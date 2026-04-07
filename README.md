# 텍스트 축약 도구

## 로컬 실행

```bash
npm install
cp .env.local.example .env.local
# .env.local 열어서 ANTHROPIC_API_KEY 입력
npm run dev
```

브라우저에서 http://localhost:3000 접속

---

## Vercel 배포

### 1. GitHub에 올리기

```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/유저명/text-compressor.git
git push -u origin main
```

### 2. Vercel 연결

1. https://vercel.com 접속 → New Project
2. GitHub 레포 선택
3. **Environment Variables** 항목에서:
   - Key: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-...` (실제 API 키)
4. Deploy 클릭

### 3. 완료

배포 후 `https://프로젝트명.vercel.app` 으로 접속 가능

---

## 파일 구조

```
pages/
  index.js       ← 프론트엔드 UI
  api/
    compress.js  ← 서버사이드 API 라우트 (API 키 여기서만 사용)
styles/
  globals.css
```

API 키는 `pages/api/compress.js`에서만 서버사이드로 사용됨 → 브라우저에 노출되지 않음
