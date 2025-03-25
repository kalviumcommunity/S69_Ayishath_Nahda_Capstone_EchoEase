

# Capstone Project Report: A Fully-Fledged website for Speech Therapists.
1. ## Project Overview
This project is a web-based platform designed exclusively for speech therapists to efficiently find therapy goals and activities for children with autism and similar disorders.
It streamlines therapy planning by generating structured activity suggestions based on a child's age and country.
The system eliminates the need for therapists to manually search for therapy activities across different sources.
Future enhancements include AI-powered recommendations to provide personalized therapy plans.
For instance, a 3-year-old child with a speech-language disorder secondary to autism, goals should focus on improving communication, social interaction, and functional language skills. Activities should be engaging, structured, and tailored to the child’s interests and sensory preferences. (it differs for different age groups)




2. ## Problem Statement
-Therapists struggle to find appropriate therapy activities for children with autism and related disorders and often find themselves searching on YouTube for similar activities for the child .
-There is no centralized platform for therapy goals, leading to time-consuming searches across multiple sources.
-Therapy approaches vary by region or the country they come from (Indians and other Asian countries, Middle Eastern parts, Americans, Africans etc.), but current solutions do not cater to region-specific therapy needs.
-Difficulties arise when therapists work with clients from different cultural backgrounds, requiring different therapy techniques.


3. ## What Makes This Website Different?
-Exclusive for Therapists: Unlike general therapy platforms, this system is tailored specifically for professional therapists.
-Region-Specific Therapy Recommendations: Unlike existing platforms, this system considers cultural and regional differences when suggesting therapy activities.
-Centralized Therapy Resource: Instead of searching on YouTube or other platforms, therapists get all therapy goals & activities in ONE place.
-Future AI Enhancements: Unlike traditional therapy tools, this platform will integrate AI to adapt recommendations based on therapist feedback and child progress.




4. ## Core Features
-Therapist Login & Authentication – Secure login with hospital details
-Child Data Input – Enter child's age and country for recommendations
-Automated Therapy Goals & Activities – System-generated therapy plans
-Region-Specific Therapy Suggestions – Activities customized for different regions
-User Dashboard – Track and manage therapy suggestions
-Database of Therapy Activities – Predefined activities categorized by diagnosis
-Future AI Integration – Intelligent recommendations based on therapist feedback




5. ## Technology Stack
Frontend: React.js (UI & User Interaction)
Backend: Node.js + Express.js (API & Data Handling)
Database: MongoDB (Stores Therapy Activities & Therapist Data)
Authentication: JWT-based secure login
Deployment: Hosted on Vercel/Netlify (Frontend) & Render/AWS (Backend)




6. ## System Architecture
Overview of how data flows between frontend, backend, and database
Workflow of input processing and therapy recommendation generation


7. ## Implementation
Steps taken to develop the project
Data collection and structuring for therapy activities
User interface design and integration with backend API


8. ## Results & Benefits
-How the system simplifies the therapist’s workflow
-Reduction in manual searching for therapy activities
-Region-based therapy activities improve accuracy and relevance


9. ## Future Enhancements
AI-driven therapy recommendations based on therapist feedback
Voice/video integration for therapist-guided exercises for different native-speaking languages.
More region-specific activities and customizable therapy plans








## MY DAILY/WEEKLY SCHEDULE PLAN




### Week 1: Project Setup & UI Design
Day 1: Create low-fidelity wireframes on Figma.
Day 2: Create High-fidelity design.
Day 3: Set up React project with Vite.




Day 4: Install Dependencies & Initial Layout
 Install necessary libraries (React Router, Tailwind, Axios).




Day 5: Build UI Components & Navigation
 Create Login page, Therapist input form, Dashboard.
.


### Week 2: Frontend Development
Day 6: Build Homepage & Authentication UI
  Design homepage with login/signup form.
  Implement session persistence (JWT-based authentication UI).
Day 7:  Create a form for therapists to enter a child's age & country.










Day 8: Develop Therapy Recommendations Page
      Display recommended therapy goals based on inputs.
      Create cards or table format to showcase therapy activities.
Day 9: Implement Responsive Design & Styling
 Ensure mobile-first design & accessibility.
 Improve UI with better colors, typography, and spacing.
Day 10: Test & Refine Frontend Components
      Perform unit tests on components.
      Fix any UI inconsistencies before backend integration.


### Week 3: Backend Development
Day 11: Express Server & MongoDB Setup
 Set up Node.js + Express.js backend.
 Connect MongoDB database (Atlas).
Day 12:  Develop signup & login APIs (JWT-based authentication).






Day 13: Develop GET API to fetch therapy goals & activities.


.
Day 14: Implement CRUD APIs for Therapists
 Develop POST API for adding therapy suggestions.
 Develop PUT API for updating therapy activities.




Day 15: Test Backend APIs & Error Handling
 Use Bruno to test API endpoints.






### Week 4: Integration & Testing
Day 16: Connect Frontend with Backend APIs
Day 17: Implement Real-Time Updates
 Add WebSocket-based real-time updates for therapy activity contributions.




Day 18: Secure API with Rate Limiting
Prevent excessive requests using express-rate-limit.




Day 19: Test Full Application
 Conduct end-to-end testing (frontend + backend).
Fix any authentication & data retrieval bugs.
Day 20: Collect Feedback & Refine UI/UX
 Get real therapists or users to test the platform.
 Improve navigation, speed, and overall user experience.


### Week 5: Deployment & Submission
Day 21: Deploy Backend (Render)
 Deploy Node.js & MongoDB backend.


Day 22: Deploy Frontend (Netlify)






Day 23: Test Deployment & Fix Issues
 Ensure backend APIs work correctly in production.
 Fix CORS or environment variable issues.
Day 24: Open Source Contribution & PR Merging
 Submit 3 pull requests to an open-source project (submission: "Submit pull request (1,2,3) on open source project").
 Accept 3 incoming pull requests on your project (submission: "Receive 3 incoming pull requests").
Day 25: User Testing & Project Adoption
Get 5, 10, and 50 users to test the project.


Day 26: Final API Testing & Documentation
 Update Bruno API templates.




Day 27: Final Debugging & UI Polish
 Fix any last-minute UI/UX issues.
 Ensure project is error-free & user-friendly.
Day 28: Final Submission 🎉
 Deploy final version, record demo video, and submit capstone project.


## BACKEND DELPOYED LINK
https://s69-ayishath-nahda-capstone-echoease.onrender.com


## FRONTEND DEPLOYED LINK

https://echoease.netlify.app/



