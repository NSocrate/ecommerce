export function getCleanLink(link: string) {
  const caracteresSpeciaux: any = {
    é: "e",
    è: "e",
    ê: "e",
    ë: "e",
    à: "a",
    â: "a",
    ä: "a",
    ù: "u",
    û: "u",
    ü: "u",
    î: "i",
    ï: "i",
    ô: "o",
    ö: "o",
    ç: "c",
  };

  return link
    .toLowerCase()
    .split("")
    .map((char) => caracteresSpeciaux[char] || char)
    .join("")
    .replaceAll(",","")
    .replaceAll(".","")
    .replaceAll(" ", "-");
}


const CryptoJS = require("crypto-js");

export function encrypt(data: string): string {
  return CryptoJS.AES.encrypt(data, process.env.ENCRYPT_KEY).toString();
}
export function decrypt(data: string): string {
  const bytes = CryptoJS.AES.decrypt(data, process.env.ENCRYPT_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
