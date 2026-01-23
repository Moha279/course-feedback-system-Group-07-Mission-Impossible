function loadSessions() {
    const courseId = getCourseIdFromUrl();
    const sessions = Storage.load('sessions') || [];
    const courseSessions = sessions.filter(s => s.courseId === courseId);

    const container = document.getElementById('sessions-container');
    if (!container) return;

    if (courseSessions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg class="empty-state-icon" viewBox="0 0 24 24">
                    <path d="M3 3h18v18H3z"></path>
                    <path d="M7 7h10v10H7z"></path>
                </svg>
                <h3>No sessions yet</h3>
                <p>Create your first session to start collecting feedback.</p>
                <button class="btn btn-primary mt-4"
                    onclick="showCreateSessionModal(getCourseIdFromUrl())">
                    Create Session
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = courseSessions.map(session => `
        <div class="card">
            <div class="card-content">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <div class="flex items-center gap-2">
                            <h4>${session.name}</h4>
                            <span class="badge badge-secondary">Week ${session.week}</span>
                            <span class="badge ${session.isActive ? "badge-success" : "badge-warning"}">
                                ${session.isActive ? "Active" : "Closed"}
                            </span>
                        </div>

                        <p class="text-sm" style="color: var(--muted-foreground);">
                            38 responses
                        </p>
                        
                    </div>
                </div>




                <div class="session-actions">
                    
                    <button class="btn btn-outline btn-sm"
                            onclick="window.location.href = 'student-feedback.html'">

                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>

                        Preview
                    </button>


                    ${session.isActive ? `
                        <button class="btn btn-outline btn-sm"
                            onclick="window.location.href = 'live-feedback.html'">

                            <svg class="icon" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="2"></circle>
                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                            </svg>

                            Live View
                        </button>
                    ` : ''}


                    ${!session.isActive ? `
                        
                        <button class="btn btn-outline btn-sm"
                            onclick="window.location.href = 'session-analytics.html'">

                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M3 3v18h18"></path>
                                <path d="M18 17V9M13 17V5M8 17v-3"></path>
                            </svg>

                            Analytics
                        </button>
                    ` : ''}

                    <button class="btn btn-outline btn-sm"
                            onclick="event.stopPropagation(); showQrCodeModal();">

                            <svg class="icon" viewBox="0 0 24 24">
                                <rect x="3" y="3" width="7" height="7"></rect>
                                <rect x="14" y="3" width="7" height="7"></rect>
                                <rect x="14" y="14" width="7" height="7"></rect>
                                <rect x="3" y="14" width="7" height="7"></rect>
                            </svg>

                        QR-Code
                    </button>


                    <button class="btn btn-outline btn-sm"
                                onclick="window.prompt('Link zum Kopieren:', 'student-feedback.html');">

                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"></path>
                                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"></path>
                            </svg>

                        Session-Link
                    </button>


                    <button class="btn btn-sm"
                        style="background-color: ${session.isActive ? '#dc2626' : '#16a34a'}; 
                            color: white; border-color: transparent;"
                       onclick="${session.isActive 
                        ? `confirmCloseSession('${session.id}')` 
                        : `closeSession('${session.id}')`}">
                        <svg class="icon" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M15 9l-6 6M9 9l6 6"></path>
                        </svg>

                        ${session.isActive ? 'Close Session' : 'Reopen Session'}
                    </button>


                    <button class="btn btn-outline btn-sm">
                        <svg class="icon" viewBox="0 0 24 24">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>

                        Edit Session
                    </button>


                    <button class="btn btn-outline btn-sm" style="color: #dc2626; margin-left: auto;"
                            onclick="confirmDeleteSession('${session.id}')">
                        <svg class="icon" viewBox="0 0 24 24">
                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                        </svg>

                        Delete
                    </button>


                </div>

            </div>
        </div>
    `).join('');
}

function getCourseIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('courseId');
}

