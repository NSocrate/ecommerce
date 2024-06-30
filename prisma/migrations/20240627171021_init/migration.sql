-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Produit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "designation" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL DEFAULT 0,
    "prix" REAL NOT NULL,
    "categorieId" INTEGER NOT NULL,
    CONSTRAINT "Produit_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Categorie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Produit" ("categorieId", "designation", "id", "prix", "quantite") SELECT "categorieId", "designation", "id", "prix", "quantite" FROM "Produit";
DROP TABLE "Produit";
ALTER TABLE "new_Produit" RENAME TO "Produit";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
