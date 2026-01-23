function toggleGuide() {
    const popup = document.getElementById('guide-popup');
    const isHidden = popup.classList.contains('hidden');

    if (isHidden) {
        updateGuideContent();
        popup.classList.remove('hidden');
    } else {
        popup.classList.add('hidden');
    }
}

function autoShowGuideForAuth() {
    const path = window.location.pathname;
    if (path.includes('auth')) {
        const popup = document.getElementById('guide-popup');
        updateGuideContent();
        popup.classList.remove('hidden');
    }
}

function updateGuideContent() {
    const path = window.location.pathname;
    const titleEl = document.getElementById('popup-title');
    const descEl = document.getElementById('popup-description');
    const tipEl = document.getElementById('popup-tip');

    if (path.includes('auth')) {
        titleEl.textContent = 'Welcome!';
        descEl.textContent = 'Access your account to manage courses and provide feedback.';
        tipEl.textContent = 'Click the bot icon anytime for help with navigation.';
    } else if (path.includes('student-dashboard')) {
        titleEl.textContent = 'Student Dashboard';
        descEl.textContent = 'View all the courses you have participated in here.';
        tipEl.textContent = 'Click "View My Response" to check your feedback.';
    } else if (path.includes('dashboard')) {
        titleEl.textContent = 'Professor Dashboard';
        descEl.textContent = 'Manage your courses and create new feedback sessions.';
        tipEl.textContent = 'Use "New Session" to quickly gather student feedback.';
    } else if (path.includes('course-view')) {
        titleEl.textContent = 'Course Overview';
        descEl.textContent = 'See details for this course and a history of all sessions.';
        tipEl.textContent = 'The QR-Code button helps students to join quickly.';
    } else if (path.includes('live-feedback')) {
        titleEl.textContent = 'Live View';
        descEl.textContent = 'Monitor incoming student feedback in real-time.';
        tipEl.textContent = 'The charts update automatically as votes come in.';
    } else if (path.includes('session-analytics')) {
        titleEl.textContent = 'Analytics';
        descEl.textContent = 'Detailed review of a closed session.';
        tipEl.textContent = 'Try the AI Summary feature for quick insights.';
    } else {
        titleEl.textContent = 'Welcome!';
        descEl.textContent = 'I am here to help you navigate the feedback system.';
        tipEl.textContent = 'Enter a username to stay anonymous. This is only used so you can view your results later.';
    }
}

document.addEventListener('click', function(event) {
    const container = document.getElementById('page-guide-container');
    const popup = document.getElementById('guide-popup');

    if (container && !container.contains(event.target) && !popup.classList.contains('hidden')) {
        popup.classList.add('hidden');
    }
});

// Auto-show guide for auth pages when page loads
document.addEventListener('DOMContentLoaded', autoShowGuideForAuth);
