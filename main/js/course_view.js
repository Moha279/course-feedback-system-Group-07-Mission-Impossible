function loadSessions() {
    const courseId = getCourseIdFromUrl();
    const sessions = Storage.load('sessions') || [];
    const courseSessions = sessions.filter(s => s.courseId === courseId);

    const container = document.getElementById('sessions-container');
    if (!container) return;

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

                    <button class="btn btn-outline btn-sm">

                        <svg class="icon" viewBox="0 0 24 24">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>

                        Edit Session
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


                    <button class="btn btn-outline btn-sm" , style="color: #dc2626;">

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


