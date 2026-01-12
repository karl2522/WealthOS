# WealthOS

WealthOS is a comprehensive personal finance and wealth management platform designed to give you a clear, real-time overview of your financial health. It provides tools for tracking assets, analyzing portfolio performance, and managing holdings across various asset classes.

## Features

- **Dashboard Overview**: A centralized hub displaying your total net worth, daily changes, and key metrics.
- **Portfolio Management**: detailed breakdown of your assets including stocks, crypto, cash, and more.
- **Asset Allocation**: Visual representation of your portfolio diversity to help you maintain a balanced investment strategy.
- **Performance Tracking**: Interactive charts to monitor your portfolio's growth over time.
- **Holdings Management**: easy-to-use interface for adding, updating, and viewing individual asset holdings.
- **Secure Authentication**: Robust user authentication to ensure your financial data remains private and secure.

## Tech Stack

### Frontend
-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Language**: TypeScript
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
-   **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
-   **Charts**: [Recharts](https://recharts.org/)
-   **State Management**: React Context & Hooks
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)

### Backend
-   **Framework**: [NestJS 11](https://nestjs.com/)
-   **Language**: TypeScript
-   **Database ORM**: [Prisma](https://www.prisma.io/)
-   **Caching**: Redis (via Docker)
-   **Authentication**: Passport.js & JWT

## Getting Started

Follow these instructions to get a copy of the project running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v20 or later recommended)
-   [Docker](https://www.docker.com/) & Docker Compose (for Redis)
