# Give & Get — Client (React + TypeScript)

A focused, polished README for the client-side application of the Give & Get project. This file documents how to run the client, what it contains, and the important implementation details discovered in the repository.

---

## Quick summary
- Framework: React (Create React App)
- Language: TypeScript
- UI: MUI (Material-UI)
- HTTP client: Axios
- Real-time: SignalR (@microsoft/signalr)
- Testing: Jest + React Testing Library
- Proxy (dev): https://localhost:7160 (see `package.json`)

---

## Badges

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![SignalR](https://img.shields.io/badge/SignalR-32CD32?style=for-the-badge)

---

## Table of contents
- Overview
- Prerequisites
- Install & run
- Scripts
- Environment variables
- Project structure (client)
- Important files and responsibilities
- Useful dev tips
- Troubleshooting
---

## Overview
The client is a single-page React + TypeScript application that provides the user interface for the Give & Get platform. It consumes REST APIs from the ASP.NET Core backend (server/GiveAndGet-server) using Axios and connects to SignalR hubs for real-time chat.

This README focuses on the actual client code found under `src/` and describes how to run, test and extend it.

---

## Prerequisites
- Node.js (LTS) and npm
- Recommended: Windows PowerShell (commands below fit PowerShell)
- A running instance of the backend (or set `REACT_APP_API_URL` to a reachable API)

---

## Install & run (local)
1. Open PowerShell and move to the client directory:

```powershell
cd "Give-Get-client"
```

2. Install dependencies:

```powershell
npm install
```

3. Start the dev server:

```powershell
npm start
```

The app uses Create React App default port (http://localhost:3000) unless otherwise configured. `package.json` includes a `proxy` field that forwards API requests to `https://localhost:7160` during development.

To create a production build:

```powershell
npm run build
```

---

## Scripts (from package.json)
- `npm start` — run the development server (react-scripts start)
- `npm run build` — create production build (react-scripts build)
- `npm test` — run test runner (react-scripts test)
- `npm run eject` — eject CRA (use with care)

---

## Environment variables
A `.env` file exists in the client root. Use environment variables to point the client to the proper backend and hubs. Typical variables (confirm exact names in `src/apis/*.tsx`):

- `REACT_APP_API_URL` — backend base URL (e.g. `https://localhost:7160/api`)
- `REACT_APP_SIGNALR_URL` — SignalR hub base URL (if not using the same API host)

Note: During development the `proxy` in `package.json` is set to `https://localhost:7160` which allows relative API paths in Axios to be proxied to the backend without CORS changes.

Do not commit `.env` containing secrets.

---

## Project structure (client)

Root (client/Give-Get-client)
- public/
  - index.html, manifest.json, robots.txt
- src/
  - apis/ — Axios wrappers for backend endpoints (chatApi, userApi, talentApi, etc.)
  - assets/images — default-user.png, logo.png
  - components/
    - common/ — shared layout (HeaderFooter.tsx)
    - specific/ — page-specific components (ChatBox, Exchange, ProfileDetails, TalentRequests, TopUsers, etc.)
    - UpdateTalentsForm.tsx
  - hooks/ — custom hooks (useTalents.tsx, useUserData.tsx)
  - pages/ — top-level routes (HomePage, LoginPage, RegisterPage, ProfilePage, TalentsPage, ChatPage, CommentsPage, AboutPage)
  - services/ — client-side services (chatService.tsx wraps SignalR client)
  - styles/ — CSS files per feature
  - Types/ — shared TypeScript types
  - utils/ — small helpers (validation.tsx)
  - index.tsx, App.tsx — entry points
  - setupTests.ts, App.test.tsx — test bootstrapping and example tests

This structure is ready for feature development and easy to refactor to MUI theming or a global state solution (Redux/Context) if needed.

---

## Important files & responsibilities
- `src/apis/*.tsx` — Put auth headers and base URL here. Keep the API layer thin and testable.
- `src/services/chatService.tsx` — Creates a SignalR connection with `@microsoft/signalr` and handles sending/receiving messages.
- `src/components/common/HeaderFooter.tsx` — Main layout (navigation, footer). Good place for global links and auth status.
- `src/pages/*` — Route-level containers: handle composition of components, calls hooks, and manage page-level state.
- `src/hooks/useTalents.tsx` & `src/hooks/useUserData.tsx` — Encapsulate data fetching and local transformations.
- `src/utils/validation.tsx` — Shared validation helpers used by forms.

---

## Useful development tips
- Centralize Axios interceptors (authorization header, token refresh, error logging) in a single `apiClient` to avoid duplication.
- Keep types in `src/Types/` accurate — they make refactors safer.
- Use the existing stylesheets or migrate to MUI theme for consistent styling.
- Confirm SignalR hub path in `chatService.tsx` and match with server `Program.cs` hub mapping.
- For file uploads check API wrapper handles `multipart/form-data` and sets `Content-Type` correctly.

---

## Troubleshooting
- If API calls fail in development, check `proxy` in `package.json` or set `REACT_APP_API_URL` to backend address.
- If SignalR fails to connect, ensure the backend hub is running, and that the hub URL and allowed CORS are configured on the server.
- Typescript errors: run `npm run build` to get full type error list.

---
