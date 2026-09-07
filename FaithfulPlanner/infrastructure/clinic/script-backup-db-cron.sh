#!/usr/bin/env bash
# Creates cron job for script-backup-db.sh
set -e -o pipefail

# cron runs with a bare PATH, so tools like `docker` may not be found. Fix that.
export PATH="/usr/local/bin:/usr/bin:/bin:$PATH"

# Run from this script's own folder so .env paths resolve correctly.
cd "$(dirname "$0")"
source .env

mkdir -p "$backup_dir"
log="$backup_dir/cron.log"

# limits the size of cron.log file size. Keeps last 500 lines
[ -f "$log" ] && tail -n 500 "$log" > "$log.tmp" && mv "$log.tmp" "$log"

# Redirects this script's stdout and stderr in cron.log
exec >> "$log" 2>&1

echo "----- run at $(date) -----"

# --- Settings -------------------------------------------------------------
schedule="*/5 * * * *"          # every 5 minutes (for testing)
# schedule="0 1 * * *"          # every night at 1:00 AM (use this later)

keep=15                         # number of backup files to keep

this_script="$(pwd)/script-backup-db-cron.sh"
backup_script="$(pwd)/script-backup-db.sh"

# --- Install the cron job (only if it is not already there) --------------
if crontab -l 2>/dev/null | grep -F -q "$this_script"; then
  echo "Cron job already installed."
else
  # Keep the current crontab, then add our new line at the end.
  (crontab -l 2>/dev/null; echo "$schedule $this_script") | crontab -
  echo "Cron job added: $schedule $this_script"
fi

# --- Take the backup ----------------------------------------------------
"$backup_script"

# --- Delete old backups, keep only the newest $keep --------------------
cd "$backup_dir"

# List backups newest-first, skip the first $keep, the rest are old.
old_files=$(ls -1t "${db_name}"-*.sql.gz 2>/dev/null | tail -n +$((keep + 1)) || true)

if [ -n "$old_files" ]; then
  echo "$old_files" | while read -r file; do
    rm -- "$file"
    echo "Deleted old backup: $file"
  done
else
  echo "No old backups to delete."
fi
