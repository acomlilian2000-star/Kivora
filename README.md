# KIVORA — Ideas into Impact

KIVORA is a mobile-first learning and innovation MVP. Community challenges move through review, teacher-approved challenges can be explored by students, and the Impact Engine can turn an approved challenge into a structured learning-project draft.

## Run locally

Requirements: Node.js 20.9 or later and npm.

1. Install packages:

   ```powershell
   npm.cmd install
   ```

2. The checked-out project includes a local `.env` for SQLite and development defaults. Copy `.env.example` to `.env` if you need to restore it.
3. Generate the Prisma client and create the local database:

   ```powershell
   npx.cmd prisma generate
   npx.cmd prisma db push
   ```

4. Start the development server:

   ```powershell
   npm.cmd run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) for the public landing page. Select **Explore the platform** to open the dashboard at `/dashboard`.

The local database is `prisma/dev.db`. The first request to the challenges API seeds the demo challenges; the curriculum resource records are seeded when the Impact Engine is used.

## Demo flow

1. On the dashboard choose **Share a challenge** and submit a community problem. It is stored with `pending` status.
2. Open **Teacher review** and approve it. The challenge becomes visible to students.
3. Open **Discover challenges**, select the challenge and generate a learning-project brief. Add an OpenRouter API key first; the draft is saved and is not student-approved yet.
4. In **Teacher review → Project briefs**, approve the generated brief.
5. Use **Mobile access** to simulate the Africa's Talking USSD menu. The same callback is available at `POST /api/ussd`.

## Environment variables

The `.env` file is local and ignored by Git. Never commit real API keys.

| Variable | Required for | Local default |
| --- | --- | --- |
| `DATABASE_URL` | Prisma persistence | `file:./dev.db` (SQLite) |
| `OPENROUTER_API_KEY` | AI project generation | Empty until configured |
| `OPENROUTER_MODEL` | OpenRouter model | `openai/gpt-4o-mini` |
| `NEXT_PUBLIC_APP_URL` | OpenRouter attribution | `http://localhost:3000` |
| `AT_USERNAME`, `AT_API_KEY` | Africa's Talking outbound SMS | Sandbox username; key empty |
| `AT_ENVIRONMENT` | SMS API host | `sandbox` |
| `AT_SENDER_ID` | Optional registered SMS sender | Empty |
| `TEACHER_PHONE_NUMBER` | Optional teacher SMS alerts | Empty |

Restart `npm.cmd run dev` after changing environment variables. AI generation returns a clear configuration error until `OPENROUTER_API_KEY` is set. SMS delivery is not attempted until Africa's Talking credentials are supplied. To receive real USSD traffic, expose the local app through a public HTTPS tunnel and configure the Africa's Talking sandbox callback URL as `https://<public-host>/api/ussd`.

## API routes

- `GET /api/challenges?status=pending|published` — list persisted challenges.
- `POST /api/challenges` — submit a challenge for teacher review.
- `PATCH /api/challenges/:id` — teacher publishes a challenge.
- `POST /api/impact-engine` — generate and save an OpenRouter project brief with retrieved curriculum references.
- `GET /api/project-briefs` and `PATCH /api/project-briefs/:id` — teacher review of AI briefs.
- `POST /api/ussd` — Africa's Talking USSD callback and local simulator.

## Scope and deployment notes

This repository is a locally runnable hackathon MVP, not a production-ready deployment. SQLite keeps setup self-contained; before a shared deployment, switch Prisma to PostgreSQL and migrate the schema. Authentication/authorization, student accounts, teams and submissions, evidence uploads, assessment/badges, inbound SMS, delivery retries, production-grade RAG/vector search, and deployment secrets still need implementation/configuration. Current teacher/student screens are demo workspaces, not security boundaries. Do not expose the demo endpoints to the public internet as-is.

AI output is an untrusted draft. A qualified teacher should check accuracy, age-appropriateness, curriculum alignment and safety before assigning a project.
