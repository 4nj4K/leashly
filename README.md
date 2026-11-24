# Leashly 🐾

> **Who walked the dog?** A shared walk tracker for families with a dog — built from idea to production as a full-stack portfolio project.

**Live app:** [leashly.onrender.com](https://leashly.onrender.com)

> The backend runs on a free plan and goes to sleep when nobody uses it. The first visit can take up to a minute while it wakes up.

![Leashly screenshots](docs/screenshots.png)

---

## The story

My family has a dog called Bobby. Four of us take him out — me, my mom, my dad and my little brother — and we kept arguing about who walked him, when, and who walks him the most.

So I built Leashly. Everyone in the family logs their walks, and the app shows a calendar, statistics and who has walked Bobby the most this week, month and year. 

## Features

- **Calendar** – every day gets a thin ring with one colored segment per walk, so you can see at a glance who walked Bobby
- **Log a walk** – pick who walked, the time of day and the date
- **Statistics** – one ring per family member, with a week / month / year switch and smooth animations
- **Streak** – how many days in a row Bobby has been walked
- **Families and invites** – create a "pack", share an invite link, and family members join with their own name and color
- **Color palette** – eight colors designed to work together in any combination; taken colors are disabled
- **Delete with confirmation** – tap once to show "Delete?", tap again to delete
- **Dark and light mode** – follows the device setting, with an animated toggle that remembers your choice
- **Mobile first** – built to be added to the phone's home screen

## Design

I designed the app before writing any code. I explored several directions — calm and elegant, playful and colorful, dark and sporty — and chose a dark, premium look inspired by fitness and wellness apps.

Some decisions I made along the way:

- **One focal point per screen** with a lot of space, thin typography and soft light instead of loud colors
- **Typography:** Inter Tight for the interface and Instrument Serif for headings
- **"Northern lights" palette:** eight colors with similar strength but different hues, so any combination looks good together
- **Glass effects** with subtle borders and highlights instead of solid cards
- **Light mode** uses darker "twin" versions of each color, and soft shadows instead of glow, so everything stays readable on a light background

## Tech stack

| Part | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, lucide-react |
| Backend | .NET Minimal API, Entity Framework Core |
| Database | PostgreSQL on Neon (SQLite locally) |
| Hosting | Render (static site + Docker web service) |
| Workflow | Git, feature branches and pull requests |

## Architecture

```
React app (Render static site)
        │  fetch, JSON over HTTPS
        ▼
.NET API (Docker on Render)
        │  Entity Framework Core
        ▼
PostgreSQL (Neon)
```

- All communication with the backend lives in one file, `src/api.ts`
- The backend validates everything itself (names, colors, family membership) instead of trusting the frontend
- Environment variables decide which database and which frontend URL to use, so the same code runs locally and in production
- CORS only allows the real frontend in production

### API endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/families` | Create a family and its first member |
| GET | `/api/families/{id}` | Get a family |
| GET | `/api/invites/{code}` | Get a family and its members from an invite code |
| POST | `/api/invites/{code}/members` | Join a family |
| GET | `/api/families/{id}/members` | Get the family's members |
| GET | `/api/families/{id}/walks` | Get the family's walks |
| POST | `/api/families/{id}/walks` | Log a walk |
| DELETE | `/api/families/{id}/walks/{walkId}` | Delete a walk |

## How I worked

I built Leashly step by step, the way a team would work on a real product:

1. **Design first** – sketches and iterations until the look felt right
2. **Frontend with mock data** – calendar, logging and statistics before any backend existed
3. **Backend and database** – endpoints tested with `curl` before connecting the frontend
4. **Families and invites** – one feature branch with many commits and one pull request
5. **Deployment** – Docker, environment variables, a cloud database and automatic deploys from `main`

Every feature was built on its own branch and merged with a pull request.

### Working with AI

I used Claude as a pair-programming partner throughout the project: to explore design directions, to plan the build in phases, to explain new concepts and to debug errors. I typed and wired up all the code myself, and I made sure I understood every part before moving on. Working this way taught me how to break a big idea into small steps, ask precise questions and read error messages carefully.

## Run it locally

**You need:** Node.js and the .NET SDK.

**1. Clone the repository**
```
git clone https://github.com/4nj4K/leashly.git
cd leashly
```

**2. Start the backend** (uses a local SQLite file)
```
cd api
dotnet run
```

**3. Start the frontend** in a second terminal
```
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Environment variables

| Variable | Where | Description |
|---|---|---|
| `DATABASE_URL` | Backend | PostgreSQL connection string. If missing, SQLite is used |
| `FRONTEND_URL` | Backend | The only origin allowed by CORS. If missing, all origins are allowed |
| `VITE_API_URL` | Frontend | The backend URL including `/api` |

## What I learned

- **Lifting state up** – keeping shared data in the parent and passing it down as props
- **Async code** – `fetch`, `async`/`await`, promises and error handling
- **Thinking in APIs** – designing endpoints and HTTP status codes, and testing them with `curl`
- **Security basics** – server-side validation, CORS and keeping secrets out of the code
- **Deployment** – Docker, environment variables and the difference between code (GitHub) and data (the database)
- **Debugging** – reading error messages, and that a single misplaced `}` can turn a whole file red

## Roadmap

- [ ] Real accounts with login
- [ ] Edit an existing walk
- [ ] App icon and full "add to home screen" support
- [ ] Reminders when nobody has walked the dog yet today
- [ ] "I'm already a member" for switching phones

---

Made with 🐾 by Anja · [GitHub](https://github.com/4nj4K)