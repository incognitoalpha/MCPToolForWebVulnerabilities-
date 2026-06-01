# 🚀 Simple & Fast Security Tests (Localhost:3001)

Use these targeted commands for instant results. They are designed to be fast and avoid timeouts.

## 📁 1. Information Disclosure (Fastest)
- `Check http://localhost:3001 for exposed .env and backup.sql`
- `Check http://localhost:3001 for .git/config and robots.txt`
- `Fuzz directories on http://localhost:3001 with consent`

## 🎯 2. Targeted Vulnerability Checks
- **Path Traversal**: `Test http://localhost:3001/download?file=../../server.js with consent`
- **Open Redirect**: `Test http://localhost:3001/redirect?url=https://google.com with consent`
- **IDOR**: `Check http://localhost:3001/profile/1 for IDOR with consent`
- **Reflected XSS**: `Test http://localhost:3001/error?msg=<script>alert(1)</script> with consent`

## ⚡ 3. SQL Injection (The "Fast" Way)
- **Search SQLi**: `Test http://localhost:3001/search?q=' OR 1=1 -- for SQL injection with consent`
- **Login Bypass**: `Test http://localhost:3001/login with username 'admin' and password 'admin123' for SQLi`

## ☢️ 4. Advanced (One-Shot)
- **Command Injection**: `Test http://localhost:3001/tools/ping with payload '8.8.8.8; id' and consent`
- **API Audit**: `Audit http://localhost:3001/api/users for sensitive data exposure`

## 📊 5. Analysis
- `Explain the findings from http://localhost:3001 in simple terms`
- `What is the most critical vulnerability on http://localhost:3001?`
