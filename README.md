# Inno Tweet a Twitter-Like service based Application

This project is a microservices-based Twitter-like system where users can post short messages, read them, and like them. It demonstrates the use of service-based architecture, containerization with Docker, inter-service communication, and an Nginx reverse proxy.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Services](#services)
  - [User Service](#user-service)
  - [Message Service](#message-service)
  - [Like Service](#like-service)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [User Service Endpoints](#user-service-endpoints)
  - [Message Service Endpoints](#message-service-endpoints)
  - [Like Service Endpoints](#like-service-endpoints)
- [Project Structure](#project-structure)
- [Demo Video](#demo-video)

## Overview

The application consists of three microservices:

1. **User Service**: Manages user registration.
2. **Message Service**: Allows users to post and read messages.
3. **Like Service**: Enables users to like messages.

These services communicate with each other over a Docker network, with Nginx acting as a reverse proxy to route traffic between services. A shared PostgreSQL database is used for data persistence.

## Architecture

- **Service-Based Architecture**: Each service is responsible for a specific business domain and can be developed, deployed, and scaled independently.
- **Dockerized Services**: All services are containerized using Docker and orchestrated with Docker Compose.
- **Inter-Service Communication**: Services communicate over a shared Docker network using HTTP requests.
- **Nginx as a Reverse Proxy**: Nginx routes incoming requests to the appropriate service based on the URL path.
- **Shared Database**: A PostgreSQL database is used for data persistence, with all services accessing it directly.

## Services

### User Service

- **Port**: `3001`
- **Responsibilities**:
  - Register new users.
  - Check if a user is registered.

### Message Service

- **Port**: `3002`
- **Responsibilities**:
  - Post new messages (tweets).
  - Retrieve the latest 10 messages (feed).
  - Increment the like count for messages.

### Like Service

- **Port**: `3003`
- **Responsibilities**:
  - Allow users to like messages.
  - Prevent users from liking the same message multiple times.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for Node.js.
- **PostgreSQL**: Relational database for data persistence.
- **Docker**: Containerization platform.
- **Docker Compose**: Tool for defining and running multi-container Docker applications.
- **Axios**: Promise-based HTTP client for Node.js.
- **Nginx**: Reverse proxy and load balancer.

## Getting Started

### Prerequisites

- **Docker** and **Docker Compose** installed on your machine.
- **Git** installed for cloning the repository.

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/twitter-like-system.git
   cd twitter-like-system
   ```

2. **Make Initialization Script Executable**

   ```bash
    chmod +x postgres-init/init.sh
   ```

### Running the Application

1.  **Build and Start the Services**

    ```bash
    docker-compose up --build
    ```

2.  **Verify Services are Running**
    Open another terminal and run:

    ```bash
    docker-compose ps
    ```

    You should see all services (postgres, user-service, message-service, like-service, nginx) up and running

## API Endpoints

### User Service Endpoints

- Register a New User

```
POST /user/register
```

Request Body:

```
{
  "username": "safi"
}
```

- Check if User is Registered

```
GET /user/isRegistered/:username
```

Response:

```
{
  "isRegistered": true
}
```

### Message Service Endpoints

- Post a New Message

```
POST /message/post
```

Request Body:

```
{
  "username": "safi",
  "content": "Hello, world!"
}
```

Retrieve the Feed

```
GET /message/feed
```

Response:

```
[
  {
    "id": 1,
    "username": "safi",
    "content": "Hello, world!",
    "likes": 0,
    "timestamp": "2024-10-10T18:30:00.000Z"
  }
  // More messages...
]
```

### Like Service Endpoints

- Like a Message

```
POST /like/like
```

Request Body:

```
{
  "username": "safi",
  "messageId": 1
}
```

### Project Structure

```
inno-tweet/
├── docker-compose.yml
├── nginx/
│   └── Dockerfile
|   └── nginx.conf
├── postgres-init/
│   └── init.sh
├── user-service/
│   ├── Dockerfile
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   └── .dockerignore
├── message-service/
│   ├── Dockerfile
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   └── .dockerignore
├── like-service/
│   ├── Dockerfile
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   └── .dockerignore
└── README.md
```
### Demo Video

<a href="https://youtu.be/iYwJzqkvv0A">
    <img src="https://i.ibb.co/CQfZJ39/demo.png" alt="Demo video" width="100" />
</a>

