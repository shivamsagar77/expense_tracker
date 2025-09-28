# 🚀 EC2 Deployment Guide

## Prerequisites
- EC2 instance running Ubuntu/Amazon Linux
- Node.js 18+ installed
- PostgreSQL/MySQL database
- Domain name (optional)

## Step 1: Prepare Your EC2 Instance

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Git
sudo apt install git -y
```

## Step 2: Clone Your Repository

```bash
# Clone your repository
git clone <your-repository-url>
cd Expense-Tracker/backend

# Install dependencies
npm install
```

## Step 3: Environment Configuration

```bash
# Create .env file
nano .env
```

Add your production environment variables:
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secure-jwt-secret-key
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_SERVICE=gmail
FRONTEND_BASE_URL=https://yourdomain.com
```

## Step 4: Database Setup

```bash
# Run migrations
npm run migrate

# Verify database connection
node -e "require('./config/db').sequelize.authenticate().then(() => console.log('DB Connected!')).catch(console.error)"
```

## Step 5: Start Your Application

```bash
# Start with PM2
pm2 start server.js --name "expense-tracker-api"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## Step 6: Configure Nginx (Optional)

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/expense-tracker
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/expense-tracker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 7: SSL Certificate (Optional)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com
```

## Step 8: Security Configuration

```bash
# Configure firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# Update security groups in AWS console
# Allow inbound traffic on ports 22, 80, 443
```

## Step 9: Monitoring & Logs

```bash
# View PM2 logs
pm2 logs expense-tracker-api

# Monitor PM2 processes
pm2 monit

# Restart application
pm2 restart expense-tracker-api
```

## Step 10: Frontend Deployment

For your React frontend in `sign_up/`:

```bash
# Build the frontend
cd ../sign_up
npm install
npm run build

# Serve with Nginx or deploy to S3/CloudFront
```

## Health Check

Test your deployment:
```bash
# Check if server is running
curl http://localhost:5000

# Check API endpoints
curl http://yourdomain.com/users/signup -X POST -H "Content-Type: application/json" -d '{"name":"test","email":"test@test.com","phone":"1234567890","password":"123456"}'
```

## Backup Strategy

```bash
# Database backup script
#!/bin/bash
pg_dump -h $DB_HOST -U $DB_USER $DB_NAME > backup_$(date +%Y%m%d_%H%M%S).sql

# Schedule with cron
crontab -e
# Add: 0 2 * * * /path/to/backup-script.sh
```

## Troubleshooting

### Common Issues:

1. **Port already in use**:
   ```bash
   sudo lsof -i :5000
   sudo kill -9 <PID>
   ```

2. **Database connection failed**:
   - Check database credentials in `.env`
   - Verify database server is running
   - Check security groups/firewall rules

3. **PM2 not starting**:
   ```bash
   pm2 logs expense-tracker-api
   pm2 delete expense-tracker-api
   pm2 start server.js --name "expense-tracker-api"
   ```

4. **Nginx 502 error**:
   - Check if Node.js app is running: `pm2 status`
   - Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`

## Performance Optimization

```bash
# Enable gzip compression in Nginx
# Add to server block:
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

# Optimize PM2
pm2 start server.js --name "expense-tracker-api" --instances max --exec-mode cluster
```

## Your MVC Architecture is Production Ready! 🎉

Your backend follows proper MVC architecture and is now ready for:
- ✅ Scalable deployment
- ✅ Production monitoring
- ✅ Team collaboration
- ✅ Feature expansion

The structure is clean, maintainable, and follows Node.js best practices for production environments!
