# CareSphere

CareSphere is a comprehensive, modern healthcare management system designed to streamline online hospital administration, staff onboarding, patient appointments, and ward capacity tracking. Powered by React and Supabase, it features real-time role-based dashboards and an automated, secure recruitment pipeline.

## Features

- **Role-Based Access Control (RBAC):** Distinct specialized dashboards and permissions for Admins, Doctors, Nurses, Receptionists, Ward Boys, and Patients.
- **Dynamic Hospital Administration:** 
  - Real-time Ward and Bed capacity management (Add, Remove, Edit).
  - Department tracking.
- **Automated Recruitment Pipeline:**
  - Online careers portal allowing candidates to submit applications.
  - Dedicated Admin Queue for approving/rejecting applications.
  - Modal viewing of detailed cover letters, shift preferences, and experiences.
  - Synchronization between approved candidates and database profiles.
- **Patient Portals & Appointments:**
  - Patients can dynamically book appointments with specific hospital departments.
  - Doctors, Admins, and Receptionists can review and confirm/cancel scheduled appointments.
- **Robust Security Framework:**
  - Built on Supabase Authentication with PostgREST row-level security (RLS).
  - Secure state management blocking cross-role contamination.

## Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/musman2403/caresphere.git
   cd caresphere
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the environment:**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```
   *Note: Contact the administrator for the database schema/RLS policies if standing up a new Supabase backend.*

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## Design Overview
CareSphere relies extensively on React context (`AuthContext.jsx`) as the global state broker between the UI (`Dashboard.jsx`, views, etc.) and the centralized PostgreSQL backend (Supabase). This approach ensures synchronized views, rapid updates, and strict encapsulation. 

For full architectural, database schema, and deployment specifics, see the [System Guide](system_guide.md).
