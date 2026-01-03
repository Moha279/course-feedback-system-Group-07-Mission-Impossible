const Storage = {
    save: (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    },
    load: (key) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },
    remove: (key) => {
        localStorage.removeItem(key);
    }
};

function initializeMockData() {
    if (!Storage.load('users')) {
        Storage.save('users', [
            { id: '1', email: 'prof@university.edu', password: 'password123', name: 'Dr. Smith' }
        ]);
    }

    if (!Storage.load('courses')) {
        Storage.save('courses', [
            {
                id: 'course-1',
                userId: '1',
                courseName: 'Introduction to Computer Science',
                courseCode: 'CS101',
                createdAt: new Date().toISOString()
            },
            {
                id: 'course-2',
                userId: '1',
                courseName: 'Data Structures & Algorithms',
                courseCode: 'CS201',
                createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
            },
            {
                id: 'course-3',
                userId: '1',
                courseName: 'Web Development',
                courseCode: 'CS301',
                createdAt: new Date(Date.now() - 86400000 * 14).toISOString()
            }
        ]);
    }

    if (!Storage.load('sessions')) {
        Storage.save('sessions', [
            {
                id: 'session-1',
                courseId: 'course-1',
                sessionName: 'Week 1: Introduction to Programming',
                weekNumber: 1,
                isActive: true,
                questions: [
                    { id: 'q1', type: 'rating', question: 'How well did you understand today\'s content?' },
                    { id: 'q2', type: 'text', question: 'What was the most confusing topic today?' },
                    { id: 'q3', type: 'rating', question: 'How was the pace of the lecture?' }
                ],
                createdAt: new Date().toISOString()
            }
        ]);
    }

    if (!Storage.load('responses')) {
        Storage.save('responses', []);
    }

    if (!Storage.load('studentSessions')) {
        Storage.save('studentSessions', []);
    }

    if (!Storage.load('usernames')) {
        Storage.save('usernames', {});
    }
}

function generateId(prefix = 'id') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.classList.add('closing');
        setTimeout(() => modal.remove(), 300);
    }
}

function getCurrentUser() {
    return Storage.load('currentUser');
}

function logout() {
    Storage.remove('currentUser');
    window.location.href = 'auth.html';
}

document.addEventListener('DOMContentLoaded', () => {
    initializeMockData();
});
