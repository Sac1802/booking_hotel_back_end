# Hotel Booking API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="80" alt="NestJS Logo" /></a>
</p>

<p align="center">
  A robust REST API for hotel reservation management built with <b>NestJS</b>, <b>MongoDB</b>, and <b>TypeScript</b>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=flat&logo=swagger&logoColor=black" alt="Swagger" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)

---

## Overview

This **Hotel Booking API** provides a complete backend solution for managing hotel reservations, room inventory, and user authentication. It supports features like pre-booking cost estimation, festive calendar pricing, reservation cancellation policies, and more.

Designed with scalability and security in mind, it uses JWT authentication, role-based access control, and comprehensive input validation.

---

## Features

### Core Functionality

- **Authentication & Authorization**
  - User registration and login with JWT
  - Protected routes with Passport.js strategies
  - Profile management

- **Hotel Management**
  - Create, read, update, and delete hotels
  - Hotel listing with filtering capabilities

- **Room Management**
  - Room CRUD operations
  - Associate rooms with hotels
  - View rooms by hotel

- **Reservation System**
  - Create individual or bulk reservations
  - Pre-booking summary with cost estimation
  - Automatic festive/special date pricing
  - Reservation cancellation with policy validation
  - View booking history per user

- **Smart Pricing**
  - Festive calendar integration for special rates
  - Dynamic pricing based on dates

### Additional Features

- **API Documentation**: Interactive Swagger UI at `/api`
- **CORS Enabled**: Configured for frontend integration (localhost:4200)
- **Data Validation**: Class-validator for DTO validation
- **Error Handling**: Consistent API responses
- **Seed Data**: Database seeding for initial setup

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **NestJS** | Progressive Node.js framework |
| **TypeScript** | Type-safe JavaScript |
| **MongoDB + Mongoose** | NoSQL database and ODM |
| **Passport.js** | Authentication middleware |
| **JWT** | JSON Web Tokens for auth |
| **bcrypt** | Password hashing |
| **Swagger/OpenAPI** | API documentation |
| **Jest** | Testing framework |
| **ESLint + Prettier** | Code quality and formatting |

---

## Project Structure

```
booking_hotel_back_end/
├── src/
│   ├── auth/              # Authentication module (JWT, Passport)
│   ├── users/             # User management
│   ├── hotels/            # Hotel CRUD operations
│   ├── rooms/             # Room management
│   ├── reservation/       # Booking and reservation logic
│   ├── filters/           # Search and filter functionality
│   ├── festive-calendar/  # Special date pricing
│   ├── database/          # MongoDB connection config
│   ├── seed/              # Database seeding
│   ├── app.module.ts      # Root application module
│   └── main.ts            # Application entry point
├── test/                  # E2E tests
├── package.json
├── tsconfig.json
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+ 
- **MongoDB** instance (local or cloud)
- **npm** or **yarn**

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd booking_hotel_back_end
```

2. Install dependencies:
```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
URL_DATABASE=mongodb://localhost:27017/hotel_booking

# JWT Configuration
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRATION=24h

# Application
PORT=3000
```

### Running the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production build
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

The API will be available at `http://localhost:3000`

---

## API Documentation

Once the application is running, access the interactive Swagger documentation at:

```
http://localhost:3000/api
```

This provides:
- Detailed endpoint descriptions
- Request/response schemas
- Authentication testing interface
- Try-it-now functionality

---

## Authentication

The API uses **JWT Bearer Token** authentication. 

1. **Register** a new user: `POST /auth/register`
2. **Login** to receive a token: `POST /auth/login`
3. **Use the token** in the `Authorization: Bearer <token>` header for protected routes

### Example Login Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login and get JWT token | No |
| GET | `/auth/profile` | Get current user profile | Yes |

### Hotels
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/hotels/create` | Create a new hotel | Yes |
| GET | `/hotels/get/all` | Get all hotels | No |
| GET | `/hotels/get/:id` | Get hotel by ID | No |
| PUT | `/hotels/update/:id` | Update a hotel | Yes |
| DELETE | `/hotels/:id` | Delete a hotel | Yes |

### Rooms
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/rooms/create` | Create a new room | Yes |
| GET | `/rooms/get/all` | Get all rooms | Yes |
| GET | `/rooms/get/:id` | Get room by ID | Yes |
| GET | `/rooms/get/hotel/:id` | Get rooms by hotel ID | No |
| PUT | `/rooms/update/:id` | Update a room | Yes |
| DELETE | `/rooms/:id` | Delete a room | Yes |

### Reservations
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/reservation` | Create a reservation | Yes |
| POST | `/reservation/bookings/summary` | Get pre-booking cost summary | Yes |
| POST | `/reservation/bookings/confirm` | Confirm multiple room booking | Yes |
| GET | `/reservation/bookings` | Get user's reservations | Yes |
| PATCH | `/reservation/bookings/:id/cancel` | Cancel a reservation | Yes |

---

## Testing

```bash
# Unit tests
npm run test

# Unit tests in watch mode
npm run test:watch

# Test coverage report
npm run test:cov

# End-to-end tests
npm run test:e2e
```

---

## Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Run in development mode with hot reload |
| `npm run start:prod` | Run compiled production build |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run lint` | Run ESLint with auto-fix |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run unit tests |
| `npm run test:cov` | Run tests with coverage report |

---

## Development Guidelines

- Follow **NestJS** architectural patterns (Controllers, Services, Modules)
- Use **DTOs** for all incoming request validation
- Document all endpoints with **Swagger decorators**
- Write **unit tests** for services and controllers
- Keep business logic in **services**, HTTP handling in **controllers**

---

## License

This project is licensed under the MIT License.
