"use server";
import { z, ZodError } from "zod";
import { prisma } from "../../lib/prisma";
import { revalidatePath } from "next/cache";

const route = "/categories";
export type Fields = {
  designation: string;
};

export type ProductFields = {
  designation: string;
  prix: number;
  quantite: number;
};

export async function getCategories() {
  try {
    return await prisma.categorie.findMany();
  } catch (error) {
    throw new Error("Echec de chargement");
  }
}

export async function getCategorie(id: number) {
  try {
    return await prisma.categorie.findUnique({
      where: {
        id: parseInt(id.toString()),
      },
      include: {
        produit: true,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Echec de chargement");
  }
}

async function Add(data: { designation: string }) {
  try {
    await prisma.categorie.create({
      data: data,
    });
    revalidatePath(route);
    return true;
  } catch (error) {
    return false;
  }
}

async function AddProduct(
  id: number,
  data: { designation: string; prix: number; quantite: number }
) {
  try {
    await prisma.categorie.update({
      where: {
        id: id,
      },
      data: {
        produit: {
          create: data,
        },
      },
    });
    revalidatePath(route);
    return true;
  } catch (error) {
    return false;
  }
}

async function Edit(id: number, data: { designation: string }) {
  try {
    await prisma.categorie.update({
      where: {
        id: id,
      },
      data: data,
    });
    revalidatePath(route);
    return true;
  } catch (error) {
    console.log(error);

    return false;
  }
}

async function Delete(id: number) {
  try {
    await prisma.categorie.delete({
      where: {
        id: id,
      },
    });
    revalidatePath(route);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

const schema = z.object({
  designation: z
    .string({
      required_error: "Ce champs est obligatoire",
      invalid_type_error: "Ce champs ne prend que de chaîne de caractère",
    })
    .min(3, "Ce champs doit contenir au moins 3 caractères"),
});

const schemaProduct = z.object({
  designation: z
    .string({
      required_error: "Ce champs est obligatoire",
      invalid_type_error: "Ce champs ne prend que de chaîne de caractère",
    })
    .min(3, "Ce champs doit contenir au moins 3 caractères"),
  prix: z
    .number({
      required_error: "Ce champs est obligatoire",
      invalid_type_error: "Ce champs ne prend que de chaîne de caractère",
    })
    .min(1, "Ce champs doit être supérieur à 1 unité monétaire"),
  quantite: z
    .number({
      required_error: "Ce champs est obligatoire",
      invalid_type_error: "Ce champs ne prend que de chaîne de caractère",
    })
    .min(1, "Ce champs doit être supérieur à 1"),
});

export type FormState = {
  ok: boolean;
  message: string;
  fieldValues: Fields;
  errors: Record<keyof Fields, string> | undefined;
};

export type FormStateProduct = {
  ok: boolean;
  message: string;
  fieldValues: ProductFields;
  errors: Record<keyof ProductFields, string> | undefined;
};

export async function Ajouter(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const designation = formData.get("designation") as string;
  try {
    schema.parse({
      designation,
    });
    const rs = await Add({
      designation: designation,
    });
    if (rs) {
      return {
        ok: rs,
        message: "Enregistrement reussi",
        fieldValues: {
          designation: "",
        },
        errors: undefined,
      };
    }
    return {
      ok: rs,
      message: "Enregistrement Echoué",
      fieldValues: {
        designation,
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
        designation,
      },
      errors: {
        designation: errorMap["designation"]?.[0] ?? "",
      },
    };
  }
}

export async function Modifier(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const id = parseInt(formData.get("id") as string);
  const designation = formData.get("designation") as string;
  try {
    schema.parse({
      designation,
    });
    const rs = await Edit(id, {
      designation: designation,
    });
    if (rs) {
      return {
        ok: rs,
        message: "Modification reussie",
        fieldValues: {
          designation,
        },
        errors: undefined,
      };
    }
    return {
      ok: rs,
      message: "Modification échouée",
      fieldValues: {
        designation,
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
        designation,
      },
      errors: {
        designation: errorMap["designation"]?.[0] ?? "",
      },
    };
  }
}

export async function Supprimer(formData: FormData): Promise<boolean> {
  const id = parseInt(formData.get("id") as string);
  return await Delete(id);
}

export async function AjouterProduit(
  prevState: FormStateProduct,
  formData: FormData
): Promise<FormStateProduct> {
  const categorie = parseInt(formData.get("categorie") as string);
  const designation = formData.get("designation") as string;
  const quantite = parseInt(formData.get("quantite") as string);
  const prix = parseFloat(formData.get("prix") as string);
  try {
    schemaProduct.parse({
      designation,
      quantite,
      prix,
    });
    const rs = await AddProduct(categorie, {
      designation: designation,
      quantite: quantite,
      prix: prix,
    });
    if (rs) {
      return {
        ok: rs,
        message: "Enregistrement reussi",
        fieldValues: {
          designation: "",
          quantite: 0,
          prix: 0,
        },
        errors: undefined,
      };
    }
    return {
      ok: rs,
      message: "Enregistrement Echoué",
      fieldValues: {
        designation,
        quantite,
        prix,
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
        designation,
        quantite,
        prix,
      },
      errors: {
        designation: errorMap["designation"]?.[0] ?? "",
        quantite: errorMap["quantite"]?.[0] ?? "",
        prix: errorMap["prix"]?.[0] ?? "",
      },
    };
  }
}
