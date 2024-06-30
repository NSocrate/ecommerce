"use server";
import { z, ZodError } from "zod";
import { prisma } from "../../lib/prisma";
import { revalidatePath } from "next/cache";

const route = "/approvisionnements";
export type Fields = {
  quantite: number;
  prix: number;
  produitId: number;
};

export async function getApprovs() {
  try {
    return await prisma.approvisionnement.findMany({
      include: {
        produit: true,
      },
    });
  } catch (error) {
    throw new Error("Echec de chargement");
  }
}

export async function getApprov(id: number) {
  try {
    return await prisma.approvisionnement.findUnique({
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

async function Add(data: {
  quantite: number;
  prix: number;
  produitId: number;
}) {
  try {
    await prisma.approvisionnement.create({
      data: data,
    });
    await prisma.produit.update({
      where: {
        id: data.produitId,
      },
      data: {
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

async function Edit(
  id: number,
  data: {
    quantite: number;
    prix: number;
    produitId: number;
  }
) {
  try {
    const old = await prisma.approvisionnement.findUnique({
      where: {
        id: id,
      },
    });
    await prisma.produit.update({
      where: {
        id: data.produitId,
      },
      data: {
        quantite: {
          decrement: (old?.quantite as number) - data.quantite,
        },
      },
    });
    await prisma.approvisionnement.update({
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
    const rs = await prisma.approvisionnement.delete({
      where: {
        id: id,
      },
    });
    await prisma.produit.update({
      where: {
        id: rs.produitId,
      },
      data: {
        quantite: {
          decrement: rs.quantite,
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

const schema = z.object({
  produitId: z
    .number({
      required_error: "Ce champs est obligatoire",
      invalid_type_error: "Ce champs ne prend que de chaîne de caractère",
    })
    .min(1, "Ce champs est obligatoire"),
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
    .min(1, "Ce champs doit être supérieur à 1 unité monétaire"),
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
  const quantite = parseInt(formData.get("quantite") as string);
  const prix = parseFloat(formData.get("prix") as string);
  const produitId = parseInt(formData.get("produitId") as string);
  try {
    schema.parse({
      quantite,
      prix,
      produitId,
    });
    const rs = await Add({
      quantite: quantite,
      prix: prix,
      produitId: produitId,
    });
    if (rs) {
      return {
        ok: rs,
        message: "Enregistrement reussi",
        fieldValues: {
          prix: 0,
          quantite: 0,
          produitId: 0,
        },
        errors: undefined,
      };
    }
    return {
      ok: rs,
      message: "Enregistrement Echoué",
      fieldValues: {
        prix,
        quantite,
        produitId,
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
        produitId,
        prix,
        quantite,
      },
      errors: {
        prix: errorMap["prix"]?.[0] ?? "",
        quantite: errorMap["quantite"]?.[0] ?? "",
        produitId: errorMap["produitId"]?.[0] ?? "",
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
  const produitId = parseInt(formData.get("produitId") as string);
  console.log(id);

  try {
    schema.parse({
      quantite,
      prix,
      produitId,
    });
    const rs = await Edit(id, {
      quantite: quantite,
      prix: prix,
      produitId: produitId,
    });
    if (rs) {
      return {
        ok: rs,
        message: "Modification reussie",
        fieldValues: {
          quantite,
          prix,
          produitId,
        },
        errors: undefined,
      };
    }
    return {
      ok: rs,
      message: "Modification échouée",
      fieldValues: {
        prix,
        quantite,
        produitId,
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
        prix,
        quantite,
        produitId,
      },
      errors: {
        prix: errorMap["prix"]?.[0] ?? "",
        quantite: errorMap["quantite"]?.[0] ?? "",
        produitId: errorMap["produitId"]?.[0] ?? "",
      },
    };
  }
}

export async function SupprimerApprov(formData: FormData): Promise<boolean> {
  const id = parseInt(formData.get("id") as string);
  return await Delete(id);
}
