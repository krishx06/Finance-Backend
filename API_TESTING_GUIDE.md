# API Testing Guide

This guide provides everything you need to easily test the Finance Backend via Postman or cURL. 

## Base Setup
- **Base URL:** <https://finance-backend-3wij.onrender.com>
- **Protected Endpoints Header:** 
  - Key: `Authorization`
  - Value: `Bearer <your-token-here>`
  - Key: `Content-Type`
  - Value: `application/json`

---

## Quick Reference Tables

### 1. Authentication Endpoints
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/signup` | Register a new user | Public |
| POST | `/auth/login` | Login and receive JWT token | Public |

### 2. User Management Endpoints
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/users` | Create a user | Admin |
| GET | `/users` | Get all users | Admin |
| PATCH | `/users/:id/role` | Update user role | Admin |
| PATCH | `/users/:id/status` | Activate/deactivate user | Admin |

### 3. Financial Records Endpoints
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/records` | Create record | Admin |
| GET | `/records` | Get records (with filters/pagination) | Admin, Analyst |
| PUT | `/records/:id` | Update record | Admin |
| DELETE | `/records/:id` | Soft delete record | Admin |

**Record Query Parameters (GET `/records`)**
| Param | Type | Example | Description |
|---|---|---|---|
| `type` | String | `?type=income` | Filter by "income" or "expense" |
| `category` | String | `?category=salary` | Exact match (case-insensitive) |
| `startDate` | Date | `?startDate=2026-04-01` | Filter records from this date |
| `endDate` | Date | `?endDate=2026-04-30` | Filter records up to this date |
| `search` | String | `?search=rent` | Regex search in `category` and `note` |
| `page` | Number | `?page=1` | Pagination: Page number (Default: 1) |
| `limit` | Number | `?limit=10` | Pagination: Items per page (Default: 10) |

### 4. Dashboard Analytics Endpoints
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/dashboard/summary` | Total income, expense, net balance | All Roles |
| GET | `/dashboard/category` | Category-wise totals | All Roles |
| GET | `/dashboard/monthly` | Monthly trends | All Roles |
| GET | `/dashboard/recent` | Last 5 recent records | All Roles |

### 5. Role-Based Access Control (RBAC) Matrix
| Action | Admin | Analyst | Viewer |
|---|---|---|---|
| Manage Users | ✅ | ❌ | ❌ |
| Create/Update/Delete Records | ✅ | ❌ | ❌ |
| View Records List | ✅ | ✅ | ❌ |
| View Dashboard Analytics | ✅ | ✅ | ✅ |

---

## Detailed Request Configurations

Copy and paste these exact configurations into your API client.

### 1. Authentication

#### Signup
- **Endpoint:** `POST /api/auth/signup`
- **Headers:** `Content-Type: application/json`
- **Body Payload (raw JSON):**
```json
{
  "name": "Alex Admin",
  "email": "alex@test.com",
  "password": "password123",
  "role": "admin"
}
```

#### Login
- **Endpoint:** `POST /api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body Payload (raw JSON):**
```json
{
  "email": "alex@test.com",
  "password": "password123"
}
```
*(Copy the generated token from the response to use as the Bearer token below)*

---

### 2. User Management

#### Create User
- **Endpoint:** `POST /api/users`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body Payload (raw JSON):**
```json
{
  "name": "Sam Analyst",
  "email": "sam@test.com",
  "password": "password123",
  "role": "analyst"
}
```

#### Update User Role
- **Endpoint:** `PATCH /api/users/<user_id>/role`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **URL Params:** Replace `<user_id>` with a valid user ObjectId.
- **Body Payload (raw JSON):**
```json
{
  "role": "viewer"
}
```

#### Update User Status
- **Endpoint:** `PATCH /api/users/<user_id>/status`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **URL Params:** Replace `<user_id>` with a valid user ObjectId.
- **Body Payload (raw JSON):**
```json
{
  "status": "inactive"
}
```

---

### 3. Financial Records

#### Create Record
- **Endpoint:** `POST /api/records`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body Payload (raw JSON):**
```json
{
  "amount": 50000,
  "type": "income",
  "category": "salary",
  "note": "April salary"
}
```

#### Update Record
- **Endpoint:** `PUT /api/records/<record_id>`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **URL Params:** Replace `<record_id>` with a valid record ObjectId.
- **Body Payload (raw JSON):**
```json
{
  "amount": 55000,
  "note": "Updated April Salary"
}
```

#### Search & Filter Records
- **Endpoint:** `GET /api/records?type=income&search=salary&page=1&limit=5`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** None

---

### 4. Dashboard Analytics

#### Get Summary
- **Endpoint:** `GET /api/dashboard/summary`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** None

#### Get Recent Activity
- **Endpoint:** `GET /api/dashboard/recent`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** None
