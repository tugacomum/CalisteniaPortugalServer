-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nickname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "goals" TEXT,
    "bio" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "verifyEmailCode" INTEGER,
    "verifyEmailCodeExpiry" DATETIME,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "passwordRecoveryCode" INTEGER,
    "passwordRecoveryExpiry" DATETIME
);
INSERT INTO "new_User" ("avatar", "bio", "email", "emailVerified", "goals", "id", "nickname", "password", "passwordRecoveryCode", "passwordRecoveryExpiry", "verifyEmailCode", "verifyEmailCodeExpiry") SELECT "avatar", "bio", "email", "emailVerified", "goals", "id", "nickname", "password", "passwordRecoveryCode", "passwordRecoveryExpiry", "verifyEmailCode", "verifyEmailCodeExpiry" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
