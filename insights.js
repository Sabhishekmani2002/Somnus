/**
 * Insights View - Sleep Trends & Analytics Dashboard
 */
import { Store } from '../store.js';

export function renderInsightsView(app) {
  const logs = Store.getSleepLogs();
  
  // Calculate average stats
  const avgScore = logs.length ? Math.round(logs.reduce((sum, l) => sum + l.score, 0) / logs.length) : 80;
  const avgDuration = logs.length ? (logs.reduce((sum, l) => sum + l.durationHours, 0) / logs.length).toFixed(1) : 7.5;
  const avgEfficiency = logs.length ? Math.round(logs.reduce((sum, l) => sum + l.efficiencyPct, 0) / logs.length) : 90;

  // Chart SVG polyline rendering
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
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h2 class="font-display text-3xl font-bold text-moonlight-accent">Sleep Insights</h2>
          <p class="text-text-variant text-body-md">Historical trends and sleep architecture analysis.</p>
        </div>
        <div class="inline-flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
          <button class="px-3 py-1.5 rounded-lg bg-secondary text-background font-semibold">Weekly</button>
          <button class="px-3 py-1.5 rounded-lg text-text-muted hover:text-on-surface">Monthly</button>
        </div>
      </div>

      <!-- Top Summary Metrics Grid -->
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

      <!-- Sleep Score Trend Line Chart -->
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

              <!-- Grid Lines -->
              <line x1="0" y1="40" x2="600" y2="40" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4"/>
              <line x1="0" y1="80" x2="600" y2="80" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4"/>
              <line x1="0" y1="120" x2="600" y2="120" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4"/>

              <!-- Gradient Area -->
              <polygon points="0,160 ${polylinePoints} 600,160" fill="url(#chartGradient)"/>

              <!-- Main Trend Line -->
              <polyline fill="none" stroke="#c3c0ff" stroke-width="3" points="${polylinePoints}" stroke-linecap="round" stroke-linejoin="round"/>

              <!-- Data Points -->
              ${logs.map((log, index) => {
                const x = logs.length === 1 ? chartWidth / 2 : (index / (logs.length - 1)) * chartWidth;
                const y = chartHeight - (log.score / maxScore) * chartHeight;
                return `
                  <circle cx="${x}" cy="${y}" r="5" fill="#0B1120" stroke="#c3c0ff" stroke-width="3" class="hover:scale-150 transition-transform cursor-pointer"/>
                  <text x="${x}" y="${y - 12}" fill="#e5e2e3" font-size="10" text-anchor="middle" font-family="Quicksand" font-weight="bold">${log.score}</text>
                `;
              }).reverse().join('')}
            </svg>
          </div>
        </div>
      </section>

      <!-- Sleep Log History List -->
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

export function attachInsightsListeners(app) {
  // Add filter listener if needed
}
