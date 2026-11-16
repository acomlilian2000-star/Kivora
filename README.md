# KIVORA — Ideas into Impact

KIVORA is an Uganda-first, mobile-first learning and innovation MVP for rural schools and communities, designed to be adaptable to other countries. Community challenges move through review, teacher-approved challenges can be explored by learners, and the Impact Engine can turn an approved challenge into a structured learning-project draft.

## Run locally

Requirements: Node.js 20.9 or later and npm.

1. Install packages:

   ```powershell
   npm.cmd install
   ```

2. Copy `.env.example` to `.env`, then set `AUTH_SECRET` to a long random value and `TEACHER_INVITE_CODE` to a private invitation code. Keep `.env` local and never commit it. The SQLite database is created locally.
3. Generate the Prisma client and create the local database:

   ```powershell
   npx.cmd prisma generate
   npx.cmd prisma db push
   ```

4. Start the development server:

   ```powershell
   npm.cmd run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) for the public landing page. Select **Explore the platform** to enter `/dashboard`. The sidebar sections can be collapsed, pages have shareable URLs, and browser back/forward works.

The local database is `prisma/dev.db`. It starts empty by design: no sample challenges, fake learners, teams, activity counts, or impact stories are seeded. Submit a real challenge through the website or the configured USSD callback to create the first record.

## Demo flow

1. Register a teacher account with your `TEACHER_INVITE_CODE`.
2. From **Manage learners**, create a supervised student account and securely give the learner the one-time login ID and password. The learner must change the password on first sign-in.
3. Sign in as a community member (or submit through USSD) and share a real local challenge.
4. As a teacher, open **Teacher review** and approve the challenge.
5. As a student, discover the approved challenge, create a team and use **My projects** to plan a safe solution, local resources, materials, steps and expected outcomes.
6. Submit real progress for teacher feedback. Public showcase sharing needs both learner opt-in and explicit teacher approval.
7. Add an OpenAI API key to generate an age-appropriate project draft. A teacher must review AI output before it is assigned.
8. Use **Mobile access** only as a developer test of the callback. It is not a live shortcode.

## Reaching a village on a basic phone

A community member does **not** open this website on a kabiriti phone. Once the service is launched, they dial the real KIVORA USSD shortcode assigned through Africa's Talking and the participating Ugandan mobile networks, choose **Submit a community problem**, and answer short prompts. USSD works without an internet bundle or smartphone, but the phone still needs cellular network coverage.

To activate that flow:

1. Arrange an Africa's Talking USSD service/shortcode for Uganda and confirm which networks it supports.
2. Deploy KIVORA to a public HTTPS URL (or use a temporary HTTPS tunnel while developing).
3. Configure the Africa's Talking callback to `https://<your-host>/api/ussd`.
4. Test the assigned shortcode on actual basic phones and supported networks before telling communities to use it.

`localhost` is not reachable by Africa's Talking or by a village phone. The demo has no assigned live shortcode; do not advertise one until the provider and network operators activate it. SMS confirmations also require valid server-side Africa's Talking credentials.

## Environment variables

The `.env` file is local and ignored by Git. Never commit real API keys.

| Variable | Required for | Local default |
| --- | --- | --- |
| `DATABASE_URL` | Prisma persistence | `file:./dev.db` (SQLite) |
| `AUTH_SECRET` | Sign and encrypt login sessions | Generate a private random secret |
| `TEACHER_INVITE_CODE` | Gate teacher self-registration | Choose a private invitation code |
| `OPENAI_API_KEY` | OpenAI project generation | Empty until configured |
| `OPENAI_MODEL` | OpenAI model | `gpt-4o-mini` |
| `NEXT_PUBLIC_APP_URL` | Local app URL | `http://localhost:3000` |
| `AT_USERNAME`, `AT_API_KEY` | Africa's Talking outbound SMS | Sandbox username; key empty |
| `AT_ENVIRONMENT` | SMS API host | `sandbox` |
| `AT_SENDER_ID` | Optional registered SMS sender | Empty |
| `TEACHER_PHONE_NUMBER` | Optional teacher SMS alerts | Empty |

Restart `npm.cmd run dev` after changing environment variables. AI generation returns a clear configuration error until `OPENAI_API_KEY` is set. SMS delivery is not attempted until Africa's Talking credentials are supplied. Never put provider secrets in browser code.

## API routes

- `GET /api/challenges?status=pending|published` — list persisted challenges.
- `GET /api/dashboard/summary` — counts current stored challenges, teams and submissions (no seeded metrics).
- `POST /api/challenges` — submit a challenge for teacher review.
- `PATCH /api/challenges/:id` — teacher publishes a challenge.
- `GET /api/teams` and `POST /api/teams` — supervised student teams and their project plans.
- `PATCH /api/projects/:id` — update an owned project plan and project stage.
- `POST /api/submissions` — submit project progress and learner-reported impact for review.
- `PATCH /api/account/password` — change a supervised learner's one-time password.
- `POST /api/impact-engine` — generate and save a structured OpenAI project-brief draft. Curriculum retrieval is inactive until real resources are added to the library.
- `GET /api/project-briefs` and `PATCH /api/project-briefs/:id` — teacher review of AI briefs.
- `POST /api/ussd` — Africa's Talking USSD callback and developer-only browser simulator.

## Scope and deployment notes

Uganda alignment is informed by the [NCDC Lower Secondary Curriculum](https://ncdc.go.ug/lower-secondary-curriculum-embraced/), which describes a competency-based framework including key learning outcomes, values, generic skills, cross-cutting issues and a curriculum menu. KIVORA project briefs are learning supports, not substitutes for the current school syllabus or teacher judgement. Teachers should select the learner's level and check alignment to the current subject syllabus.

The interface is designed mobile-first for rural connectivity constraints. The website itself still needs an internet connection; the separate USSD route is intended for basic phones without mobile data. The current UI and USSD prompts are in English; local-language versions should be co-designed and tested with Ugandan communities.

This repository is a locally runnable hackathon MVP, not a production-ready deployment. SQLite keeps setup self-contained; before a shared deployment, switch Prisma to PostgreSQL and migrate the schema. Authentication uses Auth.js credentials with role and teacher-invitation checks; accounts, school verification workflows, guardian consent and supervised moderation still need further production review. The resource library is empty until real curriculum materials are added; AI briefs must not be described as retrieval-grounded until that source library exists. File uploads and live Africa's Talking shortcode activation require provider configuration and are not represented as complete.

AI output is an untrusted draft. A qualified teacher should check accuracy, age-appropriateness, curriculum alignment and safety before assigning a project.
