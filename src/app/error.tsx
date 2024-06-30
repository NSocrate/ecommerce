"use client";

import { Button } from "@mui/material";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex justify-center items-center flex-col gap-3 h-screen">
      <h1 className="text-8xl text-center font-extrabold w-96"> Erreur </h1>
      <p> {error.message} </p>
        <Button onClick={reset} variant="contained">Réessayer</Button>
    </div>
  );
}
