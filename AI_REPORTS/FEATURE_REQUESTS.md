# Feature Requests & Roadmap

This document outlines potential future features for the Quran Mailer application, separated by Admin and Client sides, and sorted by their impact/priority and difficulty.

---

## 🛡️ Admin Features

### 1. Email Templates & Rich Text Editor
- **Impact / Priority:** High
- **Difficulty:** Medium
- **Description:** Integrate a WYSIWYG editor (like TipTap or React Quill) into the Broadcast and Targeted Messaging pages. This will allow admins to format text, add links, insert images, and create beautiful HTML emails without writing code.

### 2. Advanced Admin Authentication & Roles
- **Impact / Priority:** High
- **Difficulty:** Medium
- **Description:** Replace the current Basic Auth with a robust authentication system (e.g., NextAuth.js). Introduce role-based access control (RBAC) so you can have "Super Admins" and "Content Editors" with restricted permissions.

### 3. Email Queueing & Rate Limiting System
- **Impact / Priority:** High
- **Difficulty:** Hard
- **Description:** As the subscriber base grows, sending thousands of emails synchronously will hit SMTP rate limits or cause timeouts. Implement a background job queue (e.g., Redis + BullMQ) to process emails asynchronously in batches.

### 4. Scheduled Broadcasts Management
- **Impact / Priority:** High
- **Difficulty:** Hard
- **Description:** Add a scheduling UI that allows admins to compose a message and set a specific future date and time for it to be sent automatically.

### 5. CSV Bulk Import
- **Impact / Priority:** Medium
- **Difficulty:** Easy
- **Description:** While JSON import/export is supported, adding the ability to import subscribers via a `.csv` file will make it easier to migrate users from other platforms or spreadsheets.

### 6. Email Analytics Dashboard
- **Impact / Priority:** Medium
- **Difficulty:** Hard
- **Description:** Track metrics such as Email Open Rates, Click-Through Rates (CTR), and Unsubscribes. Display these metrics using charts (e.g., Chart.js or Recharts) on the admin homepage.

---

## 🌐 Client (Public) Features

### 7. User Profile & Preferences Center
- **Impact / Priority:** High
- **Difficulty:** Medium
- **Description:** Allow subscribers to log in (or use a secure magic link) to manage their subscription preferences. They could choose the specific time of day they want to receive the email or select their preferred Tafseer provider.

### 8. Audio Recitation Support
- **Impact / Priority:** High
- **Difficulty:** Easy
- **Description:** Include a link or an embedded audio player in the daily emails (and the public website) allowing users to listen to the recitation of the daily verse.

### 9. Social Login (OAuth) for Subscriptions
- **Impact / Priority:** Medium
- **Difficulty:** Medium
- **Description:** Reduce the friction of subscribing by allowing users to sign up via "Continue with Google" or "Continue with Apple", bypassing the need for a manual email verification link.

### 10. Web-based Daily Verse Archive
- **Impact / Priority:** Medium
- **Difficulty:** Medium
- **Description:** Create a public archive page on the website where users can browse, search, and read past daily verses that were sent out, essentially building a rich content library.

### 11. Multi-language Support (i18n)
- **Impact / Priority:** Low
- **Difficulty:** Medium
- **Description:** Add localization to the public website, subscription flow, and emails, allowing users to navigate and receive content in languages other than Arabic (e.g., English, Urdu, French).

### 12. Dark Mode for Public Website
- **Impact / Priority:** Low
- **Difficulty:** Easy
- **Description:** Implement a system-aware or toggleable dark mode for the public landing, subscription, and contact pages to improve accessibility and user experience.

### 13. Shareable "Verse of the Day" Images
- **Impact / Priority:** High
- **Difficulty:** Medium
- **Description:** Automatically generate beautiful, shareable images containing the daily verse and its translation. Allow users to easily download or share these directly to Instagram, WhatsApp, or X from the email or website.

### 14. Web Push Notifications
- **Impact / Priority:** Medium
- **Difficulty:** Hard
- **Description:** Give users the option to subscribe to web push notifications, so they receive the daily verse directly on their desktop or mobile lock screen, bypassing the inbox entirely.

### 15. Dynamic Multi-translation Selection
- **Impact / Priority:** Medium
- **Difficulty:** Medium
- **Description:** Allow subscribers to select which specific translations/tafseers (e.g., English Saheeh International, Urdu, French) they want appended to their daily verse emails.

### 16. Community Reflections
- **Impact / Priority:** Low
- **Difficulty:** Hard
- **Description:** Introduce a social element where logged-in users can write their reflections on the daily verse within the web archive, creating a community of shared learning.
