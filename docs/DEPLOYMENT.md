# Vercel deployment

Prepared on 15 November 2026. Production publication is pending Vercel login.

## Project configuration

- Framework: React / TypeScript with Vite.
- Package manager: npm, using the existing `package-lock.json`.
- Install command: `npm ci`.
- Production build: `npm run build`.
- Public output directory: `dist`.
- Configuration: `vercel.json` in the workspace root.
- No Git repository or local `.vercel/project.json` was present at inspection. Existing account projects must be checked after login before creating another project.
- No domain purchase, paid plan, paid build machine or integration is required for this static student website. Use an eligible free Hobby scope and the Vercel-provided `.vercel.app` address.

## Sign in

In the VS Code terminal, from this workspace, run:

```sh
npx vercel@65.16.0 login
```

Follow the CLI's browser link and complete Vercel sign-in in the browser. Do not put passwords, tokens or recovery codes into project files or chat. If creating an account, choose the free Hobby plan.

After signing in, confirm that sign-in is complete so the deployment can resume. The next steps are to inspect account projects, reuse a matching project if present, and deploy to production. No temporary/unclaimed deployment has been created.

## Upload boundaries and validation

`.vercelignore` allows only `src`, `public`, the entry HTML, dependency manifests, TypeScript/Vite build configuration and `vercel.json`. It excludes local tooling, tests, documentation, build artifacts, environment files, credential files and common applicant dataset formats. `.vercel` and environment files are also ignored by Git.

Inspection found no environment files, private keys, real applicant records or hard-coded credentials in the build inputs. Questionnaire answers live only in browser memory; only language preference is persisted. The application has no backend or application-data submission endpoint.

The production build, lint and all 56 regression tests passed during deployment preparation. The CLI source-file dry run requires login and is still pending. After login, run `vercel deploy --dry --json` and inspect its file list before uploading.

## Routes and visitor checks

Home, Browse, questionnaire, Results and details are React views at `/`, not separate pathname routes. Individual schemes do not have shareable direct URLs. Refreshing `/` intentionally resets personal answers and the current view; language preference remains. The `#eligibility` and similar fragments are in-page section anchors, not scheme routes.

After deployment, verify the production alias in a signed-out browser: Home, Browse, search, English/Hindi switching, an official application link, and a page refresh. Confirm the page and assets are publicly reachable without Vercel authentication. Record the actual production URL and observed results here once deployment completes.

## Future updates

Once this folder is linked to the chosen Vercel project, retain `.vercel/project.json` locally so subsequent deployments update that project and its existing production alias.

```sh
npm test
npm run lint
npx vercel@65.16.0 --prod
```

Vercel builds from the local source; a GitHub connection is optional. Inspect the CLI's final production alias and verify the live page after each update. Do not use `--temporary`, `--turbo`, domain-purchase commands or plan-upgrade commands for this project.
