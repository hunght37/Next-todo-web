# Next.js Todo Web Application

A modern, feature-rich todo application built with Next.js 14, featuring a beautiful UI, real-time updates, and powerful task management capabilities.

![Todo App Screenshot](public/screenshot.png)

## Features

### Task Management
- Create, edit, and delete tasks
- Mark tasks as important or completed
- Search tasks with real-time filtering
- Responsive design for all devices
- View tasks by different categories (All, Today, Important, Completed)

### User Interface
- Modern and clean design with Tailwind CSS
- Statistics dashboard with Chart.js visualizations
- Smooth animations and transitions
- Fast and responsive interactions
- Intuitive task management interface

### Technical Features
- Server-side rendering with Next.js 14
- API Routes for backend functionality
- MongoDB integration with Mongoose
- Real-time updates and optimistic UI
- Client-side search with debouncing
- Data visualization with Chart.js
- Mobile-first responsive design

## Tech Stack

### Frontend
- Framework: Next.js 14 with React 18
- Styling: Tailwind CSS
- Icons: Lucide Icons
- Charts: Chart.js with react-chartjs-2
- State Management: React Hooks
- Data Fetching: Next.js API Routes

### Backend
- API: Next.js API Routes
- Database: MongoDB with Mongoose
- Validation: Zod
- Type Safety: TypeScript

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account

### Installation

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
Create a `.env.local` file in the root directory:
```env
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
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   ├── page.tsx        # Home page
│   │   ├── statistics/     # Statistics page
│   │   └── layout.tsx      # Root layout
│   ├── components/         # React components
│   │   ├── TodoList.tsx    # Todo list component
│   │   ├── TodoForm.tsx    # Todo form component
│   │   └── ...            # Other components
│   ├── lib/               # Utility functions
│   │   └── db.ts          # Database connection
│   ├── types/             # TypeScript types
│   └── models/            # Mongoose models
├── public/                # Static files
└── ...                    # Config files
```

## API Routes

### Todos
- `GET /api/todos` - Get all todos with optional filtering
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/[id]` - Update a todo
- `DELETE /api/todos/[id]` - Delete a todo

### Statistics
- `GET /api/statistics` - Get todo statistics

## Configuration

### Environment Variables
- `DATABASE_URL`: MongoDB connection string
- `NEXT_PUBLIC_API_URL`: API base URL (optional, defaults to local)

### Development Tools
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type checking

## Deployment

The application is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add environment variables in Vercel project settings
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Hung Ho**
- GitHub: [@hunght37](https://github.com/hunght37)

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting
- MongoDB for the database
- All contributors and users of this project
