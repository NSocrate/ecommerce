"use server";
import { z, ZodError } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "../lib/functions";
import { GET, Login } from "../lib/actions";


export async function getUser(id: number) {
  try {
    return GET(`users/${id}`, "articles");
  } catch (error) {
    throw new Error("Echec de chargement");
  }
}


export async function LogOut() {
  cookies().set("session", "", {
    secure: true,
    httpOnly: true,
    expires: new Date(0),
  });
  redirect("/connexion");
}


export type Fields = {
  login: string;
  password: string;
};

const schema = z.object({
  login: z.string({
    required_error: "Ce champs est obligatoire",
    invalid_type_error: "Ce champs ne prend que de chaîne de caractère",
  }),
  password: z.string({
    required_error: "Ce champs est obligatoire",
    invalid_type_error: "Ce champs ne prend que de chaîne de caractère",
  }),
});

export async function getAuth() {
  try {
    const session = JSON.parse(
      decrypt(cookies().get("session")?.value as string)
    );
    const user = await getUser(session);

    if (user) {
      return user;
    }
    redirect("/connexion");
  } catch (error) {
    return false;
  }
}

export type FormSate = {
  ok: boolean;
  message: string;
  fieldValues: Fields;
  errors: Record<keyof Fields, string> | undefined;
};

export async function SignIn(
  prevState: FormSate,
  formData: FormData
): Promise<FormSate> {
  const login = formData.get("login") as string;
  const password = formData.get("password") as string;
  try {
    schema.parse({
      login,
      password,
    });
    const rs = await Login({ username: login, password: password });

    console.log(rs);

    if (rs) {
      return {
        ok: true,
        message: "Connexion reussie",
        fieldValues: {
          login,
          password,
        },
        errors: undefined,
      };
    }
    return {
      ok: false,
      message: "Login ou mot de passe incorrect",
      fieldValues: {
        login,
        password,
      },
      errors: undefined,
    };
  } catch (error) {
    // const zodError = error as ZodError;
    // const errorMap = zodError.flatten().fieldErrors;
    return {
      ok: false,
      message: "Completer les champs",
      fieldValues: {
        login,
        password,
      },
      errors: {
        login: 'errorMap["login"]?.[0] ?? "",',
        password: 'errorMap["password"]?.[0] ?? "",'
      },
    };
  }
}
