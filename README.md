# SaaS Subscription Billing System Engine

A robust, enterprise-grade subscription and billing engine built with **Node.js, Express, TypeScript, and MongoDB**. This system provides secure, stateless authentication, automated tier management, manual & automatic subscription lifecycles, and cryptographic webhook handlers to orchestrate seamless billing flows.

---

## 🚀 Core Technologies & Ecosystem

The engine is engineered for type-safety, rapid compilation, and reliable horizontal scale under heavy traffic:

*   **Runtime & Language:** Node.js (v22-alpine) & TypeScript 6.x
*   **Web Framework:** Express 5.x (optimized for robust routing and modern middleware workflows)
*   **Database & ORM:** MongoDB & Mongoose ORM 9.x
*   **Security & Encryption:**
    *   Stateless sessions via **JSON Web Tokens (JWT)**.
    *   Cryptographically-secure password hashing using **bcrypt**.
    *   **HMAC-SHA256 signature verification** on Webhooks to ensure requests originate exclusively from authorized payment gateway providers.
*   **Runtime Validation:** **Zod schemas** checking structural validity and input constraints on incoming requests.
*   **Development Utilities:** `ts-node-dev` for hot-reloading compilation and file system change detection.
*   **Logging:** Lightweight custom logging utility containing timestamps, structured contexts, and error traceback routing.

---

## 📂 Modular Folder Structure

The codebase adheres to a modular pattern. Business domain layers are encapsulated into isolated sub-modules inside the `module` directory, separating controllers, models, validations, and services from other unrelated domains.

```text
Billing-system/
├── dist/                          # Compiled production JavaScript files
├── src/
│   ├── app.ts                     # Main Express Application setup & middleware mounts
│   ├── server.ts                  # Server entrypoint (database setup, server instantiation, crash hooks)
│   └── app/
│       ├── config/                # Environment variables parsing and configuration object
│       │   └── index.ts
│       ├── errors/                # Global Application Error types and handlers
│       │   └── AppError.ts
│       ├── middlewares/           # Custom authentication, validation and logging middlewares
│       │   ├── auth.ts
│       │   ├── globalErrorHandler.ts
│       │   └── ValidateRequest.ts
│       ├── routes/                # Global router registry linking all API endpoints
│       │   └── index.ts
│       ├── utils/                 # General helpers (custom logger, catchAsync wrapper)
│       │   ├── CatchAsync.ts
│       │   ├── SendResponse.ts
│       │   └── logger.ts
│       └── module/                # Domain specific business modules
│           ├── plan/              # Plan endpoints, model, schema validation, and services
│           ├── subscription/      # Subscription purchasing, cancellation, and validation
│           ├── user/              # User Authentication, password hashing, and JWT generation
│           └── webhook/           # Signature checks and automated payment lifecycle hooks
├── .env                           # Local environment variables configurations (git-ignored)
├── .env.example                   # Template containing keys for setting up environment configs
├── Dockerfile                     # Multi-stage production ready Docker packaging descriptor
├── docker-compose.yml             # Local Multi-Container setup (Node Service + MongoDB)
├── package.json                   # Dependencies, scripts and build configurations
├── postman_collection.json        # Pre-configured API queries for Postman Client import
└── tsconfig.json                  # Compiler configurations adjusted for robust build pipelines
```

---

## 🔌 API Endpoints Catalog

The billing engine mounts all domain endpoints under the `/api/v1` namespace.

### Authentication Module (`/api/v1/auth`)

| Method | Endpoint | Authorization | Payload (JSON) | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/register` | Public | `{ "name", "email", "password", "role" }` | Creates a new user account inside the database. Valid values for role: `'client'` \| `'admin'`. |
| `POST` | `/login` | Public | `{ "email", "password" }` | Verifies login credentials and returns a stateless Access Token (JWT). |

### Plans Module (`/api/v1/plans`)

| Method | Endpoint | Authorization | Payload (JSON) | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/` | Admin Only | `{ "name", "price", "durationInDays", "isActive" }` | Registers a subscription tier option into the engine catalog. |
| `GET` | `/` | Public | *None* | Retrieves all available active subscription tier options. |

