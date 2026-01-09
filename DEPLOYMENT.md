# Deployment Guide

## Prerequisites
- Node.js 20+ installed on VPS
- PostgreSQL database set up
- Git installed
- PM2 installed globally (`npm install -g pm2`)

## Step 1: Pull Latest Code on VPS

```bash
cd ~/telalalbedaya
git pull origin master
```

## Step 2: Install Dependencies

```bash
npm install
# or
npm ci  # for production (uses package-lock.json exactly)
```

## Step 3: Set Up Environment Variables

Create/update `.env` file:

```bash
nano .env
```

Required variables:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32

# Node Environment
NODE_ENV=production

# Email (if using Resend)
RESEND_API_KEY="your-resend-api-key"

# Optional: Port (defaults to 3000)
PORT=3000
```

## Step 4: Generate Prisma Client

```bash
npm run db:generate
```

## Step 5: Run Database Migrations

**For fresh database:**
```bash
npx prisma migrate deploy
```

**Or if you need to create initial migration:**
```bash
npx prisma migrate dev --name init
```

## Step 6: Build the Application

```bash
npm run build
```

## Step 7: Start with PM2

Create PM2 ecosystem file or start directly:

```bash
# Start the app
pm2 start npm --name "telalalbedaya" -- start

# Or with more options:
pm2 start npm --name "telalalbedaya" -- start -- --port 3000

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

## Step 8: Set Up Nginx Reverse Proxy (Recommended)

Create Nginx config:

```bash
sudo nano /etc/nginx/sites-available/telalalbedaya
```

Add configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/telalalbedaya /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 9: Set Up SSL with Let's Encrypt (Optional but Recommended)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Useful Commands

### PM2 Commands
```bash
pm2 list              # View running processes
pm2 logs telalalbedaya # View logs
pm2 restart telalalbedaya # Restart app
pm2 stop telalalbedaya   # Stop app
pm2 delete telalalbedaya # Remove from PM2
```

### Update Deployment
```bash
cd ~/telalalbedaya
git pull origin master
npm install
npm run db:generate
npx prisma migrate deploy
npm run build
pm2 restart telalalbedaya
```

### Database Commands
```bash
npx prisma studio          # Open database GUI
npx prisma migrate status   # Check migration status
```

## Troubleshooting

1. **Port already in use**: Change PORT in .env or kill process using port 3000
2. **Database connection error**: Check DATABASE_URL in .env
3. **Build fails**: Check Node.js version (needs 20+)
4. **PM2 not starting**: Check logs with `pm2 logs telalalbedaya`

