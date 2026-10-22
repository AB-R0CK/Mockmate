# MockMate AI Career Coach

AI-Powered Resume Optimization & ATS Scoring Platform

## Features

- **AI Resume Analysis**: Advanced keyword extraction and ATS compatibility scoring
- **Smart Job Matching**: Get personalized job recommendations based on your profile
- **Skill Gap Analysis**: Identify weaknesses and improve your competitive edge
- **Resume Builder**: Create professional resumes with modern templates
- **User Authentication**: Secure sign-up and sign-in with Supabase

## Tech Stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Authentication & Database)

## Setup Instructions

### Prerequisites

- Node.js & npm installed
- A Supabase project (free at https://supabase.com)

### Step 1: Clone the repository

```sh
git clone https://github.com/AB-R0CK/Mockmate.git
cd Mockmate
```

### Step 2: Install dependencies

```sh
npm install
```

### Step 3: Set up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Once created, go to Project Settings > API
3. Copy your Project URL and anon/public API key
4. Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
```

### Step 4: Run database migrations

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL commands from `supabase/migrations/20250813034102-.sql`
4. Then run the SQL commands from `supabase/migrations/20250813034121-.sql`

### Step 5: Start the development server

```sh
npm run dev
```

Open http://localhost:8080 in your browser

## Database Schema

The application uses the following tables:

- **profiles**: User profile information with ATS scores
- **resumes**: User-created resumes
- **job_recommendations**: AI-generated job recommendations

## Deployment

To deploy this project:

1. Build the project: `npm run build`
2. Deploy to Vercel, Netlify, or any static hosting service
3. Set environment variables in your deployment platform

## License

MIT
