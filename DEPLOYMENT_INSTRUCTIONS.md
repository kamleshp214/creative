# SynapShare Deployment Instructions

## Overview

SynapShare is a collaborative knowledge-sharing platform built with the MERN stack (MongoDB, Express, React, and Node.js). This document provides comprehensive instructions for deploying both the frontend and backend components of the application in development and production environments.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Security Considerations](#security-considerations)
7. [Monitoring and Maintenance](#monitoring-and-maintenance)
8. [Scaling Considerations](#scaling-considerations)
9. [Troubleshooting](#troubleshooting)

## System Requirements

- Node.js >= 16.x
- MongoDB >= 4.4
- NPM or Yarn package manager
- Firebase account for authentication
- Storage solution for file uploads (local or cloud)

## Backend Deployment

### Development Environment

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd synapshare-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Production Environment

1. Prepare your production environment:
   ```bash
   git clone <repository-url>
   cd synapshare-backend
   npm install --production
   cp .env.example .env
   # Edit .env with production settings
   ```

2. Set environment variables:
   - `NODE_ENV=production`
   - `PORT=5000` (or your preferred port)
   - `MONGO_URI=your_production_mongodb_uri`
   - `API_URL=https://your-api-domain.com`
   - `FRONTEND_URL=https://your-frontend-domain.com`

3. Start the server:
   ```bash
   npm start
   ```

4. For production deployment, consider using process managers:
   ```bash
   # Using PM2
   npm install -g pm2
   pm2 start server.js --name "synapshare-backend"
   pm2 save
   ```

## Frontend Deployment

### Development Environment

1. Navigate to the frontend directory:
   ```bash
   cd synapshare-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment files:
   ```bash
   # .env.development already exists
   # Verify configurations are correct
   ```

4. Start the development server:
   ```bash
   npm start
   ```

### Production Environment

1. Prepare the build:
   ```bash
   cd synapshare-frontend
   npm install
   ```

2. Set up the production environment file:
   ```bash
   # .env.production already exists
   # Verify configurations are correct
   ```

3. Build the application:
   ```bash
   npm run build
   ```

4. Deploy the build folder to your hosting service:
   - For Netlify: Connect your repository or drag and drop the build folder
   - For Vercel: Connect your repository and set the build command
   - For traditional hosting: Upload the build folder to your web server

## Environment Configuration

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| NODE_ENV | Environment type | `development` or `production` |
| PORT | Server port | `5000` |
| MONGO_URI | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/synapshare` |
| FIREBASE_SERVICE_ACCOUNT | Firebase service account JSON | `{"type":"service_account",...}` |
| API_URL | Backend API URL | `https://api.synapshare.com` |
| FRONTEND_URL | Frontend URL for CORS | `https://synapshare.com` |
| NEWS_API_KEY | API key for news integration | `your_api_key` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| REACT_APP_API_URL | Backend API URL | `https://api.synapshare.com` |
| REACT_APP_FIREBASE_API_KEY | Firebase API key | `your_firebase_api_key` |
| REACT_APP_FIREBASE_AUTH_DOMAIN | Firebase auth domain | `your-project.firebaseapp.com` |
| REACT_APP_FIREBASE_PROJECT_ID | Firebase project ID | `your-project-id` |
| REACT_APP_FIREBASE_STORAGE_BUCKET | Firebase storage bucket | `your-project.appspot.com` |
| REACT_APP_FIREBASE_MESSAGING_SENDER_ID | Firebase sender ID | `12345678900` |
| REACT_APP_FIREBASE_APP_ID | Firebase app ID | `1:1234:web:abcd` |

## Database Setup

1. Create a MongoDB database:
   - Use MongoDB Atlas for cloud hosting (recommended for production)
   - Or set up a local MongoDB server (development only)

2. Create necessary collections:
   - Users
   - Notes
   - Discussions
   - Nodes
   - SavedPosts

3. Set up indexes for text search:
   ```javascript
   db.notes.createIndex({ text: "text" });
   db.discussions.createIndex({ text: "text" });
   db.nodes.createIndex({ text: "text" });
   ```

## Security Considerations

1. **Authentication**: Firebase authentication is already implemented

2. **Authorization**: User roles and permissions are managed in middleware

3. **Data Protection**:
   - All sensitive data should be in environment variables
   - CORS is configured to allow only specific origins
   - Rate limiting is enabled to prevent abuse

4. **File Upload Security**:
   - File type validation is implemented
   - File size limits are enforced
   - Consider moving to cloud storage in production

5. **API Security**:
   - Helmet.js is used to set secure HTTP headers
   - Express is configured with security best practices
   - Token verification is required for sensitive operations

## Monitoring and Maintenance

1. **Logging**:
   - Server logs are output to console
   - Consider adding a logging service like Winston

2. **Monitoring**:
   - For production, implement monitoring with tools like:
     - PM2 for Node.js process monitoring
     - MongoDB Atlas monitoring for database
     - Sentry or LogRocket for error tracking

3. **Backups**:
   - Set up regular MongoDB backups
   - Implement a strategy for uploaded files backup

## Scaling Considerations

### Current Capacity

With the current configuration, SynapShare can handle:

- **Concurrent Users**: ~500-1000 concurrent users on a standard server setup
- **Database Operations**: The MongoDB connection is optimized for production loads
- **File Storage**: Local file storage with 50MB limit per file
- **API Requests**: Rate limited to 100 requests per 15 minutes per IP

### Scaling Strategies

For higher load scenarios:

1. **Horizontal Scaling**:
   - Deploy the backend to multiple servers
   - Use a load balancer to distribute traffic
   - Implement a session store if using session-based auth

2. **Database Scaling**:
   - Use MongoDB Atlas scaling options
   - Implement database sharding for larger datasets
   - Consider read replicas for heavy read operations

3. **File Storage Scaling**:
   - Migrate from local storage to cloud storage (AWS S3, Firebase Storage)
   - Implement CDN for file delivery

4. **Caching**:
   - Add Redis caching for frequently accessed data
   - Implement client-side caching strategies

## Troubleshooting

### Common Issues

1. **Connection Errors**:
   - Verify MongoDB connection string
   - Check network connectivity
   - Verify firewall settings

2. **Authentication Issues**:
   - Validate Firebase configuration
   - Check token verification process
   - Verify CORS settings

3. **File Upload Problems**:
   - Check upload directory permissions
   - Verify file size limits
   - Check for disk space issues

### Debugging

- Backend logs are available in the console or log files
- MongoDB connection events are logged
- Firebase authentication errors are captured
- File operation errors are logged with details

---

For additional support, contact the development team or refer to the project documentation.
