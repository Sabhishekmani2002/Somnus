/**
 * Coaching View - CBT for Insomnia & AI Sleep Coach
 */
import { Store } from '../store.js';

export function renderCoachingView(app) {
  const cbtProgress = Store.getCbtProgress();
  const assessment = Store.getAssessment();
  const logs = Store.getSleepLogs();

  // Dynamic AI Tip based on recent user data
  let aiTip = "Try reading for 15 mins before bed tonight to lower cortisol levels.";
  if (assessment.issues.includes("Trouble falling asleep")) {
    aiTip = "Practice the 4-7-8 breathing exercise in the Wind-Down Studio 20 mins before bed.";
  } else if (assessment.issues.includes("Feeling tired in the morning")) {
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
      <!-- AI Coach Bento Hero Header -->
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

      <!-- Active CBT-I Program -->
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

          <!-- Lessons List -->
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

      <!-- Educational Sleep Library -->
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

export function attachCoachingListeners(app) {
  const cards = document.querySelectorAll('.cbt-lesson-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      Store.completeCbtLesson(id);
      app.renderCurrentView();
    });
  });
}
