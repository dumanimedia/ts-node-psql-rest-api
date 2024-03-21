# TS Node Psql Rest Api

Back-end Express server created with typescript, Drizzle ORM ( Postgresql ), json web token, bcrypt js password hasing ( sha256 ), cookies.

## Features:

- Authentication

## Technology Stack:

- TypeScript
- Node.js
- Express.js
- Drizzle Orm
- JWT
- Bcrypt.js
- Pg
- cookie Parser
- slugify

## Default urls:

- Login User : POST METHOD <br/>
  localhost:3500/api/users/login
- Register User : POST METHOD <br/>
  localhost:3500/api/users/
- Get All Users : GET METHOD <br/>
  localhost:3500/api/users/

## Usage

### Env Variables

Create a .env file in then root and add the following

```js
PORT = 3500;
TOKEN_NAME = "random-name-for-the-cookie";
NODE_ENV = "development";
JWT_SECRET = "abc123";
DATABASE_URL =
  "postgresql://username:password@host:port/database?schema=public";
```

## Install Dependencies

```bash
pnpm i
```

## Run App

```bash

# Start Server
pnpm start

# Start server in dev mode
pnpm dev
```