function loadCourseHeader() {
    const courseId = getCourseIdFromUrl();
    const nameEl = document.getElementById('course-name');
    const codeEl = document.getElementById('course-code');
    const editStatusEl = document.getElementById('course-edit-status');
    const editBtn = document.getElementById('edit-course-btn');

    if (!courseId || typeof Storage === 'undefined') {
        if (editStatusEl) {
            editStatusEl.classList.remove('badge-success');
            editStatusEl.classList.add('badge-secondary');
            editStatusEl.textContent = 'Read-only';
        }
        if (editBtn) {
            editBtn.disabled = true;
            editBtn.title = 'Select a course to edit';
        }
        return;
    }

    const courses = Storage.load('courses') || [];
    const course = courses.find(c => c.id === courseId);
    if (!course) {
        if (nameEl) nameEl.textContent = 'Course';
        if (codeEl) codeEl.textContent = '';
        if (editStatusEl) {
            editStatusEl.classList.remove('badge-success');
            editStatusEl.classList.add('badge-secondary');
            editStatusEl.textContent = 'Read-only';
        }
        if (editBtn) {
            editBtn.disabled = true;
            editBtn.title = 'Course not found';
        }
        return;
    }

    if (nameEl) nameEl.textContent = course.courseName;
    if (codeEl) codeEl.textContent = course.courseCode;

    if (editStatusEl) {
        editStatusEl.classList.remove('badge-secondary');
        editStatusEl.classList.add('badge-success');
        editStatusEl.textContent = 'Editable';
    }

    if (editBtn) {
        editBtn.disabled = false;
        editBtn.removeAttribute('title');
    }

    document.title = `${course.courseName} - Course View`;
}

