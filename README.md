# Finance Data Processing and Access Control Backend

A RESTful backend API for a finance dashboard system built with Node.js, Express, and MongoDB. Supports user management, role-based access control, financial record CRUD with filtering, and dashboard analytics using MongoDB aggregation.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Environment:** dotenv

## Project Structure

```
src/
├── config/
│   ├── db.js              # MongoDB connection
│   └── env.js             # Environment variables
├── constants/
│   └── roles.js           # Role definitions (admin, analyst, viewer)
├── controllers/
│   ├── auth.controller.js  # Signup and login handlers
│   ├── user.controller.js  # User management handlers
│   ├── record.controller.js # Financial record handlers
│   └── dashboard.controller.js # Dashboard analytics handlers
├── middlewares/
│   ├── auth.middleware.js  # JWT token verification
│   ├── role.middleware.js  # Role-based access control
│   └── error.middleware.js # Global error handler
├── models/
│   ├── user.model.js       # User schema
│   └── record.model.js     # Financial record schema
├── routes/
│   ├── auth.routes.js      # /api/auth
│   ├── user.routes.js      # /api/users
│   ├── record.routes.js    # /api/records
│   └── dashboard.routes.js # /api/dashboard
├── services/
│   ├── auth.service.js     # Auth business logic
│   ├── user.service.js     # User business logic
│   ├── record.service.js   # Record business logic
│   └── dashboard.service.js # Aggregation pipelines
├── utils/
│   └── apiResponse.js      # Standardized response helper
├── app.js                  # Express app setup
└── server.js               # Server entry point
```

## Architecture

The project follows clean separation of concerns:

```
Routes → Controllers → Services → Models
```

- **Routes** define endpoints and apply middleware
- **Controllers** handle HTTP request/response (kept thin)
- **Services** contain all business logic
- **Models** define database schemas

## Setup

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)

### Installation

```bash
git clone https://github.com/krishx06/Finance-Backend.git
cd Finance-Backend
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret_key
```

### Run

```bash
npm run dev
```

Server starts at `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint           | Description       | Access |
|--------|--------------------|--------------------|--------|
| POST   | `/api/auth/signup` | Register a user    | Public |
| POST   | `/api/auth/login`  | Login and get token| Public |

**Signup body:**
```json
{
  "name": "Krish",
  "email": "krish@test.com",
  "password": "password123",
  "role": "admin"
}
```

**Login body:**
```json
{
  "email": "krish@test.com",
  "password": "password123"
}
```

### User Management

| Method | Endpoint                 | Description         | Access |
|--------|--------------------------|----------------------|--------|
| POST   | `/api/users`             | Create a user        | Admin  |
| GET    | `/api/users`             | Get all users        | Admin  |
| PATCH  | `/api/users/:id/role`    | Update user role     | Admin  |
| PATCH  | `/api/users/:id/status`  | Activate/deactivate  | Admin  |

**Update role body:**
```json
{ "role": "analyst" }
```

**Update status body:**
```json
{ "status": "inactive" }
```

### Financial Records

| Method | Endpoint            | Description      | Access         |
|--------|---------------------|-------------------|----------------|
| POST   | `/api/records`      | Create record     | Admin          |
| GET    | `/api/records`      | Get records       | Admin, Analyst |
| PUT    | `/api/records/:id`  | Update record     | Admin          |
| DELETE | `/api/records/:id`  | Soft delete record| Admin          |

**Create record body:**
```json
{
  "amount": 50000,
  "type": "income",
  "category": "salary",
  "note": "April salary",
  "date": "2026-04-01"
}
```

**Query parameters for GET:**

| Param      | Description                    | Example              |
|------------|--------------------------------|----------------------|
| `type`     | Filter by income or expense    | `?type=income`       |
| `category` | Filter by category             | `?category=salary`   |
| `startDate`| Filter from date               | `?startDate=2026-04-01` |
| `endDate`  | Filter to date                 | `?endDate=2026-04-30`   |
| `search`   | Search in category and notes   | `?search=rent`       |
| `page`     | Page number (default 1)        | `?page=1`            |
| `limit`    | Records per page (default 10)  | `?limit=5`           |

### Dashboard Analytics

| Method | Endpoint                 | Description              | Access         |
|--------|--------------------------|--------------------------|----------------|
| GET    | `/api/dashboard/summary` | Total income, expense, net balance | All roles |
| GET    | `/api/dashboard/category`| Category-wise totals     | All roles      |
| GET    | `/api/dashboard/monthly` | Monthly trends           | All roles      |
| GET    | `/api/dashboard/recent`  | Last 5 records           | All roles      |

## Role-Based Access Control

Three roles are defined with different permission levels:

| Action                    | Admin | Analyst | Viewer |
|---------------------------|-------|---------|--------|
| Create/update/delete records | ✅   | ❌      | ❌     |
| View records              | ✅    | ✅      | ❌     |
| View dashboard            | ✅    | ✅      | ✅     |
| Manage users              | ✅    | ❌      | ❌     |

Access control is enforced using two middleware layers:
- `auth.middleware.js` — Verifies JWT token and attaches `req.user`
- `role.middleware.js` — Checks `req.user.role` against allowed roles

Inactive users are blocked from logging in.

## Error Handling

All errors follow a standardized format:

```json
{
  "success": false,
  "message": "Error description"
}
```

The global error middleware handles:
- **Duplicate key errors** (MongoDB 11000) → 409
- **Validation errors** (Mongoose) → 400
- **Invalid ObjectId** (CastError) → 400
- **Custom errors** with `statusCode` → dynamic status
- **Unhandled errors** → 500

## Validation

Input validation is applied at the service layer:
- Required fields check (amount, type, category)
- Amount must be a positive number
- Type must be "income" or "expense"
- Email uniqueness enforced at the database level

## Additional Features

- **Soft Delete** — Records are marked with `isDeleted: true` instead of being permanently removed. All queries and aggregations filter out soft-deleted records.
- **Pagination** — Record listing returns paginated results with metadata (`total`, `page`, `limit`, `totalPages`).
- **Search** — Full-text search across `category` and `note` fields using regex.
- **Standardized Responses** — All endpoints use a consistent `{ success, message, data }` format via a shared utility.

## Assumptions

- JWT tokens expire after 7 days
- Default role for new users is "viewer"
- Default user status is "active"
- Dashboard aggregations operate on the global dataset (not scoped to individual users)
- Soft-deleted records are excluded from all read operations and aggregations
- The `search` query uses case-insensitive regex matching
