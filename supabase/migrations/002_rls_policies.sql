-- Row Level Security Policies for BeeMed

-- Users table policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- User profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User progress policies
CREATE POLICY "Users can view their own progress" ON public.user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can update user progress" ON public.user_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Achievements policies (public read)
CREATE POLICY "Achievements are viewable by everyone" ON public.achievements
    FOR SELECT USING (true);

-- User achievements policies
CREATE POLICY "Users can view all user achievements" ON public.user_achievements
    FOR SELECT USING (true);

CREATE POLICY "System can insert user achievements" ON public.user_achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Loot items policies (public read)
CREATE POLICY "Loot items are viewable by everyone" ON public.loot_items
    FOR SELECT USING (true);

-- Inventory items policies
CREATE POLICY "Users can view their own inventory" ON public.inventory_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own inventory" ON public.inventory_items
    FOR UPDATE USING (auth.uid() = user_id);

-- Courses policies (public read)
CREATE POLICY "Courses are viewable by everyone" ON public.courses
    FOR SELECT USING (true);

-- Course prerequisites policies (public read)
CREATE POLICY "Course prerequisites are viewable by everyone" ON public.course_prerequisites
    FOR SELECT USING (true);

-- Modules policies (public read)
CREATE POLICY "Modules are viewable by everyone" ON public.modules
    FOR SELECT USING (true);

-- Lessons policies
CREATE POLICY "Lessons are viewable by enrolled users" ON public.lessons
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.enrollments e
            JOIN public.modules m ON m.course_id = e.course_id
            WHERE e.user_id = auth.uid() 
            AND m.id = lessons.module_id
        )
    );

-- Quizzes policies
CREATE POLICY "Quizzes are viewable by enrolled users" ON public.quizzes
    FOR SELECT USING (
        lesson_id IS NULL OR
        EXISTS (
            SELECT 1 FROM public.enrollments e
            JOIN public.modules m ON m.course_id = e.course_id
            JOIN public.lessons l ON l.module_id = m.id
            WHERE e.user_id = auth.uid() 
            AND l.id = quizzes.lesson_id
        )
    );

-- Questions policies
CREATE POLICY "Questions are viewable during quiz attempts" ON public.questions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.quiz_attempts qa
            WHERE qa.user_id = auth.uid() 
            AND qa.quiz_id = questions.quiz_id
        )
    );

-- Answers policies
CREATE POLICY "Answers are viewable during quiz attempts" ON public.answers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.quiz_attempts qa
            JOIN public.questions q ON q.quiz_id = qa.quiz_id
            WHERE qa.user_id = auth.uid() 
            AND q.id = answers.question_id
        )
    );

-- Enrollments policies
CREATE POLICY "Users can view their own enrollments" ON public.enrollments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll themselves" ON public.enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Lesson progress policies
CREATE POLICY "Users can view their own lesson progress" ON public.lesson_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.enrollments e
            WHERE e.id = lesson_progress.enrollment_id
            AND e.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own lesson progress" ON public.lesson_progress
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.enrollments e
            WHERE e.id = lesson_progress.enrollment_id
            AND e.user_id = auth.uid()
        )
    );

-- Quiz attempts policies
CREATE POLICY "Users can view their own quiz attempts" ON public.quiz_attempts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quiz attempts" ON public.quiz_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User answers policies
CREATE POLICY "Users can view their own answers" ON public.user_answers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.quiz_attempts qa
            WHERE qa.id = user_answers.attempt_id
            AND qa.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own answers" ON public.user_answers
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.quiz_attempts qa
            WHERE qa.id = user_answers.attempt_id
            AND qa.user_id = auth.uid()
        )
    );

-- Study groups policies
CREATE POLICY "Public study groups are viewable by everyone" ON public.study_groups
    FOR SELECT USING (
        NOT is_private OR
        EXISTS (
            SELECT 1 FROM public.study_group_members sgm
            WHERE sgm.group_id = study_groups.id
            AND sgm.user_id = auth.uid()
        )
    );

CREATE POLICY "Group owners can update their groups" ON public.study_groups
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.study_group_members sgm
            WHERE sgm.group_id = study_groups.id
            AND sgm.user_id = auth.uid()
            AND sgm.role = 'OWNER'
        )
    );

-- Study group members policies
CREATE POLICY "Group members are viewable by group members" ON public.study_group_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.study_group_members sgm
            WHERE sgm.group_id = study_group_members.group_id
            AND sgm.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can join groups" ON public.study_group_members
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Forum categories policies (public read)
CREATE POLICY "Forum categories are viewable by everyone" ON public.forum_categories
    FOR SELECT USING (true);

-- Forum posts policies
CREATE POLICY "Forum posts are viewable by everyone" ON public.forum_posts
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON public.forum_posts
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts" ON public.forum_posts
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts" ON public.forum_posts
    FOR DELETE USING (auth.uid() = author_id);

-- Forum comments policies
CREATE POLICY "Forum comments are viewable by everyone" ON public.forum_comments
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON public.forum_comments
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own comments" ON public.forum_comments
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own comments" ON public.forum_comments
    FOR DELETE USING (auth.uid() = author_id);

-- Mentorships policies
CREATE POLICY "Users can view their own mentorships" ON public.mentorships
    FOR SELECT USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

CREATE POLICY "Users can create mentorship requests" ON public.mentorships
    FOR INSERT WITH CHECK (auth.uid() = mentee_id);

CREATE POLICY "Mentors can update mentorship status" ON public.mentorships
    FOR UPDATE USING (auth.uid() = mentor_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Admin policies (for users with ADMIN or INSTRUCTOR role)
CREATE POLICY "Admins can manage courses" ON public.courses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()
            AND role IN ('ADMIN', 'INSTRUCTOR')
        )
    );

CREATE POLICY "Admins can manage modules" ON public.modules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()
            AND role IN ('ADMIN', 'INSTRUCTOR')
        )
    );

CREATE POLICY "Admins can manage lessons" ON public.lessons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()
            AND role IN ('ADMIN', 'INSTRUCTOR')
        )
    );

CREATE POLICY "Admins can manage quizzes" ON public.quizzes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()
            AND role IN ('ADMIN', 'INSTRUCTOR')
        )
    );

CREATE POLICY "Admins can manage questions" ON public.questions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()
            AND role IN ('ADMIN', 'INSTRUCTOR')
        )
    );

CREATE POLICY "Admins can manage answers" ON public.answers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()
            AND role IN ('ADMIN', 'INSTRUCTOR')
        )
    );

CREATE POLICY "Admins can manage achievements" ON public.achievements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()
            AND role = 'ADMIN'
        )
    );

CREATE POLICY "Admins can manage loot items" ON public.loot_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()
            AND role = 'ADMIN'
        )
    );