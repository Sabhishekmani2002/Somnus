/**
 * Sleep Assessment View - Onboarding questionnaire
 */
import { Store } from '../store.js';

export function renderAssessmentView(app) {
  const current = Store.getAssessment();

  const isIssueSelected = (issueName) => current.issues.includes(issueName) ? 'selected' : '';

  return `
    <div class="w-full max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop py-xl">
      <div class="max-w-2xl mx-auto space-y-xl">
        <!-- Header -->
        <div class="text-center space-y-sm">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs uppercase tracking-widest font-semibold">
            Step 1 of 1 • Assessment
          </div>
          <h2 class="font-display text-3xl md:text-4xl font-bold text-moonlight-accent">Sleep Assessment</h2>
          <p class="text-text-variant text-body-lg">Let's understand your sleep habits to build your tailored recovery plan.</p>
        </div>

        <form id="assessment-form" class="space-y-xl">
          <!-- Section 1: Times -->
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

          <!-- Section 2: Quality -->
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

          <!-- Section 3: Issues -->
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

          <!-- Section 4: Stress -->
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

          <!-- Submit Button -->
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

export function attachAssessmentListeners(app) {
  let selectedQuality = 3;
  const qualityLabels = ["Poor", "Fair", "Good", "Excellent"];

  // Quality Buttons
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

  // Issue Chip Toggles
  const chips = document.querySelectorAll('#issues-chips-container .chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
    });
  });

  // Stress Slider
  const stressSlider = document.getElementById('stress-slider');
  const stressLabel = document.getElementById('stress-val');
  const stressTextMap = ["Very Low", "Low", "Moderate", "High", "Very High"];
  stressSlider?.addEventListener('input', (e) => {
    stressLabel.textContent = stressTextMap[e.target.value - 1];
  });

  // Form Submit
  const form = document.getElementById('assessment-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const bedtime = document.getElementById('input-bedtime').value;
    const waketime = document.getElementById('input-waketime').value;
    const stressLevel = parseInt(stressSlider.value);

    const selectedIssues = [];
    chips.forEach(chip => {
      if (chip.classList.contains('selected')) {
        selectedIssues.push(chip.textContent.trim());
      }
    });

    Store.saveAssessment({
      bedtime,
      waketime,
      quality: selectedQuality,
      issues: selectedIssues,
      stressLevel
    });

    app.navigate('dashboard');
  });
}
