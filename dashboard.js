/**
 * Dashboard View - Main Home Dashboard
 */
import { Store } from '../store.js';
import { renderLogModal } from '../components/logModal.js';

export function renderDashboardView(app) {
  const score = Store.calculateCurrentSleepScore();
  const latestLog = Store.getLatestSleepLog();
  const habits = Store.getHabits();
  const assessment = Store.getAssessment();

  // SVG Radial Ring Math
  const radius = 45;
  const circumference = 2 * Math.PI * radius; // 282.74
  const strokeOffset = circumference - (score / 100) * circumference;

  return `
    <div class="w-full max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop py-xl flex flex-col gap-xl">
      <!-- Sleep Score & Summary Section -->
      <section class="grid grid-cols-1 md:grid-cols-12 gap-md items-center">
        <!-- Hero Progress Ring -->
        <div class="col-span-1 md:col-span-5 flex justify-center relative ambient-glow py-md">
          <div class="relative w-64 h-64 flex items-center justify-center">
            <svg class="w-full h-full" viewBox="0 0 100 100">
              <!-- Track -->
              <circle class="text-white/10 stroke-current" cx="50" cy="50" fill="transparent" r="45" stroke-width="6"></circle>
              <!-- Progress Ring -->
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

        <!-- Last Night Summary Cards -->
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

      <!-- Tonight's Recovery Plan & Habit Tracker -->
      <section class="grid grid-cols-1 md:grid-cols-12 gap-md">
        <!-- Recovery Recommendation -->
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

        <!-- Habits Checklist -->
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

      <!-- Quick Action Floating Launchers -->
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

export function attachDashboardListeners(app) {
  // Animate progress ring
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

  // Habit Item Toggles
  const habitItems = document.querySelectorAll('.habit-item');
  habitItems.forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.id;
      Store.toggleHabit(id);
      app.renderCurrentView(); // Re-render view
    });
  });

  // Action Launchers
  document.getElementById('btn-action-log-sleep')?.addEventListener('click', () => {
    renderLogModal(() => {
      app.renderCurrentView();
    });
  });

  document.getElementById('btn-action-start-audio')?.addEventListener('click', () => {
    app.navigate('winddown');
  });

  document.getElementById('btn-start-winddown-direct')?.addEventListener('click', () => {
    app.navigate('winddown');
  });
}
