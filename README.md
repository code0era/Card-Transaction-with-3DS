# 🛡️ 3DS Card Transaction Visualizer

> **DatMan QA Trainee Assignment — Task 1**  
> An enterprise-grade, interactive visualization of the end-to-end lifecycle of a 3D Secure card payment.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?logo=vercel)](https://card-transaction-3ds.vercel.app)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

---

## 🎯 Assignment Goal

> Research and document an end-to-end lifecycle of a card payment involving 3D Secure.
> - Frontend initiation (merchant site)
> - Tokenization
> - 3DS challenge flow (redirects, OTP, challenge/frictionless)
> - API involvement (authorization)
> - Success/failure events and handling

---

## ✨ Features

| Page | Description |
|------|-------------|
| 🏠 **Landing** | Hero with animated mini 3DS flow preview |
| 🔍 **Flow Explorer** | Interactive 9-step 3DS timeline with API payloads |
| ⚡ **Simulation** | Live mock 3DS transaction runner (frictionless/challenge) |
| ⚖️ **Comparison** | 3DS v1 vs 3DS v2 side-by-side feature matrix |
| 📊 **History** | Paginated transaction history with stats & filters |
| 📄 **Documentation** | Complete 1-page 3DS explanation (Task 1 deliverable) |

---

## 🏗️ Architecture

```
root/
├── api/                          ← Express.js (Vercel Serverless)
│   ├── index.js                  ← App entry & MongoDB connect
│   ├── middleware/auth.js        ← JWT middleware
│   ├── models/{User, Transaction}.js
│   └── routes/{auth, transactions}.js
├── client/                       ← React 18 + Vite 4
│   └── src/
│       ├── components/NavBar/    ← Sticky nav, mobile menu
│       ├── context/AuthContext   ← JWT state management
│       ├── data/3ds-flow-data.js ← All 9 flow stages + payloads
│       ├── pages/                ← 8 pages
│       └── utils/api.js          ← Axios + JWT interceptor
├── vercel.json                   ← Routes /api/* → serverless
└── package.json                  ← Root build script
```

---

## 🚀 Quick Start (Local)

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)

### 1. Clone & Install
```bash
git clone https://github.com/code0era/Card-Transaction-with-3DS.git
cd Card-Transaction-with-3DS
npm install
cd client && npm install && cd ..
```

### 2. Configure Environment
```bash
# Create .env in root
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/card3ds
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
PORT=5000
```

### 3. Run Development
```bash
# Terminal 1 — API
node api/index.js

# Terminal 2 — Client
cd client && npm run dev
```

Open `http://localhost:3000`

---

## 🌐 Deployment (Vercel)

This project is pre-configured for Vercel free tier.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard:
# MONGODB_URI, JWT_SECRET, JWT_EXPIRES_IN
```

The `vercel.json` routes:
- `/api/*` → Express serverless function
- Everything else → React SPA (`client/dist`)

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login + get JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/transactions` | ✅ | List transactions (paginated) |
| POST | `/api/transactions/simulate` | ✅ | Run mock 3DS simulation |
| GET | `/api/transactions/stats` | ✅ | Dashboard statistics |
| GET | `/api/transactions/:id` | ✅ | Get single transaction |
| DELETE | `/api/transactions/:id` | ✅ | Delete transaction |

---

## 🔐 Authentication

JWT-based authentication:
- Tokens expire in 7 days
- Stored in `localStorage`
- Attached via `Authorization: Bearer <token>` header
- Axios interceptor auto-redirects on 401

---

## 📖 3DS Flow — Quick Reference

```
Merchant → PSP (Tokenization) → Acquiring Bank → Card Network
  → 3DS Server → Directory Server → ACS (Risk Engine)
    → [Frictionless] CAVV Generated, ECI=07
    → [Challenge] OTP/Biometric → CAVV Generated, ECI=05
  → Authorization (ISO 8583) → Issuer → Approve/Decline
→ Settlement (T+1)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 4, React Router v6 |
| Styling | Vanilla CSS (custom design system) |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Deployment | Vercel (frontend + serverless API) |

---

## 📂 Key Files

- [`client/src/data/3ds-flow-data.js`](client/src/data/3ds-flow-data.js) — Complete 3DS flow data with API payloads
- [`client/src/pages/Documentation.jsx`](client/src/pages/Documentation.jsx) — Task 1 official deliverable
- [`api/routes/transactions.js`](api/routes/transactions.js) — 3DS simulation logic
- [`vercel.json`](vercel.json) — Serverless deployment config

---

*Built for DatMan QA Trainee Assignment — demonstrating end-to-end 3DS payment flow understanding.*
