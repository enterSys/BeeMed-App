-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types/enums
CREATE TYPE user_role AS ENUM ('STUDENT', 'INSTRUCTOR', 'ADMIN');
CREATE TYPE rarity AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY');
CREATE TYPE achievement_category AS ENUM ('LEARNING', 'SOCIAL', 'CONSISTENCY', 'MASTERY', 'SPECIAL');
CREATE TYPE loot_item_type AS ENUM ('AVATAR_FRAME', 'BADGE', 'TITLE', 'XP_BOOST', 'THEME');
CREATE TYPE course_category AS ENUM ('ANATOMY', 'PHYSIOLOGY', 'PATHOLOGY', 'PHARMACOLOGY', 'CLINICAL_SKILLS', 'MEDICAL_ETHICS');
CREATE TYPE difficulty AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');
CREATE TYPE question_type AS ENUM ('MULTIPLE_CHOICE', 'TRUE_FALSE', 'OPEN_ENDED', 'CASE_STUDY');
CREATE TYPE group_role AS ENUM ('OWNER', 'MODERATOR', 'MEMBER');
CREATE TYPE mentorship_status AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED');
CREATE TYPE notification_type AS ENUM ('ACHIEVEMENT_UNLOCKED', 'LEVEL_UP', 'QUIZ_COMPLETED', 'COURSE_COMPLETED', 'STUDY_GROUP_INVITE', 'MENTORSHIP_REQUEST', 'SYSTEM');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    role user_role DEFAULT 'STUDENT' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- User profiles
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    medical_school TEXT,
    year_of_study INTEGER,
    specialization TEXT,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- User progress (gamification)
CREATE TABLE public.user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    total_xp INTEGER DEFAULT 0 NOT NULL,
    current_level INTEGER DEFAULT 1 NOT NULL,
    current_level_xp INTEGER DEFAULT 0 NOT NULL,
    next_level_xp INTEGER DEFAULT 100 NOT NULL,
    daily_streak INTEGER DEFAULT 0 NOT NULL,
    longest_streak INTEGER DEFAULT 0 NOT NULL,
    last_activity_date TIMESTAMPTZ,
    weekly_xp INTEGER DEFAULT 0 NOT NULL,
    monthly_xp INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Achievements
CREATE TABLE public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category achievement_category NOT NULL,
    rarity rarity NOT NULL,
    icon_url TEXT,
    xp_reward INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- User achievements (junction table)
CREATE TABLE public.user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id),
    unlocked_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, achievement_id)
);

-- Loot items
CREATE TABLE public.loot_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    type loot_item_type NOT NULL,
    rarity rarity NOT NULL,
    image_url TEXT,
    effect JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- User inventory
CREATE TABLE public.inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    loot_item_id UUID NOT NULL REFERENCES public.loot_items(id),
    quantity INTEGER DEFAULT 1 NOT NULL,
    equipped BOOLEAN DEFAULT FALSE NOT NULL,
    obtained_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, loot_item_id)
);

-- Courses
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category course_category NOT NULL,
    difficulty difficulty NOT NULL,
    image_url TEXT,
    total_xp INTEGER DEFAULT 0 NOT NULL,
    duration INTEGER NOT NULL, -- in hours
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Course prerequisites (self-referencing many-to-many)
CREATE TABLE public.course_prerequisites (
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    prerequisite_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    PRIMARY KEY (course_id, prerequisite_id)
);

-- Modules
CREATE TABLE public.modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    order_num INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Lessons
CREATE TABLE public.lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    order_num INTEGER NOT NULL,
    title TEXT NOT NULL,
    content JSONB NOT NULL, -- Rich content
    video_url TEXT,
    duration INTEGER NOT NULL, -- in minutes
    xp_reward INTEGER DEFAULT 50 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Quizzes
CREATE TABLE public.quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    time_limit INTEGER, -- in minutes
    xp_reward INTEGER DEFAULT 100 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Questions
CREATE TABLE public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    order_num INTEGER NOT NULL,
    type question_type NOT NULL,
    text TEXT NOT NULL,
    explanation TEXT,
    image_url TEXT,
    points INTEGER DEFAULT 10 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Answers
CREATE TABLE public.answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enrollments
CREATE TABLE public.enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0 NOT NULL, -- percentage
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, course_id)
);

-- Lesson progress
CREATE TABLE public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id),
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    xp_earned INTEGER DEFAULT 0 NOT NULL,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(enrollment_id, lesson_id)
);

-- Quiz attempts
CREATE TABLE public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id),
    score INTEGER NOT NULL,
    total_points INTEGER NOT NULL,
    xp_earned INTEGER DEFAULT 0 NOT NULL,
    time_spent INTEGER, -- in seconds
    passed BOOLEAN DEFAULT FALSE NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- User answers
CREATE TABLE public.user_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id),
    answer_id UUID REFERENCES public.answers(id),
    text_answer TEXT, -- For open-ended questions
    is_correct BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(attempt_id, question_id)
);

-- Study groups
CREATE TABLE public.study_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    is_private BOOLEAN DEFAULT FALSE NOT NULL,
    max_members INTEGER DEFAULT 20 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Study group members
CREATE TABLE public.study_group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
    role group_role DEFAULT 'MEMBER' NOT NULL,
    joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, group_id)
);

-- Forum categories
CREATE TABLE public.forum_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    slug TEXT UNIQUE NOT NULL,
    order_num INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Forum posts
CREATE TABLE public.forum_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.forum_categories(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE NOT NULL,
    view_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Forum comments
CREATE TABLE public.forum_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    upvotes INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Mentorships
CREATE TABLE public.mentorships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    mentee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status mentorship_status DEFAULT 'PENDING' NOT NULL,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(mentor_id, mentee_id)
);

-- Notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_modules_course_order ON public.modules(course_id, order_num);
CREATE INDEX idx_lessons_module_order ON public.lessons(module_id, order_num);
CREATE INDEX idx_questions_quiz_order ON public.questions(quiz_id, order_num);
CREATE INDEX idx_quiz_attempts_user_quiz ON public.quiz_attempts(user_id, quiz_id);
CREATE INDEX idx_notifications_user_read ON public.notifications(user_id, read);
CREATE INDEX idx_forum_posts_category ON public.forum_posts(category_id);

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loot_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_prerequisites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER set_timestamp_users BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_user_profiles BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_user_progress BEFORE UPDATE ON public.user_progress FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_achievements BEFORE UPDATE ON public.achievements FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_loot_items BEFORE UPDATE ON public.loot_items FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_courses BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_modules BEFORE UPDATE ON public.modules FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_lessons BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_quizzes BEFORE UPDATE ON public.quizzes FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_questions BEFORE UPDATE ON public.questions FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_answers BEFORE UPDATE ON public.answers FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_enrollments BEFORE UPDATE ON public.enrollments FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_lesson_progress BEFORE UPDATE ON public.lesson_progress FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_study_groups BEFORE UPDATE ON public.study_groups FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_forum_categories BEFORE UPDATE ON public.forum_categories FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_forum_posts BEFORE UPDATE ON public.forum_posts FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_forum_comments BEFORE UPDATE ON public.forum_comments FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();