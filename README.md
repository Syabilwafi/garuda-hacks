# PressPoint

PressPoint is a software platform designed to help patients with musculoskeletal disorders in Indonesia by leveraging traditional Indonesian massage methods. It connects patients with qualified therapists and uses modern technology to streamline assessments and tracking.

## Features

- **Personalized Therapist Booking:** Patients can choose their own therapists based on their specific needs and preferences.
- **Pre-treatment Body Screening:** Before a session, patients complete an initial assessment questionnaire to determine their triage status.
- **3D Body Imaging:** Patients can pinpoint the exact area of their pain on a digital model. The system reads this data to identify the scientific name and precise location of the issue.
- **Therapist Community:** A dedicated, community-based program built for all participating therapists.
- **AI-Generated Reports:** Automated insights and reports generated after assessments and treatments.

## Tech Stack

- **Frontend:** Next.js (React 19, Tailwind CSS v4, Three.js / React Three Fiber)
- **Backend:** Express.js
- **Database & Auth:** Supabase[cite: 1]

## Prerequisites

- **Node.js**
- **pnpm**

---

## Getting Started

Follow these instructions to set up and run the PressPoint platform locally.

### 1. Clone & Setup Repository

```bash
# Clone the repository
git clone <repository-url>
cd presspoint

# Install dependencies for both Frontend and Backend
pnpm install

# Start the Frontend server
cd client
pnpm dev
```

### Frontend Setup (Next.js)
Create a `.env.local` file in the `client/` directory
```javascript
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXTAUTH_SECRET=your_nextauth_secret
```