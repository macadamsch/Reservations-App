# Reservations App

## Live Site

[https://reservations-app-frontend.onrender.com](https://reservations-app-frontend.onrender.com)

## Screenshots
![image](https://github.com/macadamsch/Reservations-App/assets/121463395/b41b5a34-45da-4c39-91ca-cbd09d109eb6)
![image](https://github.com/macadamsch/Reservations-App/assets/121463395/742c6b1c-eb5e-4ba0-b0c2-e2e8a8360cfe)
![image](https://github.com/macadamsch/Reservations-App/assets/121463395/7d725fdf-c8da-4fd2-9bd5-782ec9b03002) ![image](https://github.com/macadamsch/Reservations-App/assets/121463395/fbb33f27-a9ac-4ebf-9381-14fa399bfbe5)

## Description

The Reservations App is a web application designed for fine dining restaurants. It provides a reservation system that is used by restaurant personnel when a customer calls to request a reservation. The application allows restaurant managers to create, update, search, and list reservations, ensuring efficient management of customer bookings.

## Technologies & Tools
The Reservations App is built using the following technologies:

- Frontend: HTML, CSS, JavaScript, React (React hooks, React router), Bootstrap 5
- Backend: Node.js, Express.js
- Database: PostgreSQL, RESTful APIs
- Testing: Jest, React Testing Library

## API Paths
The application provides the following API endpoints:

- `GET /reservations`: Retrieves a list of reservations for a specific date.
- `POST /reservations`: Creates a new reservation.
- `GET /reservations/:reservation_id`: Retrieves a specific reservation by ID.
- `PUT /reservations/:reservation_id`: Updates a specific reservation by ID.
- `PUT /reservations/:reservation_id/status`: Updates the status of a specific reservation by ID.
- `GET /tables`: Retrieves a list of tables.
- `POST /tables`: Creates a new table.
- `PUT /tables/:table_id/seat`: Assigns a reservation to a table.
- `DELETE /tables/:table_id/seat`: Removes a reservation from a table.

## Run Locally
To run the Reservations App locally, follow these steps:

1. Fork and clone the repository.
2. Run `npm install`.
3. Run `npm run start:dev` to start the application.
