"# Tadkedar Restaurant

A modern full-stack restaurant management and ordering platform built with Next.js and Express.js.

## 🌟 Features

### Customer Features
- **Browse Menu** - Explore restaurant menu with categories and descriptions
- **Place Orders** - Easy-to-use ordering system with real-time order tracking
- **Make Reservations** - Book tables for dining experiences
- **View Gallery** - Showcase of restaurant ambiance and dishes
- **Reviews & Ratings** - Customer feedback and ratings
- **Contact & Support** - Easy communication channels

### Admin Features
- **Admin Dashboard** - Comprehensive management interface
- **Menu Management** - Add, edit, and organize menu items and categories
- **Order Management** - View, update, and manage customer orders
- **Reservation Management** - Handle table bookings and availability
- **Order History** - Track all past orders and analytics
- **User Authentication** - Secure admin login system

## 🏗️ Tech Stack

### Frontend
- **Framework** - Next.js 14+
- **Language** - TypeScript
- **Styling** - Tailwind CSS
- **Build** - Next.js with ESLint configuration
- **Deployment** - Netlify

### Backend
- **Framework** - Express.js
- **Language** - TypeScript
- **Database** - MongoDB
- **Deployment** - Render
- **Authentication** - Custom auth middleware

## 📁 Project Structure

```
tadkedar-restaurant/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js app directory
│   │   │   ├── admin/       # Admin dashboard pages
│   │   │   ├── menu/        # Menu page
│   │   │   ├── order/       # Ordering pages
│   │   │   ├── reservations/# Reservation pages
│   │   │   └── ...other pages
│   │   ├── components/      # Reusable React components
│   │   └── lib/             # Utility functions and configs
│   └── public/              # Static assets
│
├── backend/                  # Express.js backend application
│   ├── src/
│   │   ├── app.ts           # Express app setup
│   │   ├── server.ts        # Server entry point
│   │   ├── models/          # MongoDB schemas
│   │   │   ├── Admin.ts
│   │   │   ├── Category.ts
│   │   │   ├── MenuItem.ts
│   │   │   ├── Order.ts
│   │   │   └── Reservation.ts
│   │   ├── routes/          # API endpoints
│   │   └── utils/           # Helper functions
│   ├── public/uploads/      # File uploads storage
│   └── render.yaml          # Render deployment config
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- MongoDB instance (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Tadkedar-Restaurant
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

## ⚙️ Configuration

### Backend Environment Variables
Create a `.env` file in the `backend/` directory:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration (for notifications)
EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password

# JWT/Auth Configuration
JWT_SECRET=your_secret_key

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables
Create a `.env.local` file in the `frontend/` directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# Other frontend configs as needed
```

## 📦 Running the Project

### Development Mode

1. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

2. **Start Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

### Production Build

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm start
```

## 🔑 Key API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth` | POST | Admin authentication |
| `/api/menu` | GET/POST | Menu management |
| `/api/orders` | GET/POST | Order management |
| `/api/reservations` | GET/POST | Reservation management |
| `/api/categories` | GET/POST | Category management |
| `/api/upload` | POST | File uploads |

## 🗄️ Database Models

- **Admin** - Admin user credentials and information
- **Category** - Menu categories
- **MenuItem** - Individual menu items
- **Order** - Customer orders
- **Reservation** - Table reservations

## 🚀 Deployment

### Frontend - Netlify
- Connected to `frontend/` directory
- Configured in `netlify.toml`
- Auto-deploys from main branch

### Backend - Render
- Configured in `render.yaml`
- Deploy from backend service
- MongoDB connection via Render environment

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Contributing

Contributions are welcome! Please follow these steps:

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📧 Support

For support or questions, please contact the development team or open an issue on the repository.

---

**Happy Ordering! 🍜**" 
