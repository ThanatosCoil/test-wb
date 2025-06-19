require("dotenv").config();

const NODE_ENV = process.env.NODE_ENV || "development";

console.log("KNEX CONFIG LOADED", process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD);

const knegConfigs = {
    development: {
        client: "pg",
        connection: {
            host: process.env.POSTGRES_HOST || "localhost",
            port: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5432,
            database: process.env.POSTGRES_DB || "test",
            user: process.env.POSTGRES_USER || "postgres",
            password: process.env.POSTGRES_PASSWORD || "postgres",
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            stub: "src/config/knex/migration.stub.js",
            directory: "./src/postgres/migrations",
            tableName: "migrations",
            extension: "ts",
        },
        seeds: {
            stub: "src/config/knex/seed.stub.js",
            directory: "./src/postgres/seeds",
            extension: "js",
        },
    },
    production: {
        client: "pg",
        connection: {
            host: process.env.POSTGRES_HOST,
            port: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : undefined,
            database: process.env.POSTGRES_DB,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            stub: "dist/config/knex/migration.stub.js",
            directory: "./dist/postgres/migrations",
            tableName: "migrations",
            extension: "js",
        },
        seeds: {
            stub: "src/config/knex/seed.stub.js",
            directory: "./dist/postgres/seeds",
            extension: "js",
        },
    },
};

module.exports = knegConfigs[NODE_ENV];
