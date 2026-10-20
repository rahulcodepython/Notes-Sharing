/** Public facts about the app and its operator, used by metadata, the landing page and legal pages. */
export const site = {
  name: "Notes Sharing",
  tagline: "Share study notes with your classmates",
  description:
    "Notes Sharing lets students create communities, upload notes of any file type to their own Google Drive, and share them with classmates in one place.",
  keywords: [
    "notes sharing",
    "study notes",
    "student community",
    "share notes with classmates",
    "college notes",
    "Google Drive notes",
    "class notes app",
  ],
  operator: {
    name: "Rahul Das",
    email: "rahulcodepython@gmail.com",
    website: "https://rahulcodepython.in",
    country: "India",
  },
  legalUpdated: "20 October 2026",
} as const;

/** Public pages listed in the sitemap. */
export const publicRoutes = [
  { path: "/", priority: 1 },
  { path: "/privacy-policy", priority: 0.5 },
  { path: "/terms-and-conditions", priority: 0.5 },
  { path: "/data-security", priority: 0.5 },
] as const;
