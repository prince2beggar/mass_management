# MessMate Multi-Tenant SaaS — Production Deployment Runbook

**Document Type:** Production Operations & Deployment Runbook\
**Platform:** Next.js 15 (App Router) + Prisma ORM + PostgreSQL / SQLite\
**Version:** 1.0.0 (Release Baseline)\
**Security Classification:** Confidential / Production Operations

---

## 1. Pre-Deployment Checklist

Before deploying any release to staging or production:
1. **Requirements & Scope:** All features have passed acceptance criteria in Phase 6.
2. **Automated Testing:** All unit and integration test suites in Phase 7 must pass (`pnpm test` = 27/27 passed).
3. **Build Check:** Static build must compile with 0 errors (`pnpm run build` = 22/22 routes compiled).
4. **Environment Isolation:** Zero reliance on C: drive. All dependencies, caches, and builds isolated to target deployment volumes.
5. **Database Backup:** Database snapshot taken before running migrations.

---

## 2. Infrastructure Options & Architecture

### Option A: Containerized Docker Swarm / Compose (Self-Hosted VPS)
- **Host Specs:** 2+ vCPU, 4GB RAM, Ubuntu 22.04 LTS or Windows Server
- **Containers:**
  - `web`: Next.js 15 Standalone Alpine container
  - `db`: PostgreSQL 16 Alpine container with persistent Docker volume
  - `caddy`: Reverse proxy with automatic Let's Encrypt SSL and wildcard subdomain routing

### Option B: Cloud Platform (Vercel / Railway / Supabase)
- **Frontend / API:** Vercel Pro (configured with wildcard domain `*.messmate.com`)
- **Database:** Supabase or Neon PostgreSQL with connection pooling
- **Object Storage:** Cloudflare R2 (S3-compatible, zero egress fees) for receipt uploads

---

## 3. Environment Variables Configuration

Deploy the production environment variables using `.env.example` as a template:

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `NODE_ENV` | Production execution mode | `production` |
| `DATABASE_URL` | PostgreSQL connection string with SSL | `postgresql://user:pass@host:5432/messmate?sslmode=require` |
| `NEXT_PUBLIC_APP_URL` | Canonical SaaS root URL | `https://messmate.com` |
| `NEXT_PUBLIC_ROOT_DOMAIN` | Wildcard root domain | `messmate.com` |
| `AUTH_SECRET` | 32-byte session encryption key | Generated via `openssl rand -base64 32` |
| `STORAGE_ENDPOINT` | S3 / R2 storage API endpoint | `https://<id>.r2.cloudflarestorage.com` |
| `STORAGE_BUCKET` | Storage bucket name | `messmate-documents` |

---

## 4. Database Migration Procedure

When schema changes are deployed:
```bash
# 1. Take snapshot of existing database
powershell -File scripts/backup-db.ps1

# 2. Deploy Prisma migrations to production
pnpm exec prisma migrate deploy

# 3. (Optional) Validate schema synchronization
pnpm exec prisma db push --preview-feature
```

---

## 5. Automated Backups & Disaster Recovery

### Automated Daily Backup Schedule
Run `scripts/backup-db.ps1` via a daily Windows Task Scheduler or Linux Cron job (`0 3 * * *` at 3:00 AM UTC).

### Restore Runbook (Disaster Recovery Drill)
In the event of database corruption or hardware failure:
1. Stop the application server:
   ```powershell
   # Stop web service
   docker stop messmate_web
   ```
2. Restore from the most recent validated snapshot:
   ```powershell
   powershell -File scripts/restore-db.ps1 -BackupFile "D:\mass_management\backups\messmate_backup_TIMESTAMP.db"
   ```
3. Restart web service:
   ```powershell
   docker start messmate_web
   ```
4. Execute smoke test suite:
   ```powershell
   powershell -File scripts/smoke-test.ps1
   ```

---

## 6. Post-Deployment Verification (Smoke Testing)

Immediately following deployment, run the automated smoke test script:
```powershell
powershell -File scripts/smoke-test.ps1 -BaseUrl "https://messmate.com"
```
The script validates:
- `/api/health` status, database connection, and latency (< 50ms)
- Public landing page (`/`)
- Member dashboard (`/dashboard`)
- Meals attendance (`/meals`)
- Bazar accounting (`/bazar`)
- Financial ledger (`/finance`)
- Emergency directory (`/emergency`)
- Reports and CSV export endpoints (`/reports`)

---

## 7. Emergency Rollback Playbook

If a critical severity issue or data integrity defect is detected post-release:
1. Revert container image to previous release tag:
   ```bash
   docker-compose pull web:v0.9.9 && docker-compose up -d web
   ```
2. Or rollback Git commit on deployment server:
   ```bash
   git revert HEAD --no-edit
   pnpm run build
   pnpm start
   ```
3. If database changes must be rolled back, execute restore script from pre-deployment snapshot.
4. Notify all mess admins via emergency notification broadcast.
