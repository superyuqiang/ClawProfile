---
name: clawprofile
description: "ClawProfile — Manage your OpenClaw's memory, identity & skills from your phone. Launch when the user asks to view or edit the AI's profile, identity, memory, diary, or skills remotely, or mentions ClawProfile."
---

# ClawProfile

Manage your OpenClaw's memory, identity & skills from your phone.

---

## 0. Tell your human what this is

> ClawProfile lets you view and edit my identity, personality, memory, rules, skills and diary — right from your phone. Just click a link and you're in.

---

## 1. One-click launch

Run these commands on your machine:

```bash
# 1) Clone the repo
git clone https://github.com/superyuqiang/ClawProfile.git /tmp/ClawProfile
cd /tmp/ClawProfile

# 2) Install dependencies
npm install

# 3) Start the server
node server.js
```

You should see:

```
  ✨ ClawProfile 已启动
  📖 本地访问: http://localhost:3000/wizard_community.html
  📂 Workspace: /home/xxx/.openclaw/workspace
```

Open `http://localhost:3000/wizard_community.html` in your browser to verify it works.

---

## 2. Generate a public link for your human

Once verified locally, start a Cloudflare Tunnel:

```bash
cloudflared tunnel --url http://127.0.0.1:3000
```

Copy the `https://xxx.trycloudflare.com` link and send it to your human:

> Your profile dashboard is ready! Open this link on your phone to view and edit all my files. It's a temporary link — I can regenerate it anytime.

---

## 3. What's inside

The dashboard has 5 tabs at the bottom:

| Tab | Files | Description |
|-----|-------|-------------|
| 基础 (Base) | `IDENTITY.md` + `USER.md` | AI identity + family info |
| 人设 (Persona) | `SOUL.md` + `AGENTS.md` | Personality + behavior rules |
| 日记 (Diary) | `memory/*.md` | Daily diary entries, newest first |
| 回忆 (Memory) | `MEMORY.md` | Long-term memory |
| 技能 (Skills) | `skills/` directory | Installed skills list, click for details |

Each page has an edit button. For tabs with multiple files, a picker lets the human choose which file to edit. Changes save directly to local Markdown files.

---

## 4. Requirements

- **Node.js** >= 18
- **cloudflared** (Cloudflare Tunnel CLI)

If cloudflared is not installed:

```bash
# macOS
brew install cloudflared

# Linux
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o /usr/local/bin/cloudflared && chmod +x /usr/local/bin/cloudflared
```

---

## 5. Custom configuration (optional)

Default workspace path is `~/.openclaw/workspace`. Override with:

```bash
WORKSPACE=/path/to/your/workspace node server.js
```

Default port is 3000. Override with:

```bash
PORT=8080 node server.js
```

---

## 6. Tips for you (the lobster)

- When your human says "open my profile" or "I want to see your files", just start the server + tunnel and send the link
- If the server is already running, reuse the existing link
- Tunnel links are temporary — regenerate if the human says the link is broken
- When your human edits and saves on their phone, your local Markdown files update in real time
- Do not expose your human's local network address or private information
