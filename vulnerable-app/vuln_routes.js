// vuln_routes.js
// This module registers additional intentionally vulnerable endpoints used by the PenTest MCP tools.
// It is imported from server.js and receives the Express app instance and the SQLite db.

module.exports = function register(app, db) {
  const { execSync } = require('child_process');
  const fs = require('fs');
  const path = require('path');
  const ejs = require('ejs');

  // Ensure uploads directory exists
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  // Recon: subdomains list
  app.get('/vuln/subdomains', (req, res) => {
    const subs = ['admin.internal', 'db.internal', 'api.internal'];
    res.json({ subdomains: subs });
  });

  // Port scanning via nmap (command injection)
  app.get('/vuln/port-scan', (req, res) => {
    try {
      const out = execSync('nmap -p 1-1024 127.0.0.1', { timeout: 5000 }).toString();
      res.type('text/plain').send(out);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });

  // SSRF endpoint
  app.get('/vuln/ssrf', (req, res) => {
    const target = req.query.url;
    if (!target) return res.status(400).send('url param required');
    try {
      const data = execSync(`curl -s ${target}`, { timeout: 5000 }).toString();
      res.type('text/plain').send(data);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });

  // Dirsearch / path echo (LFI)
  app.get('/vuln/dirsearch', (req, res) => {
    const p = req.query.path || '';
    res.send(`You requested path: ${p}`);
  });

  // Secret disclosure
  app.get('/vuln/secret', (req, res) => {
    const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.secret';
    const gitConfig = `[core]\n\trepositoryformatversion = 0\n\tfilemode = true\n`;
    res.json({ jwt_secret: fakeJwt, git_config: gitConfig });
  });

  // Command execution (arbitrary)
  app.post('/vuln/exec', (req, res) => {
    const cmd = req.body.cmd;
    if (!cmd) return res.status(400).send('cmd required');
    try {
      const out = execSync(cmd, { timeout: 5000 }).toString();
      res.type('text/plain').send(out);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });

  // File upload (no validation)
  app.post('/vuln/upload', (req, res) => {
    const filename = req.body.filename || `file_${Date.now()}.txt`;
    const content = req.body.content || '';
    const dest = path.join(uploadsDir, filename);
    fs.writeFileSync(dest, content);
    res.send(`Uploaded as ${filename}`);
  });

  // File download (potential LFI)
  app.get('/vuln/download', (req, res) => {
    const file = req.query.file;
    if (!file) return res.status(400).send('file param required');
    const filePath = path.join(uploadsDir, file);
    res.sendFile(filePath);
  });

  // Open redirect
  app.get('/vuln/redirect', (req, res) => {
    const url = req.query.url;
    if (url) {
      res.redirect(url);
    } else {
      res.status(400).send('url required');
    }
  });

  // Stored XSS (new comments table)
  app.post('/vuln/comment2', (req, res) => {
    const { post_id, author, content } = req.body;
    db.prepare('INSERT INTO comments2 (post_id, author, content) VALUES (?, ?, ?)').run(post_id, author, content);
    res.send('Comment added');
  });

  app.get('/vuln/comments2', (req, res) => {
    const comments = db.prepare('SELECT * FROM comments2 ORDER BY created_at DESC').all();
    res.json(comments);
  });

  // Insecure cookie
  app.get('/vuln/set-cookie', (req, res) => {
    res.cookie('insecure', 'true', { maxAge: 3600000 }); // no httpOnly, no secure, SameSite none
    res.send('Insecure cookie set');
  });

  // .env disclosure
  app.get('/vuln/.env', (req, res) => {
    const envPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
      const data = fs.readFileSync(envPath, 'utf-8');
      res.type('text/plain').send(data);
    } else {
      res.status(404).send('.env not found');
    }
  });

  // Debug info (process env)
  app.get('/vuln/debug-info', (req, res) => {
    res.json({ env: process.env });
  });

  // CSRF‑less state change
  app.post('/vuln/csrf', (req, res) => {
    const { userId, bio } = req.body;
    if (!userId) return res.status(400).send('userId required');
    db.prepare('UPDATE users SET bio = ? WHERE id = ?').run(bio, userId);
    res.send('Bio updated without CSRF protection');
  });

  // Blind SQLi
  app.get('/vuln/blind-sqli', (req, res) => {
    const id = req.query.id;
    if (!id) return res.status(400).send('id required');
    try {
      const row = db.prepare(`SELECT 1 FROM users WHERE id = ${id}`).get();
      const exists = !!row;
      res.send(`User exists: ${exists}`);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });

  // Server‑Side Template Injection
  app.get('/vuln/ssti', (req, res) => {
    const tpl = req.query.tpl;
    if (!tpl) return res.status(400).send('tpl required');
    try {
      const rendered = ejs.render(tpl, {});
      res.send(rendered);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });

  // ─── VULNERABILITY: Robots.txt Directory Disclosure ────────────────────────
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain').send(`User-agent: *
Disallow: /admin
Disallow: /vuln/.env
Disallow: /vuln/secret
Disallow: /vuln/debug-info
Disallow: /uploads/
Disallow: /git-dumper
Sitemap: http://localhost:3001/sitemap.xml`);
  });

  // ─── VULNERABILITY: Security.txt Exposure ────────────────────────
  const securityTxt = `Contact: mailto:security@vulnlab.local
Expires: 2029-06-01T00:00:00.000Z
Encryption: https://keybase.io/vulnlab/pgp_key.asc
Acknowledgements: https://localhost:3001/hall-of-fame
Policy: https://localhost:3001/security-policy`;

  app.get('/security.txt', (req, res) => {
    res.type('text/plain').send(securityTxt);
  });

  app.get('/.well-known/security.txt', (req, res) => {
    res.type('text/plain').send(securityTxt);
  });

  // ─── VULNERABILITY: GraphQL Introspection Enabled ────────────────────────
  app.use('/graphql', (req, res) => {
    const bodyStr = JSON.stringify(req.body) + JSON.stringify(req.query);
    if (bodyStr.includes('__schema') || bodyStr.includes('__type')) {
      return res.json({
        data: {
          __schema: {
            queryType: { name: "Query" },
            types: [
              { name: "Query", kind: "OBJECT" },
              { name: "User", kind: "OBJECT" },
              { name: "DbBackup", kind: "OBJECT" },
              { name: "SystemDiagnostic", kind: "OBJECT" }
            ]
          }
        }
      });
    }
    res.json({
      data: {
        message: "GraphQL service online. Send query schemas via POST."
      }
    });
  });

  // ─── VULNERABILITY: Insecure JWT Validation (none algorithm & weak key) ────
  app.get('/vuln/jwt', (req, res) => {
    const token = req.query.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) return res.status(401).json({ error: "Token required for auth diagnostics" });

    try {
      const parts = token.split('.');
      if (parts.length < 2) return res.status(400).json({ error: "Invalid JWT structure" });

      const header = JSON.parse(Buffer.from(parts[0], 'base64').toString('utf-8'));
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));

      if (header.alg === 'none') {
        return res.json({ authorized: true, authentication_bypass: "none_algorithm", payload });
      }

      // Check weak secret (mock validation)
      if (parts.length === 3) {
        return res.json({ authorized: true, verification: "weak_signature_accepted", payload });
      }

      res.status(401).json({ error: "Signature verification failed" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};
