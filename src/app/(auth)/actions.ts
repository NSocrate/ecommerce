"use server";
import { array, z, ZodError } from "zod";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt, encrypt } from "../lib/functions";
import { GET } from "../lib/actions";

const route = "/*";


export async function getUser(id: number) {
  try {
    return GET(`users/${id}`, "articles");
  } catch (error) {
    throw new Error("Echec de chargement");
  }
}

async function Login(credential: { login: string; password: string }) {
  try {
    fetch("https://fakestoreapi.com/users")
      .then((res: Response) => res.json())
      .then((data: any[]) => {
        const auth = data.filter(
          (user: { email: string; password: string }) =>
            user.email == credential.login &&
            user.password == credential.password
        );
        if (auth) {
          const expire = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          const session = { ...auth, expires: expire };
          cookies().set("session", encrypt(JSON.stringify(session)), {
            secure: true,
            httpOnly: true,
            expires: expire,
          });

          console.log("okokokkkk");
          
          return true;
        } else {
          return false;
        }
      });
      return true;
  } catch (error) {

    console.log("il y a une erreur");
    console.log(error);
    
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
    const rs = await fetch(`${process.env.BASE_URL}verify/${session.id}`, {
      next: { revalidate: 0 },
      method: "GET",
      headers: {
        Authorization: `${process.env.API_KEY}`,
      },
    });
    if (await rs.json()) {
      const oneMonthAgo = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      if (
        new Date(session.expires).setHours(0, 0, 0, 0) <=
        oneMonthAgo.setHours(0, 0, 0, 0)
      ) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  } catch (error) {
    return false;
  }
}

export async function userExist() {
  try {
    const rs = await fetch(`${process.env.BASE_URL}verify`, {
      next: { revalidate: 0 },
      method: "GET",
      headers: {
        Authorization: `${process.env.API_KEY}`,
      },
    });
    if (await rs.json()) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

export async function getAuth() {
  try {
    const session = JSON.parse(
      decrypt(cookies().get("session")?.value as string)
    );
    const user = await getUser(session.id);
    if (user) {
      return session;
    }
    redirect("/creer-un-compte");
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
    const rs = await Login({ login: login, password: password });

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
