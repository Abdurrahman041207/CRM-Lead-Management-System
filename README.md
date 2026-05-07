# CRM Lead Management System

## Project Overview

CRM Lead Management System is a full-stack application for tracking sales leads from first contact through final outcome. It gives a small sales workflow a single place to log in, create and update leads, capture notes, and monitor pipeline performance through a simple dashboard.

This project demonstrates full-stack development across frontend, backend, authentication, API design, and relational database management. The application is structured as a separate React client and NestJS server backed by PostgreSQL with Prisma ORM.

---

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- React Router
- Axios

### Backend

- NestJS
- TypeScript
- Passport JWT authentication
- class-validator / class-transformer

### Database

- PostgreSQL
- Prisma ORM

### Tooling and Testing

- ESLint
- Jest
- Supertest

---

## Features

### Authentication

- Secure login with email and password
- JWT-based session handling
- Protected routes on both client and server
- Auto-logout behavior when the API returns `401`

### Lead Management

- Create new leads
- View all leads assigned to the logged-in user
- Edit existing leads
- Delete leads
- Track lead status using `NEW`, `CONTACTED`, `QUALIFIED`, `PROPOSAL_SENT`, `WON`, and `LOST`
- Store lead source and estimated deal value

### Lead Details and Notes

- View a dedicated detail page for each lead
- See assigned user, timestamps, and key contact information
- Add notes to a lead
- View notes in reverse chronological order

### Dashboard

- Total leads count
- Lead counts by status
- Total pipeline value
- Total won revenue

### Filtering and Validation

- Filter leads by status
- Filter leads by source
- Backend request validation using NestJS validation pipes
- Centralized backend exception handling for cleaner API responses

---

## Setup Instructions

### Prerequisites

- Node.js 18 or newer
- npm
- PostgreSQL

### 1. Clone the Repository

```bash
git clone https://github.com/Abdurrahman041207/CRM-Lead-Management-System
cd "CRM Lead Management System"
```

### 2. Install Dependencies

```bash
cd server
npm install
```

```bash
cd ../client
npm install
```

### 3. Start the Backend

```bash
cd server
npm run start:dev
```

The API runs on:

```text
http://localhost:3000
```

### 4. Start the Frontend

Open a second terminal:

```bash
cd client
npm run dev
```

The client runs on:

```text
http://localhost:5173
```

---

## DB Setup

### 1. Create a PostgreSQL Database

Create a database locally, for example:

```sql
CREATE DATABASE crm_lead_management;
```

### 2. Configure the Server Environment

Create a `.env` file inside [`server`](/C:/Users/abdur/Documents/GitHub/CRM%20Lead%20Management%20System/server) and add the required variables listed below.

### 3. Run Prisma Migrations

```bash
cd server
npx prisma migrate dev
```

### 4. Seed the Database

```bash
npx prisma db seed
```

This inserts the default admin user used for local testing.

---

## Test Credentials

After running the seed script, log in with:

```text
Email: admin@example.com
Password: password123
```

---

## Environment Variables

Create [`server/.env`](/C:/Users/abdur/Documents/GitHub/CRM%20Lead%20Management%20System/server/.env) with:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/crm_lead_management"
JWT_SECRET="your-secret-key"
JWT_EXPIRATION="1d"
```

### Variable Notes

- `DATABASE_URL`: PostgreSQL connection string used by Prisma and the NestJS server
- `JWT_SECRET`: secret used to sign and verify access tokens
- `JWT_EXPIRATION`: optional token lifetime; the app currently falls back to `1d` if not provided

### Frontend Environment Notes

- No dedicated frontend `.env` file is currently required
- The client uses a hardcoded API base URL:
  - local development: `http://localhost:3000`
  - production: `https://crm-lead-management-system.onrender.com`

---

## Known Limitations

- There is no user registration flow; authentication depends on existing seeded or manually created users
- The system is effectively single-user in practice. While leads are linked to the logged-in user in the database, the current app is set up around one seeded test account and does not include user management, multiple salesperson accounts, shared team views, or a meaningful assigned-salesperson filter across different users
- The frontend does not currently support search, pagination, or advanced sorting for large lead lists
- The API base URL is hardcoded in the client instead of being driven by frontend environment variables
- Notes only store content and timestamps; they are not attributed to a separate note author model
- Dashboard metrics are calculated client-side from the fetched lead list rather than through dedicated reporting endpoints
- The backend CORS allowlist is fixed to localhost and one deployed frontend URL

---

## Reflection

This project was a good exercise in connecting a modern frontend to a structured backend with authentication and a relational data model. It covers the core product loop of logging in, managing leads, storing follow-up context, and turning raw records into lightweight pipeline insights.

The biggest strengths of the implementation are the clear separation between client and server, the use of Prisma for schema-driven database work, and the use of route protection plus JWT authentication to keep the application flow coherent.

If I were extending this further, the next improvements would be:

- multi-user collaboration with roles and permissions
- better reporting and analytics endpoints
- search, pagination, and richer filtering
- configurable frontend environment variables
- stronger automated test coverage across lead and note workflows
- deployment polish and production-grade configuration management

---

## Demo Video

Link: https://drive.google.com/file/d/1-vfDZjHphWu4aLEp_-19orsq8AkVRXpo/view?usp=sharing

---

## Deployment

- Frontend: [Vercel](https://crm-lead-management-system.vercel.app)
- Backend: [Render](https://crm-lead-management-system.onrender.com)
- Database: PostgreSQL hosted on Neon

If login is required, use the test credentials listed above.
