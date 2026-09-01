<div align="center">

<img src="./L.png" alt="SRT ROYAL Logo" width="180"/>

👑 SRT ROYAL Design

Frontend Development With Royal Precision.





</div>

🌐 Live Website

🚀 Visit SRT ROYAL Design

SRT ROYAL Design is a modern designer marketplace and web platform where clients can discover designers, submit hire requests, manage projects, receive notifications, leave reviews, and initialize payments.

The platform combines a responsive frontend with a Node.js/Express backend and MongoDB-powered data management.

✨ Features

🎨 Client Features

🔐 User registration and login

👤 User profile management

🔎 Browse designers

🧑‍💻 View designer profiles and portfolios

📩 Submit hire requests

📊 Track hire-request status

🚀 Manage projects

🔔 Receive notifications

⭐ Review designers after completed projects

💳 Initialize project payments

🔑 Change account password

📱 Responsive interface

🧑‍💻 Designer Features

Designer profile management

Portfolio management

Receive hire requests

Accept or reject project requests

Manage project status

Receive notifications

Build reputation through reviews and ratings

🛡️ Admin Features

Protected admin APIs

Platform overview statistics

User management

Activate/deactivate user accounts

Hire-request management

Review moderation

Project and user statistics

Average rating statistics

🏗️ Technology Stack

Frontend

HTML5

CSS3

Vanilla JavaScript

Responsive UI

Modern animations and interactions

Google Fonts — Inter

Backend

Node.js

Express.js

Mongoose

MongoDB Atlas

Security

JWT Authentication

bcrypt password hashing

Helmet security headers

CORS

Express Rate Limiting

Request validation

Centralized error handling

Role-based authorization

Deployment

Vercel

MongoDB Atlas

📁 Project Structure

SRT-Royal-Site/
│
├── api/
│   └── index.js
│
├── public/
│   ├── index.html
│   ├── Login_page.html
│   ├── app.js
│   ├── style.css
│   ├── styles.css
│   ├── Logo_Image.png
│   └── T.jpg
│
├── server/
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   │
│   ├── controllers/
│   │   └── authController.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   │
│   ├── models/
│   │   ├── Designer.js
│   │   ├── HireRequest.js
│   │   ├── Notification.js
│   │   ├── Payment.js
│   │   ├── Project.js
│   │   ├── Review.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── designerRoutes.js
│   │   ├── hireRequestRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── userRoutes.js
│   │
│   └── services/
│       ├── emailService.js
│       ├── notificationService.js
│       └── storageService.js
│
├── tests/
│   └── api.test.js
│
├── L.png
├── .env.example
├── .gitignore
├── CONTRIBUTING.md
├── package.json
├── package-lock.json
├── server.js
└── vercel.json

Logo: Keep the uploaded L.png file in the repository root so the logo appears at the top of this README on GitHub.

