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
      "passwordHash" TEXT NOT NULL,
      "role" TEXT NOT NULL,
      "age" INTEGER,
      "favouriteColor" TEXT,
      "favouriteAnimal" TEXT,
      "nickname" TEXT,
      "profileCreated" BOOLEAN DEFAULT FALSE
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
      "level" INTEGER NOT NULL
    );

    CREATE TABLE "schools" (
      "id" UUID PRIMARY KEY,
      "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      "updatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      "name" TEXT NOT NULL
    );
  `)
}

exports.down = async (knex) => {
  await knex.raw(`
    DROP TABLE "users";
    DROP TABLE "authSessions";
    DROP TABLE "books";
`)
}
