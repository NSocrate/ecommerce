"use client";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Page404() {
  const router = useRouter();
  return (
    <div className="flex justify-center items-center flex-col gap-3 h-screen">
      <h1 className="text-9xl text-center font-extrabold w-96"> 404 </h1>
      <p className="font-black"> Page introuvable</p>
      <Button
        onClick={() => router.back()}
        variant="outlined"
        
      >
        Retour
      </Button>
    </div>
  );
}
