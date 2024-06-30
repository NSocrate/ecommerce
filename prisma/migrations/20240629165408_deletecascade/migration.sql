-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Approvisionnement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "produitId" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prix" REAL NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Approvisionnement_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Approvisionnement" ("date", "id", "prix", "produitId", "quantite") SELECT "date", "id", "prix", "produitId", "quantite" FROM "Approvisionnement";
DROP TABLE "Approvisionnement";
ALTER TABLE "new_Approvisionnement" RENAME TO "Approvisionnement";
CREATE TABLE "new_LigneCommande" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "prix" REAL NOT NULL,
    "produitId" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL,
    "commandeId" INTEGER NOT NULL,
    CONSTRAINT "LigneCommande_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LigneCommande_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "Commande" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_LigneCommande" ("commandeId", "id", "prix", "produitId", "quantite") SELECT "commandeId", "id", "prix", "produitId", "quantite" FROM "LigneCommande";
DROP TABLE "LigneCommande";
ALTER TABLE "new_LigneCommande" RENAME TO "LigneCommande";
CREATE TABLE "new_Produit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "designation" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL DEFAULT 0,
    "prix" REAL NOT NULL,
    "categorieId" INTEGER NOT NULL,
    CONSTRAINT "Produit_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Categorie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Produit" ("categorieId", "designation", "id", "prix", "quantite") SELECT "categorieId", "designation", "id", "prix", "quantite" FROM "Produit";
DROP TABLE "Produit";
ALTER TABLE "new_Produit" RENAME TO "Produit";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
