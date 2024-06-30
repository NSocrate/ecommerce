"use server";
import { z, ZodError } from "zod";
import { prisma } from "../../lib/prisma";
import { revalidatePath } from "next/cache";

const route = "/produits";
export type Fields = {
  designation: string;
  quantite: number;
  prix: number;
  categorieId: number;
};

export type ApprovFields = {
  quantite: number;
  prix: number;
};

export async function getProduits() {
  try {
    return await prisma.produit.findMany({
      include: {
        categorie: true,
      },
    });
  } catch (error) {
    throw new Error("Echec de chargement");
  }
}

export async function getProduit(id: number) {
  try {
    return await prisma.produit.findUnique({
      where: {
        id: parseInt(id.toString()),
      },
      include: {
        Approvisionnement: true,
        ligneCommande: true,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Echec de chargement");
  }
}

async function Add(data: {
  designation: string;
  quantite: number;
  prix: number;
  categorieId: number;
}) {
  try {
    await prisma.produit.create({
      data: data,
    });
    revalidatePath(route);
    return true;
  } catch (error) {
    console.log(error);

    return false;
  }
}

async function Edit(
  id: number,
  data: {
    designation: string;
    quantite: number;
    prix: number;
    categorieId: number;
  }
) {
  try {
    await prisma.produit.update({
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

async function AddApprov(
  id: number,
  data: {
    quantite: number;
    prix: number;
  }
) {
  try {
    await prisma.produit.update({
      where: {
        id: id,
      },
      data: {
        Approvisionnement: {
          create: data,
        },
        quantite: {
          increment: data.quantite,
        },
      },
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
    await prisma.produit.delete({
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

const schemaApprov = z.object({
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

export type FormStateApprov = {
  ok: boolean;
  message: string;
  fieldValues: ApprovFields;
  errors: Record<keyof ApprovFields, string> | undefined;
};

export async function Ajouter(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const designation = formData.get("designation") as string;
  const quantite = parseInt(formData.get("quantite") as string);
  const prix = parseFloat(formData.get("prix") as string);
  const categorieId = parseInt(formData.get("categorieId") as string);
  try {
    schema.parse({
      designation,
      quantite,
      prix,
      categorieId,
    });
    const rs = await Add({
      designation: designation,
      quantite: quantite,
      prix: prix,
      categorieId: categorieId,
    });
    if (rs) {
      return {
        ok: rs,
        message: "Enregistrement reussi",
        fieldValues: {
          designation: "",
          prix: 0,
          quantite: 0,
          categorieId: 0,
        },
        errors: undefined,
      };
    }
    return {
      ok: rs,
      message: "Enregistrement Echoué",
      fieldValues: {
        designation,
        prix,
        quantite,
        categorieId,
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
        prix,
        quantite,
        categorieId,
      },
      errors: {
        designation: errorMap["designation"]?.[0] ?? "",
        prix: errorMap["prix"]?.[0] ?? "",
        quantite: errorMap["quantite"]?.[0] ?? "",
        categorieId: errorMap["categorieId"]?.[0] ?? "",
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
  const quantite = parseInt(formData.get("quantite") as string);
  const prix = parseFloat(formData.get("prix") as string);
  const categorieId = parseInt(formData.get("categorieId") as string);
  try {
    schema.parse({
      designation,
      quantite,
      prix,
      categorieId,
    });
    const rs = await Edit(id, {
      designation: designation,
      quantite: quantite,
      prix: prix,
      categorieId: categorieId,
    });
    if (rs) {
      return {
        ok: rs,
        message: "Modification reussie",
        fieldValues: {
          designation,
          quantite,
          prix,
          categorieId,
        },
        errors: undefined,
      };
    }
    return {
      ok: rs,
      message: "Modification échouée",
      fieldValues: {
        designation,
        prix,
        quantite,
        categorieId,
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
        prix,
        quantite,
        categorieId,
      },
      errors: {
        designation: errorMap["designation"]?.[0] ?? "",
        prix: errorMap["prix"]?.[0] ?? "",
        quantite: errorMap["quantite"]?.[0] ?? "",
        categorieId: errorMap["categorieId"]?.[0] ?? "",
      },
    };
  }
}

export async function SupprimerProduit(formData: FormData): Promise<boolean> {
  const id = parseInt(formData.get("id") as string);
  return await Delete(id);
}

export async function Approvisionner(
  prevState: FormStateApprov,
  formData: FormData
): Promise<FormStateApprov> {
  const produit = parseInt(formData.get("produit") as string);
  const quantite = parseInt(formData.get("quantite") as string);
  const prix = parseFloat(formData.get("prix") as string);
  try {
    schemaApprov.parse({
      quantite,
      prix,
    });
    const rs = await AddApprov(produit, {
      quantite: quantite,
      prix: prix,
    });
    if (rs) {
      return {
        ok: rs,
        message: "Enregistrement reussi",
        fieldValues: {
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
        quantite,
        prix,
      },
      errors: {
        quantite: errorMap["quantite"]?.[0] ?? "",
        prix: errorMap["prix"]?.[0] ?? "",
      },
    };
  }
}
