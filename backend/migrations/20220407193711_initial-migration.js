exports.up = async (knex) => {
  await knex.raw(`
    CREATE TABLE "facts" (
      "id" UUID PRIMARY KEY,
      "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      "entityType" TEXT NOT NULL,
      "entityId" UUID NOT NULL,
      "data" JSONB NOT NULL
    );

    CREATE TABLE "entities" (
      "id" UUID PRIMARY KEY,
      "type" TEXT NOT NULL,
      "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      "updatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      "data" JSONB NOT NULL
    );
    CREATE UNIQUE INDEX user_email_address ON entities((data->>'emailAddress'));
  `)
}

exports.down = async (knex) => {
  await knex.raw(`
    DROP TABLE "facts";
    DROP TABLE "entities";
`)
}
