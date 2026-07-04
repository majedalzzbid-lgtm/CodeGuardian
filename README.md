# 🛡️ CodeGuardian

CodeGuardian is a fully operational, Full-Stack AI-powered Static Application Security Testing (SAST) tool. It connects directly to public GitHub repositories, fetches source code, and dynamically scans for vulnerabilities based on OWASP security standards.

## ✨ Key Features
- **Real GitHub API Integration:** Dynamically parses and fetches raw repository code files.
- **AI-Powered SAST Analysis:** Automatically detects vulnerabilities (e.g., SQL Injection, XSS) using integrated AI logic.
- **Full-Stack Cloud Backend:** Wired with a secure **Supabase** database to log analyses, store code diffs, and track the `FixesQueue`.
- **Interactive UX/UI:** Real-time health scoring dashboard with interactive original vs. secure code comparisons.

## 🛠️ Tech Stack
- **Frontend:** React, Tailwind CSS, TypeScript
- **Backend & Database:** Supabase & PostgreSQL
- **AI Engine:** Lovable AI Core
