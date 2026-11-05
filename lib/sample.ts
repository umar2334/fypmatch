import type { Idea, Profile } from "./schema";

/** Hand-written sample output for the Examples page and for tests. Not produced for a real student. */
export const SAMPLE_PROFILE: Profile = {
  university: "Other",
  semester: "7th",
  supervisorStyle: "Not sure yet",
  department: "SE",
  interests: ["AI/ML", "EdTech"],
  skillLevel: "Intermediate",
  tech: ["React", "Python", "Firebase", "TypeScript"],
  teamSize: 2,
  durationMonths: 6,
  careerGoal: "Job abroad",
  notes: "",
};

export const SAMPLE_IDEAS: Idea[] = [
  {
    label: "Top pick",
    categories: ["AI/ML", "EdTech"],
    title: "AI Code Review Assistant for Pakistani Bootcamps",
    tagline: "Code-quality teaching for Urdu and English speakers, inspired by tools like GitHub Copilot",
    summary:
      "Students submit code and get review feedback they can read in Urdu or English. You solve a local problem with a globally relevant skillset and finish with a strong portfolio piece.",
    difficulty: 7,
    careerRelevance: 9,
    originality: 8,
    estimatedMonths: 6,
    stackPreview: ["Next.js", "Python (FastAPI)", "Postgres", "Gemini API"],
    whyGood: "Combines NLP, AST analysis and HCI, with a clear audience among coding instructors after graduation.",
    whyGoodLong:
      "This project combines NLP, code AST analysis and HCI, three advanced computer science topics. Well-known tools such as Codacy and SonarQube focus on general code quality and aren't designed around Urdu-speaking learners. A bilingual angle gives you a clear research question. Coding bootcamps and university labs that review a lot of student code are the natural audience after graduation.",
    mvpFeatures: [
      "Upload code and get bilingual feedback (Urdu + English)",
      "Instructor dashboard with a multi-student view",
      "Track student progress over time with skill graphs",
      "Code quality scoring (0-100) with category breakdown",
      "Suggested fixes with detailed explanations and examples",
    ],
    techStack: {
      frontend: ["React", "Next.js", "TailwindCSS"],
      backend: ["Python (FastAPI)"],
      database: ["PostgreSQL"],
      aiMl: ["Gemini API", "Tree-sitter (AST)"],
      deployment: ["Vercel", "GitHub Actions"],
    },
    skills: ["LLM prompt engineering", "AST parsing", "Multilingual NLP", "Production AI deployment"],
    challenges: [
      { title: "API costs", mitigation: "Use a free-tier model and cache repeated reviews aggressively." },
      { title: "Multi-language code parsing", mitigation: "Start with Python only, then expand to JS/TS later in the project." },
      { title: "Natural Urdu translations", mitigation: "Build a programming glossary and manually review a sample of outputs." },
    ],
    similarProducts: [
      { name: "Codacy", note: "Automated code quality and review platform" },
      { name: "SonarQube", note: "Static analysis for code quality and security" },
      { name: "Snyk Code", note: "Security-focused code analysis" },
    ],
    glance: {
      difficultyNote: "Advanced",
      careerNote: "Strong portfolio piece",
      originalityNote: "Bilingual angle",
      teamValue: "Needs 2",
      teamNote: "1 backend + 1 frontend",
      budgetValue: "0 PKR",
      budgetNote: "Free tiers can cover the MVP",
    },
    potential: {
      headline: "Rough estimate: paid pilots with coding bootcamps",
      details:
        "A monthly subscription per institute is one possible model. This is an unverified estimate and depends on execution, so talk to instructors before relying on it.",
    },
    supervisorPitch:
      "This project applies natural language processing and abstract syntax tree analysis to build a bilingual code review system for Pakistani coding students. Its novelty lies in providing context-aware feedback in Urdu and English, which mainstream code review tools aren't designed around. The system will be evaluated with student submissions, and it offers a route to both research and entrepreneurship.",
  },
  {
    label: "Easiest to ship",
    categories: ["AI/ML", "EdTech"],
    title: "Bilingual Lecture Summarizer for Pakistani Students",
    tagline: "Upload Urdu/English lectures and get structured notes, flashcards and quiz questions",
    summary:
      "Turn recorded mixed Urdu-English lectures into study material students can revise from. The scope is manageable, and each feature can be demonstrated on real lectures.",
    difficulty: 5,
    careerRelevance: 8,
    originality: 7,
    estimatedMonths: 5,
    stackPreview: ["Next.js", "Whisper", "Supabase", "Gemini API"],
    whyGood: "Solves an everyday student problem, since mixed Urdu-English lectures are common and hard to revise from.",
    whyGoodLong:
      "Lectures in Pakistan often mix Urdu and English, which makes speech recognition and summarization a real technical challenge. The project covers speech processing, language models and product design. Students can test it on their own lectures, so user evaluation is straightforward.",
    mvpFeatures: [
      "Upload lecture audio or video",
      "Transcribe mixed Urdu-English speech",
      "Generate structured notes by topic",
      "Create flashcards from each lecture",
      "Generate practice quiz questions",
    ],
    techStack: {
      frontend: ["Next.js", "TailwindCSS"],
      backend: ["Node.js"],
      database: ["Supabase"],
      aiMl: ["Whisper", "Gemini API"],
      deployment: ["Vercel"],
    },
    skills: ["Speech-to-text", "Summarization", "Full-stack development"],
    challenges: [
      { title: "Code-switching accuracy", mitigation: "Test on a small set of real lectures and let users correct the transcript." },
      { title: "Long audio files", mitigation: "Split recordings into chunks and process them in the background." },
    ],
    similarProducts: [
      { name: "Otter.ai", note: "Meeting and lecture transcription" },
      { name: "Notion AI", note: "General AI summaries inside notes" },
    ],
    glance: {
      difficultyNote: "Moderate",
      careerNote: "Useful AI product skills",
      originalityNote: "Urdu-English focus",
      teamValue: "Needs 2",
      teamNote: "1 AI + 1 full-stack",
      budgetValue: "0 PKR",
      budgetNote: "Free tiers can cover the MVP",
    },
    potential: {
      headline: "Rough estimate: low-cost student subscription",
      details: "A small monthly fee or a university licence are possible models. This is an unverified estimate and depends on execution.",
    },
    supervisorPitch:
      "This project builds a system that transcribes and summarizes lectures delivered in mixed Urdu and English. It addresses the technical challenge of code-switched speech and evaluates how well generated notes support student revision. The outcome is a working tool and a measured evaluation on real lecture recordings.",
  },
  {
    label: "Highest impact",
    categories: ["HealthTech", "Mobile"],
    title: "Local Pharmacy Drug Interaction Checker",
    tagline: "Search Pakistani medicine brands and get interaction warnings in Urdu",
    summary:
      "Map local medicine brand names to their active ingredients, then show interaction information in plain Urdu. It needs careful scoping and pharmacist review, because it deals with health information.",
    difficulty: 6,
    careerRelevance: 7,
    originality: 9,
    estimatedMonths: 6,
    stackPreview: ["React Native", "Node.js", "Open drug data", "Google Translate"],
    whyGood: "Local brand names are harder to look up in global tools, so the data mapping is valuable public-health work.",
    whyGoodLong:
      "Global drug databases are organised around ingredients and international brands, so local brand names can be hard to match. Building that mapping is the core technical contribution. The project also raises real questions of safety and communicating risk, which make for a strong report. It must be presented as an information tool that doesn't replace a doctor or pharmacist.",
    mvpFeatures: [
      "Search medicines by local brand name",
      "Map brands to active ingredients",
      "Check interactions between selected medicines",
      "Show warnings in Urdu and English",
      "Clear safety notice and pharmacist guidance",
    ],
    techStack: {
      frontend: ["React Native"],
      backend: ["Node.js"],
      database: ["PostgreSQL"],
      aiMl: ["Google Translate"],
      deployment: ["Railway"],
    },
    skills: ["Data cleaning", "Mobile development", "Health data safety"],
    challenges: [
      { title: "Reliable local data", mitigation: "Start with a limited medicine list and have a pharmacist check it." },
      { title: "Safety of the advice", mitigation: "Only show sourced information and always direct users to a professional." },
    ],
    similarProducts: [
      { name: "Drugs.com", note: "Interaction checker built around international drug names" },
      { name: "Medscape", note: "Clinical reference for healthcare professionals" },
    ],
    glance: {
      difficultyNote: "Moderate to hard",
      careerNote: "Health and mobile skills",
      originalityNote: "Local brand mapping",
      teamValue: "Needs 2",
      teamNote: "1 mobile + 1 data",
      budgetValue: "0 PKR",
      budgetNote: "Free tiers can cover the MVP",
    },
    potential: {
      headline: "Rough estimate: grants or pharmacy tools",
      details: "Health grants or tools for pharmacies are possible routes. This is an unverified estimate, and a real launch would need medical review.",
    },
    supervisorPitch:
      "This project develops a mobile application that maps Pakistani medicine brands to active ingredients and presents interaction information in Urdu and English. The main contributions are the local brand dataset and an evaluation of how clearly risk information is communicated. The system will be reviewed with a pharmacist and framed as an information aid rather than medical advice.",
  },
  {
    label: "Most original",
    categories: ["IoT", "ML"],
    title: "Smart Attendance via Classroom WiFi Fingerprinting",
    tagline: "Mark attendance automatically from BSSID signatures, with no QR codes or GPS",
    summary:
      "Use the WiFi networks visible from a phone to confirm a student is in a classroom. It's a research-oriented project with clear experiments and accuracy measurements.",
    difficulty: 8,
    careerRelevance: 8,
    originality: 9,
    estimatedMonths: 7,
    stackPreview: ["Flutter", "Node.js", "WiFi APIs", "TimescaleDB"],
    whyGood: "A novel academic angle that combines signal processing with ML, and gives you experiments to measure and report.",
    whyGoodLong:
      "Indoor positioning from WiFi signals is an established research area, and applying it to attendance gives you a concrete use case. You'll collect your own signal data, train a classifier and measure accuracy in real rooms. Privacy and spoofing are important discussion points for your report.",
    mvpFeatures: [
      "Scan nearby WiFi access points from the app",
      "Register classroom fingerprints",
      "Classify which room a student is in",
      "Mark attendance during class time",
      "Teacher dashboard with attendance reports",
    ],
    techStack: {
      frontend: ["Flutter"],
      backend: ["Node.js"],
      database: ["TimescaleDB"],
      aiMl: ["scikit-learn"],
      deployment: ["Railway"],
    },
    skills: ["Signal processing", "Applied ML", "Mobile development"],
    challenges: [
      { title: "OS limits on WiFi scanning", mitigation: "Target Android first and work within its scan limits." },
      { title: "Signal changes over time", mitigation: "Collect data across several days and retrain regularly." },
    ],
    similarProducts: [{ name: "Cisco Spaces", note: "Indoor location analytics using WiFi infrastructure" }],
    glance: {
      difficultyNote: "Advanced",
      careerNote: "Research and ML skills",
      originalityNote: "Novel use of WiFi data",
      teamValue: "Needs 2",
      teamNote: "1 mobile + 1 ML",
      budgetValue: "0 PKR",
      budgetNote: "Uses existing campus WiFi",
    },
    potential: {
      headline: "Rough estimate: pilot with one institution",
      details: "A pilot at a school or university could test demand. This is an unverified estimate and depends on execution and privacy approval.",
    },
    supervisorPitch:
      "This project investigates WiFi fingerprinting for automated classroom attendance, using signal data and machine learning to identify a student's room. It will measure accuracy in real classrooms over time and discuss privacy and spoofing. The work suits a research-oriented final year project with clear experiments and results.",
  },
  {
    label: "Fastest to monetize",
    categories: ["AI/ML", "Mobile"],
    title: "Urdu Voice to Excel Sheet for Small Businesses",
    tagline: "A shopkeeper speaks Urdu, and AI turns it into a live spreadsheet and invoices",
    summary:
      "Let small shop owners record sales and stock by speaking in Urdu. It's a simple idea with a clear user, and you can test it directly with local shops.",
    difficulty: 4,
    careerRelevance: 6,
    originality: 8,
    estimatedMonths: 4,
    stackPreview: ["Flutter", "Whisper", "Firebase", "Gemini API"],
    whyGood: "Many small shops still keep paper records, so you can test the idea quickly with real users nearby.",
    whyGoodLong:
      "Many small businesses keep paper records and avoid complex software. Voice input in Urdu lowers that barrier. The project covers speech recognition, structured data extraction and designing for low-tech users, and it's easy to evaluate with shop owners near your campus.",
    mvpFeatures: [
      "Record sales by speaking in Urdu",
      "Extract items, quantities and prices",
      "Update a spreadsheet automatically",
      "Generate simple invoices",
      "Daily sales summary",
    ],
    techStack: {
      frontend: ["Flutter"],
      backend: ["Firebase Functions"],
      database: ["Firestore"],
      aiMl: ["Whisper", "Gemini API"],
      deployment: ["Firebase"],
    },
    skills: ["Speech-to-text", "Information extraction", "User research"],
    challenges: [
      { title: "Noisy shop environments", mitigation: "Show the transcript so that users can confirm it before saving." },
      { title: "Number and unit mistakes", mitigation: "Ask for confirmation of every price and quantity." },
    ],
    similarProducts: [
      { name: "Udhaar Book", note: "Digital ledger app for small businesses" },
      { name: "Google Sheets", note: "General spreadsheets with no Urdu voice workflow" },
    ],
    glance: {
      difficultyNote: "Beginner friendly",
      careerNote: "Product and mobile skills",
      originalityNote: "Voice-first for shops",
      teamValue: "1-2",
      teamNote: "1 mobile + optional AI",
      budgetValue: "0 PKR",
      budgetNote: "Free tiers can cover the MVP",
    },
    potential: {
      headline: "Rough estimate: small monthly fee per shop",
      details: "A low monthly subscription is one possible model. This is an unverified estimate, so test it with real shop owners first.",
    },
    supervisorPitch:
      "This project builds a voice-first mobile application that lets small business owners record transactions in Urdu and converts them into structured spreadsheets and invoices. It combines speech recognition with information extraction, and will be evaluated with local shop owners for accuracy and ease of use.",
  },
];
