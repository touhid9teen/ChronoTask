export const sections = [
  {
    title: "1. What the App Does",
    content:
      "20-Minute Goal Tracker is a productivity tool that helps users focus on short 20-minute work intervals while capturing learning notes. The app supports both offline mode through PWA features and optional cloud syncing via Google Drive.",
  },
  {
    title: "2. PWA & Offline Usage",
    content:
      "The app can be installed as a Progressive Web App (PWA) and used offline. Your goals and notes are stored locally on your device and remain available without an internet connection.",
  },
  {
    title: "3. Data Storage & Syncing",
    content:
      "Your data is stored in your browser via LocalStorage. Cloud syncing is optional and uses Google Drive through OAuth authentication. The app only accesses the folder it creates in your Drive and does not read or modify any other files.",
  },
  {
    title: "4. Acceptable Use",
    content:
      "You agree not to misuse the app, attempt to hack it, or interfere with others' usage. The application must be used legally and responsibly.",
  },
  {
    title: "5. Availability & Changes",
    content:
      "The app is provided as-is. Features or syncing functionality may change or become temporarily unavailable due to updates or third-party service outages.",
  },
  {
    title: "6. Ownership",
    content:
      "You retain ownership of your goals and notes. App design and source code belong to the project owner.",
  },
  {
    title: "7. Disclaimer",
    content:
      "The app does not provide professional or legal advice. Use at your own risk. The creator is not responsible for data loss, missed goals, or productivity outcomes.",
  },
  {
    title: "8. Contact",
    content: "For support or questions: touhid.ru66@gmail.com",
  },
];

export const privacyPolicy = [
  {
    title: "Introduction",
    content:
      "ChronoTask ('we', 'our', 'us') respects your privacy and is committed to protecting it. This Privacy Policy explains how we collect, use, store, and protect your information when you use our productivity application. By using ChronoTask, you agree to the collection and use of information in accordance with this policy.",
  },
  {
    title: "Last Updated",
    content: "January 3, 2026",
  },
  {
    title: "1. Information We Collect",
    content: [
      "Task Data: Task titles, descriptions, notes, completion status, and timestamps that you create within the app.",
      "Local Storage: Your task data is stored locally in your browser's LocalStorage by default.",
      "Google Account Information: If you choose to enable Google Drive sync, we collect your email address and basic profile information (name, profile picture) through Google OAuth.",
      "Usage Data: We may collect anonymous usage statistics to improve app performance and user experience.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: [
      "To provide core app functionality: saving, loading, displaying, and managing your tasks and notes.",
      "To enable optional cloud synchronization of your tasks across devices via Google Drive.",
      "To improve app performance, fix bugs, and develop new features.",
      "To provide customer support when you contact us.",
    ],
  },
  {
    title: "3. Google API Services and Data Usage",
    content:
      "ChronoTask's use of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements. When you choose to enable Google Drive sync:",
  },
  {
    title: "3.1 Google Drive Access",
    content: [
      "Scope: We request the 'https://www.googleapis.com/auth/drive.file' scope, which allows us to create and access ONLY the files that ChronoTask creates in your Google Drive.",
      "Limited Access: We CANNOT read, modify, or delete any other files in your Google Drive that were not created by ChronoTask.",
      "What We Store: We create a dedicated folder in your Google Drive to store your task data in JSON format.",
      "Data Sync: Your tasks are synced between your local device and your Google Drive folder to enable cross-device access.",
    ],
  },
  {
    title: "3.2 Google Account Information",
    content: [
      "We access your basic profile information (email, name, profile picture) solely for authentication and to display your account information in the app.",
      "We use the 'openid', 'email', and 'profile' scopes for Google Sign-In.",
      "This information is not shared with any third parties.",
    ],
  },
  {
    title: "4. Data Storage and Security",
    content: [
      "Local Storage: By default, all your task data is stored locally in your browser using LocalStorage. This data never leaves your device unless you enable Google Drive sync.",
      "Google Drive Storage: If you enable sync, your task data is stored in your personal Google Drive account in a folder created by ChronoTask.",
      "Encryption: Data transmitted to Google Drive is encrypted using HTTPS/TLS.",
      "No Server Storage: We do not store your task data on our own servers. Your data exists only on your device and/or your Google Drive.",
      "Security Measures: We implement industry-standard security practices, but no method of transmission or storage is 100% secure.",
    ],
  },
  {
    title: "5. Data Sharing and Third Parties",
    content: [
      "We do NOT sell, rent, or share your personal data with third parties for marketing purposes.",
      "We do NOT share your task data with any third parties except as necessary to provide Google Drive sync functionality.",
      "Google Drive: When you enable sync, your data is stored in YOUR Google Drive account, which is governed by Google's Privacy Policy.",
      "We may disclose your information if required by law or to protect our rights and safety.",
    ],
  },
  {
    title: "6. Your Rights and Choices",
    content: [
      "Opt-Out of Sync: Google Drive sync is completely optional. You can use ChronoTask entirely offline without signing in.",
      "Revoke Access: You can revoke ChronoTask's access to your Google account at any time through your Google Account settings (myaccount.google.com/permissions).",
      "Delete Data: You can delete your task data at any time from within the app. If you've enabled sync, you can also manually delete the ChronoTask folder from your Google Drive.",
      "Export Data: You can export your task data from the app or access it directly in your Google Drive folder.",
    ],
  },
  {
    title: "7. Data Retention",
    content:
      "Local data persists in your browser until you clear it or uninstall the app. Google Drive data persists in your Drive account until you delete it. We do not retain any data on our servers as we do not operate backend servers for data storage.",
  },
  {
    title: "8. Children's Privacy",
    content:
      "ChronoTask is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.",
  },
  {
    title: "9. Progressive Web App (PWA)",
    content:
      "ChronoTask can be installed as a Progressive Web App. When installed, the app may cache certain resources on your device for offline functionality. You can uninstall the PWA at any time through your browser or device settings.",
  },
  {
    title: "10. Changes to This Privacy Policy",
    content:
      "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last Updated' date. You are advised to review this Privacy Policy periodically for any changes.",
  },
  {
    title: "11. Contact Us",
    content:
      "If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at: touhid.ru66@gmail.com",
  },
  {
    title: "12. Compliance",
    content:
      "ChronoTask complies with applicable data protection laws and Google API Services User Data Policy, including the Limited Use requirements. We are committed to protecting your privacy and handling your data responsibly.",
  },
];
