# CareSphere Presentation: Q&A Cheat Sheet

This document contains expected questions you might be asked during your Web Development class presentation by your teacher or peers, along with strong, technical answers you can use to impress them.

---

### 1. General Project Questions

**Q: Why did you choose React and Supabase for this project?**
**A:** "I chose React because its component-based architecture allows me to reuse UI elements and manage the complex dynamic state required for a multi-dashboard application seamlessly. I paired it with Supabase because it provides an immediate PostgreSQL backend with built-in Authentication and Row Level Security (RLS). It allowed me to focus on building the hospital logic rather than spending weeks standing up a boilerplate Node.js/Express server."

**Q: What is the main problem CareSphere solves?**
**A:** "CareSphere digitalizes hospital administration. Instead of using paper or disjointed systems, it centralizes patient appointment booking, staff recruitment, and ward/bed management into a single, real-time application with custom portals for every unique hospital role (Admin, Doctor, Nurse, etc.)."

---

### 2. Architecture & State Management

**Q: How are you managing state across the application? Are you using Redux?**
**A:** "Instead of introducing the heavy overhead of Redux, I opted for React's native `Context API`. I created an `AuthContext.jsx` file that acts as the completely centralized global state manager. It wraps the entire application, fetches and stores data from Supabase (like users, appointments, and wards), and provides those variables to any component that needs them, making the application fast and lightweight."

**Q: How does the application know which dashboard to show? (Role-Based Access Control)**
**A:** "When a user logs in, Supabase issues an authentication token. However, to find their specific role, the `AuthContext` takes their email and checks across custom PostgreSQL tables (`admins`, `doctor`, `nurse`, `patient`, etc.). Once an email match is found, my React frontend saves their role in global state and `Dashboard.jsx` dynamically renders a completely different React view (like `<AdminView />` or `<PatientView />`) based on that role string."

---

### 3. Security & Database

**Q: If I know the API URL, can I just query or delete your database from my terminal?**
**A:** "No. The system is protected by PostgreSQL's Row Level Security (RLS) policies configured in Supabase. Even if someone has the public API key, RLS dictates that you must pass a valid JWT (JSON Web Token) from an authenticated user. For example, my database strictly verifies that only authenticated users are allowed to trigger `UPDATE` or `DELETE` requests on the `ward` table."

**Q: How do you protect certain pages from being visited by unauthorized users?**
**A:** "I implemented a `<ProtectedRoute />` wrapper utilizing `react-router-dom`. If a user attempts to navigate to `/dashboard` directly via the URL, the wrapper checks the global `AuthContext` to see if a valid user object exists. If it doesn't, it intercepts the routing event and forcibly redirects them to the `/login` page."

---

### 4. Technical Challenges

**Q: What was the hardest technical challenge you faced while building this, and how did you solve it?**
**A:** "One of the biggest challenges was handling silent database failures caused by Row Level Security (RLS) and keeping the UI perfectly synchronized. 
Sometimes, when a user tried to delete a ward without proper permissions, Supabase would return a 'success' status code without actually deleting the row because RLS blocked it securely under the hood. To fix this, I attached an explicit `.select()` modifier to my update/delete queries so my React code could check if the row was *actually* altered. Furthermore, I implemented `await` on my data refresh functions to guarantee the UI only updating after the database mathematically confirms the change."

---

### 5. Future Scope

**Q: If you had more time to work on this, what would you add?**
**A:** "I would implement real-time WebSockets using Supabase's realtime subscriptions. That way, if a receptionist adds an appointment or an admin removes a ward, it would instantly appear on the dashboard of any doctor currently logged in, without them needing to refresh the page."
