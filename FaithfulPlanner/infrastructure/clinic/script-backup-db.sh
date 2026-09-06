#!/usr/bin/env bash
# 
# set
# -e = script will fail on error and will not continue
# -o = Turn on the option coming next
# pipefail = Fail any on any pipeline command. This script uses pipe "|"". Look at docker ... | gzip ...

set -e -o pipefail

# "$(dirname "$0")/ = script's current directory will be where the script is
# cd into the script's own dir so .env's `app_dir=$(pwd)` resolves correctly
# even when launched from cron (where pwd is $HOME, not this folder)
cd "$(dirname "$0")"
source .env

mkdir -p "$backup_dir"
backup_file="$backup_dir/${db_name}-$(date +%Y%m%d-%H%M%S).sql.gz"

docker exec -e PGPASSWORD="$db_password" "$db_name" \
  pg_dump -U "$db_user" -d "$db_name" \
  --insert --clean --if-exists | gzip > "$backup_file"

echo "Wrote $backup_file"

# Hardcoded export command
# SQL export
# docker exec -e PGPASSWORD="password" "clinic_db" \
#    pg_dump -U "clinic_user" -d "clinic_db" \
#    --insert --clean --if-exists > clinic_db_backup.sql

# ZIP export
# docker exec -e PGPASSWORD="password" "clinic_db" \
#    pg_dump -U "clinic_user" -d "clinic_db" \
#    --insert --clean --if-exists | gzip > clinic_db_backup.sql.gz

# Hardcoded import command
# SQL import
# docker exec -i -e PGPASSWORD="password" "clinic_db" \
#    psql -U "clinic_user" -d "clinic_db" < clinic_db_backup.sql


# ZIP import
# gunzip -c clinic_db_backup.sql.gz | docker \
#    exec -i clinic_db psql -U clinic_user -d clinic_db

# Hardcoded copy command
# scp -r -i ~/.ssh/id_rsa \
#   sheraz@10.0.0.20:clinic_db_backup.sql.gz .
