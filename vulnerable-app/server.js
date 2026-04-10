/**
 * VulnLab - Deliberately Vulnerable Web Application
 * FOR EDUCATIONAL/TESTING PURPOSES ONLY
 * 
 * Vulnerabilities included:
 * - SQL Injection (login, search, user profiles)
 * - Reflected XSS (search, error pages)
 * - Stored XSS (comments, profile bio)
 * - CSRF (no tokens on any forms)
 * - Missing security headers (all of them)
 * - Server banner disclosure
 * - Exposed sensitive files (.env, .git, robots.txt, backup.sql)
 * - Directory traversal (file download)
 * - Open redirect (login redirect)
 * - CORS misconfiguration (wildcard origin)
 * - Insecure cookies (no httpOnly, no secure)
 * - IDOR (user profiles accessible by incrementing ID)
 * - Command injection (ping utility)
 * - Insecure deserialization (JSON user prefs)
 */

const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { execSync } = require('child_process');

const app = express();
const PORT = 3001;

// ─── VULNERABILITY: No security headers at all ───────────────────────────────
// Deliberately NOT setting: CSP, X-Frame-Options, X-Content-Type-Options, etc.

// ─── VULNERABILITY: Server banner disclosure ──────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'Express 4.18.2 / Node.js 20.0.0');
  res.setHeader('Server', 'VulnLab/1.0 (Ubuntu 22.04)');
  next();
});

// ─── VULNERABILITY: CORS misconfiguration ─────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/static', express.static(path.join(__dirname, 'public')));

// ─── Database Setup ───────────────────────────────────────────────────────────
const db = new Database(':memory:');

db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    email TEXT,
    bio TEXT DEFAULT '',
    role TEXT DEFAULT 'user',
    api_key TEXT
  );

  CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    author_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    author TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_user TEXT,
    to_user TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed data
db.exec(`
  INSERT INTO users (username, password, email, bio, role, api_key) VALUES
    ('admin', 'admin123', 'admin@vulnlab.local', 'System administrator', 'admin', 'sk-admin-key-12345-secret'),
    ('john', 'password', 'john@vulnlab.local', 'Regular user', 'user', 'sk-john-key-67890'),
    ('alice', 'alice2024', 'alice@vulnlab.local', 'Developer', 'user', 'sk-alice-key-11111'),
    ('testuser', 'test', 'test@vulnlab.local', 'Test account', 'user', 'sk-test-key-99999');

  INSERT INTO posts (title, content, author_id) VALUES
    ('Welcome to VulnLab', 'This is a deliberately vulnerable application for security testing.', 1),
    ('Company Secrets', 'Internal API endpoint: https://internal-api.company.com/v2/data?key=PROD_KEY_abc123', 1),
    ('Server Migration Notes', 'SSH credentials: deploy@192.168.1.50 password: d3pl0y_2024!', 1);

  INSERT INTO comments (post_id, author, content) VALUES
    (1, 'john', 'Great platform for learning!'),
    (1, 'alice', 'Looking forward to testing this.');

  INSERT INTO messages (from_user, to_user, content) VALUES
    ('admin', 'john', 'Your temporary password is: password'),
    ('admin', 'alice', 'Database backup password: backup_p@ss_2024');
`);


// ═══════════════════════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Home ─────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  const posts = db.prepare('SELECT posts.*, users.username FROM posts JOIN users ON posts.author_id = users.id ORDER BY created_at DESC').all();
  const user = req.cookies.user ? JSON.parse(req.cookies.user) : null;
  res.render('index', { posts, user, query: '' });
});


// ─── VULNERABILITY: SQL Injection in Login ────────────────────────────────────
app.get('/login', (req, res) => {
  const redirect = req.query.redirect || '/';
  res.render('login', { error: null, redirect });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const redirect = req.body.redirect || '/';

  // VULNERABLE: String concatenation in SQL query
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  
  try {
    const user = db.prepare(query).get();
    
    if (user) {
      // VULNERABILITY: Insecure cookie - no httpOnly, no secure, no sameSite
      res.cookie('user', JSON.stringify({ id: user.id, username: user.username, role: user.role }), {
        maxAge: 86400000
        // Missing: httpOnly: true, secure: true, sameSite: 'strict'
      });
      // VULNERABILITY: Open redirect
      res.redirect(redirect);
    } else {
      res.render('login', { error: 'Invalid credentials', redirect });
    }
  } catch (err) {
    // VULNERABILITY: Verbose error messages exposing SQL details
    res.render('login', { error: `Database error: ${err.message}`, redirect });
  }
});

app.get('/logout', (req, res) => {
  res.clearCookie('user');
  res.redirect('/');
});

app.get('/register', (req, res) => {
  res.render('register', { error: null });
});

app.post('/register', (req, res) => {
  const { username, password, email } = req.body;
  // VULNERABILITY: No input validation, no password requirements
  try {
    db.prepare(`INSERT INTO users (username, password, email) VALUES ('${username}', '${password}', '${email}')`).run();
    res.redirect('/login');
  } catch (err) {
    res.render('register', { error: `Registration failed: ${err.message}` });
  }
});


