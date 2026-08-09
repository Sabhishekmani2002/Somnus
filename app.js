/**
 * Somnus Restful Sleep Application - Standalone Bundle
 * Works directly under file:// protocol without CORS restriction!
 */

(function() {
  'use strict';

  // ==========================================
  // 1. STORE & STATE MANAGEMENT
  // ==========================================
  const STORAGE_KEYS = {
    PROFILE: 'somnus_profile',
    ASSESSMENT: 'somnus_assessment',
    SLEEP_LOGS: 'somnus_logs',
    CBT_PROGRESS: 'somnus_cbt',
    HABITS: 'somnus_habits'
  };

  const DEFAULT_ASSESSMENT = {
    bedtime: "23:00",
    waketime: "07:00",
    quality: 3,
    issues: ["Feeling tired in the morning"],
    stressLevel: 3,
    completed: false
  };

  const DEFAULT_PROFILE = {
    name: "Alex",
    targetSleepDuration: 8.0,
    targetBedtime: "23:00",
    targetWaketime: "07:00"
  };

  const INITIAL_SLEEP_LOGS = [
    {
      id: "log_1",
      date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
      bedtime: "23:15",
      waketime: "06:45",
      durationHours: 7.5,
      efficiencyPct: 92,
      quality: "Good",
      awakenings: 1,
      score: 82,
      notes: "Felt well-rested after 15m wind down reading."
    },
    {
      id: "log_2",
      date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
      bedtime: "23:45",
      waketime: "06:30",
      durationHours: 6.75,
      efficiencyPct: 88,
      quality: "Fair",
      awakenings: 2,
      score: 75,
      notes: "Late phone usage before sleep."
    },
    {
      id: "log_3",
      date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
      bedtime: "22:45",
      waketime: "07:15",
      durationHours: 8.5,
      efficiencyPct: 95,
      quality: "Excellent",
      awakenings: 0,
      score: 91,
      notes: "Deep sleep after 10m ocean ambient meditation."
    }
  ];

  const DEFAULT_HABITS = [
    { id: "h1", title: "Wind-down 30m before bed", completed: true },
    { id: "h2", title: "No screens after 10:00 PM", completed: false },
    { id: "h3", title: "Keep bedroom temp at 67°F", completed: true },
    { id: "h4", title: "Morning light exposure (10 mins)", completed: true }
  ];

  const Store = {
    getProfile() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
        return data ? JSON.parse(data) : DEFAULT_PROFILE;
      } catch (e) { return DEFAULT_PROFILE; }
    },

    saveProfile(profile) {
      try { localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile)); } catch (e) {}
    },

    getAssessment() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.ASSESSMENT);
        return data ? JSON.parse(data) : DEFAULT_ASSESSMENT;
      } catch (e) { return DEFAULT_ASSESSMENT; }
    },

    saveAssessment(assessment) {
      try {
        assessment.completed = true;
        localStorage.setItem(STORAGE_KEYS.ASSESSMENT, JSON.stringify(assessment));
      } catch (e) {}
    },

    getSleepLogs() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.SLEEP_LOGS);
        return data ? JSON.parse(data) : INITIAL_SLEEP_LOGS;
      } catch (e) { return INITIAL_SLEEP_LOGS; }
    },

    addSleepLog(logEntry) {
      const logs = this.getSleepLogs();
      const newLog = {
        id: "log_" + Date.now(),
        date: logEntry.date || new Date().toISOString().split('T')[0],
        bedtime: logEntry.bedtime || "23:00",
        waketime: logEntry.waketime || "07:00",
        durationHours: logEntry.durationHours || 7.5,
        efficiencyPct: logEntry.efficiencyPct || 90,
        quality: logEntry.quality || "Good",
        awakenings: logEntry.awakenings || 0,
        score: logEntry.score || Math.min(100, Math.round(logEntry.durationHours * 10 + logEntry.efficiencyPct * 0.2)),
        notes: logEntry.notes || ""
      };
      logs.unshift(newLog);
      try { localStorage.setItem(STORAGE_KEYS.SLEEP_LOGS, JSON.stringify(logs)); } catch (e) {}
      return newLog;
    },

    getLatestSleepLog() {
      const logs = this.getSleepLogs();
      return logs.length > 0 ? logs[0] : INITIAL_SLEEP_LOGS[0];
    },

    calculateCurrentSleepScore() {
      const logs = this.getSleepLogs();
      if (logs.length === 0) return 78;
      const recent = logs.slice(0, 3);
      const avgScore = recent.reduce((sum, item) => sum + item.score, 0) / recent.length;
      return Math.round(avgScore);
    },

    getHabits() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.HABITS);
        return data ? JSON.parse(data) : DEFAULT_HABITS;
      } catch (e) { return DEFAULT_HABITS; }
    },

    toggleHabit(habitId) {
      const habits = this.getHabits();
      const target = habits.find(h => h.id === habitId);
      if (target) {
        target.completed = !target.completed;
        try { localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits)); } catch (e) {}
      }
      return habits;
    },

    getCbtProgress() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.CBT_PROGRESS);
        return data ? JSON.parse(data) : { currentWeek: 1, progressPct: 25, completedLessons: ['lesson_1'] };
      } catch (e) { return { currentWeek: 1, progressPct: 25, completedLessons: ['lesson_1'] }; }
    },

    completeCbtLesson(lessonId) {
      const progress = this.getCbtProgress();
      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
        progress.progressPct = Math.min(100, progress.completedLessons.length * 25);
        try { localStorage.setItem(STORAGE_KEYS.CBT_PROGRESS, JSON.stringify(progress)); } catch (e) {}
      }
      return progress;
    },

    resetAllData() {
      try {
        localStorage.removeItem(STORAGE_KEYS.PROFILE);
        localStorage.removeItem(STORAGE_KEYS.ASSESSMENT);
        localStorage.removeItem(STORAGE_KEYS.SLEEP_LOGS);
        localStorage.removeItem(STORAGE_KEYS.CBT_PROGRESS);
        localStorage.removeItem(STORAGE_KEYS.HABITS);
      } catch (e) {}
    }
  };

  // ==========================================
  // 2. LOG MODAL COMPONENT
  // ==========================================
  function renderLogModal(onSaveCallback) {
    const existingModal = document.getElementById('somnus-log-modal');
    if (existingModal) existingModal.remove();

    const modalHtml = `
      <div id="somnus-log-modal" class="fixed inset-0 z-[100] flex items-center justify-center p-margin-mobile bg-background/80 backdrop-blur-xl">
        <div class="glass-panel w-full max-w-lg rounded-2xl p-md border border-white/10 shadow-2xl space-y-md relative">
          <div class="flex justify-between items-center pb-xs border-b border-white/10">
            <div class="flex items-center gap-sm">
              <span class="material-symbols-outlined text-secondary text-2xl">bedtime</span>
              <h3 class="font-display text-2xl font-bold text-primary">Log Sleep Entry</h3>
            </div>
            <button id="modal-close-btn" class="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-moonlight-accent hover:bg-white/10 transition-colors">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <form id="log-sleep-form" class="space-y-md">
            <div class="grid grid-cols-2 gap-md">
              <div>
                <label class="block text-xs font-semibold text-text-muted uppercase mb-xs">Bedtime</label>
                <input id="modal-bedtime" type="time" value="23:00" class="glass-input w-full rounded-xl px-3 py-2 text-body-md" required />
              </div>
              <div>
                <label class="block text-xs font-semibold text-text-muted uppercase mb-xs">Wake Time</label>
                <input id="modal-waketime" type="time" value="07:00" class="glass-input w-full rounded-xl px-3 py-2 text-body-md" required />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-md">
              <div>
                <label class="block text-xs font-semibold text-text-muted uppercase mb-xs">Sleep Quality</label>
                <select id="modal-quality" class="glass-input w-full rounded-xl px-3 py-2 text-body-md bg-background text-moonlight-accent">
                  <option value="Excellent">Excellent</option>
                  <option value="Good" selected>Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-text-muted uppercase mb-xs">Awakenings</label>
                <input id="modal-awakenings" type="number" min="0" max="10" value="1" class="glass-input w-full rounded-xl px-3 py-2 text-body-md" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-text-muted uppercase mb-xs">Sleep Notes & Observations</label>
              <textarea id="modal-notes" rows="3" placeholder="Felt calm, read 15 mins before sleeping, no caffeine after 2 PM..." class="glass-input w-full rounded-xl p-3 text-body-md"></textarea>
            </div>

            <div class="pt-sm flex justify-end gap-sm">
              <button type="button" id="modal-cancel-btn" class="px-4 py-2 rounded-xl text-text-muted hover:text-moonlight-accent transition-colors">Cancel</button>
              <button type="submit" class="bg-secondary text-background font-semibold px-6 py-2 rounded-xl shadow-[0_0_15px_rgba(195,192,255,0.4)] hover:shadow-[0_0_25px_rgba(195,192,255,0.6)] transition-all transform hover:-translate-y-0.5">
                Save Entry
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.getElementById('somnus-log-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const form = document.getElementById('log-sleep-form');

    const closeModal = () => modal.remove();

    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const bedtime = document.getElementById('modal-bedtime').value;
      const waketime = document.getElementById('modal-waketime').value;
      const quality = document.getElementById('modal-quality').value;
      const awakenings = parseInt(document.getElementById('modal-awakenings').value) || 0;
      const notes = document.getElementById('modal-notes').value;

      const [bH, bM] = bedtime.split(':').map(Number);
      const [wH, wM] = waketime.split(':').map(Number);
      let duration = (wH + wM / 60) - (bH + bM / 60);
      if (duration <= 0) duration += 24;
      duration = Math.round(duration * 10) / 10;

      const efficiencyPct = Math.max(70, Math.min(98, Math.round(100 - awakenings * 5)));
      const qualityScoreMap = { "Excellent": 92, "Good": 82, "Fair": 72, "Poor": 58 };
      const score = Math.min(100, Math.round((qualityScoreMap[quality] || 80) + (duration >= 7 ? 5 : -5)));

      Store.addSleepLog({
        date: new Date().toISOString().split('T')[0],
        bedtime,
        waketime,
        durationHours: duration,
        efficiencyPct,
        quality,
        awakenings,
        score,
        notes
      });

      closeModal();
      if (onSaveCallback) onSaveCallback();
    });
  }

  // ==========================================
  // 3. VIEWS
  // ==========================================

  // WELCOME VIEW
  function renderWelcomeView(app) {
    return `
      <div class="relative w-full min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden px-margin-mobile md:px-margin-desktop py-xl">
        <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div class="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/20 blur-[120px] animate-pulse-slow mix-blend-screen"></div>
          <div class="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-tertiary/20 blur-[120px] animate-pulse-slow mix-blend-screen" style="animation-delay: 2s;"></div>
        </div>

        <div class="w-full max-w-[1200px] flex flex-col md:flex-row items-center justify-between gap-xl z-10">
          <div class="flex-1 flex flex-col items-start justify-center space-y-md text-left z-20 w-full">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium">
              <span class="material-symbols-outlined text-base">auto_awesome</span> Restful Sleep Companion
            </div>
            <h1 class="font-display text-4xl md:text-6xl font-bold text-primary tracking-tight leading-tight">
              Somnus
            </h1>
            <h2 class="font-display text-2xl md:text-4xl font-semibold text-moonlight-accent">
              Your journey to restful sleep starts here.
            </h2>
            <p class="text-body-lg text-text-variant max-w-lg">
              Discover personalized sleep insights, circadian rhythm optimization, and deep wind-down soundscapes designed to restore your natural rest cycle.
            </p>
            <div class="pt-md w-full md:w-auto flex flex-col sm:flex-row gap-md">
              <button id="btn-get-started" class="w-full md:w-auto bg-secondary text-background font-semibold px-8 py-3 rounded-full shadow-[0_0_20px_rgba(195,192,255,0.4)] hover:shadow-[0_0_30px_rgba(195,192,255,0.6)] transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-sm">
                Start Assessment
                <span class="material-symbols-outlined">arrow_forward</span>
              </button>
              <button id="btn-go-dashboard" class="w-full md:w-auto glass-panel text-moonlight-accent font-medium px-6 py-3 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center gap-xs">
                Go to Dashboard
              </button>
            </div>
          </div>

          <div class="flex-1 w-full h-[380px] md:h-[500px] relative rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl animate-float">
            <div class="absolute inset-0 bg-gradient-to-br from-[#0B1120] via-[#1a1f38] to-[#110e2e]"></div>
            <div class="absolute top-12 right-12 w-28 h-28 rounded-full bg-gradient-to-br from-[#e0e7ff] to-[#a5b4fc] opacity-80 blur-[1px] shadow-[0_0_50px_rgba(195,192,255,0.6)]"></div>
            <div class="absolute inset-0 opacity-40 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:24px_24px]"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent"></div>

            <div class="absolute bottom-md left-md right-md glass-panel rounded-2xl p-md flex items-center gap-md border border-white/15 backdrop-blur-2xl">
              <div class="w-12 h-12 rounded-full bg-secondary/20 border border-secondary/40 flex items-center justify-center shadow-[0_0_15px_rgba(195,192,255,0.3)]">
                <span class="material-symbols-outlined text-secondary">bedtime</span>
              </div>
              <div>
                <p class="text-xs uppercase font-medium text-text-muted tracking-wider">Expected Sleep Quality</p>
                <p class="font-display text-lg font-semibold text-primary">Deep & Restorative</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function attachWelcomeListeners(app) {
    document.getElementById('btn-get-started')?.addEventListener('click', () => app.navigate('assessment'));
    document.getElementById('btn-go-dashboard')?.addEventListener('click', () => app.navigate('dashboard'));
  }

  // ASSESSMENT VIEW
  function renderAssessmentView(app) {
    const current = Store.getAssessment();
    const isIssueSelected = (issueName) => (current.issues || []).includes(issueName) ? 'selected' : '';

    return `
      <div class="w-full max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        <div class="max-w-2xl mx-auto space-y-xl">
          <div class="text-center space-y-sm">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs uppercase tracking-widest font-semibold">
              Step 1 of 1 • Assessment
            </div>
            <h2 class="font-display text-3xl md:text-4xl font-bold text-moonlight-accent">Sleep Assessment</h2>
            <p class="text-text-variant text-body-lg">Let's understand your sleep habits to build your tailored recovery plan.</p>
          </div>

          <form id="assessment-form" class="space-y-xl">
            <section class="glass-panel rounded-2xl p-md md:p-lg space-y-md border border-white/10">
              <h3 class="font-display text-xl text-primary font-semibold flex items-center gap-xs">
                <span class="material-symbols-outlined text-secondary">schedule</span> Schedule
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div class="space-y-xs">
                  <label class="block text-xs font-semibold text-text-muted uppercase tracking-wider">Usual Bedtime</label>
                  <div class="relative">
                    <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">bedtime</span>
                    <input id="input-bedtime" class="glass-input w-full rounded-xl pl-10 pr-3 py-3 text-body-md" type="time" value="${current.bedtime || '23:00'}" required/>
                  </div>
                </div>
                <div class="space-y-xs">
                  <label class="block text-xs font-semibold text-text-muted uppercase tracking-wider">Usual Wake Time</label>
                  <div class="relative">
                    <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">wb_sunny</span>
                    <input id="input-waketime" class="glass-input w-full rounded-xl pl-10 pr-3 py-3 text-body-md" type="time" value="${current.waketime || '07:00'}" required/>
                  </div>
                </div>
              </div>
            </section>

            <section class="glass-panel rounded-2xl p-md md:p-lg space-y-md border border-white/10">
              <div class="flex justify-between items-center">
                <h3 class="font-display text-xl text-primary font-semibold flex items-center gap-xs">
                  <span class="material-symbols-outlined text-secondary">sentiment_satisfied</span> Sleep Quality
                </h3>
                <span class="text-secondary font-semibold" id="quality-val-label">Good</span>
              </div>
              <div class="grid grid-cols-4 gap-sm pt-sm">
                <button class="quality-btn flex flex-col items-center gap-xs p-3 rounded-xl hover:bg-white/5 transition-all text-text-muted" data-val="1" type="button">
                  <span class="material-symbols-outlined text-3xl">sentiment_very_dissatisfied</span>
                  <span class="text-xs">Poor</span>
                </button>
                <button class="quality-btn flex flex-col items-center gap-xs p-3 rounded-xl hover:bg-white/5 transition-all text-text-muted" data-val="2" type="button">
                  <span class="material-symbols-outlined text-3xl">sentiment_dissatisfied</span>
                  <span class="text-xs">Fair</span>
                </button>
                <button class="quality-btn flex flex-col items-center gap-xs p-3 rounded-xl hover:bg-white/5 transition-all text-secondary bg-secondary/15 border border-secondary/30" data-val="3" type="button">
                  <span class="material-symbols-outlined text-3xl">sentiment_satisfied</span>
                  <span class="text-xs font-semibold">Good</span>
                </button>
                <button class="quality-btn flex flex-col items-center gap-xs p-3 rounded-xl hover:bg-white/5 transition-all text-text-muted" data-val="4" type="button">
                  <span class="material-symbols-outlined text-3xl">sentiment_very_satisfied</span>
                  <span class="text-xs">Excellent</span>
                </button>
              </div>
            </section>

            <section class="glass-panel rounded-2xl p-md md:p-lg space-y-md border border-white/10">
              <h3 class="font-display text-xl text-primary font-semibold flex items-center gap-xs">
                <span class="material-symbols-outlined text-secondary">error_outline</span> Common Issues
              </h3>
              <p class="text-sm text-text-variant">Select any challenges you regularly experience:</p>
              <div class="flex flex-wrap gap-sm pt-xs" id="issues-chips-container">
                <button class="chip ${isIssueSelected('Trouble falling asleep')} rounded-full px-4 py-2 text-sm" type="button">Trouble falling asleep</button>
                <button class="chip ${isIssueSelected('Waking up at night')} rounded-full px-4 py-2 text-sm" type="button">Waking up at night</button>
                <button class="chip ${isIssueSelected('Feeling tired in the morning')} rounded-full px-4 py-2 text-sm" type="button">Feeling tired in the morning</button>
                <button class="chip ${isIssueSelected('Vivid dreams/Nightmares')} rounded-full px-4 py-2 text-sm" type="button">Vivid dreams/Nightmares</button>
                <button class="chip ${isIssueSelected('Snoring')} rounded-full px-4 py-2 text-sm" type="button">Snoring</button>
                <button class="chip ${isIssueSelected('Restless legs')} rounded-full px-4 py-2 text-sm" type="button">Restless legs</button>
              </div>
            </section>

            <section class="glass-panel rounded-2xl p-md md:p-lg space-y-md border border-white/10">
              <div class="flex justify-between items-center">
                <h3 class="font-display text-xl text-primary font-semibold flex items-center gap-xs">
                  <span class="material-symbols-outlined text-secondary">psychology</span> Daily Stress Level
                </h3>
                <span class="text-secondary font-semibold" id="stress-val">Moderate</span>
              </div>
              <div class="pt-sm pb-xs">
                <input id="stress-slider" class="w-full" max="5" min="1" type="range" value="${current.stressLevel || 3}"/>
              </div>
              <div class="flex justify-between text-xs text-text-muted font-medium">
                <span>Very Low</span>
                <span>Low</span>
                <span>Moderate</span>
                <span>High</span>
                <span>Very High</span>
              </div>
            </section>

            <div class="pt-md">
              <button type="submit" class="w-full bg-secondary text-background font-display font-bold text-lg py-4 rounded-2xl shadow-[0_0_20px_rgba(195,192,255,0.4)] hover:shadow-[0_0_30px_rgba(195,192,255,0.6)] transition-all duration-300 transform hover:-translate-y-0.5">
                Complete & View Personalized Plan
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  function attachAssessmentListeners(app) {
    let selectedQuality = 3;
    const qualityLabels = ["Poor", "Fair", "Good", "Excellent"];

    const qualityBtns = document.querySelectorAll('.quality-btn');
    qualityBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        qualityBtns.forEach(b => {
          b.classList.remove('bg-secondary/15', 'border', 'border-secondary/30', 'text-secondary');
          b.classList.add('text-text-muted');
        });
        btn.classList.add('bg-secondary/15', 'border', 'border-secondary/30', 'text-secondary');
        btn.classList.remove('text-text-muted');
        selectedQuality = parseInt(btn.dataset.val);
        document.getElementById('quality-val-label').textContent = qualityLabels[selectedQuality - 1];
      });
    });

    const chips = document.querySelectorAll('#issues-chips-container .chip');
    chips.forEach(chip => chip.addEventListener('click', () => chip.classList.toggle('selected')));

    const stressSlider = document.getElementById('stress-slider');
    const stressLabel = document.getElementById('stress-val');
    const stressTextMap = ["Very Low", "Low", "Moderate", "High", "Very High"];
    stressSlider?.addEventListener('input', (e) => stressLabel.textContent = stressTextMap[e.target.value - 1]);

    const form = document.getElementById('assessment-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const bedtime = document.getElementById('input-bedtime').value;
      const waketime = document.getElementById('input-waketime').value;
      const stressLevel = parseInt(stressSlider.value);

      const selectedIssues = [];
      chips.forEach(chip => {
        if (chip.classList.contains('selected')) selectedIssues.push(chip.textContent.trim());
      });

      Store.saveAssessment({ bedtime, waketime, quality: selectedQuality, issues: selectedIssues, stressLevel });
      app.navigate('dashboard');
    });
  }

  // DASHBOARD VIEW
  function renderDashboardView(app) {
    const score = Store.calculateCurrentSleepScore();
    const latestLog = Store.getLatestSleepLog();
    const habits = Store.getHabits();
    const assessment = Store.getAssessment();

    const radius = 45;
    const circumference = 2 * Math.PI * radius;

    return `
      <div class="w-full max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop py-xl flex flex-col gap-xl">
        <section class="grid grid-cols-1 md:grid-cols-12 gap-md items-center">
          <div class="col-span-1 md:col-span-5 flex justify-center relative ambient-glow py-md">
            <div class="relative w-64 h-64 flex items-center justify-center">
              <svg class="w-full h-full" viewBox="0 0 100 100">
                <circle class="text-white/10 stroke-current" cx="50" cy="50" fill="transparent" r="45" stroke-width="6"></circle>
                <circle id="dashboard-score-ring" class="text-secondary stroke-current progress-ring__circle progress-glow" 
                        cx="50" cy="50" fill="transparent" r="45" stroke-width="6"
                        stroke-linecap="round"
                        stroke-dasharray="${circumference}"
                        stroke-dashoffset="${circumference}">
                </circle>
              </svg>
              <div class="absolute flex flex-col items-center justify-center text-center">
                <span id="dashboard-score-val" class="font-display text-6xl font-bold text-secondary">${score}</span>
                <span class="text-xs font-semibold text-primary uppercase tracking-widest mt-1">Sleep Score</span>
              </div>
            </div>
          </div>

          <div class="col-span-1 md:col-span-7 flex flex-col gap-sm">
            <div class="flex justify-between items-center mb-xs">
              <h2 class="font-display text-2xl font-semibold text-moonlight-accent">Last Night's Overview</h2>
              <span class="text-xs text-text-muted font-medium">${latestLog.date || 'Recent'}</span>
            </div>
            <div class="grid grid-cols-2 gap-sm">
              <div class="glass-panel p-md rounded-2xl flex flex-col gap-xs hover:bg-white/10 transition-all border border-white/10">
                <div class="flex items-center gap-xs text-primary">
                  <span class="material-symbols-outlined">schedule</span>
                  <span class="text-xs font-semibold uppercase tracking-wider">Duration</span>
                </div>
                <div class="font-display text-2xl font-bold text-moonlight-accent">${latestLog.durationHours}h</div>
                <div class="text-xs text-text-variant font-medium">Target: 8.0h</div>
              </div>

              <div class="glass-panel p-md rounded-2xl flex flex-col gap-xs hover:bg-white/10 transition-all border border-white/10">
                <div class="flex items-center gap-xs text-primary">
                  <span class="material-symbols-outlined">bolt</span>
                  <span class="text-xs font-semibold uppercase tracking-wider">Efficiency</span>
                </div>
                <div class="font-display text-2xl font-bold text-moonlight-accent">${latestLog.efficiencyPct}%</div>
                <div class="text-xs text-tertiary font-medium">${latestLog.awakenings} awakening${latestLog.awakenings === 1 ? '' : 's'}</div>
              </div>

              <div class="glass-panel p-md rounded-2xl flex flex-col gap-xs hover:bg-white/10 transition-all border border-white/10">
                <div class="flex items-center gap-xs text-primary">
                  <span class="material-symbols-outlined">sentiment_satisfied</span>
                  <span class="text-xs font-semibold uppercase tracking-wider">Quality</span>
                </div>
                <div class="font-display text-xl font-bold text-moonlight-accent">${latestLog.quality}</div>
                <div class="text-xs text-text-variant font-medium">Self-rated</div>
              </div>

              <div class="glass-panel p-md rounded-2xl flex flex-col gap-xs hover:bg-white/10 transition-all border border-white/10">
                <div class="flex items-center gap-xs text-primary">
                  <span class="material-symbols-outlined">bedtime</span>
                  <span class="text-xs font-semibold uppercase tracking-wider">Bedtime</span>
                </div>
                <div class="font-display text-xl font-bold text-moonlight-accent">${latestLog.bedtime}</div>
                <div class="text-xs text-text-variant font-medium">Wake: ${latestLog.waketime}</div>
              </div>
            </div>
          </div>
        </section>

        <section class="grid grid-cols-1 md:grid-cols-12 gap-md">
          <div class="col-span-1 md:col-span-6 flex flex-col gap-sm">
            <h2 class="font-display text-xl font-semibold text-moonlight-accent mb-xs">Tonight's Plan</h2>
            <div class="glass-panel p-md md:p-lg rounded-2xl h-full flex flex-col justify-between border border-white/10">
              <div>
                <div class="flex justify-between items-start mb-md">
                  <div class="bg-secondary/15 text-secondary px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 border border-secondary/30">
                    <span class="material-symbols-outlined text-sm">auto_awesome</span> Recovery Focus
                  </div>
                  <span class="text-xs text-text-muted">Target: ${assessment.bedtime || '23:00'}</span>
                </div>
                <p class="text-body-md text-text-variant mb-md leading-relaxed">
                  Your circadian alignment shows standard performance. To maximize REM sleep tonight, begin winding down 30 minutes before bedtime with calming audio or reading.
                </p>
              </div>
              
              <div class="pt-md border-t border-white/10 flex items-center justify-between">
                <div class="flex items-center gap-sm">
                  <div class="w-10 h-10 rounded-xl bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary">
                    <span class="material-symbols-outlined">menu_book</span>
                  </div>
                  <div>
                    <div class="font-display text-sm font-semibold text-moonlight-accent">Recommended Activity</div>
                    <div class="text-xs text-text-muted">Wind-down reading at 10:30 PM</div>
                  </div>
                </div>
                <button id="btn-start-winddown-direct" class="bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/40 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all">
                  Start Studio
                </button>
              </div>
            </div>
          </div>

          <div class="col-span-1 md:col-span-6 flex flex-col gap-sm">
            <h2 class="font-display text-xl font-semibold text-moonlight-accent mb-xs">Evening Habits</h2>
            <div class="glass-panel p-md md:p-lg rounded-2xl h-full flex flex-col justify-between border border-white/10">
              <div class="space-y-sm" id="habits-list-container">
                ${habits.map(h => `
                  <div class="habit-item flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 cursor-pointer" data-id="${h.id}">
                    <div class="flex items-center gap-sm">
                      <div class="w-6 h-6 rounded-md border border-secondary/50 flex items-center justify-center ${h.completed ? 'bg-secondary text-background' : 'bg-transparent'} transition-colors">
                        ${h.completed ? '<span class="material-symbols-outlined text-sm font-bold">check</span>' : ''}
                      </div>
                      <span class="text-sm font-medium ${h.completed ? 'line-through text-text-muted' : 'text-moonlight-accent'}">${h.title}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </section>

        <section class="grid grid-cols-1 md:grid-cols-2 gap-md">
          <button id="btn-action-log-sleep" class="glass-panel p-md rounded-2xl flex items-center justify-between group hover:bg-secondary/15 transition-all duration-300 border border-white/10 relative overflow-hidden text-left">
            <div class="flex items-center gap-md z-10">
              <div class="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(195,192,255,0.2)]">
                <span class="material-symbols-outlined">bed</span>
              </div>
              <div>
                <div class="font-display text-lg font-semibold text-moonlight-accent">Log Last Night's Sleep</div>
                <div class="text-xs text-text-muted">Record custom hours, mood & awakenings</div>
              </div>
            </div>
            <span class="material-symbols-outlined text-text-muted group-hover:text-secondary transition-colors z-10">chevron_right</span>
          </button>

          <button id="btn-action-start-audio" class="glass-panel p-md rounded-2xl flex items-center justify-between group hover:bg-tertiary/15 transition-all duration-300 border border-white/10 relative overflow-hidden text-left">
            <div class="flex items-center gap-md z-10">
              <div class="w-12 h-12 rounded-full bg-tertiary/20 flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(189,194,255,0.2)]">
                <span class="material-symbols-outlined">graphic_eq</span>
              </div>
              <div>
                <div class="font-display text-lg font-semibold text-moonlight-accent">Ambient Sound & Breathing</div>
                <div class="text-xs text-text-muted">Relax with ocean waves & 4-7-8 rhythm</div>
              </div>
            </div>
            <span class="material-symbols-outlined text-text-muted group-hover:text-tertiary transition-colors z-10">chevron_right</span>
          </button>
        </section>
      </div>
    `;
  }

  function attachDashboardListeners(app) {
    setTimeout(() => {
      const ring = document.getElementById('dashboard-score-ring');
      if (ring) {
        const score = Store.calculateCurrentSleepScore();
        const radius = 45;
        const circumference = 2 * Math.PI * radius;
        const strokeOffset = circumference - (score / 100) * circumference;
        ring.style.strokeDashoffset = strokeOffset;
      }
    }, 150);

    const habitItems = document.querySelectorAll('.habit-item');
    habitItems.forEach(item => {
      item.addEventListener('click', () => {
        Store.toggleHabit(item.dataset.id);
        app.renderCurrentView();
      });
    });

    document.getElementById('btn-action-log-sleep')?.addEventListener('click', () => renderLogModal(() => app.renderCurrentView()));
    document.getElementById('btn-action-start-audio')?.addEventListener('click', () => app.navigate('winddown'));
    document.getElementById('btn-start-winddown-direct')?.addEventListener('click', () => app.navigate('winddown'));
  }

  // COACHING VIEW
  function renderCoachingView(app) {
    const cbtProgress = Store.getCbtProgress();
    const assessment = Store.getAssessment();
    const logs = Store.getSleepLogs();

    let aiTip = "Try reading for 15 mins before bed tonight to lower cortisol levels.";
    if ((assessment.issues || []).includes("Trouble falling asleep")) {
      aiTip = "Practice the 4-7-8 breathing exercise in the Wind-Down Studio 20 mins before bed.";
    } else if ((assessment.issues || []).includes("Feeling tired in the morning")) {
      aiTip = "Get 10 minutes of direct morning sunlight within 30 minutes of waking to anchor your circadian clock.";
    } else if (logs.length > 0 && logs[0].awakenings > 1) {
      aiTip = "Keep your room temperature at 65°F - 67°F tonight to prevent micro-awakenings.";
    }

    const cbtLessons = [
      { id: 'lesson_1', title: 'Sleep Efficiency & Stimulus Control', duration: '5 min read', desc: 'Associate your bed strictly with sleep and intimacy, not work or stress.' },
      { id: 'lesson_2', title: 'Managing Sleep Anxiety & Racing Thoughts', duration: '7 min read', desc: 'Cognitive restructuring techniques for nighttime worry.' },
      { id: 'lesson_3', title: 'Circadian Rhythm & Light Exposure', duration: '6 min read', desc: 'Optimizing natural sunlight and blue light timing for peak melatonin.' },
      { id: 'lesson_4', title: 'Sleep Restriction & Stabilization', duration: '8 min read', desc: 'Consolidating broken sleep into a solid, restorative sleep block.' }
    ];

    return `
      <div class="w-full max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop py-xl flex flex-col gap-xl">
        <section class="glass-panel rounded-3xl p-md md:p-lg flex flex-col md:flex-row items-center gap-md border border-white/10 relative overflow-hidden">
          <div class="w-24 h-24 md:w-32 md:h-32 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/30 shadow-[0_0_25px_rgba(195,192,255,0.3)] animate-pulse-slow flex-shrink-0">
            <span class="material-symbols-outlined text-secondary text-5xl">psychology</span>
          </div>
          <div class="flex-1 text-center md:text-left z-10 space-y-xs">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-semibold">
              <span class="material-symbols-outlined text-sm">auto_awesome</span> Somnus AI Sleep Coach
            </div>
            <h2 class="font-display text-2xl font-semibold text-moonlight-accent">Personalized Sleep Strategy</h2>
            <p class="text-text-variant text-body-md">Evidence-based Cognitive Behavioral Therapy for Insomnia (CBT-I).</p>
            
            <div class="mt-sm p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-sm">
              <span class="material-symbols-outlined text-tertiary">lightbulb</span>
              <span class="text-sm text-tertiary font-medium">${aiTip}</span>
            </div>
          </div>
        </section>

        <section class="flex flex-col gap-sm">
          <div class="flex justify-between items-center">
            <h3 class="font-display text-xl font-semibold text-moonlight-accent">Current Program</h3>
            <span class="text-xs text-text-muted">Week 1 of 4</span>
          </div>

          <div class="glass-panel rounded-3xl p-md md:p-lg border border-white/10 space-y-md">
            <div class="flex justify-between items-start">
              <div>
                <span class="text-xs font-semibold uppercase text-secondary tracking-wider">CBT for Insomnia</span>
                <h4 class="font-display text-2xl font-bold text-moonlight-accent mt-xs">Cognitive Sleep Restructuring</h4>
              </div>
              <div class="w-12 h-12 rounded-full bg-secondary/20 border border-secondary/40 flex items-center justify-center text-secondary">
                <span class="material-symbols-outlined">school</span>
              </div>
            </div>

            <div class="space-y-xs">
              <div class="flex justify-between text-xs text-text-variant font-medium">
                <span>Overall Program Progress</span>
                <span class="text-secondary font-bold">${cbtProgress.progressPct}%</span>
              </div>
              <div class="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div class="h-full bg-secondary rounded-full shadow-[0_0_10px_rgba(195,192,255,0.8)] transition-all duration-500" style="width: ${cbtProgress.progressPct}%"></div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-sm pt-sm">
              ${cbtLessons.map(lesson => {
                const isDone = cbtProgress.completedLessons.includes(lesson.id);
                return `
                  <div class="cbt-lesson-card glass-panel-interactive p-md rounded-2xl border border-white/10 flex flex-col justify-between cursor-pointer" data-id="${lesson.id}">
                    <div>
                      <div class="flex justify-between items-center mb-xs">
                        <span class="text-xs text-text-muted font-medium">${lesson.duration}</span>
                        ${isDone ? '<span class="text-xs text-secondary font-semibold flex items-center gap-1"><span class="material-symbols-outlined text-sm">check_circle</span> Completed</span>' : '<span class="text-xs text-text-variant">Tap to read</span>'}
                      </div>
                      <h5 class="font-display text-base font-semibold text-moonlight-accent">${lesson.title}</h5>
                      <p class="text-xs text-text-variant mt-xs line-clamp-2">${lesson.desc}</p>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </section>

        <section class="flex flex-col gap-sm">
          <h3 class="font-display text-xl font-semibold text-moonlight-accent mb-xs">Sleep Knowledge Base</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-md">
            <div class="glass-panel p-md rounded-2xl border border-white/10 flex flex-col gap-sm hover:border-secondary/30 transition-all">
              <span class="material-symbols-outlined text-tertiary text-3xl">brightness_medium</span>
              <h4 class="font-display text-lg font-semibold text-moonlight-accent">Why Blue Light Matters</h4>
              <p class="text-xs text-text-variant leading-relaxed">
                Blue light spectrum (450–480nm) suppresses pineal melatonin secretion. Switching to warm ambient lighting 2 hours before bed accelerates sleep onset.
              </p>
            </div>

            <div class="glass-panel p-md rounded-2xl border border-white/10 flex flex-col gap-sm hover:border-secondary/30 transition-all">
              <span class="material-symbols-outlined text-tertiary text-3xl">thermostat</span>
              <h4 class="font-display text-lg font-semibold text-moonlight-accent">Optimal Bedroom Climate</h4>
              <p class="text-xs text-text-variant leading-relaxed">
                Your core body temperature must drop by ~2°F to initiate sleep. Ambient bedroom temperatures between 65°F and 67°F yield the highest proportion of Deep slow-wave sleep.
              </p>
            </div>

            <div class="glass-panel p-md rounded-2xl border border-white/10 flex flex-col gap-sm hover:border-secondary/30 transition-all">
              <span class="material-symbols-outlined text-tertiary text-3xl">local_cafe</span>
              <h4 class="font-display text-lg font-semibold text-moonlight-accent">Caffeine Half-Life Dynamics</h4>
              <p class="text-xs text-text-variant leading-relaxed">
                Caffeine has a half-life of 5 to 7 hours. A cup of coffee at 4 PM means 50% of the adenosine blocker is still active in your brain at 10 PM.
              </p>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  function attachCoachingListeners(app) {
    const cards = document.querySelectorAll('.cbt-lesson-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        Store.completeCbtLesson(card.dataset.id);
        app.renderCurrentView();
      });
    });
  }

  // INSIGHTS VIEW
  function renderInsightsView(app) {
    const logs = Store.getSleepLogs();
    
    const avgScore = logs.length ? Math.round(logs.reduce((sum, l) => sum + l.score, 0) / logs.length) : 80;
    const avgDuration = logs.length ? (logs.reduce((sum, l) => sum + l.durationHours, 0) / logs.length).toFixed(1) : 7.5;
    const avgEfficiency = logs.length ? Math.round(logs.reduce((sum, l) => sum + l.efficiencyPct, 0) / logs.length) : 90;

    const maxScore = 100;
    const chartHeight = 160;
    const chartWidth = 600;

    const points = logs.map((log, index) => {
      const x = logs.length === 1 ? chartWidth / 2 : (index / (logs.length - 1)) * chartWidth;
      const y = chartHeight - (log.score / maxScore) * chartHeight;
      return `${x},${y}`;
    }).reverse();

    const polylinePoints = points.join(' ');

    return `
      <div class="w-full max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop py-xl flex flex-col gap-xl">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="font-display text-3xl font-bold text-moonlight-accent">Sleep Insights</h2>
            <p class="text-text-variant text-body-md">Historical trends and sleep architecture analysis.</p>
          </div>
          <div class="inline-flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
            <button class="px-3 py-1.5 rounded-lg bg-secondary text-background font-semibold">Weekly</button>
            <button class="px-3 py-1.5 rounded-lg text-text-muted hover:text-moonlight-accent">Monthly</button>
          </div>
        </div>

        <section class="grid grid-cols-1 md:grid-cols-3 gap-md">
          <div class="glass-panel p-md rounded-2xl border border-white/10 flex flex-col gap-xs">
            <span class="text-xs font-semibold text-text-muted uppercase tracking-wider">Average Sleep Score</span>
            <div class="font-display text-3xl font-bold text-secondary">${avgScore}</div>
            <span class="text-xs text-tertiary font-medium">Optimal range (80-100)</span>
          </div>

          <div class="glass-panel p-md rounded-2xl border border-white/10 flex flex-col gap-xs">
            <span class="text-xs font-semibold text-text-muted uppercase tracking-wider">Average Sleep Duration</span>
            <div class="font-display text-3xl font-bold text-moonlight-accent">${avgDuration} hrs</div>
            <span class="text-xs text-text-variant font-medium">Target: 8.0 hrs</span>
          </div>

          <div class="glass-panel p-md rounded-2xl border border-white/10 flex flex-col gap-xs">
            <span class="text-xs font-semibold text-text-muted uppercase tracking-wider">Sleep Efficiency</span>
            <div class="font-display text-3xl font-bold text-tertiary">${avgEfficiency}%</div>
            <span class="text-xs text-secondary font-medium">High consistency</span>
          </div>
        </section>

        <section class="glass-panel p-md md:p-lg rounded-3xl border border-white/10 space-y-md">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="font-display text-xl font-semibold text-moonlight-accent">Sleep Score Trend</h3>
              <span class="text-xs text-text-muted">Daily performance tracking</span>
            </div>
            <span class="material-symbols-outlined text-secondary">trending_up</span>
          </div>

          <div class="w-full overflow-x-auto pt-md pb-xs">
            <div class="min-w-[500px]">
              <svg viewBox="0 0 600 200" class="w-full h-48 overflow-visible">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#c3c0ff" stop-opacity="0.4"/>
                    <stop offset="100%" stop-color="#c3c0ff" stop-opacity="0.0"/>
                  </linearGradient>
                </defs>

                <line x1="0" y1="40" x2="600" y2="40" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4"/>
                <line x1="0" y1="80" x2="600" y2="80" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4"/>
                <line x1="0" y1="120" x2="600" y2="120" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4"/>

                <polygon points="0,160 ${polylinePoints} 600,160" fill="url(#chartGradient)"/>
                <polyline fill="none" stroke="#c3c0ff" stroke-width="3" points="${polylinePoints}" stroke-linecap="round" stroke-linejoin="round"/>

                ${logs.map((log, index) => {
                  const x = logs.length === 1 ? chartWidth / 2 : (index / (logs.length - 1)) * chartWidth;
                  const y = chartHeight - (log.score / maxScore) * chartHeight;
                  return `
                    <circle cx="${x}" cy="${y}" r="5" fill="#0B1120" stroke="#c3c0ff" stroke-width="3"/>
                    <text x="${x}" y="${y - 12}" fill="#e5e2e3" font-size="10" text-anchor="middle" font-family="Quicksand" font-weight="bold">${log.score}</text>
                  `;
                }).reverse().join('')}
              </svg>
            </div>
          </div>
        </section>

        <section class="space-y-sm">
          <h3 class="font-display text-xl font-semibold text-moonlight-accent">Logged Sleep Records</h3>
          <div class="space-y-sm">
            ${logs.map(log => `
              <div class="glass-panel p-md rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-sm">
                <div class="flex items-center gap-md">
                  <div class="w-12 h-12 rounded-full bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary font-display font-bold text-lg">
                    ${log.score}
                  </div>
                  <div>
                    <div class="font-display font-semibold text-moonlight-accent">${log.date}</div>
                    <div class="text-xs text-text-muted">${log.bedtime} - ${log.waketime} (${log.durationHours} hrs)</div>
                  </div>
                </div>
                <div class="flex items-center gap-md">
                  <span class="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-tertiary">${log.quality} Quality</span>
                  <span class="text-xs text-text-variant">${log.efficiencyPct}% Efficiency</span>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `;
  }

  function attachInsightsListeners(app) {}

  // WINDDOWN VIEW
  let audioCtx = null;
  let currentSoundNode = null;
  let gainNode = null;
  let isPlaying = false;
  let currentPreset = 'rain';
  let breathingTimer = null;
  let isBreathingActive = false;

  function renderWinddownView(app) {
    return `
      <div class="w-full max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop py-xl flex flex-col gap-xl">
        <div class="text-center space-y-xs">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-semibold">
            <span class="material-symbols-outlined text-sm">graphic_eq</span> Wind-Down Studio
          </div>
          <h2 class="font-display text-3xl md:text-4xl font-bold text-moonlight-accent">Ambient Relaxation & Breathing</h2>
          <p class="text-text-variant text-body-md">Calm your nervous system before sleep with bio-acoustics and rhythm therapy.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-xl">
          <div class="col-span-1 md:col-span-6 glass-panel rounded-3xl p-md md:p-lg border border-white/10 flex flex-col items-center justify-between min-h-[420px] text-center relative overflow-hidden">
            <div class="space-y-xs z-10">
              <h3 class="font-display text-xl font-semibold text-moonlight-accent">4-7-8 Breathing Rhythm</h3>
              <p class="text-xs text-text-muted">Inhale (4s) • Hold (7s) • Exhale (8s)</p>
            </div>

            <div class="relative w-56 h-56 flex items-center justify-center my-md">
              <div id="breath-outer-ring" class="absolute inset-0 rounded-full border-2 border-secondary/30 bg-secondary/10 backdrop-blur-md transition-all duration-1000"></div>
              <div id="breath-inner-ring" class="absolute w-36 h-36 rounded-full bg-secondary/20 border border-secondary/50 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(195,192,255,0.4)] transition-all duration-1000">
                <span id="breath-phase-text" class="font-display text-lg font-bold text-secondary uppercase">Ready</span>
                <span id="breath-countdown" class="text-2xl font-bold text-moonlight-accent">4</span>
              </div>
            </div>

            <button id="btn-toggle-breathing" class="z-10 bg-secondary text-background font-display font-semibold px-8 py-3 rounded-full shadow-[0_0_20px_rgba(195,192,255,0.4)] hover:shadow-[0_0_30px_rgba(195,192,255,0.6)] transition-all transform hover:-translate-y-0.5">
              Start Breathing
            </button>
          </div>

          <div class="col-span-1 md:col-span-6 glass-panel rounded-3xl p-md md:p-lg border border-white/10 flex flex-col justify-between space-y-md">
            <div class="space-y-xs">
              <div class="flex justify-between items-center">
                <h3 class="font-display text-xl font-semibold text-moonlight-accent">Ambient Soundscape</h3>
                <span id="sound-status" class="text-xs font-semibold text-text-muted">Paused</span>
              </div>
              <p class="text-xs text-text-variant">Synthesized pure organic noise & binaural frequencies.</p>
            </div>

            <div class="grid grid-cols-2 gap-sm">
              <button class="sound-preset-btn p-3 rounded-2xl glass-panel-interactive border border-secondary/40 bg-secondary/15 text-secondary flex items-center gap-sm text-left" data-sound="rain">
                <span class="material-symbols-outlined text-2xl">water_drop</span>
                <div>
                  <div class="text-sm font-semibold">Gentle Rain</div>
                  <div class="text-[10px] opacity-70">Soft rainfall noise</div>
                </div>
              </button>

              <button class="sound-preset-btn p-3 rounded-2xl glass-panel-interactive border border-white/10 text-moonlight-accent flex items-center gap-sm text-left" data-sound="ocean">
                <span class="material-symbols-outlined text-2xl">waves</span>
                <div>
                  <div class="text-sm font-semibold">Ocean Surges</div>
                  <div class="text-[10px] opacity-70">Deep rhythmic waves</div>
                </div>
              </button>

              <button class="sound-preset-btn p-3 rounded-2xl glass-panel-interactive border border-white/10 text-moonlight-accent flex items-center gap-sm text-left" data-sound="pink">
                <span class="material-symbols-outlined text-2xl">graphic_eq</span>
                <div>
                  <div class="text-sm font-semibold">Pink Noise</div>
                  <div class="text-[10px] opacity-70">Consistent sleep filter</div>
                </div>
              </button>

              <button class="sound-preset-btn p-3 rounded-2xl glass-panel-interactive border border-white/10 text-moonlight-accent flex items-center gap-sm text-left" data-sound="binaural">
                <span class="material-symbols-outlined text-2xl">bedtime</span>
                <div>
                  <div class="text-sm font-semibold">Delta Binaural</div>
                  <div class="text-[10px] opacity-70">Deep sleep 3Hz tone</div>
                </div>
              </button>
            </div>

            <div class="space-y-md pt-sm border-t border-white/10">
              <div class="flex items-center gap-md">
                <span class="material-symbols-outlined text-text-muted">volume_down</span>
                <input id="volume-slider" type="range" min="0" max="1" step="0.05" value="0.5" class="w-full"/>
                <span class="material-symbols-outlined text-text-muted">volume_up</span>
              </div>

              <button id="btn-toggle-sound" class="w-full bg-secondary/20 border border-secondary/40 text-secondary font-display font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-secondary/30 transition-all">
                <span id="play-icon" class="material-symbols-outlined">play_arrow</span>
                <span id="play-text">Play Soundscape</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function attachWinddownListeners(app) {
    const soundStatus = document.getElementById('sound-status');
    const playBtn = document.getElementById('btn-toggle-sound');
    const playIcon = document.getElementById('play-icon');
    const playText = document.getElementById('play-text');
    const volumeSlider = document.getElementById('volume-slider');

    function initAudio() {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
        gainNode = audioCtx.createGain();
        gainNode.gain.value = parseFloat(volumeSlider.value);
        gainNode.connect(audioCtx.destination);
      }
      if (audioCtx.state === 'suspended') audioCtx.resume();
    }

    function stopAudioNode() {
      if (currentSoundNode) {
        try { currentSoundNode.stop(); currentSoundNode.disconnect(); } catch (e) {}
        currentSoundNode = null;
      }
    }

    function playPresetSound(preset) {
      initAudio();
      stopAudioNode();

      const bufferSize = 2 * audioCtx.sampleRate;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      if (preset === 'rain' || preset === 'ocean' || preset === 'pink') {
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.11;
          b6 = white * 0.115926;
        }
        const whiteSource = audioCtx.createBufferSource();
        whiteSource.buffer = noiseBuffer;
        whiteSource.loop = true;

        const filter = audioCtx.createBiquadFilter();
        filter.type = preset === 'ocean' ? 'lowpass' : 'bandpass';
        filter.frequency.value = preset === 'ocean' ? 350 : 800;

        whiteSource.connect(filter);
        filter.connect(gainNode);
        whiteSource.start();
        currentSoundNode = whiteSource;

      } else if (preset === 'binaural') {
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        osc1.frequency.value = 100;
        osc2.frequency.value = 103;

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        osc1.start();
        osc2.start();

        currentSoundNode = {
          stop: () => { osc1.stop(); osc2.stop(); },
          disconnect: () => { osc1.disconnect(); osc2.disconnect(); }
        };
      }
    }

    playBtn?.addEventListener('click', () => {
      if (isPlaying) {
        stopAudioNode();
        isPlaying = false;
        playIcon.textContent = 'play_arrow';
        playText.textContent = 'Play Soundscape';
        soundStatus.textContent = 'Paused';
      } else {
        playPresetSound(currentPreset);
        isPlaying = true;
        playIcon.textContent = 'pause';
        playText.textContent = 'Pause Soundscape';
        soundStatus.textContent = 'Playing ' + currentPreset.toUpperCase();
      }
    });

    volumeSlider?.addEventListener('input', (e) => {
      if (gainNode) gainNode.gain.value = parseFloat(e.target.value);
    });

    const presetBtns = document.querySelectorAll('.sound-preset-btn');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        presetBtns.forEach(b => {
          b.classList.remove('border-secondary/40', 'bg-secondary/15', 'text-secondary');
          b.classList.add('border-white/10', 'text-moonlight-accent');
        });
        btn.classList.add('border-secondary/40', 'bg-secondary/15', 'text-secondary');
        btn.classList.remove('border-white/10', 'text-moonlight-accent');

        currentPreset = btn.dataset.sound;
        if (isPlaying) {
          playPresetSound(currentPreset);
          soundStatus.textContent = 'Playing ' + currentPreset.toUpperCase();
        }
      });
    });

    const btnBreathing = document.getElementById('btn-toggle-breathing');
    const phaseText = document.getElementById('breath-phase-text');
    const countdownText = document.getElementById('breath-countdown');
    const outerRing = document.getElementById('breath-outer-ring');
    const innerRing = document.getElementById('breath-inner-ring');

    btnBreathing?.addEventListener('click', () => {
      if (isBreathingActive) {
        clearInterval(breathingTimer);
        isBreathingActive = false;
        btnBreathing.textContent = 'Start Breathing';
        phaseText.textContent = 'Ready';
        countdownText.textContent = '4';
        outerRing.style.transform = 'scale(1)';
        innerRing.style.transform = 'scale(1)';
      } else {
        isBreathingActive = true;
        btnBreathing.textContent = 'Stop Breathing';
        runBreathingLoop();
      }
    });

    function runBreathingLoop() {
      let phase = 'inhale';
      let count = 4;

      const updateUI = () => {
        if (!isBreathingActive) return;
        phaseText.textContent = phase;
        countdownText.textContent = count;

        if (phase === 'inhale' || phase === 'hold') {
          outerRing.style.transform = 'scale(1.3)';
          innerRing.style.transform = 'scale(1.25)';
        } else if (phase === 'exhale') {
          outerRing.style.transform = 'scale(0.9)';
          innerRing.style.transform = 'scale(0.85)';
        }
      };

      updateUI();

      breathingTimer = setInterval(() => {
        if (!isBreathingActive) {
          clearInterval(breathingTimer);
          return;
        }
        count--;
        if (count < 1) {
          if (phase === 'inhale') { phase = 'hold'; count = 7; }
          else if (phase === 'hold') { phase = 'exhale'; count = 8; }
          else if (phase === 'exhale') { phase = 'inhale'; count = 4; }
        }
        updateUI();
      }, 1000);
    }
  }

  // PROFILE VIEW
  function renderProfileView(app) {
    const profile = Store.getProfile();
    const logs = Store.getSleepLogs();

    return `
      <div class="w-full max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop py-xl flex flex-col gap-xl">
        <section class="glass-panel rounded-3xl p-md md:p-lg border border-white/10 flex flex-col md:flex-row items-center gap-md">
          <div class="w-20 h-20 rounded-full bg-secondary/20 border-2 border-secondary/40 flex items-center justify-center text-secondary text-3xl font-display font-bold shadow-[0_0_20px_rgba(195,192,255,0.3)]">
            ${(profile.name || 'A').charAt(0).toUpperCase()}
          </div>
          <div class="flex-1 text-center md:text-left space-y-xs">
            <h2 class="font-display text-2xl font-bold text-moonlight-accent">${profile.name}</h2>
            <p class="text-text-variant text-sm">Somnus Restful Sleep Member</p>
            <div class="inline-flex items-center gap-md pt-xs text-xs text-text-muted">
              <span>Logged Entries: <strong class="text-secondary">${logs.length}</strong></span>
              <span>•</span>
              <span>Target Bedtime: <strong class="text-secondary">${profile.targetBedtime}</strong></span>
            </div>
          </div>
        </section>

        <section class="glass-panel rounded-3xl p-md md:p-lg border border-white/10 space-y-md">
          <h3 class="font-display text-xl font-semibold text-moonlight-accent">Target Sleep Goals</h3>
          
          <form id="profile-form" class="space-y-md">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div>
                <label class="block text-xs font-semibold text-text-muted uppercase mb-xs">Your Name</label>
                <input id="input-profile-name" type="text" value="${profile.name}" class="glass-input w-full rounded-xl px-3 py-2.5 text-body-md" required />
              </div>

              <div>
                <label class="block text-xs font-semibold text-text-muted uppercase mb-xs">Target Sleep Duration (Hours)</label>
                <input id="input-profile-target-duration" type="number" step="0.5" min="4" max="12" value="${profile.targetSleepDuration}" class="glass-input w-full rounded-xl px-3 py-2.5 text-body-md" required />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div>
                <label class="block text-xs font-semibold text-text-muted uppercase mb-xs">Target Bedtime</label>
                <input id="input-profile-target-bedtime" type="time" value="${profile.targetBedtime}" class="glass-input w-full rounded-xl px-3 py-2.5 text-body-md" required />
              </div>

              <div>
                <label class="block text-xs font-semibold text-text-muted uppercase mb-xs">Target Wake Time</label>
                <input id="input-profile-target-waketime" type="time" value="${profile.targetWaketime}" class="glass-input w-full rounded-xl px-3 py-2.5 text-body-md" required />
              </div>
            </div>

            <div class="pt-sm flex justify-end">
              <button type="submit" class="bg-secondary text-background font-semibold px-6 py-2.5 rounded-xl shadow-[0_0_15px_rgba(195,192,255,0.3)] hover:shadow-[0_0_25px_rgba(195,192,255,0.5)] transition-all">
                Save Preferences
              </button>
            </div>
          </form>
        </section>

        <section class="glass-panel rounded-3xl p-md md:p-lg border border-white/10 space-y-md">
          <h3 class="font-display text-xl font-semibold text-moonlight-accent">Data & Privacy</h3>
          <p class="text-xs text-text-variant">All your data is stored offline inside your web browser. You control your information.</p>
          
          <div class="flex flex-wrap gap-md pt-xs">
            <button id="btn-export-data" class="glass-panel-interactive border border-white/10 px-4 py-2 rounded-xl text-xs font-semibold text-moonlight-accent flex items-center gap-xs">
              <span class="material-symbols-outlined text-sm">download</span> Export Sleep Backup (JSON)
            </button>

            <button id="btn-reset-data" class="glass-panel-interactive border border-error/40 text-error hover:bg-error/10 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-xs">
              <span class="material-symbols-outlined text-sm">delete_forever</span> Reset All App Data
            </button>
          </div>
        </section>
      </div>
    `;
  }

  function attachProfileListeners(app) {
    const form = document.getElementById('profile-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('input-profile-name').value;
      const targetSleepDuration = parseFloat(document.getElementById('input-profile-target-duration').value);
      const targetBedtime = document.getElementById('input-profile-target-bedtime').value;
      const targetWaketime = document.getElementById('input-profile-target-waketime').value;

      Store.saveProfile({ name, targetSleepDuration, targetBedtime, targetWaketime });
      alert('Preferences saved successfully!');
      app.renderCurrentView();
    });

    document.getElementById('btn-export-data')?.addEventListener('click', () => {
      const data = { profile: Store.getProfile(), assessment: Store.getAssessment(), logs: Store.getSleepLogs(), habits: Store.getHabits() };
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `somnus_sleep_data_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    document.getElementById('btn-reset-data')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all sleep logs and preferences? This cannot be undone.')) {
        Store.resetAllData();
        alert('Data reset to default.');
        app.navigate('welcome');
      }
    });
  }

  // ==========================================
  // 4. MAIN APP ROUTER CLASS
  // ==========================================
  class SomnusApp {
    constructor() {
      this.currentView = 'dashboard';
      const assessment = Store.getAssessment();
      if (!assessment || !assessment.completed) {
        this.currentView = 'welcome';
      }
      this.init();
    }

    init() {
      this.bindGlobalNavigation();
      this.renderCurrentView();
    }

    bindGlobalNavigation() {
      document.querySelectorAll('[data-nav]').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const view = link.dataset.nav;
          this.navigate(view);
        });
      });

      document.getElementById('btn-header-log')?.addEventListener('click', () => {
        renderLogModal(() => this.renderCurrentView());
      });
    }

    navigate(viewName) {
      this.currentView = viewName;
      this.renderCurrentView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderCurrentView() {
      const container = document.getElementById('app-view-container');
      if (!container) return;

      let html = '';
      let attachFn = null;

      switch (this.currentView) {
        case 'welcome':
          html = renderWelcomeView(this);
          attachFn = attachWelcomeListeners;
          break;
        case 'assessment':
          html = renderAssessmentView(this);
          attachFn = attachAssessmentListeners;
          break;
        case 'dashboard':
          html = renderDashboardView(this);
          attachFn = attachDashboardListeners;
          break;
        case 'coaching':
          html = renderCoachingView(this);
          attachFn = attachCoachingListeners;
          break;
        case 'insights':
          html = renderInsightsView(this);
          attachFn = attachInsightsListeners;
          break;
        case 'winddown':
          html = renderWinddownView(this);
          attachFn = attachWinddownListeners;
          break;
        case 'profile':
          html = renderProfileView(this);
          attachFn = attachProfileListeners;
          break;
        default:
          html = renderDashboardView(this);
          attachFn = attachDashboardListeners;
      }

      container.innerHTML = html;
      if (attachFn) attachFn(this);

      this.updateActiveNavState();
    }

    updateActiveNavState() {
      document.querySelectorAll('header [data-nav]').forEach(link => {
        if (link.dataset.nav === this.currentView) {
          link.classList.add('text-secondary', 'font-semibold');
          link.classList.remove('text-text-muted');
        } else {
          link.classList.remove('text-secondary', 'font-semibold');
          link.classList.add('text-text-muted');
        }
      });

      document.querySelectorAll('nav [data-nav]').forEach(link => {
        if (link.dataset.nav === this.currentView) {
          link.classList.add('text-secondary', 'bg-secondary/20', 'scale-105');
          link.classList.remove('text-text-muted');
        } else {
          link.classList.remove('text-secondary', 'bg-secondary/20', 'scale-105');
          link.classList.add('text-text-muted');
        }
      });
    }
  }

  // AUTO INITIALIZE
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.app = new SomnusApp();
    });
  } else {
    window.app = new SomnusApp();
  }

})();
