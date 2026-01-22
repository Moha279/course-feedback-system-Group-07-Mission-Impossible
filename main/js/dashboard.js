let sortBy = 'newest';

function checkAuth() {
    if (typeof getCurrentUser !== 'function') return { id: 'test-user', name: 'Test User' };
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'auth.html';
        return null;
    }
    return currentUser;
}

function loadCourses() {
    const currentUser = checkAuth();
    if (!currentUser) return;

    const courses = Storage.load('courses') || [];
    const userCourses = courses.filter(c => c.userId === currentUser.id);
    
    const sortedCourses = [...userCourses].sort((a, b) => {
        if (sortBy === 'newest') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortBy === 'oldest') {
            return new Date(a.createdAt) - new Date(b.createdAt);
        } else if (sortBy === 'name') {
            return a.courseName.localeCompare(b.courseName);
        }
    });

    const container = document.getElementById('courses-container');
    
    if (sortedCourses.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg class="empty-state-icon icon-xl" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <path d="M16 2v4M8 2v4M3 10h18"></path>
                </svg>
                <p>No courses yet. Create your first course to get started!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = sortedCourses.map(course => {
        const sessions = Storage.load('sessions') || [];
        const courseSessions = sessions.filter(s => s.courseId === course.id);
        const activeSessions = courseSessions.filter(s => s.isActive);

        return `
            <div class="card course-card" onclick="goToCourse('${course.id}')">
                <div class="card-header">
                    <div class="flex items-start justify-between">
                        <div style="flex: 1;">
                            <h3 class="card-title">${course.courseName}</h3>
                            <p class="card-description">${course.courseCode}</p>
                        </div>
                        <button class="btn btn-ghost btn-icon" onclick="deleteCourse(event, '${course.id}')" title="Delete course">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="card-content">
                    <div class="flex items-center justify-between mb-3">
                        <div>
                            <p class="text-sm" style="color: var(--muted-foreground);">Total Sessions</p>
                            <p class="text-lg" style="font-weight: 600;">${courseSessions.length}</p>
                        </div>
                        <div>
                            <p class="text-sm" style="color: var(--muted-foreground);">Active Sessions</p>
                            <p class="text-lg" style="font-weight: 600; color: #10b981;">${activeSessions.length}</p>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button class="btn btn-outline" style="flex: 1;" onclick="event.stopPropagation(); goToCourse('${course.id}')">
                            View Sessions
                        </button>
                        <button class="btn btn-primary" style="flex: 1;" onclick="event.stopPropagation(); showCreateSessionModal('${course.id}')">
                            New Session
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function changeSortBy(newSort) {
    sortBy = newSort;
    document.querySelectorAll('.sort-option').forEach(opt => {
        opt.classList.remove('active');
    });
    event.target.classList.add('active');
    loadCourses();
}

function closeLocalModal(element) {
    const modal = element.closest('.modal-overlay');
    if (modal) {
        document.body.removeChild(modal);
    }
}

function showCreateCourseModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.onclick = (e) => {
        if (e.target === modal) document.body.removeChild(modal);
    };
    
    modal.innerHTML = `
        <div class="modal" onclick="event.stopPropagation()">
            <div class="modal-header">
                <h3 class="modal-title">Create New Course</h3>
                <p class="modal-description">Add a new course to your dashboard</p>
            </div>
            <form onsubmit="handleCreateCourse(event)">
                <div class="modal-content">
                    <div class="form-group">
                        <label class="form-label">Course Name</label>
                        <input type="text" name="courseName" class="input" placeholder="e.g., Introduction to Computer Science" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Course Code</label>
                        <input type="text" name="courseCode" class="input" placeholder="e.g., CS101" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline" onclick="document.body.removeChild(this.closest('.modal-overlay'))">Cancel</button>
                    <button type="submit" class="btn btn-primary">Create Course</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function showCreateSessionModal(courseId) {
    const savedTemplates = Storage.load('questionTemplates') || [];
    window.questionTemplates = [...savedTemplates];

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';

    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };

    modal.innerHTML = `
        <div class="modal session-modal" onclick="event.stopPropagation()">
            <div class="modal-header">
                <h3 class="modal-title">Create New Session</h3>
                <p class="modal-description">Set up a feedback session for your students</p>
            </div>

            <form onsubmit="handleCreateSession(event)">
                <input type="hidden" name="courseId" value="${courseId}">

                <div class="modal-content">
                    <div class="form-group">
                        <label class="form-label">Session Name *</label>
                        <input type="text" name="sessionName" class="input"
                               placeholder="e.g., Week 1: Introduction" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Date *</label>
                        <input type="date" name="sessionDate" class="input"
                               value="${new Date().toISOString().split('T')[0]}" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Week Number *</label>
                        <input type="number" name="weekNumber" class="input"
                               placeholder="e.g., 1" min="1" required>
                    </div>

                    <div class="form-group">
                        <div class="flex justify-between items-center mb-2">
                            <label class="form-label" style="margin: 0;">Questions *</label>
                            <button type="button" class="btn btn-sm btn-outline" onclick="addQuestion()">
                                <svg class="icon" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M12 8v8M8 12h8"></path>
                                </svg>
                                Add Question
                            </button>
                        </div>
                        <div id="questions-container">
                            <!-- Questions will be added here -->
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Create Session</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    addQuestion();
}


function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) document.body.removeChild(modal);
}

function addQuestion() {
    const container = document.getElementById('questions-container');
    if (!container) return;

    const index = container.children.length + 1;

    const question = document.createElement('div');
    question.className = 'question-card';
    question.style.border = '1px solid #e5e7eb';
    question.style.borderRadius = '8px';
    question.style.padding = '0.75rem';
    question.style.marginBottom = '0.75rem';

    question.innerHTML = `
        <div class="form-group">
            <label class="form-label">Question ${index}</label>
            <input type="text" class="input" placeholder="Enter question">
        </div>

        <div class="form-group">
            <label class="form-label">Answer Type</label>
            <select class="select">
                <option value="text">Text</option>
                <option value="rating">Rating (1–5)</option>
                <option value="yesno">Yes / No</option>
            </select>
        </div>
    `;

    container.appendChild(question);
}

function handleCreateCourse(e) {
    e.preventDefault();
    const currentUser = checkAuth();
    if (!currentUser) return;

    const formData = new FormData(e.target);
    const courseName = formData.get('courseName');
    const courseCode = formData.get('courseCode');

    const courses = Storage.load('courses') || [];
    
    const newId = typeof generateId === 'function' ? generateId('course') : 'course_' + Date.now();

    const newCourse = {
        id: newId,
        userId: currentUser.id,
        courseName,
        courseCode,
        createdAt: new Date().toISOString()
    };

    courses.push(newCourse);
    Storage.save('courses', courses);

    if (typeof showToast === 'function') showToast('Course created successfully!');
    
    const modal = e.target.closest('.modal-overlay');
    if (modal) document.body.removeChild(modal);

    loadSessions();
}


function handleCreateSession(e) {
    e.preventDefault();
    
    const currentUser = checkAuth();
    if (!currentUser) return;

    const formData = new FormData(e.target);
    const courseId = formData.get('courseId');
    
    const sessionName = formData.get('sessionName');
    const sessionDate = formData.get('sessionDate');
    const weekNumber = formData.get('weekNumber');
    const description = formData.get('description');

    const sessions = Storage.load('sessions') || [];
    
    const newId = typeof generateId === 'function' ? generateId('session') : 'session_' + Date.now();

    const newSession = {
        id: newId,
        courseId: courseId,
        userId: currentUser.id,
        name: sessionName,
        date: sessionDate,
        week: weekNumber || null,
        description: description || '',
        isActive: true,
        status: 'open',
        createdAt: new Date().toISOString()
    };

    sessions.push(newSession);
    Storage.save('sessions', sessions);

    if (typeof showToast === 'function') showToast('Session created successfully!');
    
    const modal = e.target.closest('.modal-overlay');
    if (modal) document.body.removeChild(modal);

    window.location.reload();
    loadCourses();
}



function deleteCourse(event, courseId) {
    event.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this course? This will also delete all associated sessions and responses.')) {
        return;
    }

    const courses = Storage.load('courses') || [];
    const sessions = Storage.load('sessions') || [];
    const responses = Storage.load('responses') || [];

    const updatedCourses = courses.filter(c => c.id !== courseId);
    Storage.save('courses', updatedCourses);

    const courseSessionIds = sessions.filter(s => s.courseId === courseId).map(s => s.id);
    const updatedSessions = sessions.filter(s => s.courseId !== courseId);
    Storage.save('sessions', updatedSessions);

    const updatedResponses = responses.filter(r => !courseSessionIds.includes(r.sessionId));
    Storage.save('responses', updatedResponses);

    if (typeof showToast === 'function') showToast('Course deleted successfully!');
    loadCourses();
}

function goToCourse(courseId) {
    window.location.href = `course-view.html?courseId=${courseId}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = checkAuth();
    if (currentUser) {
        const userNameEl = document.getElementById('user-name');
        if (userNameEl) userNameEl.textContent = currentUser.name || currentUser.email;
        loadCourses();
    }
});

