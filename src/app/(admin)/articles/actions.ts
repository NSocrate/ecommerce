"use server";
import { z, ZodError } from "zod";
import { revalidatePath } from "next/cache";
import { DELETE, GET, POST, PUT } from "../../lib/actions";

const route = "/options";
export type Fields = {
  title: string;
  price:number;
  description:string;
  image:string;
  category:string;
};

export async function getArticles() {
  try {
    return GET("products","articles");
  } catch (error) {
    console.log(error);
    throw new Error("Echec de chargement");
  }
}

export async function getArticle(id:number) {
  try {
    return GET(`products/${id}`,"article");
  } catch (error) {
    console.log(error);
    throw new Error("Echec de chargement");
  }
}

async function Add(data: Fields) {
  try {
    POST("products",data,"articles")
    revalidatePath(route);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function Edit(id: number, data: Fields) {
  try {
    PUT(`produits/${id}`,data,"articles")
    revalidatePath(route);
    return true;
  } catch (error) {
    console.log(error);

    return false;
  }
}

async function Delete(id: number) {
  try {
    DELETE(`produits/${id}`,"articles")
    revalidatePath(route);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

const schema = z.object({
  title: z
    .string({
      required_error: "Ce champ est obligatoire",
      invalid_type_error: "Ce champ ne prend que des chaînes de caractères",
    })
    .min(2, "Ce champ doit coitenir au moins 2 caractères"),
   price: z
    .number({
      required_error: "Ce champ est obligatoire",
      invalid_type_error: "Ce champ ne prend que des caractères numériques",
    })
    .min(1, "le prix doit être superieur à 0"),
    description: z
    .string({
      required_error: "Ce champ est obligatoire",
      invalid_type_error: "Ce champ ne prend que des chaînes de caractères",
    })
    .min(2, "Ce champ doit coitenir au moins 2 caractères"),
    image: z
    .string({
      required_error: "Ce champ est obligatoire",
      invalid_type_error: "Ce champ ne prend que des chaînes de caractères",
    })
    .min(2, "Ce champ doit coitenir au moins 2 caractères"),
    category: z
    .string({
      required_error: "Ce champ est obligatoire",
      invalid_type_error: "Ce champ ne prend que des chaînes de caractères",
    })
    .min(2, "Ce champ doit coitenir au moins 2 caractères"),
});

export type FormState = {
  ok: boolean;
  message: string;
  fieldValues: Fields;
  errors: Record<keyof Fields, string> | undefined;
};

export async function Ajouter(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const title = formData.get("title") as string;
  const price = Number(formData.get("price") as string);
  const description = formData.get("description") as string;
  const image = formData.get("image") as string;
  const category = formData.get("category") as string;
  try {
    schema.parse({
      title,
      price,
      description,
      image,
      category
    });
    const rs = await Add({
      title,
      price,
      description,
      image,
      category
    });
    if (rs) {
      return {
        ok: rs,
        message: "Enregistrement reussi",
        fieldValues: {
          title:"",
          price:0,
          description:"",
          image:"",
          category:""
        },
        errors: undefined,
      };
    }
    return {
      ok: rs,
      message: "Enregistrement existant",
      fieldValues: {
        title,
        price,
        description,
        image,
        category
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
        title,
        price,
        description,
        image,
        category
      },
      errors: {
        title : errorMap["title"]?.[0] ?? "",
        price : errorMap["price"]?.[0] ?? "",
        description : errorMap["description"]?.[0] ?? "",
        image : errorMap["image"]?.[0] ?? "",
        category : errorMap["category"]?.[0] ?? "",
      },
    };
  }
}

// export async function Modifier(
//   prevState: FormState,
//   formData: FormData
// ): Promise<FormState> {
//   const id = parseInt(formData.get("id") as string);
//   const designation = formData.get("designation") as string;
//   try {
//     schema.parse({
//       designation,
//     });
//     const rs = await Edit(id, {
//       designation: designation,
//     });
//     if (rs) {
//       return {
//         ok: rs,
//         message: "Modification reussie",
//         fieldValues: {
//           designation,
//         },
//         errors: undefined,
//       };
//     }
//     return {
//       ok: rs,
//       message: "Enregistrement existant",
//       fieldValues: {
//         designation,
//       },
//       errors: undefined,
//     };
//   } catch (error) {
//     const zodError = error as ZodError;
//     const errorMap = zodError.flatten().fieldErrors;
//     return {
//       ok: false,
//       message: "Completer les champs",
//       fieldValues: {
//         designation,
//       },
//       errors: {
//         designation: errorMap["designation"]?.[0] ?? "",
//       },
//     };
//   }
// }

export async function Supprimer(formData: FormData): Promise<boolean> {
  const id = parseInt(formData.get("id") as string);
  return await DELETE(`produits/${id}`,'articles');
}
