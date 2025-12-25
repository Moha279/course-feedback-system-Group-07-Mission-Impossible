# Course Feedback System – Web-Based University Feedback System

A web-based (live) Course Feedback System designed for universities.
The system simplifies the feedback loop between students and lecturers by using QR codes, real-time analytics.

The goal of this project is to enable fast, anonymous, and structured feedback during or after lectures, while providing lecturers with immediate and meaningful analysis.

---

## 🚀 Features

### Session Management (Professor Portal)
* **Quick Setup:** Create courses and weekly feedback sessions with minimal effort.
* **Flexible Templates:** Use pre-defined templates (e.g., *Lecture Quality*, *Quick Feedback*) or create custom questions.
* **QR Access:** Generate session-specific QR codes for instant student access.

### Real-Time Analytics & AI
* **Live View:** Monitor incoming responses in real-time during the lecture.
* **Keyword Cloud:** Automatically visualizes common terms from text answers and allows filtering by selected keywords.
* **AI Summary:** Generates a concise 1–5 sentence summary of open text responses using AI-based logic.

### Student Interaction
* **Anonymous Feedback:** Submission via mobile or desktop devices without login barriers.
* **Varied Input:** Supports star ratings (1–5), multiple-choice questions, and free-text input.
* **Transparency:** Displays aggregated group results to students after session closure.

---

## 🧰 Programming Languages & Technologies

* **HTML5** – Structure of the web application
* **CSS3** – Styling and layout
* **JavaScript (ES6+)** – Application logic and interactivity
* **CouchDB** – NoSQL database for storing sessions and feedback
* **QR Code Generation** – Client-side QR code creation

---

## ⚙️ Requirements

* **Browser:** Modern web browser (Chrome, Firefox, Edge, or Safari).
* **Database:** [Apache CouchDB](https://couchdb.apache.org/) (must be installed and running locally on Port 5984).
* **Backend:** No dedicated backend server required (client-side application with direct database access).

---

## 🛠️ Installation & Running

### 1. Clone the repository
Download the project to your local machine:
```bash
git clone [https://github.com/Moha279/course-feedback-system-Group-07-Mission-Impossible.git](https://github.com/Moha279/course-feedback-system-Group-07-Mission-Impossible.git)
```
2. Database Setup

Ensure CouchDB is running on your machine.

    Default Port: 5984

    Verify access by navigating to http://127.0.0.1:5984/_utils/ in your browser.

3. Launch the App

Open the index.html file inside the main folder directly in your browser.

4. Usage

    Log in as a professor (or create a new profile).

    Create a Course and start a new Session.

    Generate QR Code: Share the code with students (or open the link in a second browser window/incognito mode to simulate a student).

    Live View: Watch the results coming in instantly on the dashboard.

## 📁 Folder Structure

The project separates distinct views (HTML) from styling (CSS) and logic (JS):

```text
.
├── auth.html                 # Login and Sign-up page for professors and students
├── course-view.html          # Detailed view of a specific course and its sessions
├── dashboard.html            # Main control panel for professors (manage courses)
├── index.html                # Entry point / Landing page of the application
├── live-feedback.html        # Real-time view of incoming feedback during a lecture
├── session-analytics.html    # Post-session analysis, charts, and AI summaries
├── student-dashboard.html    # Student area showing participation history
├── student-feedback.html     # The actual feedback form interface for students
├── css/
│   ├── auth.css              # Styles specific to login/signup forms
│   ├── common.css            # Global styles, variables (colors/fonts), and resets
│   ├── components.css        # Reusable UI elements (buttons, modals, cards)
│   ├── dashboard.css         # Layout styles for the professor dashboard
│   ├── live-feedback.css     # Styles for the real-time visualization view
│   ├── session-analytics.css # Styles for data visualization and charts
│   └── style.css             # General fallback styles or landing page styles
└── js/
    ├── app.js                # Core application logic and global utilities
    ├── auth.js               # Handles authentication logic and user sessions
    └── dashboard.js          # Logic for fetching courses and UI interactions
```
🎓 Academic Context

This project was developed as part of a university course and demonstrates:

    Practical application of web technologies (HTML, CSS, JavaScript).

    Real-time data processing and visualization.

    User-centered design for academic environments.

    Integration of AI-supported text analysis concepts.

📄 License

This project is intended for educational purposes.
