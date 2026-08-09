/**
 * Log Modal Component - Modal overlay for adding custom sleep logs
 */
import { Store } from '../store.js';

export function renderLogModal(onSaveCallback) {
  const existingModal = document.getElementById('somnus-log-modal');
  if (existingModal) existingModal.remove();

  const modalHtml = `
    <div id="somnus-log-modal" class="fixed inset-0 z-[100] flex items-center justify-center p-margin-mobile bg-background/80 backdrop-blur-xl animate-fade-in">
      <div class="glass-panel w-full max-w-lg rounded-2xl p-md border border-white/10 shadow-2xl space-y-md relative">
        <div class="flex justify-between items-center pb-xs border-b border-white/10">
          <div class="flex items-center gap-sm">
            <span class="material-symbols-outlined text-secondary text-2xl">bedtime</span>
            <h3 class="font-display text-headline-lg-mobile text-primary">Log Sleep Entry</h3>
          </div>
          <button id="modal-close-btn" class="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-on-surface hover:bg-white/10 transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form id="log-sleep-form" class="space-y-md">
          <div class="grid grid-cols-2 gap-md">
            <div>
              <label class="block font-label-sm text-label-sm text-text-muted uppercase mb-xs">Bedtime</label>
              <input id="modal-bedtime" type="time" value="23:00" class="glass-input w-full rounded-xl px-3 py-2 text-body-md" required />
            </div>
            <div>
              <label class="block font-label-sm text-label-sm text-text-muted uppercase mb-xs">Wake Time</label>
              <input id="modal-waketime" type="time" value="07:00" class="glass-input w-full rounded-xl px-3 py-2 text-body-md" required />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-md">
            <div>
              <label class="block font-label-sm text-label-sm text-text-muted uppercase mb-xs">Sleep Quality</label>
              <select id="modal-quality" class="glass-input w-full rounded-xl px-3 py-2 text-body-md bg-background">
                <option value="Excellent">Excellent</option>
                <option value="Good" selected>Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
            <div>
              <label class="block font-label-sm text-label-sm text-text-muted uppercase mb-xs">Awakenings</label>
              <input id="modal-awakenings" type="number" min="0" max="10" value="1" class="glass-input w-full rounded-xl px-3 py-2 text-body-md" />
            </div>
          </div>

          <div>
            <label class="block font-label-sm text-label-sm text-text-muted uppercase mb-xs">Sleep Notes & Observations</label>
            <textarea id="modal-notes" rows="3" placeholder="Felt calm, read 15 mins before sleeping, no caffeine after 2 PM..." class="glass-input w-full rounded-xl p-3 text-body-md"></textarea>
          </div>

          <div class="pt-sm flex justify-end gap-sm">
            <button type="button" id="modal-cancel-btn" class="px-4 py-2 rounded-xl text-text-muted hover:text-on-surface transition-colors">Cancel</button>
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

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const bedtime = document.getElementById('modal-bedtime').value;
    const waketime = document.getElementById('modal-waketime').value;
    const quality = document.getElementById('modal-quality').value;
    const awakenings = parseInt(document.getElementById('modal-awakenings').value) || 0;
    const notes = document.getElementById('modal-notes').value;

    // Calculate duration in hours
    const [bH, bM] = bedtime.split(':').map(Number);
    const [wH, wM] = waketime.split(':').map(Number);
    let duration = (wH + wM / 60) - (bH + bM / 60);
    if (duration <= 0) duration += 24;
    duration = Math.round(duration * 10) / 10;

    // Efficiency estimate
    const efficiencyPct = Math.max(70, Math.min(98, Math.round(100 - awakenings * 5)));

    // Quality mapping to score base
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
