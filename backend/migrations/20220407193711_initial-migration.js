exports.up = async (knex) => {
  await knex.raw(`
    CREATE TABLE "users" (
      "id" UUID PRIMARY KEY,
      "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      "updatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      "emailAddress" TEXT UNIQUE NOT NULL,
      "firstName" TEXT NOT NULL,
      "lastName" TEXT NOT NULL,
      "passwordHash" TEXT NOT NULL,
      "role" TEXT NOT NULL
    );

    CREATE TABLE "authSessions" (
      "id" UUID PRIMARY KEY,
      "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      "updatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      "userId" UUID NOT NULL,
      "token" TEXT UNIQUE NOT NULL
    );
  `)
}

exports.down = async (knex) => {
  await knex.raw(`
    DROP TABLE "users";
    DROP TABLE "authSessions";
`)
}
