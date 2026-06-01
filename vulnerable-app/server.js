/**
 * VulnLab - Deliberately Vulnerable Web Application
 * FOR EDUCATIONAL/TESTING PURPOSES ONLY
 */

const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { execSync } = require('child_process');

const app = express();

const PORT_CANDIDATES = [3001];

// ─── VULNERABILITY: Missing Security Headers ──────────────────────────────
// No CSP, HSTS, X-Frame-Options, or X-Content-Type-Options

// ─── VULNERABILITY: Server Banner Leak ─────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'Express 5.2.1 / Node.js 20.0.0');
  res.setHeader('Server', 'VulnLab/2.0 (Ubuntu 24.04)');
  next();
});

// ─── VULNERABILITY: CORS Wildcard & Dynamic Reflection Misconfiguration ──────
app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, TRACE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'TRACE') {
    res.type('message/http');
    return res.send(`${req.method} ${req.url} HTTP/1.1\r\nHost: ${req.headers.host}\r\n\r\n`);
  }
  next();
});

// ─── VULNERABILITY: Sensitive Site Configuration Exposures ────────────────
app.get('/.git/config', (req, res) => {
  res.type('text/plain').send(`[core]
\trepositoryformatversion = 0
\tfilemode = true
\tbare = false
\tlogallrefupdates = true
\tignorecase = true
\tprecomposeunicode = true
[remote "origin"]
\turl = https://github.com/vulnlab/vulnerable-range.git
\tfetch = +refs/heads/*:refs/remotes/origin/*`);
});

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>http://localhost:3001/</loc>
  </url>
  <url>
    <loc>http://localhost:3001/admin</loc>
  </url>
  <url>
    <loc>http://localhost:3001/vuln/.env</loc>
  </url>
  <url>
    <loc>http://localhost:3001/vuln/secret</loc>
  </url>
</urlset>`);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── Database Seeding ────────────────────────────────────────────────────────
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

  CREATE TABLE comments2 (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    author TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insert Mock Accounts
db.exec(`
  INSERT INTO users (username, password, email, bio, role, api_key) VALUES
    ('admin', 'admin123', 'admin@vulnlab.local', 'Master administrative control dashboard.', 'admin', 'sk_live_51NvYtZ8e1Lp2q0x8_secret_admin_key_99'),
    ('john', 'johnny99', 'john@gmail.com', 'Developer working on security diagnostics.', 'user', 'sk_live_38BxKm5w2Qv7n3p1_john_api_key_47'),
    ('alice', 'wonderland', 'alice@yahoo.com', 'QA Engineer auditing template scripts.', 'user', 'sk_live_12AsFp4d9Rz3x0c2_alice_api_key_11');

  INSERT INTO posts (title, content, author_id) VALUES
    ('VulnLab Range Initialized', 'Welcome to the penetration testing training field! All database schemas have loaded successfully in-memory.', 1),
    ('Reflected XSS Diagnostics', 'Our search console contains direct parameter printing without HTML escaping. Input standard alert scripting blocks into the query parameter.', 2),
    ('Command Injection Playground', 'Check out the Network ICMP Echo utility on the side dashboard to test shell parameter chaining techniques.', 3);

  INSERT INTO comments (post_id, author, content) VALUES
    (1, 'alice', 'Ready to test the stored script triggers!'),
    (1, 'john', 'Awesome! SQLite memory speed makes resets easy.');

  INSERT INTO messages (from_user, to_user, content) VALUES
    ('admin', 'john', 'Your temporary reset password is: TempPassWord!2026'),
    ('admin', 'alice', 'Local system backup configurations are stored in the server root.');
