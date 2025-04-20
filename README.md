# Cubite

A modern, multi-tenant learning management system built with Next.js.

## System Requirements

- **Docker** and **Docker Compose** (latest version recommended)
- **Node.js** v18 or higher
- **npm** v9 or higher
- **Git**

## Installation

1. Clone the repository:
   ```bash
   git clone [your-repo-url]
   cd cubite
   ```

2. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your configuration values. The main variables to configure are:
   - `MYSQL_ROOT_PASSWORD`
   - `MYSQL_PASSWORD`
   - Cloudinary credentials (for image uploads)
   - Resend API key (for emails)

## Running the Application

### Development Mode

```bash
# Start the development environment with Docker
docker-compose -f docker-compose.dev.yml up -d

# Or run without Docker (requires MySQL running separately)
npm install
npm run dev
```

### Production Mode

```bash
# Build and start the production environment
docker-compose up -d
```

## First-Time Setup

After running the application, follow these steps to set up your first site:

1. Navigate to `http://localhost:3000` in your browser
2. Create an admin user by signing up
3. Once logged in, go to the dashboard
4. Create a new site using the "Create Site" button
5. In the site settings, assign a subdomain to your site
6. Access your new site at `http://your-subdomain.localhost:3000`

## Important Notes

- The first user registered automatically becomes an admin
- Each site must have a unique subdomain
- Changes to a site may take a few moments to propagate

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Stripe Testing

For testing payments, use these Stripe test card numbers:

### Test Card Numbers
- **Successful Payment**: 4242 4242 4242 4242
- **Payment Fails**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0000 0000 3220
- **Insufficient Funds**: 4000 0000 0000 9995

### Other Test Card Details
- **Expiry Date**: Any future date (MM/YY)
- **CVC**: Any 3 digits
- **ZIP**: Any 5 digits

For webhook testing, run `stripe listen --forward-to localhost:3000/api/webhooks/stripe` in the terminal. Make sure to have the Stripe CLI installed and you are logged in by running `stripe login` in the terminal.