### Subscriptions Module (`/api/v1/subscriptions`)

| Method | Endpoint | Authorization | Payload (JSON) | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/purchase` | Client Only | `{ "planId", "autoRenew" }` | Signs up the client for a subscription plan tier. Returns the subscription record. |
| `PATCH`| `/:id/cancel` | Client Only | *None* | Toggles the active status or schedules the cancellation of the specific subscription contract. |

### Webhook Gateway Module (`/api/v1/webhooks`)

| Method | Endpoint | Headers Required | Payload (JSON) | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/payment-update` | `x-webhook-signature` | `{ "event", "data": { "subscriptionId" } }` | Integrates with the payment processors' webhooks. Updates status to `'active'` or `'expired'` dynamically. |

*Webhook Signature Validation is calculated via HMAC-SHA256:* `crypto.createHmac('sha256', WEBHOOK_SECRET).update(JSON.stringify(req.body)).digest('hex')`.

---

## 🛠️ Local Development & Setup Setup Guidelines

Follow these directions to stand up the local environment:

### Prerequisites
*   Node.js (v20+ recommended)
*   MongoDB Instance (Local Community Server or MongoDB Atlas cluster connection string)

### 1. Repository Setup
Clone the repository and install the development and core packages:
```bash
git clone <repository-url>
cd Billing-system
npm install
```

### 2. Configuration Settings
Create a `.env` file at the root level of the codebase. Copy the settings block below or duplicate and modify `.env.example`:
```ini
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/subscription-billing
JWT_ACCESS_SECRET=your_super_complex_random_jwt_access_secret_key_here
JWT_ACCESS_EXPIRES_IN=1d
BCRYPT_SALT_ROUND=12
WEBHOOK_SECRET=your_cryptographically_secure_hmac_webhook_signing_key
```

### 3. Running Locally
Run the server locally inside development mode:
```bash
npm run dev
```
The hot-reloader daemon (`ts-node-dev`) will spin up, watch your source directory for modifications, and output log logs directly into standard stdout.

### 4. Compiling the Production Bundle
To compile and test the server using standard built JavaScript packages:
```bash
# Build the TypeScript files to JS
npm run build

# Start the node server using the dist bundle
npm run start
```

---

## 🐳 Docker Deployment Setup

A multi-stage `Dockerfile` and `docker-compose.yml` configurations are available to bootstrap both the API server and database dependencies without manual installations:

```bash
# Spin up both MongoDB and the Billing API Engine containers in detached mode
docker-compose up -d --build
```
Once initialized:
*   The billing API service will dynamically bound and expose itself on host port `5000`.
*   A persistent database volume (`mongo_billing_data`) will automatically save MongoDB state.

To check container operations and logs:
```bash
docker-compose logs -f
```

---

## 🛡️ Professional Production-Ready Features

The engine is packed with design paradigms that make it immediately drop-in ready for modern production environments:

### 1. Robust Graceful Shutdown Flow
The HTTP Server intercepts crash and termination signals (`SIGTERM`, `uncaughtException`, `unhandledRejection`). Upon detection, the engine closes the active HTTP listener, stops processing new client requests, terminates the MongoDB connection cleanly via Mongoose, and closes process bindings safely:
```typescript
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection detected.', { promise, reason });
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});
```

### 2. Cryptographic Integrity Guard on Webhooks
To protect business endpoints against counterfeit billing triggers or spoofed invoices, the Webhook Gateway strictly inspects `x-webhook-signature` header using `crypto` hashing to verify origin integrity before modifying database contracts.

### 3. Schema Enforcement
Every single input request payload undergoes runtime deserialization and assertion checks via custom validation middlewares running Zod schemas. This completely blocks garbage parameters or script-injections from ever traversing near database drivers.

### 4. Custom Structured Logger
The logger formats logs with high-resolution ISO timestamps, severity tiers (`INFO`, `WARN`, `ERROR`), and structured payload context dumps, allowing modern log aggregation tools (Elasticsearch, Datadog, Grafana Loki) to effortlessly scan, parse, and catalog app actions.
