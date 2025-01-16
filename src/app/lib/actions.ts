"use server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export async function AuthVerify() {
  const authToken = cookies().get("session")?.value;

  return true;
}

export async function GET(url: string, tag: string, revalidate?: number) {
  const authToken = cookies().get("session")?.value;
  const rs = await fetch(
    `${process.env.API_URL}/${url}`,{
      next: {
        revalidate: 60,
        tags: [tag],
      },
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
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
      return await rs.json();
    }
    console.log(await rs.text());
    return rs.ok;
  }
  return redirect("/login");
}

export async function SignIn(url: string, body: {}) {
  const rs = await fetch(`${process.env.API_URL}/${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (rs.ok) {
    return await rs.json();
  }
  console.log(await rs.text());
  return rs.ok;
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

export async function Login(body: {}) {
  const rs = await fetch(`${process.env.API_URL}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (rs.ok) {
    const data = await rs.json();
    const expire = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    cookies().set("session", data.access, { expires: expire, httpOnly: true });
    cookies().set("refresh", data.refresh, { expires: expire, httpOnly: true });
  }
  return rs.ok;
}

export async function SignOut() {
  cookies().set("session", "", { expires: new Date(0) });
  cookies().set("refresh", "", { expires: new Date(0) });
  redirect("/");
}

export async function refresh() {
  const refreshToken = cookies().get("refresh")?.value;
  const rs = await fetch(`${process.env.API_URL}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh: refreshToken,
    }),
  });
  if (rs.ok) {
    const data = await rs.json();
    cookies().set("auth", data.access);
    cookies().set("refresh", data.refresh);
  }
  return rs.ok;
}

export default async function FetchAuth(): Promise<any> {
  const authToken = cookies().get("session")?.value;
  if (authToken) {
    const rs = await fetch(`${process.env.API_URL}/users/me`, {
      next: { revalidate: 60 * 60, tags: ["auth"] },
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (rs.ok) {
      return await rs.json();
    }
    return rs.ok;
  } else return false;
}

// autres methodes

export async function getCategories() {
  const data = await GET("products/categories", "categories");
  return data;
}
