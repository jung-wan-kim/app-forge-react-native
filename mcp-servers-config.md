# MCP 서버 설정 정보

현재 연결된 MCP 서버들을 `claude mcp add-json` 명령어로 추가하는 방법입니다.

## 연결된 MCP 서버 목록

- **context7**: ✅ connected
- **mcp-taskmanager**: ✅ connected  
- **puppeteer-browser**: ✅ connected
- **server-sequential-thinking**: ✅ connected
- **terminal**: ✅ connected

## claude mcp add-json 명령어로 추가하기

### 1. Terminal MCP Server
```bash
claude mcp add-json '{
  "terminal": {
    "command": "npx",
    "args": ["iterm_mcp_server"]
  }
}'
```

### 2. Context7 MCP Server
```bash
claude mcp add-json '{
  "context7": {
    "command": "npx",
    "args": ["-y", "@upstash/context7-mcp@latest"]
  }
}'
```

### 3. Puppeteer Browser MCP Server
```bash
claude mcp add-json '{
  "puppeteer-browser": {
    "command": "npx",
    "args": ["-y", "puppeteer-mcp-server"]
  }
}'
```

### 4. Sequential Thinking MCP Server
```bash
claude mcp add-json '{
  "server-sequential-thinking": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
  }
}'
```

### 5. Task Manager MCP Server
```bash
claude mcp add-json '{
  "mcp-taskmanager": {
    "command": "npx",
    "args": [
      "-y",
      "@smithery/cli@latest",
      "run",
      "@kazuph/mcp-taskmanager",
      "--key",
      "3e7735c8-b9d5-45ec-a2da-4d5ca70dfc17"
    ]
  }
}'
```

## 모든 서버를 한 번에 추가하기

전체 설정을 한 번에 추가하려면:

```bash
claude mcp add-json '{
  "terminal": {
    "command": "npx",
    "args": ["iterm_mcp_server"]
  },
  "context7": {
    "command": "npx",
    "args": ["-y", "@upstash/context7-mcp@latest"]
  },
  "puppeteer-browser": {
    "command": "npx",
    "args": ["-y", "puppeteer-mcp-server"]
  },
  "server-sequential-thinking": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
  },
  "mcp-taskmanager": {
    "command": "npx",
    "args": [
      "-y",
      "@smithery/cli@latest",
      "run",
      "@kazuph/mcp-taskmanager",
      "--key",
      "3e7735c8-b9d5-45ec-a2da-4d5ca70dfc17"
    ]
  }
}'
```

## 주의사항

- **mcp-taskmanager**의 키(`3e7735c8-b9d5-45ec-a2da-4d5ca70dfc17`)는 개인 키이므로 공유 시 주의하세요.
- 설정 파일에는 연결되지 않은 다른 서버들(Figma 관련)도 있지만, 현재 연결된 서버들만 포함했습니다.