import os
import base64
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad

# File Path
input_file = r""
output_file = r""  # Encrypted output file

# AES Configuration
KEY = b'1234567890123456'  # 16 bytes = AES-128
IV =  b'6543210987654321' # Secure random IV

# Step 1: Verify File Exists
if not os.path.exists(input_file):
    print(f"Error: File '{input_file}' does not exist!")
    exit(1)

# Step 2: Read Input File
try:
    with open(input_file, "rb") as f:
        plaintext_bytes = f.read()
        print(f"Read {len(plaintext_bytes)} bytes from file.")
except Exception as e:
    print(f"Error reading file: {e}")
    exit(1)

# Step 3: Pad the plaintext
padded_plaintext = pad(plaintext_bytes, AES.block_size)

# Step 4: Encrypt
cipher = AES.new(KEY, AES.MODE_CBC, IV)
ciphertext_bytes = cipher.encrypt(padded_plaintext)

# Step 5: Encode & Store IV + Ciphertext
base64_ciphertext = base64.b64encode(IV + ciphertext_bytes).decode()

# Step 6: Save the Encrypted File
with open(output_file, "w") as f:
    f.write(base64_ciphertext)

print(f"Encryption complete. Encrypted payload saved to {output_file}")
