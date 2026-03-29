const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// OpenClaw workspace 目录，可通过环境变量配置
const WORKSPACE = process.env.WORKSPACE || path.join(require('os').homedir(), '.openclaw', 'workspace');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // 托管前端 HTML

// 根路径重定向到主页面
app.get('/', (req, res) => {
  res.redirect('/wizard_community.html');
});

// Tab 与文件的映射
const TAB_FILES = {
  base: ['IDENTITY.md', 'USER.md'],
  persona: ['SOUL.md', 'AGENTS.md'],
  memory: ['MEMORY.md'],
  skills: ['TOOLS.md'],
  diary: [] // 日记单独处理
};

// GET /api/files?tab=base — 读取某个 tab 对应的所有文件
app.get('/api/files', (req, res) => {
  const tab = req.query.tab;
  const files = TAB_FILES[tab];
  if (!files) {
    return res.status(400).json({ error: 'invalid tab' });
  }

  const result = files.map(filename => {
    const filepath = path.join(WORKSPACE, filename);
    let content = '';
    try {
      content = fs.readFileSync(filepath, 'utf-8');
    } catch (e) {
      content = `_${filename} 尚未创建_`;
    }
    return { filename, content };
  });

  res.json(result);
});

// GET /api/diaries — 读取日记列表（memory/ 目录）
app.get('/api/diaries', (req, res) => {
  const memoryDir = path.join(WORKSPACE, 'memory');
  try {
    const files = fs.readdirSync(memoryDir)
      .filter(f => f.endsWith('.md'))
      .sort((a, b) => b.localeCompare(a)); // 按日期倒序

    const result = files.map(filename => {
      const content = fs.readFileSync(path.join(memoryDir, filename), 'utf-8');
      return { filename, content };
    });
    res.json(result);
  } catch (e) {
    res.json([]);
  }
});

// POST /api/save — 保存单个文件 { filename, content }
app.post('/api/save', (req, res) => {
  const { filename, content } = req.body;
  if (!filename || content === undefined) {
    return res.status(400).json({ error: 'missing filename or content' });
  }

  // 安全检查：防止路径穿越
  const resolved = path.resolve(WORKSPACE, filename);
  if (!resolved.startsWith(path.resolve(WORKSPACE))) {
    return res.status(403).json({ error: 'forbidden path' });
  }

  try {
    fs.writeFileSync(resolved, content, 'utf-8');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/save-diary — 保存日记 { filename, content }
app.post('/api/save-diary', (req, res) => {
  const { filename, content } = req.body;
  if (!filename || content === undefined) {
    return res.status(400).json({ error: 'missing filename or content' });
  }

  const resolved = path.resolve(WORKSPACE, 'memory', filename);
  if (!resolved.startsWith(path.resolve(WORKSPACE, 'memory'))) {
    return res.status(403).json({ error: 'forbidden path' });
  }

  try {
    fs.mkdirSync(path.join(WORKSPACE, 'memory'), { recursive: true });
    fs.writeFileSync(resolved, content, 'utf-8');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/skills — 读取 skills 列表（支持符号链接）
app.get('/api/skills', (req, res) => {
  const skillsDir = path.join(WORKSPACE, 'skills');
  try {
    const entries = fs.readdirSync(skillsDir);
    const skills = entries
      .filter(name => {
        if (name.startsWith('.')) return false;
        const full = path.join(skillsDir, name);
        try {
          return fs.statSync(full).isDirectory();
        } catch (_) { return false; }
      })
      .map(name => {
        const dir = path.join(skillsDir, name);
        let meta = { id: name, name };
        // 读 clawhub.json
        try {
          const raw = fs.readFileSync(path.join(dir, 'clawhub.json'), 'utf-8');
          meta = { ...meta, ...JSON.parse(raw) };
        } catch (_) {}
        return meta;
      });
    res.json(skills);
  } catch (e) {
    res.json([]);
  }
});

// GET /api/skills/:id — 读取单个 skill 的 SKILL.md
app.get('/api/skills/:id', (req, res) => {
  const skillDir = path.join(WORKSPACE, 'skills', req.params.id);
  const resolved = path.resolve(skillDir);
  if (!resolved.startsWith(path.resolve(WORKSPACE))) {
    return res.status(403).json({ error: 'forbidden' });
  }
  try {
    const content = fs.readFileSync(path.join(skillDir, 'SKILL.md'), 'utf-8');
    res.json({ filename: 'SKILL.md', content });
  } catch (e) {
    res.status(404).json({ error: 'SKILL.md not found' });
  }
});

app.listen(PORT, () => {
  console.log('');
  console.log('  ✨ ClawProfile 已启动');
  console.log(`  📖 本地访问: http://localhost:${PORT}/wizard_community.html`);
  console.log(`  📂 Workspace: ${WORKSPACE}`);
  console.log('');
});
