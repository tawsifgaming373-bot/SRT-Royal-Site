# SRT Royal Site

SRT Royal is a lightweight designer marketplace platform. Clients discover designers, submit hire requests, follow projects, initialize payments, and review completed work. Designers manage profiles, portfolios, requests, projects, and notifications. Admins monitor and moderate the platform.

## Stack

- Node.js and Express
- MongoDB Atlas through Mongoose
- Vanilla HTML, CSS, and JavaScript frontend
- JWT authentication and bcrypt password hashing
- Helmet, CORS, rate limiting, and centralized errors

## Architecture

```text
server.js                 Application entrypoint
server/app.js             Express app factory and routes
server/config             Database and environment configuration
server/middleware         Authentication, validation, and errors
server/models             Mongoose models
server/routes             Auth, marketplace, workflow, admin, and payment APIs
server/services           Notification, email, and storage boundaries
public                    Existing SRT Royal frontend
 tests                    Mongo-backed integration tests
```

## Configuration

Copy `.env.example` to `.env` and set a MongoDB Atlas URI and a strong JWT secret. `.env` is ignored by Git.

Required for production:

```text
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<at least 32 random characters>
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend.example
```

Production uses Atlas. No local MongoDB service is required.

Optional provider settings are documented in `.env.example` for email, cloud storage, and payments. The application does not claim an upload or payment succeeded without a real provider implementation or confirmation.

## Development

```text
npm install
npm run dev
```

The server serves the existing frontend at `http://localhost:3000`. In development, the database connection is optional; production startup validates `MONGODB_URI` and `JWT_SECRET`.

## Testing and build

```text
npm run build
npm test
```

Tests use `mongodb-memory-server` only. The default test binary is MongoDB `4.2.25`, selected for compatibility with older CPUs such as the Intel Core 2 Duo E8400. It is downloaded and run as a test process, not installed as a local MongoDB server.

## API overview

- `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`
- `GET /api/users/me`, `PUT /api/users/profile`, `PATCH /api/users/password`
- `GET /api/designers`, `GET /api/designers/:id`
- `PATCH /api/designers/:id`, portfolio add/delete endpoints
- `GET/POST /api/hire-requests`, `PATCH /api/hire-requests/:id`
- `GET /api/projects`, `GET /api/projects/:id`, project status updates
- `GET/POST /api/reviews`, admin moderation endpoint
- `GET /api/notifications`, read and read-all endpoints
- `POST /api/payments` initializes a pending payment only
- `/api/admin/*` admin-only management and overview APIs
- `GET /api/health` health check

All protected APIs require `Authorization: Bearer <token>`. Pagination accepts `page` and `limit`, with a maximum limit of 50.

## Admin setup

Admin accounts should be provisioned through a controlled administrative process. Public signup cannot assign the admin role in production. The integration tests may create an admin account in their isolated test environment.

## Deployment

Deploy the Node process with `npm start`, provide environment variables through the hosting platform, and point `MONGODB_URI` to MongoDB Atlas. Configure `CLIENT_URL` to the deployed frontend origin and use the health endpoint for service checks. Enable Atlas backups, restrict network access, rotate JWT/provider credentials, and retain deployment logs outside the application database.

## External requirements

The following require provider credentials and operational setup before production use:

- MongoDB Atlas cluster and restricted database user
- Strong production JWT secret
- Cloudinary or S3-compatible storage for image uploads
- SMTP/email provider for transactional mail
- bKash, Nagad, or SSLCommerz merchant credentials and verified callbacks
- Hosting, HTTPS, monitoring, and backup configuration
