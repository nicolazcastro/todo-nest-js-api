# Todo NestJS API

![NestJS Logo](https://nestjs.com/img/logo_text.svg)

## Description

**Todo NestJS API** is a RESTful API template built with [NestJS](https://nestjs.com/), designed to manage tasks (ToDos) with advanced features such as:

- **Basic JWT Authentication:**  
  - Allows users to register and log in.
  - Protects routes using JWT tokens generated with `jsonwebtoken`.

- **MongoDB Integration:**  
  - Uses [MongoDB](https://www.mongodb.com/) as the database, managed through [Mongoose](https://mongoosejs.com/).

- **External API Consumption:**  
  - Each ToDo item fetches a random piece of advice from a public external API (the [Advice Slip API](https://api.adviceslip.com/)) to enrich user experience.

- **Unit Testing:**  
  - Implements isolated unit tests for controllers and services using [Jest](https://jestjs.io/).
  - Uses mocks to isolate components during testing.

This template serves as a solid foundation for future projects, providing a modular, scalable, and maintainable structure.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Clone the Repository](#clone-the-repository)
  - [Configure Environment Variables](#configure-environment-variables)
  - [Install Dependencies](#install-dependencies)
  - [Run the Application](#run-the-application)
- [Usage](#usage)
  - [API Endpoints](#api-endpoints)
- [External API Integration](#external-api-integration)
- [Testing](#testing)
  - [Run Unit Tests](#run-unit-tests)
- [Contributing](#contributing)
- [License](#license)

## Features

- **JWT Authentication:**
  - User registration.
  - User login and JWT token generation.
  - Route protection using guards.

- **ToDo Management:**
  - Create, read, update, and delete tasks.
  - Associate each ToDo with a random piece of advice fetched from an external API.

- **External API Consumption:**
  - Integration with the Advice Slip API to fetch random advice (no authentication required).

- **Unit Testing:**
  - Comprehensive unit tests for controllers and services.
  - Utilizes mocks to isolate components during testing.

## Technologies

- **Backend:**
  - [NestJS](https://nestjs.com/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [MongoDB](https://www.mongodb.com/)
  - [Mongoose](https://mongoosejs.com/)
  - [JWT](https://jwt.io/)
  - [Axios](https://axios-http.com/) (for external API requests)

- **Testing:**
  - [Jest](https://jestjs.io/)

## Project Structure

todo-nest-js-api/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── config/
│   │   └── database.config.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   └── login-user.dto.ts
│   │   │   ├── schemas/
│   │   │   │   └── user.schema.ts
│   │   │   └── auth.module.ts
│   │   ├── todos/
│   │   │   ├── todos.controller.ts
│   │   │   ├── todos.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-todo.dto.ts
│   │   │   │   └── update-todo.dto.ts
│   │   │   ├── schemas/
│   │   │   │   └── todo.schema.ts
│   │   │   └── todos.module.ts
│   │   └── external-apis/
│   │       ├── advice/
│   │       │   ├── advice.service.ts
│   │       │   └── advice.module.ts
│   ├── common/
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   └── filters/
│   │       └── http-exception.filter.ts
│   └── tests/
│       ├── auth/
│       │   └── auth.service.spec.ts
│       ├── todos/
│       │   └── todos.service.spec.ts
│       └── external-apis/
│           └── advice/
│               └── advice.service.spec.ts
├── .env
├── .gitignore
├── README.md
├── package.json
├── tsconfig.json
└── jest.config.js

### **Description of Folders and Files**

- **`src/`**: Contains all source code of the application.
  - **`app.module.ts`**: Root module that imports and configures other modules.
  - **`main.ts`**: Entry point where the NestJS server is started.
  - **`config/`**: Contains global configuration files.
    - **`database.config.ts`**: Configuration for connecting to MongoDB.
  - **`modules/`**: Contains functional modules.
    - **`auth/`**: Handles user authentication.
      - **`auth.controller.ts`**: Controller for authentication routes.
      - **`auth.service.ts`**: Business logic for authentication.
      - **`dto/`**: Data Transfer Objects for authentication.
        - **`create-user.dto.ts`** and **`login-user.dto.ts`**
      - **`schemas/`**: Mongoose schema for the User model.
      - **`auth.module.ts`**: Defines the Auth module.
    - **`todos/`**: Manages ToDo operations.
      - **`todos.controller.ts`**: Controller for ToDo routes.
      - **`todos.service.ts`**: Business logic for ToDo operations.
      - **`dto/`**: DTOs for ToDo operations.
        - **`create-todo.dto.ts`** and **`update-todo.dto.ts`**
      - **`schemas/`**: Mongoose schema for the ToDo model.
      - **`todos.module.ts`**: Defines the ToDo module.
    - **`external-apis/`**: Manages external API integrations.
      - **`advice/`**: Integration with the Advice Slip API.
        - **`advice.service.ts`**: Service for fetching random advice.
        - **`advice.module.ts`**: Defines the Advice module.
  - **`common/`**: Contains reusable components.
    - **`guards/`**: Contains JWT authentication guard.
      - **`jwt-auth.guard.ts`**
    - **`filters/`**: Contains global HTTP exception filters.
      - **`http-exception.filter.ts`**
  - **`tests/`**: Contains unit tests for each module.
    - **`auth/`**, **`todos/`**, **`external-apis/advice/`**

- **`.env`**: File containing environment variables (not committed to version control).
- **`.gitignore`**: Specifies files and directories to ignore in version control.
- **`README.md`**: Project documentation (this file).
- **`package.json`**: Manages project dependencies and scripts.
- **`tsconfig.json`**: TypeScript configuration.
- **`jest.config.js`**: Jest configuration for testing.

---

## Installation

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **[Node.js](https://nodejs.org/) (v14 or higher)**
- **[npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)**
- **[MongoDB](https://www.mongodb.com/)** (running locally)

### Clone the Repository

Clone the repository to your local machine (replace `<YOUR_TOKEN>` with your GitHub token if needed):

```bash
git clone https://<YOUR_TOKEN>@github.com/<YOUR_GITHUB_USERNAME>/todo-nest-js-api.git

Security Note: Use secure methods (e.g., SSH) when possible. Do not expose your token publicly.

Configure Environment Variables
	1.	Create the .env File:
    In the root directory, create a .env file:

    touch .env

  2.	Add the Following Variables:
    PORT=3000
    JWT_SECRET=your_jwt_secret_key_here
    JWT_EXPIRATION=3600s
    MONGODB_URI=mongodb://localhost:27017/todo-nest-js-api
    ADVICE_API_URL=https://api.adviceslip.com/advice

    Replace your_jwt_secret_key_here with a strong, unique key.


Install Dependencies

  Navigate to the project directory and install dependencies:

  npm install


Run the Application

  Development Mode (with Hot Reload)

  npm run start:dev

  This command uses nodemon for hot-reloading. Your server will run on the port specified in .env (default is 3000).


Production Mode
	
  1.	Build the Project:

    npm run build

  2.	Start the Application:

    npm run start:prod


Usage

API Endpoints

  Authentication

    •	User Registration
      •	URL: /auth/register
      •	Method: POST
      •	Body:
              {
                "username": "exampleUser",
                "password": "securePassword"
              }

      •	Description: Registers a new user.

   	•	User Login
      •	URL: /auth/login
      •	Method: POST
      •	Body: 
              {
                "username": "exampleUser",
                "password": "securePassword"
              }
      
      •	Description: Authenticates the user and returns a JWT token.


  ToDo Management

    Note: All ToDo endpoints require authentication. Include the JWT token in the Authorization header as Bearer <token>.

    •	Create a ToDo
      •	URL: /todos
      •	Method: POST
      •	Body:  
              {
                "title": "Buy milk",
                "description": "Milk, Bread, Eggs"
              }

     •	Description: Creates a new task and associates a random piece of advice fetched from the external API. 


    •	Get All ToDos
      •	URL: /todos
      •	Method: GET
      •	Description: Retrieves all tasks for the authenticated user, sorted by creation date (descending).
      •	Get a Specific ToDo
      •	URL: /todos/:id
      •	Method: GET

      •	Description: Retrieves a task by its ID.

    •	Update a ToDo
      •	URL: /todos/:id
      •	Method: PUT
      •	Body:
              {
                "title": "Buy bread",
                "description": "Whole grain bread"
              }
      •	Description: Updates the title and/or description of a specific task.
      
    •	Delete a ToDo
      •	URL: /todos/:id
      •	Method: DELETE
      
      •	Description: Deletes a specific task.

External API Integration

    Advice Slip API
      •	Purpose:
        The external API is used to fetch a random piece of advice which is automatically attached to each new ToDo item.
          •	How It Works:
          •	When a ToDo is created, the TodosService calls the AdviceService.
          •	The AdviceService makes an HTTP GET request to the Advice Slip API.
          •	The retrieved advice is stored in the advice field of the ToDo document.

Testing

  Run Unit Tests

  This project uses Jest for unit testing. Tests are located in the src/tests/ directory and ensure that controllers and services function correctly in isolation using mocks.

  Execute All Tests
    npm run test

  Run Tests in Watch Mode
    npm run test:watch

  Generate Coverage Report
    npm run test:cov


Contributing

Contributions are welcome! If you’d like to contribute, follow these steps:
	1.	Fork the Repository
	2.	Create a Feature Branch (e.g., feature/YourFeature)
	3.	Commit Your Changes
	4.	Push to Your Fork
	5.	Open a Pull Request

Please adhere to the project’s coding standards and include appropriate tests for any new features.

License

This project is licensed under the MIT License.

Thank you for using Todo NestJS API! If you have any questions or need assistance, feel free to open an issue or contact the project maintainer.