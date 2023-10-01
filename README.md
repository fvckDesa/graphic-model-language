# Graphic Model Language

## Quick start

### Prerequisite

- Docker
- Node (Version: >= 18.x)
- Pnpm (Version: >= 8.7.x)
- Github Account

### Setup

1. Clone locally the repo

```sh
git clone git@github.com:fvckDesa/graphic-model-language.git
```

2. Go to project directory

```sh
cd graphic-model-language
```

3. Install dependency with pnpm

```sh
pnpm i
```

4. Setup env variables

- Copy .env.example into .env.local
- Go to (Github)[https://github.com/settings/developers] and create new OAuth App
- Go to the new app and create a client secret
- Copy the 'Client ID' and the 'Client Secret' into .env.local
- In .env.local add a next auth secret or generate one with

```sh
openssl rand -base64 32
```

5. Run database

```sh
pnpm docker
```

6. Add Prisma schemas to database

```sh
pnpm prisma db push
```

7. Start web app and server

```sh
pnpm start
```

## Keywords

- State: set of data
- Node: visual component that varies based on its state
- Edge: connection between two nodes
- Project: set of Nodes and Edges
- Workspace: set of Nodes and Edges, like a root state
