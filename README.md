# School Payments API

**Backend API for School Payment Dashboard** built with the **MERN stack**.  
This API supports **admin and user roles**, **payment creation**, **transaction tracking**, and **webhook processing**.

---

## Features

- User registration and login (JWT authentication)  
- Admin and User role-based access control  
- Payment creation with external gateway integration  
- View all transactions (admin) or school-specific transactions (user)  
- Webhook support to update payment status  
- Transaction status queries by `custom_order_id`  

---

## Tech Stack

- **Node.js** + **Express**  
- **MongoDB** with **Mongoose**  
- **JWT** for authentication  
- **Axios** for payment gateway requests  
- **Helmet, CORS, Morgan** for security and logging  

---

## Installation & Setup

1. Clone the repository:  
```bash
git clone https://github.com/<your-username>/school-payments-api.git
cd school-payments-api
---

Install dependencies:

  npm install

Create a .env file in the root directory with the following variables:

  PORT=4000
  MONGO_URI=<your-mongodb-connection-string>
  JWT_SECRET=<your-jwt-secret>
  PAYMENT_API_URL=<payment-gateway-url>
  PAYMENT_API_KEY=<your-payment-api-key>

API Endpoints

Auth

POST /auth/register – Register user/admin

POST /auth/login – Login and receive JWT

Payments

POST /payments/create – Create a new payment

GET /payments/status/:collect_id – Get payment status

Transactions

GET /transactions – Get all transactions (admin only)

GET /transactions/school/:schoolId – Get school-specific transactions

GET /transactions/status/:custom_order_id – Get transaction status

Webhook

POST /webhook – Receive payment gateway webhook updates

Roles & Permissions
Role	Permissions
Admin	Create payments for any school, view all transactions
User	Create payments only for their school, view own school transactions
Testing

Register admin and user via /auth/register.

Login to get JWT token.

Use token in Authorization: Bearer <token> header for all protected routes.

Create payments, check transactions, and simulate webhook updates.