`);

// Register Extended Vulnerability Routes
const registerVulnRoutes = require('./vuln_routes');
registerVulnRoutes(app, db);

// ─── CORE ROUTES ─────────────────────────────────────────────────────────────

app.get('/', (req, res) => {
  const posts = db.prepare('SELECT posts.*, users.username FROM posts JOIN users ON posts.author_id = users.id ORDER BY created_at DESC').all();
  const user = req.cookies.user ? JSON.parse(req.cookies.user) : null;
  res.render('index', { posts, user, query: '' });
});

// SQL Injection login
app.get('/login', (req, res) => {
  const redirect = req.query.redirect || '/';
  res.render('login', { error: null, redirect });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const redirect = req.body.redirect || '/';

  // VULNERABLE: Direct SQL injection concatenation
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  
  try {
    const user = db.prepare(query).get();
    if (user) {
      res.cookie('user', JSON.stringify({ id: user.id, username: user.username, role: user.role }), {
        maxAge: 86400000
      });
      res.redirect(redirect);
    } else {
      res.render('login', { error: 'Invalid credentials. User record matching criteria not found.', redirect });
    }
  } catch (err) {
    res.render('login', { error: `Verbose SQL Compilation Error: ${err.message}`, redirect });
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
  try {
    db.prepare(`INSERT INTO users (username, password, email) VALUES ('${username}', '${password}', '${email}')`).run();
    res.redirect('/login');
  } catch (err) {
    res.render('register', { error: `Database insertion failed: ${err.message}` });
  }
});

// Reflected XSS Search
app.get('/search', (req, res) => {
  const query = req.query.q || '';
  let results = [];
  if (query) {
    try {
      // VULNERABLE: Concatenation search
      results = db.prepare(`SELECT posts.*, users.username FROM posts JOIN users ON posts.author_id = users.id WHERE title LIKE '%${query}%' OR content LIKE '%${query}%'`).all();
    } catch (err) {
      results = [];
    }
  }
  const user = req.cookies.user ? JSON.parse(req.cookies.user) : null;
  res.render('search', { query, results, user });
});

// IDOR Profile details
app.get('/profile/:id', (req, res) => {
  try {
    const profile = db.prepare('SELECT id, username, email, bio, role, api_key FROM users WHERE id = ?').get(req.params.id);
    const user = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    if (profile) {
      res.render('profile', { profile, user });
    } else {
      res.status(404).send('User database profile not found');
    }
  } catch (err) {
    res.status(500).send(`Server Database Error: ${err.message}`);
  }
});

app.post('/profile/update', (req, res) => {
  const user = req.cookies.user ? JSON.parse(req.cookies.user) : null;
  if (!user) return res.redirect('/login');
  const { bio } = req.body;
  // VULNERABLE: Stored XSS bio update
  try {
    db.prepare(`UPDATE users SET bio = '${bio}' WHERE id = ${user.id}`).run();
    res.redirect(`/profile/${user.id}`);
  } catch (err) {
    res.status(500).send(`Update Failed: ${err.message}`);
  }
});

// Single Post view & Stored XSS comments
app.get('/post/:id', (req, res) => {
  const post = db.prepare('SELECT posts.*, users.username FROM posts JOIN users ON posts.author_id = users.id WHERE posts.id = ?').get(req.params.id);
  if (!post) return res.status(404).send('Post entry not found.');
  
  const comments = db.prepare('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC').all(req.params.id);
  const user = req.cookies.user ? JSON.parse(req.cookies.user) : null;
  res.render('post', { post, comments, user });
});

app.post('/post/:id/comment', (req, res) => {
  const user = req.cookies.user ? JSON.parse(req.cookies.user) : null;
  if (!user) return res.status(401).send('Unauthorized request');
  const { content } = req.body;
  try {
    db.prepare('INSERT INTO comments (post_id, author, content) VALUES (?, ?, ?)').run(req.params.id, user.username, content);
    res.redirect(`/post/${req.params.id}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Network Command Injection utility
app.get('/tools/ping', (req, res) => {
  res.render('ping', { output: null, error: null });
});

app.post('/tools/ping', (req, res) => {
  const { host } = req.body;
  try {
    // VULNERABLE: Executing raw shell input concatenation
    const cmd = `ping -c 2 ${host}`;
    const output = execSync(cmd, { timeout: 7000 }).toString();
    res.render('ping', { output, error: null });
  } catch (err) {
    res.render('ping', { output: null, error: `Diagnostics execution failure:\n${err.message}` });
  }
});

// PHPMyAdmin Mock shell
app.get('/admin', (req, res) => {
  res.render('admin', { output: null, error: null });
});

app.post('/phpmyadmin/query', (req, res) => {
  const { sql } = req.body;
  try {
    const result = db.prepare(sql).all();
    res.render('admin', { output: JSON.stringify(result, null, 2), error: null });
  } catch (err) {
    res.render('admin', { output: null, error: `Execution Error: ${err.message}` });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
function startServer(portIndex = 0) {
  const port = PORT_CANDIDATES[portIndex];
  if (!port) {
    throw new Error('No usable port candidates were provided.');
  }

  console.log(`Starting VulnLab on http://0.0.0.0:${port} ...`);
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   ⚠️  VulnLab - Deliberately Vulnerable Web App  ⚠️      ║
║                                                          ║
║   Running at: http://localhost:${port}                     ║
║                                                          ║
║   FOR EDUCATIONAL/TESTING PURPOSES ONLY                  ║
║   DO NOT deploy to production!                           ║
║                                                          ║
║   Scan with your MCP server:                             ║
║   run_scan target=http://localhost:${port} mode=medium     ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
    `);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE' && portIndex + 1 < PORT_CANDIDATES.length) {
      console.error(`Port ${port} is busy, trying the next candidate...`);
      startServer(portIndex + 1);
      return;
    }
    console.error('VulnLab failed to start:', err);
  });
}

startServer();
