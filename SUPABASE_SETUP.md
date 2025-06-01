# Supabase Storage 설정 가이드

TikTok 클론 앱의 비디오 업로드를 위한 Supabase Storage 설정 방법입니다.

## 1. Storage 버킷 생성

1. Supabase 대시보드에서 Storage 섹션으로 이동
2. "Create a new bucket" 클릭
3. 버킷 이름: `videos`
4. Public bucket 옵션 활성화
5. "Create bucket" 클릭

## 2. 버킷 정책 설정

### 읽기 권한 (SELECT)
모든 사용자가 비디오를 볼 수 있도록 설정:

```sql
-- 모든 사용자에게 읽기 권한 부여
CREATE POLICY "Public videos are viewable by everyone" ON storage.objects
FOR SELECT USING (bucket_id = 'videos');
```

### 업로드 권한 (INSERT)
인증된 사용자만 업로드 가능:

```sql
-- 인증된 사용자만 업로드 가능
CREATE POLICY "Authenticated users can upload videos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'videos' 
  AND auth.role() = 'authenticated'
);
```

### 수정 권한 (UPDATE)
자신의 비디오만 수정 가능:

```sql
-- 자신의 비디오만 수정 가능
CREATE POLICY "Users can update own videos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'videos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### 삭제 권한 (DELETE)
자신의 비디오만 삭제 가능:

```sql
-- 자신의 비디오만 삭제 가능
CREATE POLICY "Users can delete own videos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'videos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## 3. 파일 크기 및 타입 제한

Storage 설정에서:
- 최대 파일 크기: 100MB (필요에 따라 조정)
- 허용된 MIME 타입: `video/*`

## 4. 테스트용 정책 (개발 중)

개발 중에는 모든 권한을 허용하는 정책 사용:

```sql
-- 개발용: 모든 작업 허용
CREATE POLICY "Allow all operations during development" ON storage.objects
FOR ALL USING (bucket_id = 'videos');
```

⚠️ **주의**: 프로덕션 환경에서는 반드시 적절한 권한 정책으로 변경하세요.

## 5. 현재 앱 설정

- 버킷 이름: `videos`
- 파일 경로: `videos/{userId}_{timestamp}_{random}.{ext}`
- 썸네일 경로: `thumbnails/{userId}_{timestamp}_thumb.{ext}`

## 6. 설정 확인

1. Supabase 대시보드 > Storage > videos 버킷
2. Configuration 탭에서 정책 확인
3. 테스트 업로드로 작동 확인

## 문제 해결

### "new row violates row-level security policy" 에러
- RLS 정책이 제대로 설정되지 않음
- 위의 정책들을 순서대로 적용

### "Bucket not found" 에러
- `videos` 버킷이 생성되지 않음
- 버킷 생성 단계 확인

### 업로드는 되는데 URL 접근 불가
- Public bucket 설정 확인
- SELECT 정책 확인