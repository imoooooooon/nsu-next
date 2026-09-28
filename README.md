# Ugrads

Two apps live in this repo, deployed together at https://nsu-next.vercel.app:

- **Mobile prototype** (repo root, unchanged): the phone-frame design build that
  clients and testers review on mobile — served at `/`.
- **Web app** ([`webapp/`](webapp/)): the desktop web version with proper
  routing and a reusable component system — served at `/webapp`. See
  [`webapp/README.md`](webapp/README.md) and
  [`webapp/DESIGN_SYSTEM.md`](webapp/DESIGN_SYSTEM.md).

The root `vercel.json` builds both apps into a single static deploy.

**Department Hub** (Entity Profiles — department directory, delegated admin
access, broadcast channel, help desk): the information architecture that governs
it on both surfaces is [`DEPARTMENT_HUB_IA.md`](DEPARTMENT_HUB_IA.md). Read it
before changing those screens.

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
