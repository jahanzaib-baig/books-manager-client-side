# Books Manager

Next.js web app that integrates with a RESTful API for managing book records. It supports CRUD operations with a focus on performance and usability.

## Requirements

- Node.js (v18.20.5)
- npm or yarn
- Next.js (v15.2.4)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/jahanzaib-baig/books-manager-client-side.git
   cd books-manager-client-side

   ```

2. Install dependencies:

   ```
    npm install
    Create a .env file in the root directory with your MongoDB connection string:

   ```

3. Create a .env file in the root directory with your MongoDB connection string:

   ```
   NEXT_PUBLIC_API_URL='http://localhost:8000/api'
   ```

4. Start the server:

   ```
   npm start
   ```

   For development with hot-reloading:

   ```
   npm run dev
   ```

5. Open http://localhost:3000 in your browser to see the app.

## Features

CRUD operations for books

#### API Endpoints

The API follows RESTful conventions and supports the following operations:

###### Create a new book

    POST /api/book

###### Retrieve all books

    GET /api/books

###### Retrieve a single book by ID

    GET /api/book/:id

###### Update a book by ID

    PUT /api/book/:id

###### Delete a book by ID

    DELETE /api/book/:id
