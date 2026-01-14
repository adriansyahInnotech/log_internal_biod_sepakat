import CryptoJS from "crypto-js";

function base64ToUint8Array(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function uint8ArrayToWordArray(u8Array: Uint8Array) {
  const words: number[] = [];
  for (let i = 0; i < u8Array.length; i++) {
    words[(i / 4) | 0] |= u8Array[i] << (24 - 8 * (i % 4));
  }
  return CryptoJS.lib.WordArray.create(words, u8Array.length);
}

export async function decryptLogInternalAES(base64CipherText: string) {
  const keyString = process.env.NEXT_PUBLIC_SECRET_KEY_LOG_INTERNAL;
  if (!keyString) {
    throw new Error("NEXT_PUBLIC_SECRET_KEY_LOG_INTERNAL is not defined");
  }
  const keyBytes = new TextEncoder().encode(keyString);
  if (![16, 24, 32].includes(keyBytes.length)) {
    throw new Error("invalid key size, must be 16, 24, or 32 bytes");
  }
  const rawBytes = base64ToUint8Array(base64CipherText);
  if (rawBytes.length < 16) {
    throw new Error("ciphertext too short");
  }
  const iv = rawBytes.slice(0, 16);
  const cipherBytes = rawBytes.slice(16);
  const keyWA = CryptoJS.enc.Utf8.parse(keyString);
  const ivWA = uint8ArrayToWordArray(iv);
  const cipherWA = uint8ArrayToWordArray(cipherBytes);
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: cipherWA } as any,
    keyWA,
    {
      iv: ivWA,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );
  return CryptoJS.enc.Utf8.stringify(decrypted);
}