function showEditCourseModal() {
    const courseId = getCourseIdFromUrl();
    if (!courseId || typeof Storage === 'undefined') return;

    const courses = Storage.load('courses') || [];
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';

    modal.onclick = (e) => {
        if (e.target === modal) document.body.removeChild(modal);
    };

    modal.innerHTML = `
        <div class="modal" onclick="event.stopPropagation()">
            <div class="modal-header">
                <h3 class="modal-title">Edit Course</h3>
                <p class="modal-description">Update this course on your dashboard</p>
            </div>
            <form onsubmit="handleEditCourse(event)">
                <div class="modal-content">
                    <input type="hidden" name="courseId" value="${courseId}">
                    <div class="form-group">
                        <label class="form-label">Course Name</label>
                        <input type="text" name="courseName" class="input" value="${course.courseName}" placeholder="e.g., Introduction to Computer Science" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Course Code</label>
                        <input type="text" name="courseCode" class="input" value="${course.courseCode}" placeholder="e.g., CS101" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline" onclick="document.body.removeChild(this.closest('.modal-overlay'))">Cancel</button>
                    <button type="submit" class="btn btn-primary">Update Course</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
}

function handleEditCourse(e) {
    e.preventDefault();
    if (typeof Storage === 'undefined') return;

    const formData = new FormData(e.target);
    const courseId = formData.get('courseId');
    const courseName = formData.get('courseName');
    const courseCode = formData.get('courseCode');

    const courses = Storage.load('courses') || [];
    const courseIndex = courses.findIndex(c => c.id === courseId);
    if (courseIndex === -1) return;

    courses[courseIndex].courseName = courseName;
    courses[courseIndex].courseCode = courseCode;

    Storage.save('courses', courses);
    if (typeof showToast === 'function') showToast('Course updated successfully!');

    const modal = e.target.closest('.modal-overlay');
    if (modal) document.body.removeChild(modal);

    loadCourseHeader();
}

function showQrCodeModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';

    modal.onclick = (e) => {
        if (e.target === modal) document.body.removeChild(modal);
    };

    const feedbackUrl = new URL('student-feedback.html', window.location.href).href;
    const qrSrc = 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=' + encodeURIComponent(feedbackUrl);

    modal.innerHTML = `
        <div class="modal" onclick="event.stopPropagation()" style="max-width: 320px;">
            <div class="modal-content" style="display:flex; justify-content:center; padding: 1.5rem;">
                <div style="background: white; border: 1px solid var(--border); border-radius: 0.5rem; padding: 1rem;">
                    <img src="${qrSrc}" alt="QR code" width="220" height="220" style="display:block;" />
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

document.addEventListener('DOMContentLoaded', () => {
    loadCourseHeader();
    loadSessions();
});

function closeSession(sessionId) {
    const sessions = Storage.load('sessions') || [];
    const index = sessions.findIndex(s => s.id === sessionId);
    if (index === -1) return;

    const session = sessions[index];

    session.isActive = !session.isActive;
    session.status = session.isActive ? 'open' : 'closed';

    Storage.save('sessions', sessions);

    if (typeof showToast === 'function') {
        showToast(session.isActive ? 'Session reopened!' : 'Session closed!');
    }

    loadSessions();
}

function confirmCloseSession(sessionId) {
    const modal = document.createElement('div');

    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.right = '0';
    modal.style.bottom = '0';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '1000';

    modal.onclick = (e) => {
        if (e.target === modal) document.body.removeChild(modal);
    };

    modal.innerHTML = `
        <div style="background: white; border-radius: 0.75rem; width: 90%; max-width: 520px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); overflow: hidden;" onclick="event.stopPropagation()">
            <div style="padding: 1.5rem; border-bottom: 1px solid rgba(0, 0, 0, 0.1);">
                <h3 style="font-size: 1.25rem; font-weight: 600; margin: 0;">End session?</h3>
                <p style="color: rgba(113, 113, 130, 1); font-size: 0.875rem; margin-top: 0.25rem; margin-bottom: 0;">Ending the session is final. Students can no longer submit feedback.</p>
            </div>
            <div style="padding: 1.5rem; display: flex; gap: 0.5rem; justify-content: flex-end;">
                <button type="button" class="btn btn-outline" onclick="document.body.removeChild(this.closest('[data-close-session-modal]'))">Cancel</button>
                <button type="button" class="btn btn-destructive" onclick="confirmCloseSessionAction('${sessionId}', this)">Yes, close session</button>
            </div>
        </div>
    `;

    modal.setAttribute('data-close-session-modal', 'true');
    document.body.appendChild(modal);
}

function confirmCloseSessionAction(sessionId, btn) {
    const modal = btn.closest('[data-close-session-modal]');
    if (modal) document.body.removeChild(modal);
    closeSession(sessionId);
}

function confirmDeleteSession(sessionId) {
    const modal = document.createElement('div');

    modal.style.position = 'fixed';
    modal.style.inset = '0';
    modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '1000';

    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };

    modal.innerHTML = `
        <div style="background:white;border-radius:12px;width:90%;max-width:480px;padding:24px;"
             onclick="event.stopPropagation()">
            <h3 style="font-size:1.25rem;font-weight:600;margin:0;">
                Delete session?
            </h3>
            <p style="margin:8px 0 20px;color:#6b7280;">
                This action cannot be undone.
            </p>

            <div style="display:flex;justify-content:flex-end;gap:8px;">
                <button class="btn btn-outline"
                        onclick="this.closest('[data-delete-modal]').remove()">
                    Cancel
                </button>
                <button class="btn btn-destructive"
                        onclick="deleteSessionConfirmed('${sessionId}', this)">
                    Delete
                </button>
            </div>
        </div>
    `;

    modal.setAttribute('data-delete-modal', 'true');
    document.body.appendChild(modal);
}

function deleteSessionConfirmed(sessionId, btn) {
    const modal = btn.closest('[data-delete-modal]');
    if (modal) modal.remove();

    const sessions = Storage.load('sessions') || [];
    const updatedSessions = sessions.filter(s => s.id !== sessionId);

    Storage.save('sessions', updatedSessions);

    loadSessions(); 
}



