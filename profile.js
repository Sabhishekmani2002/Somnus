/**
 * Profile View - Settings, Target Goals & Data Management
 */
import { Store } from '../store.js';

export function renderProfileView(app) {
  const profile = Store.getProfile();
  const assessment = Store.getAssessment();
  const logs = Store.getSleepLogs();

  return `
    <div class="w-full max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop py-xl flex flex-col gap-xl">
      <!-- User Profile Header -->
      <section class="glass-panel rounded-3xl p-md md:p-lg border border-white/10 flex flex-col md:flex-row items-center gap-md">
        <div class="w-20 h-20 rounded-full bg-secondary/20 border-2 border-secondary/40 flex items-center justify-center text-secondary text-3xl font-display font-bold shadow-[0_0_20px_rgba(195,192,255,0.3)]">
          ${profile.name.charAt(0).toUpperCase()}
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

      <!-- Settings & Targets Form -->
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

      <!-- Data Operations -->
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

export function attachProfileListeners(app) {
  const form = document.getElementById('profile-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('input-profile-name').value;
    const targetSleepDuration = parseFloat(document.getElementById('input-profile-target-duration').value);
    const targetBedtime = document.getElementById('input-profile-target-bedtime').value;
    const targetWaketime = document.getElementById('input-profile-target-waketime').value;

    Store.saveProfile({
      name,
      targetSleepDuration,
      targetBedtime,
      targetWaketime
    });

    alert('Preferences saved successfully!');
    app.renderCurrentView();
  });

  document.getElementById('btn-export-data')?.addEventListener('click', () => {
    const data = {
      profile: Store.getProfile(),
      assessment: Store.getAssessment(),
      logs: Store.getSleepLogs(),
      habits: Store.getHabits()
    };
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
