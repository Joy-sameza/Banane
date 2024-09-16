# Banane

## How to install

Run the command

```bash
npm install
```

## Setting up the environment

### Run the follwing commands to add the Environment variables. Follow the guides from the [.env.example](.env.example) file

```bash
echo "SQLITE_DB_PATH=./path/to/database.db" > .env
echo "NODE_ENV=development" >> .env
echo "ACCESS_TOKEN=super#secret%hash" >> .env
echo "" >> .env
...
```

### Then run the Drizzle ORM migration

```bash
npx drizzle-kit generate
```

## ⚠⚠⚠ Do not forget to set the `NODE_ENV` variable to production ⚠⚠⚠
