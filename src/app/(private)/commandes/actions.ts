"use server";
import { z, ZodError } from "zod";
import { prisma } from "../../lib/prisma";
import { revalidatePath } from "next/cache";

const route = "/commandes";
export type Fields = {
  id?: number;
  client: string;
};

export type LignesFields = {
  prix: number;
  quantite: number;
  produitId: number;
};

export async function getCommandesAujourdhui() {
  const today = new Date(new Date().setUTCHours(0, 0, 0, 0));
  const demain = new Date(new Date().setUTCHours(0, 0, 0, 0));
  demain.setDate(demain.getDate() + 1);
  try {
    return await prisma.commande.findMany({
      where: {
        date: {
          gte: today,
          lt: demain,
        },
      },
      include: {
        ligneCommande: true,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Echec de chargement");
  }
}

export async function getCommandesDeLaSemaine() {
  try {
    const dateDebutSemaine = new Date(new Date().setUTCHours(0, 0, 0, 0));
    dateDebutSemaine.setDate(
      dateDebutSemaine.getDate() - (dateDebutSemaine.getDay() || 7) + 1
    );
    

    const dateFinSemaine = new Date();
    dateFinSemaine.setDate(dateDebutSemaine.getDate() + 6);
    return await prisma.commande.findMany({
      where: {
        date: {
          gte: dateDebutSemaine,
          lte: dateFinSemaine,
        },
      },
      include: {
        ligneCommande: true,
      },
    });
  } catch (error) {
    throw new Error("Echec de chargement");
  }
}

export async function getCommandesDuMois() {
  try {
    const dateDebutMois = new Date(new Date().setUTCHours(0, 0, 0, 0));
    dateDebutMois.setDate(1);
    const dateFinMois = new Date(
      dateDebutMois.getFullYear(),
      dateDebutMois.getMonth() + 1,
      1
    );
    // console.log(dateDebutMois);
    // console.log(dateFinMois);

    return await prisma.commande.findMany({
      where: {
        date: {
          gte: dateDebutMois,
          lte: dateFinMois,
        },
      },
      include: {
        ligneCommande: true,
      },
    });
  } catch (error) {
    throw new Error("Echec de chargement");
  }
}

export async function getCommandes() {
  try {
    return await prisma.commande.findMany({
      include: {
        ligneCommande: true,
      },
    });
  } catch (error) {
    throw new Error("Echec de chargement");
  }
}

export async function getCommande(id: number) {
  try {
    return await prisma.commande.findUnique({
      where: {
        id: parseInt(id.toString()),
      },
      include: {
        ligneCommande: {
          include: {
            produit: true,
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Echec de chargement");
  }
}

async function Add(data: { client: string }) {
  try {
    const rs = await prisma.commande.create({
      data: data,
    });
    revalidatePath(route);
    return rs;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function AddLignes(
  id: number,
  data: {
    prix: number;
    quantite: number;
    produitId: number;
  }
) {
  try {
    await prisma.produit.update({
      where: {
        id: data.produitId,
      },
      data: {
        quantite: {
          decrement: data.quantite,
        },
      },
    });
    await prisma.commande.update({
      where: {
        id: id,
      },
      data: {
        ligneCommande: {
          create: data,
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
    client: string;
  }
) {
  try {
    await prisma.commande.update({
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
    const rs = await prisma.commande.delete({
      where: {
        id: id,
      },
      include: {
        ligneCommande: true,
      },
    });
    for (const ligneCommande of rs.ligneCommande) {
      await prisma.produit.update({
        where: {
          id: ligneCommande.produitId,
        },
        data: {
          quantite: {
            increment: ligneCommande.quantite,
          },
        },
      });
    }
    revalidatePath(route);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function DeleteLigne(id: number) {
  try {
    const rs = await prisma.ligneCommande.delete({
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
          increment: rs.quantite,
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
  client: z
    .string({
      required_error: "Ce champs est obligatoire",
      invalid_type_error: "Ce champs ne prend que de chaîne de caractère",
    })
    .min(3, "Ce champs doit contenir au moins 3 caractères"),
});

const schemaLignes = z.object({
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
    .min(1, "Ce champs doit être supérieur à 1"),
});

export type FormState = {
  ok: boolean;
  message: string;
  fieldValues: Fields;
  errors: Record<keyof Fields, string> | undefined;
};

export type FormStateLignes = {
  ok: boolean;
  message: string;
  fieldValues: LignesFields;
  errors: Record<keyof LignesFields, string> | undefined;
};

export async function Ajouter(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const client = formData.get("client") as string;
  try {
    schema.parse({
      client,
    });
    const rs = await Add({
      client: client,
    });
    if (rs) {
      return {
        ok: true,
        message: "Enregistrement reussi",
        fieldValues: {
          client: "",
          id: rs.id,
        },
        errors: undefined,
      };
    }
    return {
      ok: rs,
      message: "Enregistrement Echoué",
      fieldValues: {
        client,
        id: undefined,
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
        client,
      },
      errors: {
        client: errorMap["designation"]?.[0] ?? "",
        id: "",
      },
    };
  }
}

export async function Modifier(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const id = parseInt(formData.get("id") as string);
  const client = formData.get("client") as string;
  try {
    schema.parse({
      client,
    });
    const rs = await Edit(id, {
      client: client,
    });
    if (rs) {
      return {
        ok: rs,
        message: "Modification reussie",
        fieldValues: {
          client,
        },
        errors: undefined,
      };
    }
    return {
      ok: rs,
      message: "Modification échouée",
      fieldValues: {
        client,
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
        client,
      },
      errors: {
        client: errorMap["designation"]?.[0] ?? "",
        id: "",
      },
    };
  }
}

export async function Supprimer(formData: FormData): Promise<boolean> {
  const id = parseInt(formData.get("id") as string);
  return await Delete(id);
}

export async function SupprimerLigne(formData: FormData): Promise<boolean> {
  const id = parseInt(formData.get("id") as string);
  return await DeleteLigne(id);
}

export async function AjouterLigne(
  prevState: FormStateLignes,
  formData: FormData
): Promise<FormStateLignes> {
  const id = parseInt(formData.get("id") as string);
  const produitId = parseInt(formData.get("produitId") as string);
  const quantite = parseInt(formData.get("quantite") as string);
  const prix = parseFloat(formData.get("prix") as string);
  try {
    schemaLignes.parse({
      produitId,
      quantite,
      prix,
    });
    const rs = await AddLignes(id, {
      quantite: quantite,
      prix: prix,
      produitId: produitId,
    });
    if (rs) {
      return {
        ok: rs,
        message: "Enregistrement reussi",
        fieldValues: {
          quantite: 0,
          prix: 0,
          produitId: 0,
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
        quantite,
        prix,
        produitId,
      },
      errors: {
        quantite: errorMap["quantite"]?.[0] ?? "",
        prix: errorMap["prix"]?.[0] ?? "",
        produitId: errorMap["produitId"]?.[0] ?? "",
      },
    };
  }
}
