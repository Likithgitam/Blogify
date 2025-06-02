# 📝 Blogify

**Blogify** is a full-featured blog application built using the **MERN Stack** – MongoDB, Express.js, React.js, and Node.js – featuring secure user authentication, cloud image uploads (via Cloudinary), and full CRUD capabilities for blog posts.

## 🔑 Key Features

- 🧑 User Authentication with JWT
- ✍️ Create, Read, Update, Delete (CRUD) blog posts
- 📷 Upload and manage blog cover images with **Cloudinary**
- 🔐 Authorization for editing and deleting only own blogs
- 📦 RESTful APIs with error handling
- 🕒 Timestamps on blog posts

## 🛠️ Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT for Auth
- bcrypt.js for Password Hashing
- Cloudinary (image storage)
- Multer (file upload)
- dotenv

### Frontend

- React.js (not shown in code but expected)
- Axios
- React Router
- Context API or Redux (optional)
- UI library (e.g., Tailwind, MUI, Bootstrap)

## 🔐 Authentication

- **Register** with first name, last name, username, email, and password.
- **Login** with email and password.
- Passwords are hashed using `bcrypt`.
- On successful login, a JWT is issued with 7-day expiry.

## 🧪 API Endpoints

### Auth Routes – `/api/auth`

| Method | Endpoint    | Description       |
| ------ | ----------- | ----------------- |
| POST   | `/register` | Register new user |
| POST   | `/login`    | Login and get JWT |

### Blog Routes – `/api/blogs`

| Method | Endpoint        | Description                      |
| ------ | --------------- | -------------------------------- |
| POST   | `/`             | Create blog (auth + file upload) |
| GET    | `/`             | Get all blogs                    |
| GET    | `/:blogId`      | Get blog by ID                   |
| PUT    | `/edit/:blogId` | Update blog (auth + upload)      |
| DELETE | `/:blogId`      | Delete blog (auth)               |

## ✅ Blog CRUD Details

### ➕ Create Blog

- Authenticated via JWT
- Requires `title`, `content`, and `coverImage` (Multer + Cloudinary)
- Author is automatically attached from token

### 📖 Get All Blogs

- Fetches all blogs with title, author, image, and created time
- Populates author username

### 📘 Get Specific Blog

- Fetches a blog by its ID with full content and author info

### ✏️ Update Blog

- Only the original author can update
- Can update title, content, and optionally the cover image
- Old image is removed from Cloudinary if replaced

### ❌ Delete Blog

- Only the original author can delete
- Deletes both blog entry and Cloudinary image

## 🌐 Environment Variables

Create a `.env` file in the server root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## ⚙️ Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/your-username/blogify.git
cd blogify
```

### 2. Setup Backend

```
cd server
npm install
npm run dev
```

### 3. Setup Frontend

```
cd client
npm install
npm start
```
