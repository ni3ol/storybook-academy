exports.up = async (knex) => {
  await knex.raw(`
    CREATE TABLE "users" (
      "id" UUID PRIMARY KEY,
      "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      "updatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      "emailAddress" TEXT UNIQUE ,
      "username" TEXT UNIQUE,
      "firstName" TEXT NOT NULL,
      "lastName" TEXT NOT NULL,
      "passwordHash" TEXT,
      "role" TEXT NOT NULL,
      "schoolId" UUID,
      "classId" UUID,
      "readingLevel" INTEGER,
      "age" INTEGER,
      "favouriteColor" TEXT,
      "favouriteAnimal" TEXT,
      "nickname" TEXT,
      "profileCreated" BOOLEAN DEFAULT FALSE,
      "profilePicture" TEXT
    );

    CREATE TABLE "authSessions" (
      "id" UUID PRIMARY KEY,
      "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      "updatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      "userId" UUID NOT NULL,
      "token" TEXT UNIQUE NOT NULL
    );

    CREATE TABLE "books" (
      "id" UUID PRIMARY KEY,
      "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      "updatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      "createdByUserId" UUID NOT NULL,
      "title" TEXT NOT NULL,
      "level1Name" TEXT,
      "level1Type" TEXT,
      "level2Name" TEXT,
      "level2Type" TEXT,
      "level3Name" TEXT,
      "level3Type" TEXT,
      "level4Name" TEXT,
      "level4Type" TEXT,
      "level5Name" TEXT,
      "level5Type" TEXT
    );

    CREATE TABLE "schools" (
      "id" UUID PRIMARY KEY,
      "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      "updatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      "name" TEXT NOT NULL
    );

    CREATE TABLE "bookAssignments" (
      "id" UUID PRIMARY KEY,
      "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      "updatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      "bookId" UUID NOT NULL,
      "schoolId" UUID,
      "classId" UUID
    );

    CREATE TABLE "classes" (
      "id" UUID PRIMARY KEY,
      "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      "updatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      "name" TEXT NOT NULL,
      "educatorId" UUID NOT NULL,
      "schoolId" UUID NOT NULL,
      "linkedClassId" UUID,
      "bookId" UUID,
      "password" TEXT NOT NULL
    );

    CREATE TABLE "messages" (
      "id" UUID PRIMARY KEY,
      "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      "updatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      "roomId" TEXT NOT NULL,
      "body" TEXT NOT NULL,
      "senderId" UUID NOT NULL
    );

    CREATE TABLE "chatRooms" (
      "id" UUID PRIMARY KEY,
      "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      "updatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      "participant1Id" UUID NOT NULL,
      "participant2Id" UUID NOT NULL
    );

    CREATE TABLE "passwordResetRequests" (
      "id" UUID PRIMARY KEY,
      "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      "updatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      "userId" UUID NOT NULL,
      "emailAddress" TEXT NOT NULL,
      "token" TEXT NOT NULL,
      "expiresOn" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      "usedOn" TIMESTAMP WITHOUT TIME ZONE
    );
  `)
}

exports.down = async (knex) => {
  await knex.raw(`
    DROP TABLE "users";
    DROP TABLE "authSessions";
    DROP TABLE "books";
    DROP TABLE "schools";
    DROP TABLE "bookAssignments";
    DROP TABLE "classes";
    DROP TABLE "messages";
    DROP TABLE "chatRooms";
    DROP TABLE "passwordResetRequests";
`)
}
