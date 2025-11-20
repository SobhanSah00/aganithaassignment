# TinyLink - URL Shortener

A modern URL shortening service built with Next.js, Prisma, and PostgreSQL. Create short, memorable links with comprehensive analytics and a clean, minimal interface.

## Features

- Create short links with auto-generated or custom codes
- Real-time click tracking and analytics
- Responsive dashboard with link management
- Individual link statistics pages with charts
- Clean, modern UI inspired by Vercel's design language
- RESTful API endpoints for automation
- Health check endpoint for monitoring

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Icons**: Lucide React
- **Deployment**: Vercel

## Project Structure
```
tinylink/
├── app/
│   ├── api/
│   │   └── links/
│   │       ├── route.ts                 # POST, GET all links
│   │       └── [code]/
│   │           └── route.ts             # GET, DELETE single link
│   ├── code/
│   │   └── [code]/
│   │       └── page.tsx                 # Stats page for individual link
│   ├── [code]/
│   │   └── route.ts                     # Redirect handler
│   ├── healthz/
│   │   └── route.ts                     # Health check endpoint
│   ├── layout.tsx                       # Root layout
│   ├── page.tsx                         # Dashboard page
│   └── globals.css                      # Global styles
├── components/
│   ├── ui/
│   │   ├── button.tsx                   # Button component
│   │   ├── card.tsx                     # Card component
│   │   ├── input.tsx                    # Input component
│   │   └── toast.tsx                    # Toast notification
│   ├── create-link-form.tsx             # Form to create new links
│   ├── link-card.tsx                    # Individual link card in list
│   ├── links-list.tsx                   # List of all links
│   └── link-stats.tsx                   # Statistics display component
├── lib/
│   ├── generateCode.ts                        # Prisma client instance
│   ├── validations.ts                   # Zod validation schemas
│   ├── utils.ts                         # Utility functions
│   └── formatDate.ts                    # Date formatting helper
├── prisma/
│   └── schema.prisma                    # Database schema
├── database/
│     └── db.ts                          # Prisma client instance
├── .env                                 # Environment variables (local)
├── .env.example                         # Example environment variables
├── .gitignore                           # Git ignore file
├── next.config.js                       # Next.js configuration
├── package.json                         # Dependencies
├── tailwind.config.ts                   # Tailwind configuration
├── tsconfig.json                        # TypeScript configuration
└── README.md                            # This file
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database (or Neon account)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SobhanSah00/aganithaassignment.git
cd tinylink
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your database URL:
```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Health Check
```
GET /healthz
```

Returns server health status.

Response:
```json
{
  "ok": true,
  "version": "1.0",
  "timestamp": "2025-01-20T12:00:00.000Z",
  "uptime": 12345.67
}
```

### Create Link
```
POST /api/links
Content-Type: application/json

{
  "targetUrl": "https://example.com/very-long-url",
  "code": "custom" // optional
}
```

Response (201):
```json
{
  "code": "abc123",
  "targetUrl": "https://example.com/very-long-url",
  "clicks": 0,
  "createdAt": "2025-01-20T12:00:00.000Z",
  "lastClickedAt": null
}
```

Error (409) - Code already exists:
```json
{
  "error": "Code already exists"
}
```

### Get All Links
```
GET /api/links
```

Response (200):
```json
[
  {
    "code": "abc123",
    "targetUrl": "https://example.com",
    "clicks": 42,
    "createdAt": "2025-01-20T12:00:00.000Z",
    "lastClickedAt": "2025-01-20T13:00:00.000Z"
  }
]
```

### Get Single Link
```
GET /api/links/:code
```

Response (200):
```json
{
  "code": "abc123",
  "targetUrl": "https://example.com",
  "clicks": 42,
  "createdAt": "2025-01-20T12:00:00.000Z",
  "lastClickedAt": "2025-01-20T13:00:00.000Z"
}
```

Error (404):
```json
{
  "error": "Link not found"
}
```

### Delete Link
```
DELETE /api/links/:code
```

Response (200):
```json
{
  "success": true,
  "deleted": {
    "code": "abc123",
    "targetUrl": "https://example.com",
    "clicks": 42,
    "createdAt": "2025-01-20T12:00:00.000Z",
    "lastClickedAt": "2025-01-20T13:00:00.000Z"
  }
}
```

### Redirect
```
GET /:code
```

Performs a 302 redirect to the target URL and increments the click count.

Response: 302 redirect to target URL
Error: 404 if code not found

## Database Schema
```prisma
model Link {
  code          String       @id @db.VarChar(8)
  targetUrl     String       @map("target_url") @db.VarChar(1024)
  clicks        Int          @default(0)
  createdAt     DateTime     @default(now()) @map("created_at")
  lastClickedAt DateTime?    @map("last_clicked_at")
  clickEvents   ClickEvent[]

  @@index([createdAt(sort: Desc)])
}

model ClickEvent {
  id        Int      @id @default(autoincrement())
  linkCode  String
  createdAt DateTime @default(now())

  link Link @relation(fields: [linkCode], references: [code], onDelete: Cascade)

  @@index([linkCode])
}
```

## Validation Rules

### URL
- Must be a valid URL format
- Required field

### Code
- 6-8 alphanumeric characters (A-Za-z0-9)
- Optional (auto-generated if not provided)
- Must be globally unique
- No special characters or spaces

## Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Import project in Vercel dashboard

3. Set environment variables:
```
DATABASE_URL=your_neon_database_url
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
```

4. Deploy

### Deploy to Other Platforms

The application can be deployed to any platform that supports Next.js:
- Railway
- Render
- AWS Amplify
- DigitalOcean App Platform

Make sure to set the required environment variables on your chosen platform.

## Testing

### Manual Testing

1. Start the development server:
```bash
npm run dev
```

2. Test the endpoints using curl or Postman:
```bash
# Health check
curl http://localhost:3000/healthz

# Create a link
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"targetUrl":"https://github.com"}'

# Get all links
curl http://localhost:3000/api/links

# Test redirect
curl -L http://localhost:3000/yourcode
```

### Automated Testing

Create a test file `test-api.ts` and run:
```bash
npx tsx test-api.ts
```

## Environment Variables

Required environment variables:
```env
# Database connection string
DATABASE_URL="postgresql://..."

# Base URL for the application
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## Development

### Running Prisma Studio

To view and edit database records:
```bash
npx prisma studio
```

### Database Migrations

After changing the schema:
```bash
npx prisma generate
npx prisma db push
```

### Build for Production
```bash
npm run build
npm start
```

## Code Style

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting (optional)
- Consistent naming conventions
- Component-based architecture

## Performance Considerations

- Server-side rendering for initial page load
- Async click tracking (non-blocking redirects)
- Database indexes on frequently queried fields
- Optimistic UI updates for better UX
- Route revalidation for data freshness

## Security

- URL validation before storage
- Code format validation
- SQL injection protection via Prisma
- CORS headers configured
- Environment variable protection


## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Acknowledgments

- Design inspired by Vercel
- Built with Next.js and Prisma
- Icons by Lucide

## Support

For issues and questions, please open an issue on GitHub.

## Roadmap

Future enhancements:
- QR code generation for links
- Custom domains support
- Link expiration dates
- Password-protected links
- Advanced analytics (geolocation, devices, referrers)
- Bulk link creation
- API rate limiting
- Link categories/tags

