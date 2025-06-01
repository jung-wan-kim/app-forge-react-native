-- 개발용 임시 RLS 정책
-- 주의: 프로덕션에서는 반드시 제거하고 적절한 정책으로 교체하세요!

-- 모든 테이블에 대해 임시로 모든 작업 허용
DROP POLICY IF EXISTS "Users can view all profiles" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Anyone can view public videos" ON videos;
DROP POLICY IF EXISTS "Users can create own videos" ON videos;
DROP POLICY IF EXISTS "Users can update own videos" ON videos;
DROP POLICY IF EXISTS "Users can delete own videos" ON videos;

-- 개발용 정책
CREATE POLICY "Dev: Allow all operations on users" ON users
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Dev: Allow all operations on videos" ON videos
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Dev: Allow all operations on likes" ON likes
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Dev: Allow all operations on comments" ON comments
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Dev: Allow all operations on follows" ON follows
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Dev: Allow all operations on notifications" ON notifications
  FOR ALL USING (true) WITH CHECK (true);

-- 테스트용 사용자 데이터 삽입
INSERT INTO users (id, username, email, full_name, bio)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'test-user-1', 'test1@example.com', '테스트 사용자 1', '테스트 계정입니다')
ON CONFLICT (id) DO UPDATE
SET 
  username = EXCLUDED.username,
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  bio = EXCLUDED.bio;

-- videos 테이블에 누락된 컬럼 추가
ALTER TABLE videos 
ADD COLUMN IF NOT EXISTS allow_comments BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS allow_duet BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS hashtags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS width INTEGER DEFAULT 720,
ADD COLUMN IF NOT EXISTS height INTEGER DEFAULT 1280;

-- users 테이블에 누락된 컬럼 추가
ALTER TABLE users
ADD COLUMN IF NOT EXISTS profile_picture TEXT,
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS website TEXT;