// ─── VULNERABILITY: Reflected XSS in Search ──────────────────────────────────
app.get('/search', (req, res) => {
  const query = req.query.q || '';
  
  // VULNERABLE: Query reflected directly in SQL AND in HTML
  let results = [];
  if (query) {
    try {
      results = db.prepare(`SELECT posts.*, users.username FROM posts JOIN users ON posts.author_id = users.id WHERE title LIKE '%${query}%' OR content LIKE '%${query}%'`).all();
    } catch (err) {
      results = [];
    }
  }
  
  const user = req.cookies.user ? JSON.parse(req.cookies.user) : null;
  res.render('search', { query, results, user });
});


// ─── VULNERABILITY: IDOR - User profiles by sequential ID ────────────────────
app.get('/profile/:id', (req, res) => {
  // VULNERABLE: No authorization check - any user can view any profile
  const profile = db.prepare('SELECT id, username, email, bio, role, api_key FROM users WHERE id = ?').get(req.params.id);
  const user = req.cookies.user ? JSON.parse(req.cookies.user) : null;
  
  if (profile) {
    // VULNERABILITY: Exposing API keys and emails
    res.render('profile', { profile, user });
  } else {
    res.status(404).send('User not found');
  }
});

// ─── VULNERABILITY: Stored XSS in profile bio ────────────────────────────────
app.post('/profile/update', (req, res) => {
  const user = req.cookies.user ? JSON.parse(req.cookies.user) : null;
  if (!user) return res.redirect('/login');
  
  const { bio } = req.body;
  // VULNERABLE: No sanitization of bio field
  db.prepare('UPDATE users SET bio = ? WHERE id = ?').run(bio, user.id);
  res.redirect(`/profile/${user.id}`);
});


// ─── VULNERABILITY: Stored XSS in Comments (no CSRF token) ───────────────────
app.get('/post/:id', (req, res) => {
  const post = db.prepare('SELECT posts.*, users.username FROM posts JOIN users ON posts.author_id = users.id WHERE posts.id = ?').get(req.params.id);
  const comments = db.prepare('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC').all(req.params.id);
  const user = req.cookies.user ? JSON.parse(req.cookies.user) : null;
  
  if (post) {
    res.render('post', { post, comments, user });
  } else {
    res.status(404).send('Post not found');
  }
});

app.post('/post/:id/comment', (req, res) => {
  const { author, content } = req.body;
  // VULNERABLE: Stored XSS - comment content not sanitized
  // VULNERABLE: No CSRF protection
  db.prepare('INSERT INTO comments (post_id, author, content) VALUES (?, ?, ?)').run(req.params.id, author, content);
  res.redirect(`/post/${req.params.id}`);
});


// ─── VULNERABILITY: Command Injection ─────────────────────────────────────────
app.get('/tools/ping', (req, res) => {
  const user = req.cookies.user ? JSON.parse(req.cookies.user) : null;
  res.render('ping', { user, output: null, host: '' });
});

app.post('/tools/ping', (req, res) => {
  const { host } = req.body;
  const user = req.cookies.user ? JSON.parse(req.cookies.user) : null;
  
  // VULNERABLE: Command injection via unsanitized input
  try {
    const output = execSync(`ping -c 2 ${host}`, { timeout: 5000 }).toString();
    res.render('ping', { user, output, host });
  } catch (err) {
    res.render('ping', { user, output: `Error: ${err.message}`, host });
  }
});


// ─── VULNERABILITY: Directory Traversal ───────────────────────────────────────
app.get('/download', (req, res) => {
  const file = req.query.file;
  if (!file) return res.status(400).send('No file specified');
  
  // VULNERABLE: Path traversal - no sanitization
  const filePath = path.join(__dirname, 'uploads', file);
  res.sendFile(filePath);
});


// ─── VULNERABILITY: Exposed sensitive files ───────────────────────────────────
app.get('/.env', (req, res) => {
  res.type('text/plain').send(`
# VulnLab Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=r00t_p@ssw0rd_2024
DB_NAME=vulnlab_production
SECRET_KEY=super_secret_jwt_key_dont_share
STRIPE_SECRET=sk_live_abc123def456
AWS_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
SMTP_PASSWORD=email_pass_2024
ADMIN_API_KEY=sk-admin-master-key-production
`);
});

app.get('/.git/config', (req, res) => {
  res.type('text/plain').send(`
[core]
  repositoryformatversion = 0
  filemode = true
  bare = false
[remote "origin"]
  url = https://github.com/internal-company/vulnlab-production.git
  fetch = +refs/heads/*:refs/remotes/origin/*
[user]
  email = devops@company.com
  name = DevOps Team
`);
});

app.get('/.git/HEAD', (req, res) => {
  res.type('text/plain').send('ref: refs/heads/main\n');
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`
User-agent: *
Disallow: /admin
Disallow: /api/internal
Disallow: /backup
Disallow: /debug
Allow: /

# Internal endpoints (DO NOT CRAWL):
# /admin/users - User management
# /api/internal/keys - API key rotation
# /debug/sql - SQL console
`);
});

