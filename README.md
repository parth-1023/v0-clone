<div align="center">

# ✦ V0 Clone — AI-Powered App Generator ✦

**A full-stack clone of [v0.dev](https://v0.dev) — describe any web app in plain English and watch it get built in real-time inside a live sandbox.**

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk)](https://clerk.com/)
[![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![E2B](https://img.shields.io/badge/E2B-Sandbox-F97316)](https://e2b.dev/)
[![Inngest](https://img.shields.io/badge/Inngest-Agent_Kit-8B5CF6)](https://www.inngest.com/)

</div>

---

## 📸 Preview
![Main Page Screenshot](./docs/images/mainpage.png)
![Main Page Screenshot](./docs/images/project_history.png)

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Configure Environment Variables](#3-configure-environment-variables)
  - [4. Start the Database](#4-start-the-database)
  - [5. Run Database Migrations](#5-run-database-migrations)
  - [6. Start the Dev Server](#6-start-the-dev-server)
  - [7. Start the Inngest Dev Server](#7-start-the-inngest-dev-server)
- [Project Structure](#-project-structure)
- [How It Works](#-how-it-works)
- [Screenshots](#-screenshots)
- [Environment Variables Reference](#-environment-variables-reference)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**V0 Clone** is a production-quality, full-stack AI application that replicates the core functionality of Vercel's v0.dev. Users can type a natural-language prompt (e.g., *"Build me a Kanban board with drag-and-drop"*) and the app will:

1. Spin up an isolated **E2B cloud sandbox** running a live Next.js environment.
2. Use a **multi-agent AI system** (powered by Google Gemini 2.5 Flash via Inngest Agent Kit) to write, modify, and install code inside that sandbox.
3. Stream the result back and display a **live preview URL** alongside the full generated code — all in your browser.

Projects, messages, and generated code fragments are persisted to a **PostgreSQL** database via Prisma, and the entire application is secured with **Clerk** authentication.

<!-- 📸 SCREENSHOT: Add a GIF or short demo video of a prompt being typed and the output loading -->
<!-- Example: ![Demo GIF](./docs/images/demo.gif) -->

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Code Generation** | Multi-agent system using Google Gemini 2.5 Flash Lite generates production-quality Next.js code |
| 🧪 **Live Sandbox Preview** | Every generation runs inside a real E2B cloud sandbox with a live preview URL |
| 💬 **Persistent Projects** | Conversations are saved per-project; resume any project and iterate on previous results |
| 🔐 **Authentication** | Full sign-in/sign-up flow via Clerk with protected routes |
| 🚦 **Rate Limiting** | Built-in rate limiting per user to prevent API abuse |
| 📁 **File Explorer** | View all generated files and their content per message fragment |
| ⚡ **Turbopack** | Blazing-fast local development with Next.js Turbopack |
| 🎨 **Shadcn/UI** | Full Shadcn component library pre-installed with Tailwind CSS v4 |
| 🔄 **Real-time Updates** | Inngest handles async background jobs with reliable event-driven execution |

---

## 🛠 Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** — React framework with App Router & Turbopack
- **[React 19](https://react.dev/)** — Latest React with compiler optimizations
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Utility-first CSS framework
- **[Shadcn/UI](https://ui.shadcn.com/)** — Accessible component library built on Radix UI
- **[Lucide React](https://lucide.dev/)** — Beautiful icon library
- **[TanStack Query](https://tanstack.com/query)** — Server state management
- **[React Hook Form](https://react-hook-form.com/)** + **[Zod](https://zod.dev/)** — Form handling & validation
- **[Sonner](https://sonner.emilkowal.ski/)** — Toast notifications
- **[React Resizable Panels](https://github.com/bvaughn/react-resizable-panels)** — Split-pane UI layout

### Backend & AI
- **[Inngest Agent Kit](https://www.inngest.com/docs/agent-kit/overview)** — Multi-agent orchestration framework
- **[Google Gemini 2.5 Flash Lite](https://deepmind.google/technologies/gemini/)** — LLM powering code generation agents
- **[E2B Code Interpreter](https://e2b.dev/)** — Cloud sandboxes for running generated code
- **[Prisma ORM](https://www.prisma.io/)** — Type-safe database client
- **[PostgreSQL](https://www.postgresql.org/)** — Relational database
- **[rate-limiter-flexible](https://github.com/animir/node-rate-limiter-flexible)** — API rate limiting

### Auth & Infrastructure
- **[Clerk](https://clerk.com/)** — Authentication & user management
- **[Docker](https://www.docker.com/)** — Local PostgreSQL via Docker Compose

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Next.js App                          │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Clerk Auth │  │  App Router  │  │  Shadcn / UI  │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │ API Routes
┌────────────────────────▼────────────────────────────────┐
│                    Inngest Engine                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │             code-agent-network                    │   │
│  │  ┌────────────┐  ┌───────────────────────────┐   │   │
│  │  │ Code Agent │  │  Fragment Title Generator  │   │   │
│  │  │ (Gemini)   │  │  + Response Generator      │   │   │
│  │  └────────────┘  └───────────────────────────┘   │   │
│  └──────────────────────────────────────────────────┘   │
└───────────────┬──────────────────────┬──────────────────┘
                │                      │
┌───────────────▼──────┐  ┌────────────▼────────────────┐
│   E2B Cloud Sandbox  │  │  PostgreSQL (via Docker)     │
│  (Next.js runtime)   │  │  Prisma ORM                  │
│  - Write files       │  │  Users / Projects /          │
│  - Run npm install   │  │  Messages / Fragments        │
│  - Live preview URL  │  └─────────────────────────────┘
└──────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

| Tool | Version | Notes |
|---|---|---|
| **Node.js** | `v18+` | [Download](https://nodejs.org/) |
| **npm** | `v9+` | Comes with Node.js |
| **Docker Desktop** | Latest | [Download](https://www.docker.com/products/docker-desktop/) — must be **running** |
| **Git** | Any | [Download](https://git-scm.com/) |

You will also need accounts and API keys for:
- **[Clerk](https://clerk.com/)** — Authentication (free tier available)
- **[Google AI Studio](https://aistudio.google.com/)** — Gemini API Key (free tier available)
- **[E2B](https://e2b.dev/)** — Cloud Sandbox API Key (free tier available)
- **[Inngest](https://inngest.com/)** — Background jobs (free tier, local dev server also available)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/v0-clone.git
cd v0-clone
```

---

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, Prisma, Inngest Agent Kit, Shadcn/UI, and more.

---

### 3. Configure Environment Variables

Create a `.env` file in the root directory by copying the example below:

```bash
cp .env.example .env   # if .env.example exists, otherwise create manually
```

Open `.env` and fill in your credentials:

```env
# ─── Database ───────────────────────────────────────────
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/postgres?schema=public"

# ─── Clerk Authentication ────────────────────────────────
# Get these from: https://dashboard.clerk.com → Your App → API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY= YOUR KEY
CLERK_SECRET_KEY= YOUR KEY

# ─── Google Gemini ───────────────────────────────────────
# Get this from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY= YOUR KEY

# ─── E2B Sandbox ─────────────────────────────────────────
# Get this from: https://e2b.dev/dashboard
E2B_API_KEY= YOUR KEY
```

> **⚠️ Important:** Never commit your `.env` file to Git. It is already listed in `.gitignore`.


---

### 4. Start the Database

Make sure **Docker Desktop is open and running**, then start the PostgreSQL container:

```bash
docker compose up -d
```

This spins up a PostgreSQL 16 instance on **port 5433** (to avoid conflicts with any local Postgres on the default 5432).

Verify it's running:
```bash
docker ps
# You should see a container named "v0-clone-db-1" or similar
```


---

### 5. Run Database Migrations

Apply the Prisma schema to your database:

```bash
npx prisma migrate dev
```

This will create all the required tables (`User`, `Project`, `Message`, `Fragment`, `Usage`).

To visually inspect your database, open **Prisma Studio**:
```bash
npx prisma studio

```


This opens a GUI at `http://localhost:5555`.

![Prisma Studio](./docs/images/prisma.png)

---

### 6. Start the Dev Server

```bash
npm run dev
```

This command simultaneously:
1. Starts the PostgreSQL Docker container (if not already running)
2. Launches the Next.js dev server on **[http://localhost:3000](http://localhost:3000)** with Turbopack

![Main Page Screenshot](./docs/images/mainpage.png)

---

### 7. Start the Inngest Dev Server

The AI agent pipeline runs on Inngest. Open a **second terminal** and run:

```bash
npx inngest-cli@latest dev
```

This starts the Inngest development server at **[http://localhost:8288](http://localhost:8288)** and connects to your Next.js app to handle background AI job execution.

> **ℹ️ Why do I need this?** When you submit a prompt, the app fires an Inngest event (`code-agent/run`). The Inngest dev server picks this up and runs the multi-agent AI pipeline in the background. Without it, prompts will queue but never execute.

![Inngest](./docs/images/inngest.png)
---

### ✅ You're Ready!

Open [http://localhost:3000](http://localhost:3000), sign in with Clerk, create a new project, and type your first prompt!

![Signup page Screenshot](./docs/images/clerk_signup.png)
![Chat page Screenshot](./docs/images/chat.png)

---

## 📁 Project Structure

```
v0-clone/
├── prisma/
│   ├── schema.prisma          # Database models: User, Project, Message, Fragment, Usage
│   └── migrations/            # Auto-generated migration history
│
├── sandbox-templates/
│   └── nextjs/                # E2B sandbox base template for generated apps
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (root)/            # Public/authenticated pages
│   │   ├── projects/          # Project detail pages
│   │   └── api/
│   │       └── inngest/       # Inngest API route handler
│   │
│   ├── components/            # Shared UI components (Shadcn + custom)
│   ├── hooks/                 # Custom React hooks
│   │
│   ├── inngest/
│   │   ├── client.js          # Inngest client initialization
│   │   ├── functions.js       # Core AI agent function (codeAgentFunction)
│   │   └── utils.js           # Helper utilities for agent output parsing
│   │
│   ├── lib/
│   │   └── db.js              # Prisma client singleton
│   │
│   ├── modules/               # Feature modules (auth, home, messages, projects, usage)
│   ├── middleware.js           # Clerk auth middleware for route protection
│   └── prompt.js              # System prompts for all AI agents
│
├── docker-compose.yml         # PostgreSQL container definition
├── next.config.mjs            # Next.js configuration
├── components.json            # Shadcn/UI configuration
└── package.json
```

---

## 🔄 How It Works

Here's the end-to-end flow when a user submits a prompt:

```
1. User types a prompt  →  Next.js API route fires an Inngest event
                                        │
2. Inngest picks up the event           │
                                        ▼
3. E2B spawns a fresh Next.js cloud sandbox (isolated environment)
                                        │
4. Code Agent (Gemini 2.5 Flash Lite) receives the prompt + conversation history
   ├─ Uses `createOrUpdateFiles` tool  →  writes .tsx/.ts files to sandbox
   ├─ Uses `terminal` tool             →  runs `npm install <package>`
   └─ Uses `readFiles` tool            →  inspects existing sandbox files
                                        │
5. Agent emits <task_summary> when done │
                                        ▼
6. Fragment Title Generator + Response Generator run in parallel (Gemini agents)
                                        │
7. Results saved to PostgreSQL:         │
   ├─ Message (role: ASSISTANT, type: RESULT)
   └─ Fragment (sandboxUrl, title, files JSON)
                                        │
8. Frontend polls / receives update     │
   └─ Displays: live preview iframe + generated file tree
```

---

## 📸 Screenshots

| View | Screenshot |
|---|---|
| **Landing / Home** | ![Landing Page](./docs/images/mainpage.png) |
| **Project Chat UI** | ![Chat View](./docs/images/chat.png) |
| **Clerk Signup page** | ![Clerk Signup page](./docs/images/clerk_signup.png) |
| **Inngest Dashboard** | ![Inngest](./docs/images/inngest.png) |
| **Prisma Studio** | ![Prisma Studio](./docs/images/prisma.png) |

---

## 🔑 Environment Variables Reference

| Variable | Required | Where to Get It |
|---|---|---|
| `DATABASE_URL` | ✅ | Set by default for local Docker Postgres |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ | [Clerk Dashboard](https://dashboard.clerk.com) → API Keys |
| `CLERK_SECRET_KEY` | ✅ | [Clerk Dashboard](https://dashboard.clerk.com) → API Keys |
| `GEMINI_API_KEY` | ✅ | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `E2B_API_KEY` | ✅ | [E2B Dashboard](https://e2b.dev/dashboard) |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/my-new-feature`
3. **Commit** your changes: `git commit -m 'feat: add some feature'`
4. **Push** to the branch: `git push origin feature/my-new-feature`
5. **Open** a Pull Request

Please make sure your code follows the existing patterns and passes linting:
```bash
npm run lint
```

---

## 📄 License

This project is for educational purposes

---

<div align="center">

Built with ❤️ using **Next.js**, **Gemini AI**, **E2B**, and **Inngest**

</div>
