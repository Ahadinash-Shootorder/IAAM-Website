# SS Instruments - Setup Guide

## Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up PostgreSQL Database

Create a PostgreSQL database:

```sql
CREATE DATABASE ssinstruments;
```

### 3. Configure Environment Variables

Update `.env.local` with your database credentials:

```
DATABASE_URL="postgresql://user:password@localhost:5432/ssinstruments"
JWT_SECRET="your-secret-key-change-this-in-production"
```

### 4. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This will:
- Create all database tables
- Generate Prisma client

### 5. Seed Sample Data (Optional)

```bash
npx prisma db seed
```

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Admin Access

Default admin credentials (after creating user):
- Email: admin@example.com
- Password: (set during user creation)

Admin URLs:
- Dashboard: `/admin/dashboard`
- Manage Users: `/admin/users`
- Manage Products: `/admin/products`
- Settings: `/admin/settings`

## Database Schema

### Users Table
- `id`: String (UUID)
- `email`: String (unique)
- `password`: String (hashed)
- `name`: String
- `role`: String (user/admin)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Products Table
- `id`: String (UUID)
- `title`: String
- `category`: String
- `description`: String
- `price`: Float
- `sku`: String (optional)
- `stock`: Integer (optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Categories Table
- `id`: String (UUID)
- `name`: String (unique)
- `slug`: String (unique)
- `description`: String (optional)
- `icon`: String (optional)
- `productCount`: Integer
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Blogs Table
- `id`: String (UUID)
- `title`: String
- `slug`: String (unique)
- `content`: String
- `excerpt`: String (optional)
- `author`: String
- `category`: String
- `image`: String (optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Contacts Table
- `id`: String (UUID)
- `name`: String
- `email`: String
- `phone`: String (optional)
- `subject`: String
- `message`: String
- `createdAt`: DateTime

### Settings Table
- `id`: String (UUID)
- `key`: String (unique)
- `value`: String

## Features

### Frontend
- Product listing and details
- Category browsing
- Blog with individual posts
- About Us page
- Contact form
- Responsive design with Tailwind CSS

### Admin Panel
- **Dashboard**: View stats, recent users, and products
- **User Management**: Create, edit, delete users with roles (user/admin)
- **Product Management**: CRUD operations for products with category selector
- **Settings**: Configure site name, URL, contact info, business settings (tax, shipping)

### Backend
- PostgreSQL database with Prisma ORM
- JWT authentication
- Password hashing with bcryptjs
- RESTful API endpoints
- User role-based access control

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `GET /api/products/[id]` - Get product by ID
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/[slug]` - Get category by slug
- `GET /api/categories/[slug]/products` - Get products in category

### Settings
- `GET /api/settings` - Get all settings
- `POST /api/settings` - Save setting

## Development Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint

# Prisma commands
npx prisma studio # Open Prisma Studio GUI
npx prisma migrate dev --name <migration-name>  # Create migration
npx prisma db push # Push schema to database
```

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check DATABASE_URL in .env.local
- Ensure database exists

### Migration Errors
- Delete `prisma/migrations` folder and run `npx prisma migrate dev --name init` again
- Or use `npx prisma db push` to sync schema

### Port Already in Use
```bash
npx kill-port 3000  # Free port 3000
npm run dev
```

## Production Deployment

1. Update `.env.local` with production values
2. Run `npm run build`
3. Set up PostgreSQL on production server
4. Run migrations: `npx prisma migrate deploy`
5. Start server: `npm run start`

## Security Notes

- Change JWT_SECRET in production
- Use environment variables for all secrets
- Implement CORS if needed
- Add rate limiting for APIs
- Use HTTPS in production
- Validate all user inputs
- Keep dependencies updated
