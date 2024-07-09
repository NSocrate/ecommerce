import { Metadata } from "next";
import { getCommande } from "../../actions";
import Detail from "./detail";

export const generateMetadata = async ({
  params,
}: {
  params: { id: number };
}): Promise<Metadata> => {
  const commande = await getCommande(params.id);
  return {
    title: `Commande - ${commande?.id}`,
    description: `facture numero ${commande?.id} du client numéro ${commande?.client}`,
  };
};
export default async function Print({ params }: { params: { id: number } }) {
  const commande = await getCommande(params.id);
  return <Detail com={commande} />;
}
