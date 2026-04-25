FROM postgres:17-alpine

COPY schema.sql /docker-entrypoint-initdb.d/01-schema.sql
COPY seed_programa.sql /docker-entrypoint-initdb.d/02-seed.sql