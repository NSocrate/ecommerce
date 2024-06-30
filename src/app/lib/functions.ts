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
    .replace(" ", "-");
}
