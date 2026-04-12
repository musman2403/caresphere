# CareSphere: Complete System Guide

Welcome to the internal system architecture and configuration guide for CareSphere. This document expands upon the technical methodologies, security schemas, architecture workflows, and database structures that power the application backend and frontend.

## 1. System Architecture
CareSphere uses a two-tier architectural pattern combining a lightweight React single-page application (SPA) with a heavily managed Database-as-a-Service (DBaaS) backend via Supabase.

### Frontend (React + Vite)
- **Routing:** Handled entirely by `react-router-dom`. Routes are deeply guarded. Non-authenticated users are booted to `/login`.
- **State Management:** Handled largely by `AuthContext.jsx`. The context wraps the entire application and executes all data fetching (`fetchAllData()`), mutations, session restoration, and database queries.
- **Styling Paradigm:** CSS-first, modern glassmorphism and clean interfaces using raw CSS (`Home.css`, `SharedPages.css`). Avoids heavyweight libraries to maintain a lightweight bundle.
- **Components:** Modularized. Distinct views (e.g., `AdminView`, `PatientView`) exist inside `Dashboard.jsx`.

### Backend (Supabase / PostgreSQL)
Supabase provides the authentication layer (`auth.users`) and the PostgreSQL persistent layer.
Instead of relying strictly on JSON Web Token (JWT) claims to determine hospital roles, CareSphere maps Supabase UUIDs seamlessly onto independent role tables.

## 2. Database Schema and Roles
The database holds a central `departments` entity, around which almost all hospital resources pivot.

### Core Tables:
- **`departments`**: Holds standard hospital branches (Cardiology, Neurology).
- **`ward`**: Maps directly to a department. Tracks `totalbeds` and `availablebeds`.
- **`appointment`**: Ties a Patient (`pid`) to a `department` and optionally a `docid`, managing standard lifecycle statuses (Pending, Confirmed, Completed, Canceled).
- **`applications`**: A standalone table for public user job applications. 

### Identity / Role Tables:
Users register via Supabase Auth. However, their specific details, permissions, and affiliations live in sub-tables indexed by their emails/IDs:
- `admins` (`adminid`)
- `patient` (`pid`)
- `doctor` (`docid`)
- `nurse` (`nurseid`)
- `receptionist` (`repid`)
- `wardboy` (`wardbid`)

When `auth.getSession()` runs, `AuthContext` queries all 6 role tables to find the matching email address. The application establishes the `user.role` from whichever table successfully returns a match. 

## 3. Row Level Security (RLS) & Permissions
Supabase mandates strict Row Level Security. All tables currently implement explicit `authenticated` role policies to prevent silent validation failures.

**Example RLS Paradigm:**
```sql
ALTER TABLE public.ward ENABLE ROW LEVEL SECURITY;
-- All Authenticated Users can View Wards
CREATE POLICY "Allow SELECT on ward" ON public.ward FOR SELECT TO authenticated USING (true);
-- Deletions & Modifications are secured to authenticated connections
CREATE POLICY "Allow UPDATE on ward" ON public.ward FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
```
*(Frontend Exception Handling: If an `authenticated` user tries an operation they aren't authorized for in more complex setups, the `.select()` chained promise intercepts the invisible failure by checking the returned `data.length` rather than a standard Postgres error.)*

## 4. Key Workflows

### Authentication Flow (Login)
1. User logs in. Supabase issues a session.
2. `AuthContext.loadUser()` takes the logged-in email and iterates over all hospital role tables.
3. Upon discovering a match, the user object is hydrated with standard keys (`user.id`, `user.name`, `user.role`) across all roles for predictability.
4. The user is allowed past `ProtectedRoute` wrappers.

### Recruitment Flow (Applications)
1. Guest visits `/careers`.
2. Form pushes to `applications` table (requires open `INSERT` policy on `public`).
3. Administrative user logs in. `Dashboard.jsx` fetches `applications`.
4. Admin clicks an application line item in `AdminView` to trigger the detail modal.
5. Admin clicks **Approve**, changing the status payload in Postgres.
6. The admin can then add the new hire to the official system via the UI.

### Facility Management
- **Ward Modifications:** The `AdminView` controls `ward` row states. 
- Using `updateWard()` or `updateWardBeds()`, changes hit the DB. To prevent visual desynchronization, `await fetchAllData()` forces the application logic to wait until the Database validates the operation before refreshing the GUI list.

## 5. Environment Map
```text
/src
 ├── /context
 │    └── AuthContext.jsx  ---- Global Store & API Controller
 ├── /pages
 │    ├── Dashboard.jsx    ---- Segregated Application Dashboard
 │    ├── Home.jsx         ---- Landing View
 │    ├── Login.jsx        ---- Auth portal
 │    ├── Register.jsx     ---- Patient onboarding
 │    └── Careers.jsx      ---- Staff onboarding
 ├── App.jsx               ---- Route Engine
 └── main.jsx              ---- React entry
```

## 6. Future Recommendations
- Implement Supabase Database Triggers to automate moving an `Approved` application directly into the target role table (e.g. inserting into `doctor`) seamlessly rather than mapping manually.
- Add real-time Supabase subscriptions rather than manual table polls.
