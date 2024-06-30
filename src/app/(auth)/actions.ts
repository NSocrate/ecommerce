"use server";
import { z, ZodError } from "zod";
import { prisma, encrypt, decrypt } from "../lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers"
import { redirect } from "next/navigation";

const route = "/utilisateurs";

export async function getUsers() {
  try {
    return await prisma.user.findMany();
  } catch (error) {
    throw new Error("Echec de chargement");
  }
}

export async function getUser(id: number) {
  try {
    return await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  } catch (error) {
    throw new Error("Echec de chargement");
  }
}

async function Add(data: { login: string; password: string }) {
  try {
    await prisma.user.create({
      data: data,
    });
    revalidatePath(route);
    return true;
  } catch (error) {
    return false;
  }
}

async function Edit(id: number, data: { login: string; password: string }) {
  try {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: data,
    });
    revalidatePath(route);
    return true;
  } catch (error) {
    return false;
  }
}

async function Delete(id: number) {
  try {
    await prisma.user.delete({
      where: {
        id: id,
      },
    });
    revalidatePath(route);
  } catch (error) {
    return false;
  }
}

async function Login(credential: { login: string; password: string }) {
  try {
    const rs = await prisma.user.findUnique({
      where: {
        login: credential.login,
      },
    });

    if (decrypt(rs?.password as string) === credential.password) {
      const expire = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const session = { ...rs, expires: expire };
      cookies().set("session", encrypt(JSON.stringify(session)), {
        secure: true,
        httpOnly: true,
        expires: expire,
      });
      return true;
    }
    return false;
  } catch (error) {
    return false;
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

export async function verify() {
  try {
    const session = JSON.parse(
      decrypt(cookies().get("session")?.value as string)
    );
    const oneMonthAgo = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    if (
      new Date(session.expires).setHours(0, 0, 0, 0) <=
      oneMonthAgo.setHours(0, 0, 0, 0)
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

export async function getAuth() {
  try {
    const session = JSON.parse(
      decrypt(cookies().get("session")?.value as string)
    );
    return session;
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

export async function SignUp(
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
    const rs = await Add({
      login: login,
      password: encrypt(password),
    });
    if (rs) {
      return {
        ok: rs,
        message: "Sucess",
        fieldValues: {
          login,
          password,
        },
        errors: undefined,
      };
    }
    return {
      ok: rs,
      message: "Ce login existe déjà",
      fieldValues: {
        login,
        password,
      },
      errors: undefined,
    };
  } catch (error) {
    const zodError = error as ZodError;
    const errorMap = zodError.flatten().fieldErrors;
    return {
      ok: false,
      message: "Completer les champs",
      fieldValues: {
        login,
        password,
      },
      errors: {
        login: errorMap["login"]?.[0] ?? "",
        password: errorMap["password"]?.[0] ?? "",
      },
    };
  }
}

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
    const rs = await Login({ login: login, password: password });
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
    const zodError = error as ZodError;
    const errorMap = zodError.flatten().fieldErrors;
    return {
      ok: false,
      message: "Completer les champs",
      fieldValues: {
        login,
        password,
      },
      errors: {
        login: errorMap["login"]?.[0] ?? "",
        password: errorMap["password"]?.[0] ?? "",
      },
    };
  }
}
