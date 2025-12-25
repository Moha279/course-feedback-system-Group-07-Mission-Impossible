# Course Feedback System

A web-based (live) Course Feedback System designed for universities. This project simplifies the feedback loop between students and lecturers using QR codes, real-time analytics, and AI-driven insights.

## Features

* **Session Management (Professor Portal)**
    * Create courses and weekly sessions with minimal setup.
    * Use pre-defined templates (e.g., "Lecture Quality", "Quick Feedback") or custom questions.
    * Generate session-specific QR codes for instant student access.

* **Real-Time Analytics & AI**
    * **Live View:** Monitor incoming responses in real-time during the lecture.
    * **Keyword Cloud:** Automatically visualizes common terms from text answers (filters responses by clicking on keywords).
    * **AI Summary:** Generates a 1-5 sentence summary of open text responses using AI logic.

* **Student Interaction**
    * Anonymous feedback submission via mobile or desktop.
    * Supports Star Ratings (1-5), Multiple Choice, and Text input.
    * Instant view of aggregated group results after session closure.

## Requirements

* **Browser:** Modern web browser (Chrome, Firefox, Edge, or Safari).
* **Database:** CouchDB (must be installed and running locally).
* **Runtime:** No complex backend server required (runs client-side with direct DB connection).

## Installation & Running

1.  **Clone the repository**
    Download the project to your local machine:
    ```bash
    git clone [https://github.com/Moha279/course-feedback-system-Group-07-Mission-Impossible.git](https://github.com/Moha279/course-feedback-system-Group-07-Mission-Impossible.git)
    ```
2.  **Usage**
    * Log in as a professor to create a session and generate a QR code.
    * Open the link in a separate window (or scan with a phone) to simulate a student

## Folder Structure

The project follows a modular structure to separate the frontend views from the data logic:

```text
├── main/
    ├── css/
    └── js/
