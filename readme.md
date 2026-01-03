# ⏳ ChronoTask

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-cyan)

**ChronoTask** is a modern, productivity-focused web application designed to help users manage tasks efficiently using the 20-minute focus technique. It combines a sleek task queue, a dedicated focus timer, and a comprehensive "What I Learned" note-taking system into a single, cohesive experience.

Built with performance and aesthetics in mind, ChronoTask leverages the latest web technologies to ensure a smooth, responsive, and engaging user journey across all devices.

---

## ✨ Key Features

- **🎯 Task Queue Management**
  - Organize tasks in a prioritized queue.
  - Drag-and-drop or seamless reordering (planned).
  - Quick add interface for rapid task entry.

- **⏱️ Focus Timer**
  - Built-in 20-minute countdown timer for deep work sessions.
  - Visual progress indicators and audio alerts.
  - Distraction-free "Active Session" mode.

- **📝 "What I Learned" Notes**
  - Dedicated note-taking section for every completed task.
  - **Accordion-style editor** for organized, collapsible notes.
  - Auto-saving functionality to prevent data loss.

- **📊 Activity Analytics**
  - **Visual Calendar:** View completed tasks by date.
  - **Responsive Layout:** Side-by-side calendar and task history on desktop; interactive auto-scroll on mobile.
  - Track productivity streaks and daily completion counts.

- **☁️ Cloud Sync (Google Drive)**
  - Seamlessly sync tasks and notes to your Google Drive.
  - Access your productivity data across multiple devices.

- **🎨 Modern UI/UX**
  - **Responsive Design:** Optimized for mobile, tablet, and desktop.
  - **Shadcn UI & Tailwind:** Beautiful, accessible, and consistent component system.
  - **Dynamic Interactions:** Smooth transitions, hover effects, and micro-animations.

---

## 🛠️ Technology Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** React Hooks & Context
- **Storage:** LocalStorage & Google Drive API
- **PWA:** Next-PWA support for offline capabilities

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chronotask.git
   cd chronotask
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory and add your Google API credentials:
   ```env
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id
   NEXT_PUBLIC_GOOGLE_API_KEY=your_api_key
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

5. **Open the App**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```bash
├── app/                  # Next.js App Router pages and layouts
│   ├── about/            # About page
│   ├── tasks/            # Task detail and editing pages
│   ├── globals.css       # Global styles and Tailwind imports
│   └── page.tsx          # Home page (Task Queue)
├── components/           # Reusable UI components
│   ├── TaskQueue/        # Core application components (Timer, Queue, Lists)
│   └── ui/               # Shadcn UI primitive components
├── hooks/                # Custom React hooks (useTaskManager, etc.)
├── lib/                  # Utility functions
└── public/               # Static assets (images, icons)
```

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve ChronoTask, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by Touhid for productivity enthusiasts everywhere.
</p>