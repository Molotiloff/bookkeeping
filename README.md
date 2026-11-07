This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Checks

```bash
pnpm test
pnpm typecheck
pnpm exec eslint . --max-warnings 0
pnpm build
```

`pnpm test` uses Node's built-in test runner with TypeScript stripping (Node 22.6+).
Deal-management actions require API mode (`CRM_USE_API=true`); mock mode does not
simulate financial mutations. Telegram cards, receipts and balances are handled
by the shared backend workflows.

## Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Linux standalone bundle

Build the production bundle on the Linux server so native dependencies match the
deployment platform:

```bash
pnpm install --frozen-lockfile
pnpm build
```

The build command copies `public/` and `.next/static/` into `.next/standalone/`.
The resulting bundle can be started with:

```bash
HOSTNAME=127.0.0.1 PORT=3000 node .next/standalone/server.js
```
