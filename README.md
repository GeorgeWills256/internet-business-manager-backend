# Internet Business Manager Backend API

Backend API for the **Internet Business Manager** platform.
This service manages subscribers, managers, payments, access codes, authentication, and SMS notifications.

---

# Tech Stack

* Node.js
* NestJS
* TypeScript
* TypeORM
* PostgreSQL (or SQLite for simple setups)
* JWT Authentication
* Africa's Talking SMS API
* Scheduler / Cron Jobs

---

# Project Structure

src/
├── auth/            Authentication logic (JWT login)
├── subscribers/     Subscriber management
├── managers/        Manager accounts
├── payments/        Payment tracking
├── codes/           Access code generation
├── africastalking/  SMS service integration
├── scheduler/       Automated background jobs
├── entities/        Database entities
└── main.ts          Application entry point

---

# Environment Setup

Create your environment configuration file.

Copy the template:

cp .env.example .env

Then open `.env` and fill the required values.

Example environment variables:

PORT=3000
NODE_ENV=development

DATABASE_URL=postgresql://user:password@localhost:5432/internet_business_manager

JWT_SECRET=your_secret_key

AFRICASTALKING_USERNAME=sandbox
AFRICASTALKING_API_KEY=your_api_key

---

# Installation

Install project dependencies:

npm install

---

# Running the Server

Start development mode:

npm run start:dev

The API will start on:

http://localhost:3000

---

# Production Build

Build the project:

npm run build

Run the compiled server:

npm run start

---

# API Modules

The system contains the following modules:

| Module      | Purpose                                     |
| ----------- | ------------------------------------------- |
| Auth        | Authentication for admin and managers       |
| Subscribers | Manage internet subscribers                 |
| Managers    | Manager account management                  |
| Payments    | Track subscriber payments                   |
| Codes       | Generate and validate internet access codes |
| SMS         | Send notifications through Africa's Talking |
| Scheduler   | Background automation tasks                 |

---

# Deployment

The backend can be deployed to:

* Render
* Railway
* Fly.io
* VPS / Docker

Typical production commands:

npm run build
npm run start

---

# Security Notes

* `.env` files are ignored by Git
* Never commit secrets to the repository
* `.env.example` is provided as a template for configuration

---

# Author

George Wills
Internet Business Manager System
