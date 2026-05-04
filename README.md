
---

# ✈️ SkyBook — Microservices Flight Booking System

A production-grade, **microservices-based flight booking system** built using **Spring Boot, Docker, Kubernetes, and React**.

SkyBook demonstrates scalable backend architecture with **independent services, API Gateway routing, isolated databases**, and a modern airline-style frontend.

---

## 🏗️ Architecture

```
                    ┌─────────────────┐
                    │ React Frontend  │
                    │ (Port 3000)     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  API Gateway    │
                    │  (Port 8080)    │
                    └────────┬────────┘
                             │
      ┌──────────────────────┼──────────────────────┐
      │                      │                      │
┌────────▼──────┐    ┌────────▼──────┐    ┌────────▼───────┐
│ User Service  │    │ Flight Service│    │ Booking Service│
│ (Port 8081)   │    │ (Port 8082)   │    │ (Port 8083)    │
│ user_db       │    │ flight_db     │    │ booking_db     │
└───────────────┘    └───────────────┘    └────────┬───────┘
                                                  │
                                          ┌───────▼────────┐
                                          │ Payment Service│
                                          │ (Port 8084)    │
                                          │ payment_db     │
                                          └────────────────┘
```

---

## 🛠️ Tech Stack

| Layer            | Technology               |
| ---------------- | ------------------------ |
| Backend          | Java 21, Spring Boot 3   |
| Security         | Spring Security, BCrypt  |
| Database         | MySQL 8 (per service DB) |
| API Gateway      | Spring Cloud Gateway     |
| Frontend         | React 18, Vite, Axios    |
| Containerization | Docker, Docker Compose   |
| Orchestration    | Kubernetes (Minikube)    |

---

## 📦 Microservices Overview

### 👤 User Service (Port 8081)

* User registration & login
* Password hashing with BCrypt
* Role-based access (USER / ADMIN)
* Database: `user_db`

---

### ✈️ Flight Service (Port 8082)

* Add, update, delete flights
* Search by source, destination, and date
* Database: `flight_db`

---

### 📖 Booking Service (Port 8083)

* Create & cancel bookings
* Seat availability validation
* Communicates with Flight & Payment services
* Booking lifecycle:

  ```
  PENDING → CONFIRMED / FAILED → CANCELLED
  ```
* Database: `booking_db`

---

### 💳 Payment Service (Port 8084)

* Simulated payment processing
* Stores full payment audit logs
* Returns SUCCESS / FAILED
* Database: `payment_db`

---

### 🌐 API Gateway (Port 8080)

* Single entry point
* Routes:

  * `/users/**`
  * `/flights/**`
  * `/bookings/**`
  * `/payments/**`

---

## 🚀 Getting Started

### ✅ Prerequisites

* Docker Desktop
* Git

---

### ⚡ Run with Docker (One Command)

```bash
git clone https://github.com/YOUR_USERNAME/flight-booking-microservices.git
cd flight-booking-microservices

docker-compose up --build -d
```

---

### 🧩 Services Started

* MySQL (4 databases)
* User Service
* Flight Service
* Booking Service
* Payment Service
* API Gateway

---

## 🧪 API Testing

### Register User

```bash
curl -X POST http://localhost:8080/users/register \
-H "Content-Type: application/json" \
-d '{"name":"Arjun Sharma","email":"arjun@example.com","password":"password123"}'
```

---

### Add Flight

```bash
curl -X POST http://localhost:8080/flights \
-H "Content-Type: application/json" \
-d '{
  "flightNumber":"AI-202",
  "airlineName":"Air India",
  "source":"Delhi",
  "destination":"Mumbai",
  "departureTime":"2025-06-15T08:00:00",
  "arrivalTime":"2025-06-15T10:15:00",
  "fare":4500,
  "totalSeats":180
}'
```

---

### Book Flight

```bash
curl -X POST http://localhost:8080/bookings \
-H "Content-Type: application/json" \
-d '{"userId":1,"flightId":1,"seatCount":2}'
```

---

## 🖥️ Frontend Setup

```bash
cd skybook-frontend
npm install
npm run dev
```

📍 Runs at: `http://localhost:3000`

---

### 🌟 Frontend Features

* 🏠 Home page (hero + popular routes)
* 🔍 Flight search with sorting
* 📖 Booking flow (3-step process)
* 💳 Payment & boarding pass UI
* 📜 My bookings dashboard

---

## 📁 Project Structure

```
flight-booking-microservices/
│
├── user-service/
├── flight-service/
├── booking-service/
├── payment-service/
├── api-gateway/
│
├── skybook-frontend/
│
├── k8s/
│   ├── namespace.yaml
│   ├── mysql.yaml
│   ├── services...
│
├── docker-compose.yml
├── init.sql
└── README.md
```

---

## 🌐 API Endpoints

| Method | Endpoint          | Description     |
| ------ | ----------------- | --------------- |
| POST   | `/users/register` | Register user   |
| POST   | `/users/login`    | Login           |
| GET    | `/users/{id}`     | Get user        |
| POST   | `/flights`        | Add flight      |
| GET    | `/flights`        | List flights    |
| GET    | `/flights/search` | Search flights  |
| POST   | `/bookings`       | Create booking  |
| GET    | `/bookings/{id}`  | Get booking     |
| DELETE | `/bookings/{id}`  | Cancel booking  |
| POST   | `/payments`       | Process payment |

---

## ☸️ Kubernetes Deployment

```bash
minikube start --driver=docker
eval $(minikube docker-env)

docker build -t user-service ./user-service
docker build -t flight-service ./flight-service
docker build -t booking-service ./booking-service
docker build -t payment-service ./payment-service
docker build -t api-gateway ./api-gateway

kubectl apply -f k8s/

minikube tunnel
```

📍 Access: `http://localhost:8080`

---

## 🔥 Key Highlights

* True **microservices architecture**
* **Database per service** pattern
* API Gateway routing
* Dockerized + Kubernetes-ready
* Clean, scalable backend design
* Modern React frontend

---

## 👨‍💻 Author

**Samarth Joshi**
🎓 College Project — Microservices Architecture
⚙️ Built with Spring Boot, Docker, Kubernetes & React

---


