# Console.Blog

A full-stack blog application built with the **MERN** stack. This project was created as part of my personal journey to becoming a software engineer. Originally intended to be a resume and portfolio site, it has evolved into a personal blog for documenting my growth as a developer.

---

## Tech Stack

![React](https://img.shields.io/badge/Frontend-React-blue)
![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-blueviolet)
![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Express](https://img.shields.io/badge/Server-Express-black)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![AWS S3](https://img.shields.io/badge/Storage-AWS%20S3-orange)
![OpenAI](https://img.shields.io/badge/API-OpenAI-blue)

---

## Features

- Full CRUD functionality for blog entries
- Rich text editing with formatting options
- Upload images for blog entries (stored on AWS S3)
- AI-generated summaries for entries via OpenAI GPT-4 Turbo
- Authentication using JWT tokens
- User profile page (update profile picture, change password, view stats)
- Functional login and signup with email/password
- Light and dark theme toggle
- Basic chatbot powered by OpenAI
- Responsive UI built with Tailwind CSS

---

## Folder Structure

```
project-root/
  client/         # Frontend React application
  server/         # Backend API with Express and Mongoose
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/SWE-Blog.git
cd SWE-Blog
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory. Here are the required environment variables:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_s3_bucket_name
```

### 4. Run the App Locally

```bash
npm run dev
```

This will start both the frontend (on port 3000) and the backend (on port 5001) using `concurrently` with hot reloading enabled.

---

## Notes

- MongoDB is hosted on MongoDB Atlas.
- AWS S3 is used to store user-uploaded images.
- OpenAI GPT-4 Turbo is used for generating summaries and chat responses.
- This app is not currently deployed. Future deployment steps may be added.
- Contact form is currently non-functional, intentionally left as-is.

---

## Author

Created by Andy Guajardo. Built with way too many late-night coding sessions.



