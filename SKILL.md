---
name: clawprofile
description: "ClawProfile — Manage your OpenClaw's memory, identity & skills from your phone. Trigger when the user asks to view/edit the AI's profile, identity, memory, diary, skills, or mentions ClawProfile, or says things like 'open my profile', 'show me your files', 'let me see your dashboard', '打开档案', '看看你的资料', 'プロフィールを見せて'."
---

# ClawProfile

Manage your OpenClaw's memory, identity & skills from your phone.

---

## 0. Pre-flight: Check if already running

Before doing anything, check if ClawProfile is already running:

```bash
curl -s http://localhost:3000/api/files?tab=base > /dev/null 2>&1 && echo "RUNNING" || echo "NOT_RUNNING"
```

- If **RUNNING**: skip to **Step 3** (generate tunnel link or reuse existing one).
- If **NOT_RUNNING**: continue to Step 1.

---

## 1. Install (first time only)

Check if ClawProfile is already installed:

```bash
ls /tmp/ClawProfile/server.js 2>/dev/null && echo "INSTALLED" || echo "NOT_INSTALLED"
```

- If **INSTALLED**: skip to Step 2.
- If **NOT_INSTALLED**: run:

```bash
git clone https://github.com/superyuqiang/ClawProfile.git /tmp/ClawProfile
cd /tmp/ClawProfile
npm install
```

If already installed, pull latest updates:

```bash
cd /tmp/ClawProfile && git pull && npm install
```

---

## 2. Start the server

```bash
cd /tmp/ClawProfile && node server.js &
```

Wait 1 second, then verify:

```bash
curl -s http://localhost:3000/api/files?tab=base > /dev/null 2>&1 && echo "OK" || echo "FAILED"
```

If **FAILED**, check if port 3000 is occupied:

```bash
lsof -i :3000
```

If occupied, use a different port:

```bash
cd /tmp/ClawProfile && PORT=3001 node server.js &
```

---

## 3. Generate public link and send to human

Start Cloudflare Tunnel:

```bash
cloudflared tunnel --url http://127.0.0.1:3000 2>&1 | grep -o 'https://[^ ]*\.trycloudflare\.com'
```

If cloudflared is not installed, install it first:

```bash
# macOS
brew install cloudflared

# Linux
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o /usr/local/bin/cloudflared && chmod +x /usr/local/bin/cloudflared
```

Once you have the `https://xxx.trycloudflare.com` link, send it to your human:

> Your profile dashboard is ready! Open this link on your phone to view and edit all my files — identity, personality, memory, diary, and skills. It's a temporary link; I can regenerate it anytime you need.

---

## 4. What's inside

The dashboard has 5 tabs at the bottom:

| Tab | Files | Description |
|-----|-------|-------------|
| Base | `IDENTITY.md` + `USER.md` | AI identity + family info (rendered as a visual card) |
| Persona | `SOUL.md` + `AGENTS.md` | Personality + behavior rules |
| Diary | `memory/*.md` | Daily diary timeline, click to read full entry |
| Memory | `MEMORY.md` | Long-term memory |
| Skills | `skills/` directory | Installed skills list, click for details |

The UI auto-detects the human's browser language (English, 简体中文, 繁體中文, 日本語).

---

## 5. Requirements

- **Node.js** >= 18 (you almost certainly have this)
- **cloudflared** (Cloudflare Tunnel CLI, for public access)

---

## 6. Tips for you (the lobster)

- When your human says "open my profile", "show me your dashboard", "打开档案", or anything similar — just run through Steps 0→3
- If the server is already running, just generate a new tunnel link (or reuse the existing one)
- Tunnel links are temporary and change on restart — regenerate if the human says the link is broken
- When your human edits and saves on their phone, your local Markdown files update in real time — you'll see the changes next time you read them
- Do not expose your human's local network address or private information
- If port 3000 is busy, use `PORT=3001` (or any free port) and adjust the tunnel URL accordingly
