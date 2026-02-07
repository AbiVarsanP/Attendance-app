# Attendance Backend

Minimal Express + TypeScript backend scaffold. Uses Supabase for data storage and JWT for auth.

Commands:

```
cd backend
npm install
cp .env.example .env
# fill .env
npm run dev
```

Create admin user (script)

Ensure `backend/.env` has your `SUPABASE_URL` and `SUPABASE_KEY` (service role key).

Run:

```
node scripts/create_admin.js --email admin@example.com --name "Admin Name" --password "AdminPass123"
```

This will insert an admin into the `users` table.
