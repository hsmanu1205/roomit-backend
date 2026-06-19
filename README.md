# RoomIt Backend

Backend API for RoomIt Meeting Room Booking System built using Node.js, Express.js, MongoDB and Mongoose.

---

## Live API

🔗 Live API: https://roomit-backend-z03a.onrender.com/

---

## Features

### Room APIs

- Get All Rooms
- Check Room Availability

### Booking APIs

- Create Booking
- Cancel Booking
- Reschedule Booking
- Get User Bookings

### Concurrency Handling

- Prevent Double Booking
- MongoDB Transactions
- Atomic Slot Reservation

### Booking Slot Management

- Dedicated BookingSlot Collection
- Consistent Availability Source
- Conflict Detection

### Waitlist System

- Join Waitlist
- Auto Promotion

---

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose

---

## Project Structure

```bash
src
│
├── config
├── controllers
├── middleware
├── models
├── routes
├── seed
├── services
└── server.js
```

---

## Installation

Clone Repository

```bash
git clone YOUR_BACKEND_REPOSITORY_URL
```

Install Dependencies

```bash
npm install
```

Create Environment Variables

```env
PORT=5000

MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
```

---

## Run Server

```bash
npm run dev
```

Server runs at:

```bash
http://localhost:5000
```

---

## API Endpoints

### Rooms

#### Get All Rooms

```http
GET /api/rooms
```

#### Get Room Availability

```http
GET /api/rooms/:id/availability?date=YYYY-MM-DD
```

---

### Bookings

#### Create Booking

```http
POST /api/bookings
```

#### Get User Bookings

```http
GET /api/bookings?email=user@example.com
```

#### Cancel Booking

```http
PATCH /api/bookings/:id/cancel
```

#### Reschedule Booking

```http
PATCH /api/bookings/:id/reschedule
```

---

## Sample Booking Request

```json
{
  "roomId": "ROOM_ID",
  "date": "2026-06-18",
  "startTime": "11:00",
  "endTime": "12:00",
  "title": "Team Meeting",
  "bookedBy": {
    "name": "Harshit Singh",
    "email": "harshit@example.com"
  }
}
```

---

## Assignment Requirements Covered

### Core Requirements

✅ No Double Booking

✅ Consistent Availability

✅ Booking Cancellation

✅ Booking Rescheduling

✅ Transaction-Based Booking

---

### Extended Requirements

✅ Waitlist System

✅ Auto Promotion

✅ Optimistic Locking

---

## Database

MongoDB Atlas

Collections:

- rooms
- bookings
- bookingslots
- waitlists

---

## Author

Harshit Singh

📞 8887453760

---

## Company

Rahane AiTech Ltd.