"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Page403() {
  const router = useRouter();
  return (
    <div className="flex justify-center items-center flex-col gap-3 h-screen">
      <h1 className="text-8xl text-center font-extrabold w-96"> 403 </h1>
      <h2 className="text-2xl text-center font-extrabold w-96"> Forbidden </h2>
      <p> Vous n&apos;êtes pas autorisés à voir cette page </p>
      <Button onClick={() => router.forward()}>Retour</Button>
    </div>
  );
}
