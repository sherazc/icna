#!/usr/bin/env bash
set -e -o pipefail
export PATH="/usr/local/bin:/usr/bin:/bin:$PATH"

# --- Settings ------------------------------------------------------------
ssh_key=/Users/sheraz/.ssh/id_rsa
remote="sheraz@10.0.0.20:dev/clinic/backup"     # folder on the Pi to pull
dest_parent=/Users/sheraz/dev/clinic            # where "backup" lands locally
backup_dir="$dest_parent/backup"

schedule="0 * * * *"          # every hour, on the hour
# schedule="*/5 * * * *"      # every 5 minutes (for testing)

this_script="$(cd "$(dirname "$0")" && pwd)/$(basename "$0")"

# Log lives OUTSIDE backup_dir, because we delete/replace backup_dir below.
log="$dest_parent/mirror-backup.log"

# --- Logging -----------------------------------------------------------
mkdir -p "$dest_parent"
[ -f "$log" ] && tail -n 500 "$log" > "$log.tmp" && mv "$log.tmp" "$log"
exec >> "$log" 2>&1
echo "----- run at $(date) -----"

# --- Install into cron (only if not already there) --------------------
if crontab -l 2>/dev/null | grep -F -q "$this_script"; then
  echo "Cron job already installed."
else
  (crontab -l 2>/dev/null; echo "$schedule $this_script") | crontab -
  echo "Cron job added: $schedule $this_script"
fi

# --- Pull the backup files from the Pi -----------------------------
# Copy the CONTENTS of the remote backup folder (note the /*) into the
# local folder. Same-named files are overwritten, new ones are added.
# Copying "$remote" without /* would nest into backup/backup on reruns.
mkdir -p "$backup_dir"

scp -r -i "$ssh_key" \
  -o StrictHostKeyChecking=accept-new \
  -o BatchMode=yes \
  "$remote"/* \
  "$backup_dir/"

echo "Local mirror now has $(ls -1 "$backup_dir" | wc -l | tr -d ' ') file(s)"
