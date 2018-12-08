// Update with your config settings.

module.exports = {
  development: {
    client: "pg",
    connection: "postgres://localhost/bees",
    useNullAsDefault: true,
    migrations: {
      directory: "./db/migrations"
    },
    seeds: {
      directory: "./db/seeds/dev/"
    }
  },
  testing: {
    client: "pg",
    connection: "postgres://localhost/bees_test",
    useNullAsDefault: true,
    migrations: {
      directory: "./db/migrations"
    },
    seeds: {
      directory: "./db/seeds/dev/"
    }
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL + ` ?ssl=true`,
    useNullAsDefault: true,
    migrations: {
      directory: "./db/migrations"
    },
    seeds: {
      directory: "./db/seeds/dev/"
    }
  }
};
