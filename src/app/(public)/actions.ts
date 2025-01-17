"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { POST } from "../lib/actions";
import { decrypt } from "../lib/functions";
export async function getPanier(): Promise<
  Array<{ quantity: number; productId: number }> | []
> {
  const products = JSON.parse(
    cookies().get("products")?.value ?? "[]"
  ) as Array<{
    quantity: number;
    productId: number;
  }>;
  return products;
}

export async function ajouterAuPanier(formData: FormData): Promise<boolean> {
  const quantite = parseInt(formData.get("quantite") as string);
  const article = parseInt(formData.get("article") as string);

  const products = JSON.parse(
    cookies().get("products")?.value ?? "[]"
  ) as Array<{ quantity: number; productId: number }>;

  const productExist = products.find((product) => product.productId == article);

  if (productExist) {
    cookies().set(
      "products",
      JSON.stringify([
        ...products.filter((product) => product.productId != article),
        { quantity: quantite, productId: article },
      ])
    );
  } else {
    cookies().set(
      "products",
      JSON.stringify([...products, { quantity: quantite, productId: article }])
    );
  }

  return redirect("/");
}

export async function retirerDuPanier(formData: FormData): Promise<boolean> {
  const article = parseInt(formData.get("article") as string);

  const products = JSON.parse(
    cookies().get("products")?.value ?? "[]"
  ) as Array<{ quantity: number; productId: number }>;

  cookies().set(
    "products",
    JSON.stringify(products.filter((product) => product.productId != article))
  );

  return true;
}

export async function passerCommande(formData: FormData): Promise<boolean> {
  try {
    const today = new Date();
    const date = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

    const auth = decrypt(cookies().get("session")?.value as string);
    const products = JSON.parse(
      cookies().get("products")?.value ?? "[]"
    ) as Array<{ quantity: number; productId: number }>;

    if (products.length > 0) {
      const rs = POST(
        "carts",
        {
          userId: auth,
          date: date,
          products: products,
        },
        "commandes"
      );
      cookies().set("products", "[]", { expires: new Date(0) });
    }

    return true;
  } catch (error) {
    throw new Error("Désolé ! Une erreur s'est produite ");
  }
}