app.get('/backup.sql', (req, res) => {
  res.type('text/plain').send(`
-- VulnLab Database Backup
-- Generated: 2024-01-15
-- Server: production-db-01

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50),
  password VARCHAR(255), -- NOTE: Passwords stored in plaintext!
  email VARCHAR(100)
);

INSERT INTO users VALUES (1, 'admin', 'admin123', 'admin@company.com');
INSERT INTO users VALUES (2, 'deploy', 'ssh_d3ploy!', 'deploy@company.com');
INSERT INTO users VALUES (3, 'dbadmin', 'mysql_r00t', 'dba@company.com');
`);
});

app.get('/.well-known/security.txt', (req, res) => {
  res.type('text/plain').send(`
Contact: security@vulnlab.local
Expires: 2024-12-31
Preferred-Languages: en
`);
});


// ─── VULNERABILITY: Admin panel with no auth check ────────────────────────────
app.get('/admin', (req, res) => {
  // VULNERABLE: No authentication required to access admin
  const users = db.prepare('SELECT id, username, email, role, api_key FROM users').all();
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  const postCount = db.prepare('SELECT COUNT(*) as count FROM posts').get().count;
  const commentCount = db.prepare('SELECT COUNT(*) as count FROM comments').get().count;
  
  const user = req.cookies.user ? JSON.parse(req.cookies.user) : null;
  res.render('admin', { 
    users, 
    user,
    stats: {
      users: userCount,
      posts: postCount,
      comments: commentCount
    }
  });
});


// ─── VULNERABILITY: API with no rate limiting, exposes sensitive data ─────────
app.get('/api/users', (req, res) => {
  // VULNERABLE: Exposes all user data including passwords
  const users = db.prepare('SELECT * FROM users').all();
  res.json({ users });
});

app.get('/api/users/:id', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.get('/api/messages', (req, res) => {
  // VULNERABLE: No auth required to read all messages
  const messages = db.prepare('SELECT * FROM messages').all();
  res.json({ messages });
});


// ─── VULNERABILITY: Debug endpoint ───────────────────────────────────────────
app.get('/debug', (req, res) => {
  res.json({
    environment: 'production',
    node_version: process.version,
    platform: process.platform,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    env_vars: {
      DB_HOST: 'localhost',
      SECRET_KEY: 'super_secret_jwt_key_dont_share',
      NODE_ENV: 'production'
    }
  });
});


// ─── VULNERABILITY: Reflected error page ──────────────────────────────────────
app.get('/error', (req, res) => {
  const msg = req.query.msg || 'Unknown error';
  // VULNERABLE: Error message reflected without encoding
  res.send(`
    <html>
    <head><title>Error - VulnLab</title></head>
    <body style="font-family: Arial; padding: 50px;">
      <h1>Error</h1>
      <p>An error occurred: ${msg}</p>
      <a href="/">Go back home</a>
    </body>
    </html>
  `);
});


// ─── VULNERABILITY: Open redirect ─────────────────────────────────────────────
app.get('/redirect', (req, res) => {
  const url = req.query.url;
  if (url) {
    // VULNERABLE: No validation of redirect target
    res.redirect(url);
  } else {
    res.status(400).send('No URL provided');
  }
});


// ─── VULNERABILITY: phpMyAdmin-like panel ─────────────────────────────────────
app.get('/phpmyadmin', (req, res) => {
  res.send(`
    <html>
    <head><title>phpMyAdmin - VulnLab</title></head>
    <body style="font-family: monospace; padding: 20px; background: #2b2b2b; color: #eee;">
      <h2>phpMyAdmin 4.9.0.1</h2>
      <p>Server: localhost:3306</p>
      <p>Database: vulnlab_production</p>
      <p><strong>Warning:</strong> This panel is exposed to the internet!</p>
      <form method="POST" action="/phpmyadmin/query">
        <textarea name="sql" rows="5" cols="60" style="background:#1a1a1a;color:#0f0;font-family:monospace;"></textarea><br>
        <button type="submit" style="margin-top:10px;padding:8px 16px;">Execute SQL</button>
      </form>
    </body>
    </html>
  `);
});

app.post('/phpmyadmin/query', (req, res) => {
  const { sql } = req.body;
  // VULNERABLE: Direct SQL execution from web
  try {
    const result = db.prepare(sql).all();
    res.json({ success: true, result });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});


// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   ⚠️  VulnLab - Deliberately Vulnerable Web App  ⚠️      ║
║                                                          ║
║   Running at: http://localhost:${PORT}                     ║
║                                                          ║
║   FOR EDUCATIONAL/TESTING PURPOSES ONLY                  ║
║   DO NOT deploy to production!                           ║
║                                                          ║
║   Scan with your MCP server:                             ║
║   run_scan target=http://localhost:${PORT} mode=medium     ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
  `);
});
