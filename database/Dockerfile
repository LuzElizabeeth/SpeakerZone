FROM postgres:17-alpine

COPY backend/db/schema.sql /docker-entrypoint-initdb.d/01-schema.sql
COPY backend/db/seed_programa.sql /docker-entrypoint-initdb.d/02-seed.sql