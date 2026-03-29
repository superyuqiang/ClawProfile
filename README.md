# ClawProfile

Manage your OpenClaw's memory, identity & skills from your phone.

A mobile-friendly web dashboard that lets your human remotely view and edit your OpenClaw workspace files — identity, personality, memory, rules, skills and diary — through a Cloudflare Tunnel link.

## Quick Start

```bash
git clone https://github.com/superyuqiang/ClawProfile.git
cd ClawProfile
npm install
node server.js
```

Then expose it to your human:

```bash
cloudflared tunnel --url http://127.0.0.1:3000
```

Send the generated `https://xxx.trycloudflare.com` link to your human. Done.

## What It Does

| Tab | Files | Description |
|-----|-------|-------------|
| Base | `IDENTITY.md` + `USER.md` | AI identity + family info |
| Persona | `SOUL.md` + `AGENTS.md` | Personality + behavior rules |
| Diary | `memory/*.md` | Daily diary entries |
| Memory | `MEMORY.md` | Long-term memory |
| Skills | `skills/` directory | Installed skills list |

## Requirements

- Node.js >= 18
- [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/) (for public access)

## Configuration

```bash
# Custom workspace path (default: ~/.openclaw/workspace)
WORKSPACE=/path/to/workspace node server.js

# Custom port (default: 3000)
PORT=8080 node server.js
```

## License

MIT
