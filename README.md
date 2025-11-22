# Internet Business Manager - Cosmos Backend

Place the `src/` folder into your project or use this as the backend root.

1. Copy `.env.example` to `.env` and fill credentials (AT_USERNAME, AT_API_KEY, ADMIN_ID, phones).
2. Install dependencies: `npm install`
3. Run in development: `npm run start:dev`

This backend uses SQLite (file at ./data/ibm.db) and TypeORM if you choose to integrate it. The code is modular: AfricasTalking, Managers, Subscribers, Payments, Codes, Scheduler, Auth (basic).