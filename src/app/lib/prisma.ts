import { PrismaClient } from "@prisma/client";
const CryptoJS = require("crypto-js");
export const prisma = new PrismaClient();

export function encrypt(data: string): string {
  return CryptoJS.AES.encrypt(data, process.env.ENCRYPT_KEY).toString();
}
export function decrypt(data: string): string {
  const bytes = CryptoJS.AES.decrypt(data, process.env.ENCRYPT_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
