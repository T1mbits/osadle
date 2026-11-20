# development documentation

- First of all, thank you for considering on helping with the code
- Second, sorry in advance

# General

- `npm run dev` to just run it
- `npx wrangler types` should fix the errors/warnings relating to `env`

# Frontend

If you are editing frontend, run `npm run dev:front` to make it auto-update. (you need to run backend too)

## Structure

- `/front/src/` is just react
- `/front/assets/` gets copied to `/public/` (or `/`)
- `/front/src/pages/` should have all the pages themselves
- Make sure every html file at `/front/` points to a file in `/front/src/entry/`

## Notes

# Backend

If you are editing backend, run `npm run dev` to start local server.

## S3

Unfortunately there is no way to really run the S3 locally (will work on it) so you will have to figure this out yourself.

## Cloudflare Worker

You can run this pretty easily since `npx wrangler` lets you do this pretty easily. You should be running via `npm run dev` though.

## Structure

- `/schema.sql`, `/src/lib/sql.ts` would have all the database related things
    - When making entries that require serialization/deserialization, name the raw type like: `DbType` (where "Type" would be the name of the parsed type), and return `Type` in your helper function (like `get` or `list`)

TODO

## API

- Make sure all API endpoints start with `/api/`

TODO

sorry for the TODOs im not done with a lot of backend changes so even if i wrote it it'd be outdated quick
