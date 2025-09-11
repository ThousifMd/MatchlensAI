# MatchboostAI - Full Stack Application

A complete AI-powered dating profile optimization platform with separate frontend and backend applications.

## 📁 Project Structure

```
matchboost-ai/
├── frontend/          # Next.js 15 Frontend Application
│   ├── src/          # React components and pages
│   ├── public/       # Static assets
│   ├── package.json  # Frontend dependencies
│   └── ...
├── rizzlab-backend/  # Node.js/Express Backend API
│   ├── src/          # Server code and routes
│   ├── package.json  # Backend dependencies
│   └── ...
└── README.md         # This file
```

## 🚀 Quick Start

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend (Node.js/Express)

```bash
cd rizzlab-backend
npm install
npm run dev
```

The backend API will be available at `http://localhost:5001`

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.3.5
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Payments**: Dodo Payment System
- **Image Storage**: Cloudinary

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **File Upload**: Cloudinary
- **Validation**: Custom middleware

## 📱 Features

### Frontend Features
- **Modern Design**: Beautiful, responsive UI
- **Onboarding Flow**: Complete user onboarding with photo uploads
- **Payment Integration**: Dodo payment system for premium packages
- **Image Upload**: Cloudinary integration for photo storage
- **Responsive Design**: Mobile-first approach

### Backend Features
- **RESTful API**: Clean API endpoints
- **Database Integration**: PostgreSQL with Prisma
- **File Processing**: Image upload and storage
- **Data Validation**: Input validation middleware
- **CORS Support**: Cross-origin resource sharing

## 🔧 Environment Setup

### Frontend Environment Variables
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
NEXT_PUBLIC_DODO_PAYMENT_URL=your_dodo_payment_url
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
```

### Backend Environment Variables
Create `backend/.env`:
```env
PORT=5001
DATABASE_URL=your_postgresql_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 🚀 Deployment

### Frontend Deployment (Vercel)
1. Navigate to the `frontend` directory
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Backend Deployment
The backend can be deployed to:
- **Railway**: Easy deployment with PostgreSQL
- **Render**: Free tier with PostgreSQL
- **Heroku**: Traditional deployment
- **DigitalOcean**: App Platform

## 📝 Available Scripts

### Frontend
```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Backend
```bash
cd rizzlab-backend
npm run dev      # Start development server with nodemon
npm start        # Start production server
node setup-db.js # Initialize database
```

## 🔗 API Endpoints

### POST `/api/onboarding/submit`
Submit onboarding data with photos.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "originalPhotos": ["base64_encoded_image_1"],
  "screenshotPhotos": ["base64_encoded_image_1"]
}
```

**Response:**
```json
{
  "success": true,
  "submissionId": 1,
  "message": "Onboarding submitted successfully",
  "data": {
    "id": 1,
    "name": "string",
    "email": "string",
    "createdAt": "2025-08-23T04:49:21.267Z"
  }
}
```

## 🗄️ Database Schema

### OnboardingSubmission
- `id` (Primary Key)
- `name` (String)
- `email` (String)
- `originalPhotos` (JSON Array)
- `screenshotPhotos` (JSON Array)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

## 📄 License

This project is part of the MatchboostAI application suite.

## 🆘 Support

For support, email support@matchboostai.com or create an issue in this repository.
