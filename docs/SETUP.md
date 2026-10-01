# Nurse-D Setup Guide

Complete setup instructions for the Nurse-D platform.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start with Docker](#quick-start-with-docker)
- [Manual Installation](#manual-installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

**Option 1: Docker (Recommended)**
- [Docker](https://docs.docker.com/get-docker/) 24.0+
- [Docker Compose](https://docs.docker.com/compose/install/) 2.0+

**Option 2: Manual Installation**
- [Node.js](https://nodejs.org/) 20+
- [PostgreSQL](https://www.postgresql.org/download/) 15+
- [Python](https://www.python.org/downloads/) 3.11+
- [Redis](https://redis.io/download) 7+ (optional but recommended)

### API Keys

- **OpenAI API Key** - Required for AI features
  - Sign up at [OpenAI Platform](https://platform.openai.com/)
  - Generate an API key in your account settings

## Quick Start with Docker

### 1. Clone the Repository

```bash
git clone https://github.com/hermz580/nurse-d.git
cd nurse-d
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set required values:

```env
# Required: Add your OpenAI API key
OPENAI_API_KEY=sk-your-openai-api-key

# Required: Change these secrets in production
JWT_SECRET=your-secure-random-string-at-least-32-characters
JWT_REFRESH_SECRET=another-secure-random-string-at-least-32-characters

# Optional: Database credentials (defaults are fine for development)
DB_PASSWORD=postgres
```

### 3. Start All Services

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Redis cache on port 6379
- Backend API on port 5000
- Frontend on port 3000
- AI Service on port 8000

### 4. Verify Installation

Check all services are running:

```bash
docker-compose ps
```

Access the application:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/health
- **API Docs**: http://localhost:5000/api/docs
- **AI Service**: http://localhost:8000

### 5. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
```

### 6. Stop Services

```bash
docker-compose down

# Stop and remove volumes (WARNING: deletes all data)
docker-compose down -v
```

## Manual Installation

### 1. Clone Repository

```bash
git clone https://github.com/hermz580/nurse-d.git
cd nurse-d
```

### 2. Setup PostgreSQL

```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt-get install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql

# Create database
sudo -u postgres psql
postgres=# CREATE DATABASE nurse_d;
postgres=# CREATE USER postgres WITH PASSWORD 'postgres';
postgres=# GRANT ALL PRIVILEGES ON DATABASE nurse_d TO postgres;
postgres=# \q

# Initialize schema
psql -U postgres -d nurse_d -f database/schemas/init.sql
```

### 3. Setup Redis (Optional)

```bash
# Install Redis (Ubuntu/Debian)
sudo apt-get install redis-server

# Start Redis
sudo systemctl start redis-server
```

### 4. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

Backend will run on http://localhost:5000

### 5. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start development server
npm run dev
```

Frontend will run on http://localhost:3000

### 6. Setup AI Service

```bash
cd ai-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start service
uvicorn main:app --reload --port 8000
```

AI Service will run on http://localhost:8000

## Configuration

### Environment Variables

#### Backend (.env in /backend/)

```env
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nurse_d
DB_USER=postgres
DB_PASSWORD=postgres

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars

# OpenAI
OPENAI_API_KEY=sk-your-key
```

#### Frontend (.env in /frontend/)

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_AI_SERVICE_URL=http://localhost:8000
```

## Database Setup

### Initialize Database

```bash
# Using Docker
docker-compose exec postgres psql -U postgres -d nurse_d -f /docker-entrypoint-initdb.d/init.sql

# Manual setup
psql -U postgres -d nurse_d -f database/schemas/init.sql
```

### Run Migrations

```bash
cd backend
npm run db:migrate
```

### Seed Sample Data

```bash
cd backend
npm run db:seed
```

### Default Admin Account

After initialization, you can login with:
- **Email**: admin@nurse-d.org
- **Password**: admin123

⚠️ **Change this password immediately in production!**

## Troubleshooting

### Port Already in Use

If you see port binding errors:

```bash
# Check what's using the port
lsof -i :3000  # or :5000, :8000, etc.

# Kill the process or change the port in your .env file
```

### Database Connection Error

1. Verify PostgreSQL is running:
   ```bash
   sudo systemctl status postgresql
   ```

2. Check database credentials in `.env`

3. Ensure database exists:
   ```bash
   psql -U postgres -l
   ```

### Docker Issues

1. Rebuild containers:
   ```bash
   docker-compose down
   docker-compose up --build
   ```

2. Remove all containers and volumes:
   ```bash
   docker-compose down -v
   docker system prune -a
   ```

### OpenAI API Errors

1. Verify API key is set correctly in `.env`
2. Check API key is active at [OpenAI Platform](https://platform.openai.com/)
3. Ensure you have sufficient credits

### Node Module Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Python Dependencies Issues

```bash
# Recreate virtual environment
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

## Development Tips

### Hot Reload

All services support hot reload in development mode:
- Backend: Changes to TypeScript files auto-restart
- Frontend: Vite provides instant HMR
- AI Service: Uvicorn watches Python files

### Debugging

#### Backend
```bash
# VS Code launch configuration
{
  "type": "node",
  "request": "launch",
  "name": "Debug Backend",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "dev"],
  "cwd": "${workspaceFolder}/backend"
}
```

#### Frontend
Use browser dev tools and React DevTools extension

### Database GUI

Install [pgAdmin](https://www.pgadmin.org/) or [DBeaver](https://dbeaver.io/) to visualize database.

## Next Steps

- Read [API Documentation](./API.md)
- Review [Developer Guide](./DEVELOPER.md)
- Check [User Guide](./USER_GUIDE.md)
- Explore [Deployment Guide](./DEPLOYMENT.md)

## Support

- [GitHub Issues](https://github.com/hermz580/nurse-d/issues)
- [Discussions](https://github.com/hermz580/nurse-d/discussions)
