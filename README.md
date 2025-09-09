# Streakz - Get sh*t done. Every day.

A modern, production-ready task management app built with Next.js 14 and Supabase. Features daily streaks, Eisenhower prioritization, drag-and-drop task management, and beautiful dark/light themes.

![Streakz Screenshot](https://via.placeholder.com/800x400/22c55e/ffffff?text=Streakz+App)

## 🚀 Features

- **Daily Streaks**: Build momentum with daily task completion tracking
- **Eisenhower Matrix**: Prioritize tasks using Do Now (UI), Quick (UN), Schedule (NI), and Maybe (NN)
- **Smart Task Management**: Break down complex tasks with subtasks and progress tracking
- **Drag & Drop**: Reorder tasks with intuitive drag-and-drop functionality
- **Links & Resources**: Attach relevant URLs to your tasks
- **Dark/Light Mode**: Beautiful themes with system preference detection
- **Real-time Updates**: Optimistic UI updates for smooth user experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Secure Authentication**: Email/password auth with Supabase
- **RLS Security**: Row Level Security ensures data privacy

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Drag & Drop**: @dnd-kit
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Validation**: Zod
- **Timezone Handling**: date-fns + date-fns-tz

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- Supabase account and project
- Git

## 🚀 Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/yourusername/streakz.git
cd streakz
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
pnpm install
# or
yarn install
\`\`\`

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Go to SQL Editor and run the migration:

\`\`\`sql
-- Copy and paste the contents of /supabase/migrations/0001_init.sql
\`\`\`

### 4. Environment Variables

Create a \`.env.local\` file in the root directory:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_DEFAULT_TZ=UTC
\`\`\`

### 5. Run the Development Server

\`\`\`bash
npm run dev
# or
pnpm dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗 Database Schema

The app uses the following main tables:

- **tasks**: Main task storage with priority, daily status, and completion tracking
- **subtasks**: Breakdown of complex tasks with done/undone status
- **task_links**: URLs and resources attached to tasks
- **settings**: User preferences including timezone and sorting mode

All tables include Row Level Security (RLS) policies for data isolation.

## 🎯 Usage Guide

### Creating Tasks

1. Click "Add Task" in the header
2. Enter title, description (optional), and priority
3. Toggle "Daily Task" for recurring tasks
4. Click "Create Task"

### Managing Daily Streaks

- Complete daily tasks to build streaks
- View current and best streaks in the Streaks page
- Get celebration animations when completing daily tasks

### Task Organization

- **Drag & Drop**: Reorder tasks within priority groups
- **Priorities**: Use Eisenhower Matrix (Do Now, Quick, Schedule, Maybe)
- **Subtasks**: Break down complex tasks for better progress tracking
- **Links**: Attach relevant resources and URLs

### Settings

- **Timezone**: Set your local timezone for accurate daily resets
- **Sort Mode**: Choose between priority-then-manual or manual-only sorting
- **Theme**: Toggle between dark and light modes

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app works on any platform that supports Next.js:
- Netlify
- Railway
- Render
- Self-hosted with Docker

## 🔧 Development

### Project Structure

\`\`\`
├── app/                    # Next.js 14 app directory
│   ├── (app)/             # Protected app routes
│   │   ├── tasks/         # Main tasks page
│   │   ├── streaks/       # Streaks and history
│   │   └── api/           # API routes
│   ├── (marketing)/       # Public landing page
│   └── providers.tsx      # Auth and theme providers
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                  # Utilities and configurations
│   ├── supabase/         # Database clients
│   ├── types.ts          # TypeScript definitions
│   ├── validations.ts    # Zod schemas
│   └── ...               # Helper functions
├── store/                # Zustand state management
└── supabase/             # Database migrations
\`\`\`

### Key Commands

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Lucide](https://lucide.dev/) for the icon library
- [Tailwind CSS](https://tailwindcss.com/) for the styling system

---

**Built with ❤️ by developers, for developers who want to get sh*t done.**
