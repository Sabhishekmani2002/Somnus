/**
 * Welcome View - Serene onboarding landing screen
 */

export function renderWelcomeView(app) {
  return `
    <div class="relative w-full min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden px-margin-mobile md:px-margin-desktop py-xl">
      <!-- Ambient Background Elements -->
      <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div class="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/20 blur-[120px] animate-pulse-slow mix-blend-screen"></div>
        <div class="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-tertiary/20 blur-[120px] animate-pulse-slow mix-blend-screen" style="animation-delay: 2s;"></div>
      </div>

      <!-- Main Content -->
      <div class="w-full max-w-[1200px] flex flex-col md:flex-row items-center justify-between gap-xl z-10">
        <!-- Text Content -->
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

        <!-- Serene Visual Card -->
        <div class="flex-1 w-full h-[380px] md:h-[500px] relative rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl animate-float">
          <!-- Deep Night Ambient Canvas -->
          <div class="absolute inset-0 bg-gradient-to-br from-[#0B1120] via-[#1a1f38] to-[#110e2e]"></div>
          
          <!-- Moon Illustration -->
          <div class="absolute top-12 right-12 w-28 h-28 rounded-full bg-gradient-to-br from-[#e0e7ff] to-[#a5b4fc] opacity-80 blur-[1px] shadow-[0_0_50px_rgba(195,192,255,0.6)]"></div>

          <!-- Abstract Star Dust -->
          <div class="absolute inset-0 opacity-40 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:24px_24px]"></div>

          <div class="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent"></div>

          <!-- Floating Sleep Quality Stat Card -->
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

export function attachWelcomeListeners(app) {
  document.getElementById('btn-get-started')?.addEventListener('click', () => {
    app.navigate('assessment');
  });

  document.getElementById('btn-go-dashboard')?.addEventListener('click', () => {
    app.navigate('dashboard');
  });
}
