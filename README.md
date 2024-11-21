# Next.js Todo Web Application

A modern todo application built with Next.js, MongoDB, and Tailwind CSS.

## Features

- Create, Read, Update, and Delete todos
- Responsive design with Tailwind CSS
- Real-time updates
- MongoDB database integration
- Server-side rendering with Next.js
- Modern UI with Headless UI and Heroicons

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **UI Components**: Headless UI, Heroicons
- **Charts**: Chart.js with react-chartjs-2
- **Type Safety**: TypeScript
- **Form Validation**: Zod

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/hunght37/Next-todo-web.git
cd Next-todo-web
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add:
```
DATABASE_URL="your_mongodb_connection_string"
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
Next-todo-web/
├── src/
│   ├── app/             # Next.js app directory
│   │   ├── api/        # API routes
│   │   └── ...         # Page components
│   ├── lib/            # Utility functions and database connection
│   └── models/         # Mongoose models
├── public/             # Static files
└── ...                 # Config files
```

## API Routes

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `GET /api/todos/[id]` - Get a specific todo
- `PUT /api/todos/[id]` - Update a todo
- `DELETE /api/todos/[id]` - Delete a todo

## Environment Variables

- `DATABASE_URL`: MongoDB connection string

## Deployment

The application can be deployed on Vercel:

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add environment variables in Vercel project settings
4. Deploy!

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for the deployment platform
- MongoDB team for the database
- All contributors and users of this project
