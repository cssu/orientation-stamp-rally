-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('participant', 'club_representative', 'admin');

-- CreateTable
CREATE TABLE "User" (
    "userId" UUID NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "fullName" VARCHAR(100),
    "role" "UserRole" NOT NULL DEFAULT 'participant',
    "organizationId" UUID,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "token" CHAR(64) NOT NULL,
    "userId" UUID NOT NULL,
    "deviceId" UUID NOT NULL,
    "userAgent" VARCHAR(255),
    "platform" VARCHAR(16),
    "expiresAt" TIMESTAMP(0) NOT NULL DEFAULT now() + INTERVAL '30 days',
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "Organization" (
    "organizationId" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("organizationId")
);

-- CreateTable
CREATE TABLE "Booth" (
    "boothId" VARCHAR(2) NOT NULL,
    "organizationId" UUID NOT NULL,
    "description" VARCHAR(255),

    CONSTRAINT "Booth_pkey" PRIMARY KEY ("boothId")
);

-- CreateTable
CREATE TABLE "Stamp" (
    "stampId" UUID NOT NULL,
    "description" TEXT,
    "issuedAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,
    "boothId" VARCHAR(2) NOT NULL,

    CONSTRAINT "Stamp_pkey" PRIMARY KEY ("stampId")
);

-- CreateTable
CREATE TABLE "ExemptedEmail" (
    "email" VARCHAR(100) NOT NULL,
    "reason" VARCHAR(255) NOT NULL,
    "approvedAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExemptedEmail_pkey" PRIMARY KEY ("email")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_userId_deviceId_key" ON "RefreshToken"("userId", "deviceId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("organizationId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booth" ADD CONSTRAINT "Booth_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stamp" ADD CONSTRAINT "Stamp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stamp" ADD CONSTRAINT "Stamp_boothId_fkey" FOREIGN KEY ("boothId") REFERENCES "Booth"("boothId") ON DELETE RESTRICT ON UPDATE CASCADE;
