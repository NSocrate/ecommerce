"use server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { encrypt } from "./functions";
export async function AuthVerify() {
  const authToken = cookies().get("session")?.value;

  return true;
}

export async function GET(url: string, tag: string, revalidate?: number) {
  const authToken = cookies().get("session")?.value;
  const rs = await fetch(`${process.env.API_URL}/${url}`, {
    next: {
      revalidate: 60,
      tags: [tag],
    },
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!rs.ok) {
    console.log(rs);
    if (rs.status === 403) {
      throw new Error("Vous n'êtes pas autorisé à voir cette page");
    }
    throw new Error("Une erreur est survenue lors de chargement des données");
  }

  if (rs.status === 204) {
    return false;
  }
  const data = await rs.json();
  return data;
}
export async function POST(
  url: string,
  body: {} | FormData,
  tag: string,
  formData?: boolean
) {
  const authToken = cookies().get("session")?.value;
  if (await AuthVerify()) {
    const rs = await fetch(
      `${process.env.API_URL}/${url}`,
      formData
        ? {
            method: "POST",
            body: body as FormData,
          }
        : {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
    );
    if (rs.ok) {
      revalidateTag(tag);
      const data = await rs.json();
      console.log(data);

      return data;
    }
    console.log(await rs.text());
    return rs.ok;
  }
  return redirect("/login");
}

export async function PUT(
  url: string,
  body: {} | FormData,
  tag: string,
  formData?: boolean
) {
  const authToken = cookies().get("session")?.value;
  const rs = await fetch(
    `${process.env.API_URL}/${url}`,
    formData
      ? {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: body as FormData,
        }
      : {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(body),
        }
  );
  if (rs.ok) {
    revalidateTag(tag);
    return rs.json();
  }
  console.log(await rs.text());

  return rs.ok;
}

export async function DELETE(url: string, tag: string) {
  const authToken = cookies().get("session")?.value;
  const rs = await fetch(`${process.env.API_URL}/${url}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });
  if (!rs.ok) {
    console.log(rs);
    throw new Error("Une erreur est survenue lors la suppression");
  }
  revalidateTag(tag);
  return true;
}

export async function Login(body: { username: string; password: string }) {
  // const rs = await fetch(`https://fakestoreapi.com/auth/login`, {
  //   method: "POST",
  //   body: JSON.stringify(body),
  // });

  const rs = await fetch(`https://fakestoreapi.com/users`, {
    method: "GET",
  });

  if (rs.ok) {
    const data = await rs.json();
    const auth = data.find(
      (user: { username: string; password: string }) =>
        user.username === body.username && user.password === body.password
    );
    
    if (auth) {
      const expire = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      cookies().set("session", encrypt(auth.id.toString()), { expires: expire, httpOnly: true });
    } else {
      return false;
    }
  }

  return rs.ok;
}

export async function SignOut() {
  cookies().set("session", "", { expires: new Date(0) });
  cookies().set("products", "[]", { expires: new Date(0) });
  redirect("/connexion");
}
// autres methodes

export async function getCategories() {
  const data = await GET("products/categories", "categories");
  return data;
}
