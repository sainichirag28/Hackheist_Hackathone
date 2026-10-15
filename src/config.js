/**
 * HackHeist 2026 - Central Configuration
 * Single source of truth for event parameters and registration endpoints.
 */

// Placeholder URL: Replace this with your official Google Form registration link.
export const REGISTRATION_URL = "https://forms.gle/REPLACE_WITH_YOUR_GOOGLE_FORM_URL";

export const IS_REGISTRATION_PLACEHOLDER = 
  !REGISTRATION_URL || REGISTRATION_URL.includes("REPLACE_WITH_YOUR_GOOGLE_FORM_URL");

export const EVENT_DETAILS = {
  name: "HackHeist 2026",
  organizer: "GDG on Campus MIET",
  venue: "MIET",
  time: "9:00 AM onwards",
  dateDisplay: "HackHeist 2026",
  tagline: "Build. Break. Solve.",
  description: "Turn bold ideas into real solutions. Learn new technologies, collaborate with fellow developers, and experience the excitement of building something extraordinary.",
  aboutParagraph: "HackHeist 2026 is a developer-focused event organized by GDG on Campus MIET where technology meets creativity. Discover new ideas, develop practical skills, collaborate with fellow students, and explore innovative solutions to real-world challenges. Whether you enjoy coding, designing, or problem-solving, HackHeist is an opportunity to learn, build, and connect with the developer community.",
  highlightedPhrase: "Learn. Build. Collaborate."
};
