# Database Infrastructure

Database schema, migrations, and related infrastructure for the MATURION ISMS platform.

## Structure

```
db/
├── migrations/           # SQL migration files
│   ├── 20250208_scoring_model.sql
│   └── README.md
└── README.md            # This file
```

## Migrations

Database migrations are stored in the `migrations/` directory. Each migration file is prefixed with a date (YYYYMMDD) and contains SQL statements to modify the database schema.

See [migrations/README.md](./migrations/README.md) for detailed information about available migrations.

### Current Migrations

- **20250208_scoring_model.sql** - Complete scoring model for maturity assessment

## Database Platform

The MATURION ISMS uses **Supabase** (PostgreSQL) as its database platform.

## Related Documentation

- Database schema is consumed by: `apps/isms-portal/src/modules/maturity/`
- Architecture: `architecture/modules/maturity/MATURITY_MODULE_ARCHITECTURE_v1.0.md`
