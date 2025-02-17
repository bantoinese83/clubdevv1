
# ClubDev - Code Sharing Platform

ClubDev is a modern, feature-rich code sharing platform built with Next.js, React, and TypeScript. It allows developers to share, discover, and learn from code snippets in a community-driven environment.

## Features

*   **User Authentication:** Supports Email/Password, GitHub, and Google authentication.
*   **Code Snippet Sharing:**  Share code snippets with syntax highlighting.
*   **Multiple Scripts per Snippet:**  Allow users to add multiple scripts per snippet
*   **Advanced Search:**  Robust search functionality with filters.
*   **User Profiles:** Customizable user profiles with detailed information.
*   **Gamification:**  Points, badges, and a leaderboard to encourage engagement.
*   **Social Features:** Likes, comments, and following to foster community.
*   **AI-Powered Features:** Code explanation, generation, and review using AI.
*   **Responsive Design:**  Optimized for all screen sizes.
*   **Dark Mode:**  Supports a visually appealing dark mode.

## Technologies Used

*   **Next.js 14 (App Router):**  React framework for building performant web applications.
*   **React 18:** JavaScript library for building user interfaces.
*   **TypeScript:**  Superset of JavaScript that adds static typing.
*   **Tailwind CSS:** Utility-first CSS framework for rapid UI development.
*   **Prisma (ORM):**  Next-generation ORM for Node.js and TypeScript.
*   **PostgreSQL (Database):** Powerful, open-source relational database.
*   **NextAuth.js (Authentication):**  Complete open-source authentication solution for Next.js.
*   **Vercel (Hosting and Serverless Functions):**  Platform for serverless deployments.
*   **Google AI (Gemini API for AI features):**  Leverages Gemini API for AI-powered functionalities.

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
*   PostgreSQL database

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/bantoinese83/clubdevv1.git
    cd club-dev-v1
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Set up your environment variables:

    Create a `.env.local` file in the project root:

    ```bash
    touch .env.local
    ```

4.  Add the following environment variables to the `.env.local` file:

    ```bash
    # Server-side variables
    DATABASE_URL=your_database_url_here
    GITHUB_ID=your_github_id_here
    GITHUB_SECRET=your_github_secret_here
    GOOGLE_CLIENT_ID=your_google_client_id_here
    GOOGLE_CLIENT_SECRET=your_google_client_secret_here
    NEXTAUTH_SECRET=your_nextauth_secret_here

    # Public variables
    NEXT_PUBLIC_SITE_NAME=ClubDev
    NEXT_PUBLIC_SITE_URL=https://clubdev.com
    NEXT_PUBLIC_MAX_UPLOAD_SIZE=5242880
    ```

5.  Replace the placeholder values with your actual configuration.  **Important:**  Keep your secrets secure.

6.  Create a new database in PostgreSQL and update the `DATABASE_URL` variable with your connection string.

7.  Run the Prisma migration to create the database schema:

    ```bash
    npx prisma migrate dev
    ```

## Project Structure  
* `app/`: Contains the main application code
   *   `api/`: API routes for server-side functionality
   *   `components/`: Reusable React components
   *   `hooks/`: Custom React hooks
   *   `services/`: Services for data fetching and business logic
   *   `stores/`: State management (using Zustand)
   *   `utils/`: Utility functions
   *   `(routes)/`: Next.js 13+ file-based routing
*   `lib/`: Shared libraries and configurations
*   `prisma/`: Prisma ORM schema and migrations
*   `public/`: Static assets
*   `styles/`: Global styles and Tailwind CSS configuration
*   `.env.local`: Environment variables (keep this file secret!)
*   `next.config.js`: Next.js configuration file.
*   `package.json`: Project dependencies and scripts.
*   `README.md`: This file!
*   `tsconfig.json`: TypeScript configuration.

## Deployment

ClubDev is designed to be deployed on Vercel. Follow these steps to deploy your project:

1.  Sign up for a [Vercel](https://vercel.com/) account if you haven't already.
2.  Install the Vercel CLI:

    ```bash
    npm install -g vercel
    ```

3.  Login to Vercel from the CLI:

    ```bash
    vercel login
    ```

4.  From the project root, run:

    ```bash
    vercel
    ```

5.  Follow the prompts to link your project to Vercel and deploy it.

Make sure to set up your environment variables in the Vercel dashboard, including database connection strings and API keys.

## Testing

We use Jest for unit testing and Cypress for end-to-end testing. To run the tests:

1.  Unit tests:

    ```bash
    npm run test
    ```

    or

    ```bash
    yarn test
    ```

2.  End-to-end tests:

    ```bash
    npm run test:e2e
    ```

    or

    ```bash
    yarn test:e2e
    ```

Make sure to write tests for new features and run the test suite before submitting pull requests.

## API Documentation

ClubDev provides a RESTful API for interacting with the platform programmatically. The main endpoints include:

*   `/api/snippets`: CRUD operations for code snippets
*   `/api/users`: User management and profile operations
*   `/api/auth`: Authentication endpoints (handled by NextAuth.js)
*   `/api/search`: Advanced search functionality
*   `/api/ai`: AI-powered code analysis and generation

For detailed API documentation, please refer to the [API Documentation](API_DOCS.md) file.  *(Make sure you have this file!)*

## Troubleshooting

If you encounter any issues while setting up or running the project, please check the following:

1.  Ensure all dependencies are installed correctly (run `npm install` or `yarn install`).
2.  Verify that your `.env.local` file contains all required environment variables and that they are correctly configured.
3.  Check that your database is properly set up and accessible.  Use a tool to verify the database connection.
4.  Clear your browser cache and restart the development server (usually `npm run dev` or `yarn dev`).
5.  Consult the error logs in your terminal or browser console for more details.

If problems persist, please open an issue on the [GitHub repository](https://github.com/your-username/clubdev/issues) with a detailed description of the problem and steps to reproduce it.

## Contributing

We welcome contributions from the community! To contribute to ClubDev, follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix: `git checkout -b feature/your-feature-name`
3.  Make your changes and commit them to your branch.  Follow established coding conventions.
4.  Push your changes to your fork: `git push origin feature/your-feature-name`
5.  Open a pull request against the `main` repository.
6.  Wait for your changes to be reviewed and merged.
7.  Celebrate your contribution to the project!
8.  Don't forget to add your name to the [CONTRIBUTORS.md](CONTRIBUTORS.md) file.
9.  If you have any questions or need help, feel free to reach out to the maintainers.  You can do this by commenting on an issue or sending a message to the repository owners.

## License

This project is licensed under the [MIT License](LICENSE). See the [LICENSE](LICENSE) file for more information.

## Acknowledgements

We would like to thank the following individuals and organizations for their contributions to ClubDev:

*   [Next.js](https://nextjs.org) and the Vercel team for their amazing tools and support.
*   [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework.
*   [Prisma](https://prisma.io) for the modern database toolkit.
*   [NextAuth.js](https://next-auth.js.org) for authentication and authorization.
*   [Google AI](https://ai.google) for the Gemini API and AI features.
*   Our amazing community of contributors and users who make ClubDev possible.
*   And many more!
*   And you, for checking out our project!