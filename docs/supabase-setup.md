# Supabase Setup Guide for BeeMed

## Overview

BeeMed uses Supabase for:
- PostgreSQL database
- Authentication (email/password, OAuth)
- Real-time subscriptions
- Row Level Security
- File storage

## Setup Steps

### 1. Create a New Supabase Project

Since you're using a Vercel-managed organization, you'll need to:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project's integrations
3. Add Supabase integration
4. Create a new Supabase project named "BeeMed"

### 2. Configure Environment Variables

Once your project is created, add these to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]
```

### 3. Run Database Migrations

The migrations are already prepared in the `supabase/migrations/` directory:

1. **Initial Schema** (`001_initial_schema.sql`): Creates all tables, types, and indexes
2. **RLS Policies** (`002_rls_policies.sql`): Sets up Row Level Security
3. **Auth Triggers** (`003_auth_triggers.sql`): Handles user creation/deletion

To apply them:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run each migration file in order

### 4. Configure Authentication

In your Supabase dashboard:

1. Go to Authentication → Providers
2. Enable Email/Password authentication
3. (Optional) Enable OAuth providers:
   - GitHub
   - Google
   - Discord (popular with students)

### 5. Configure Email Templates

Go to Authentication → Email Templates and customize:
- Confirmation email
- Password reset email
- Magic link email

### 6. Storage Buckets

Create these storage buckets:

1. `avatars` - User profile pictures
2. `course-images` - Course thumbnails
3. `lesson-content` - Videos and images for lessons
4. `achievements` - Achievement icons

Set appropriate policies for each bucket.

## Database Schema Overview

### Core Tables

- **users** - Extends Supabase auth.users
- **user_profiles** - Additional user information
- **user_progress** - XP, levels, streaks

### Gamification

- **achievements** - Achievement definitions
- **user_achievements** - Unlocked achievements
- **loot_items** - Cosmetic rewards
- **inventory_items** - User's loot collection

### Learning Content

- **courses** - Medical courses
- **modules** - Course sections
- **lessons** - Individual lessons
- **quizzes** - Assessments
- **questions/answers** - Quiz content

### Social Features

- **study_groups** - Collaborative groups
- **forum_posts/comments** - Discussion forums
- **mentorships** - Mentor/mentee relationships

## Row Level Security

All tables have RLS enabled with appropriate policies:

- Students can only view/edit their own data
- Course content is viewable by enrolled students
- Instructors can manage course content
- Admins have full access

## Next Steps

After setup:

1. Test authentication flow
2. Seed initial data (courses, achievements)
3. Configure Supabase Realtime for live features
4. Set up Edge Functions for complex logic

## Troubleshooting

### Common Issues

1. **RLS blocking access**: Check auth.uid() is set correctly
2. **Migration errors**: Ensure UUID extension is enabled
3. **Auth not working**: Verify environment variables are set

### Useful Queries

Check if user exists:
```sql
SELECT * FROM auth.users WHERE email = 'test@example.com';
```

View user's full profile:
```sql
SELECT u.*, up.*, prog.*
FROM public.users u
LEFT JOIN public.user_profiles up ON u.id = up.user_id
LEFT JOIN public.user_progress prog ON u.id = prog.user_id
WHERE u.email = 'test@example.com';
```