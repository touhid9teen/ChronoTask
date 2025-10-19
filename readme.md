# ⏱️ 20-Minute Goal Tracker

A productivity app for completing goals in 20-minute intervals with learning notes and Google Drive sync.

## ✨ Features

- **20-Minute Timer** - Track each goal with countdown timer
- **Toggle Learning Notes** - Expandable text field to record what you learned
- **Google Drive Sync** - Save and fetch your goals from cloud storage
- **Goal Completion** - Mark goals as complete with visual indicators
- **Auto-Save** - Local storage backup
- **Export/Import** - JSON backup options

## 🚀 Quick Start
```bash
# Clone repository
git clone https://github.com/yourusername/20-minute-goal-tracker.git

# Install dependencies
npm install

# Add Google credentials to .env
REACT_APP_GOOGLE_CLIENT_ID=your_client_id
REACT_APP_GOOGLE_API_KEY=your_api_key

# Start app
npm start
```

## 📖 Usage

1. Add a goal and click play to start timer
2. Expand goal to add learning notes (toggle field)
3. Mark complete when done
4. Save to Google Drive for backup
5. Fetch from Drive on any device

## 🛠️ Tech Stack

React • Tailwind CSS • Google Drive API • LocalStorage

## 🔑 Setup Google Drive

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google Drive API
3. Create OAuth 2.0 credentials
4. Add credentials to `.env` file

## 📝 License

MIT License

---

⭐ Star this repo if you find it useful!