🔄 Application Architecture

                    ┌─────────────────────┐
                    │     SRT ROYAL UI    │
                    │ HTML/CSS/JavaScript │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Express API     │
                    │       /api/*        │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
      ┌────────────┐    ┌─────────────┐   ┌────────────┐
      │    Auth    │    │ Marketplace │   │   Admin    │
      │ JWT/Bcrypt │    │   Workflow  │   │ Management │
      └────────────┘    └──────┬──────┘   └────────────┘
                                │
                                ▼
                       ┌────────────────┐
                       │    Mongoose    │
                       └───────┬────────┘
                               │
                               ▼
                     ┌──────────────────┐
                     │   MongoDB Atlas  │
                     └──────────────────┘

🔐 Authentication

Authentication is handled with JSON Web Tokens.

Authentication Endpoints

Method

Endpoint

Access

POST

/api/auth/signup

Public

POST

/api/auth/login

Public

POST

/api/auth/logout

Authenticated

Protected requests use:

Authorization: Bearer <JWT_TOKEN>

Passwords are securely hashed using bcryptjs.

📡 API Overview

Base API:

/api

👤 Users

GET    /api/users/me
PUT    /api/users/profile
PATCH  /api/users/password

🎨 Designers

GET    /api/designers
GET    /api/designers/:id
PATCH  /api/designers/:id

📩 Hire Requests

GET    /api/hire-requests
POST   /api/hire-requests
PATCH  /api/hire-requests/:id

📁 Projects

GET    /api/projects
GET    /api/projects/:id
PATCH  /api/projects/:id/status

⭐ Reviews

GET    /api/reviews
POST   /api/reviews
PATCH  /api/reviews/:id/moderate

🔔 Notifications

GET    /api/notifications
PATCH  /api/notifications/:id/read
PATCH  /api/notifications/read-all

💳 Payments

POST   /api/payments
GET    /api/payments/project/:projectId

🛡️ Admin

GET    /api/admin/overview
GET    /api/admin/users
PATCH  /api/admin/users/:id/status
GET    /api/admin/hire-requests
PATCH  /api/admin/hire-requests/:id/status

🔄 Hire & Project Workflow

Client
  │
  ▼
Browse Designers
  │
  ▼
Select Designer
  │
  ▼
Submit Hire Request
  │
  ├──────────────► Rejected
  │
  ▼
Accepted
  │
  ▼
Project Created
  │
  ▼
In Progress
  │
  ▼
Completed
  │
  ├──────────────► Review
  │
  └──────────────► Payment

💳 Payment Flow

The payment layer supports payment initialization for gateways such as:

bKash
Nagad
SSLCommerz

The correct production payment flow should be:

Client
   │
   ▼
Payment Initialization
   │
   ▼
Payment Gateway
   │
   ▼
Gateway Callback / Webhook
   │
   ▼
Server-side Verification
   │
   ▼
Payment Status Update

⚠️ A pending payment record does not mean that a payment has been successfully completed. Production payment confirmation must be verified server-side through the gateway's callback/webhook system.

🔔 Notifications

The platform can notify users about important workflow events, including:

New hire requests

Accepted requests

Rejected requests

Project status changes

Other platform events

⭐ Reviews & Ratings

Clients can review designers after eligible projects are completed.

Review moderation supports:

pending
approved
rejected

Ratings contribute to designer reputation and platform statistics.

🛡️ Security

SRT ROYAL follows several security practices:

JWT-based authentication

Password hashing with bcrypt

HTTP security headers with Helmet

CORS configuration

Rate limiting

Request validation

Role-based authorization

Centralized error handling

Server-side payment verification

Environment-based secrets

⚠️ Never Commit Secrets

Never commit:

.env
MongoDB credentials
JWT secrets
API keys
Payment credentials
SMTP passwords

Use environment variables for all sensitive configuration.

🧪 Testing

The project includes automated API tests using:

Node.js test runner

Supertest

MongoDB Memory Server

Run the test suite with:

npm test

❤️ Health Check

The API exposes:

GET /api/health

Expected response:

{
  "status": "ok"
}

This can be used to verify that the deployed API is online.

☁️ Deployment

The project is configured for Vercel deployment through:

api/index.js
vercel.json

Production Website

https://srt-royal-site.vercel.app/

The frontend and API can be served through the deployed Vercel application.

📊 User Roles

Role

Main Capabilities

👤 Client

Hire designers, manage projects, reviews, notifications

🎨 Designer

Manage profile, portfolio, requests and projects

🛡️ Admin

Manage users, requests, reviews and platform statistics

🗃️ Database Models

The application uses these MongoDB/Mongoose models:

User
Designer
HireRequest
Project
Review
Notification
Payment

🤝 Contributing

Contributions are welcome.

Before submitting changes:

Create a feature branch.

Keep changes focused.

Follow the existing project structure.

Never commit secrets.

Run the test suite.

Verify the application locally.

Submit a pull request with a clear description.

Example:

git checkout -b feature/new-feature
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

🐛 Bug Reports

When reporting a bug, include:

What happened

Expected behavior

Steps to reproduce

Relevant error message

Whether the issue occurs locally or in production

Never include passwords, tokens, database credentials, or private API keys in an issue.

📌 Production Checklist

Production MongoDB configured

Strong JWT secret configured

.env excluded from Git

MongoDB access secured

HTTPS enabled

Production CLIENT_URL configured

Payment callbacks/webhooks verified

Production email provider configured

Production storage provider configured

Database backups enabled

Error monitoring configured

Admin access secured

👑 SRT ROYAL Design

Build. Design. Deliver. With Royal Precision.

<div align="center">

Made with ❤️ by SRT ROYAL Design

🌐 Visit Website

</div>
