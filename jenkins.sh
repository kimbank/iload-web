# === Configuration ===
SSH_KEY="${SSH_KEY:-$HOME/.ssh/id_rsa}"   # SSH key (can be overridden from env)
REMOTE_USER="ubuntu"                      # SSH login user
REMOTE_HOST="10.10.10.11".                # Target server IP or hostname
REMOTE_DIR="/home/ubuntu/iload-web"       # Directory on the remote host
ENV_FILE=".env"                           # File to sync

# === Pre-check ===
if [ ! -f ".env" ]; then
  echo "Error: .env not found in current directory."
  exit 1
fi

if [ ! -f "$SSH_KEY" ]; then
  echo "Error: SSH private key not found at $SSH_KEY"
  exit 1
fi

# === Step 1: Rsync .env to remote ===
echo "Step 1: Syncing .env to $REMOTE_HOST:$REMOTE_DIR ..."
rsync -avz -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
  ".env" \
  "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR"

if [ $? -ne 0 ]; then
  echo "Error: rsync failed."
  exit 1
fi

# === Step 2: Run docker compose up on remote ===
echo "Step 2: Running 'docker compose up -d --build' on remote server..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$REMOTE_USER@$REMOTE_HOST" \
  "cd $REMOTE_DIR && git pull && docker compose up -d --build"

if [ $? -eq 0 ]; then
  echo "✔ Deployment completed successfully."
else
  echo "✖ Deployment failed during docker compose step."
  exit 1
fi