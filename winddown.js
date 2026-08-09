/**
 * Wind-Down Studio View - Web Audio Soundscape Synth & 4-7-8 Breathing Guide
 */

let audioCtx = null;
let currentSoundNode = null;
let gainNode = null;
let isPlaying = false;
let currentPreset = 'rain';

let breathingTimer = null;
let breathState = 'idle'; // 'inhale', 'hold', 'exhale', 'idle'

export function renderWinddownView(app) {
  return `
    <div class="w-full max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop py-xl flex flex-col gap-xl">
      <!-- Header -->
      <div class="text-center space-y-xs">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-semibold">
          <span class="material-symbols-outlined text-sm">graphic_eq</span> Wind-Down Studio
        </div>
        <h2 class="font-display text-3xl md:text-4xl font-bold text-moonlight-accent">Ambient Relaxation & Breathing</h2>
        <p class="text-text-variant text-body-md">Calm your nervous system before sleep with bio-acoustics and rhythm therapy.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-xl">
        <!-- 4-7-8 Breathing Visualizer Card -->
        <div class="col-span-1 md:col-span-6 glass-panel rounded-3xl p-md md:p-lg border border-white/10 flex flex-col items-center justify-between min-h-[420px] text-center relative overflow-hidden">
          <div class="space-y-xs z-10">
            <h3 class="font-display text-xl font-semibold text-moonlight-accent">4-7-8 Breathing Rhythm</h3>
            <p class="text-xs text-text-muted">Inhale (4s) • Hold (7s) • Exhale (8s)</p>
          </div>

          <!-- Pulsing Breathing Ring -->
          <div class="relative w-56 h-56 flex items-center justify-center my-md">
            <div id="breath-outer-ring" class="absolute inset-0 rounded-full border-2 border-secondary/30 bg-secondary/10 backdrop-blur-md transition-all duration-1000"></div>
            <div id="breath-inner-ring" class="absolute w-36 h-36 rounded-full bg-secondary/20 border border-secondary/50 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(195,192,255,0.4)] transition-all duration-1000">
              <span id="breath-phase-text" class="font-display text-lg font-bold text-secondary uppercase">Ready</span>
              <span id="breath-countdown" class="text-2xl font-bold text-moonlight-accent">4</span>
            </div>
          </div>

          <!-- Start Breathing Button -->
          <button id="btn-toggle-breathing" class="z-10 bg-secondary text-background font-display font-semibold px-8 py-3 rounded-full shadow-[0_0_20px_rgba(195,192,255,0.4)] hover:shadow-[0_0_30px_rgba(195,192,255,0.6)] transition-all transform hover:-translate-y-0.5">
            Start Breathing
          </button>
        </div>

        <!-- Ambient Soundscape Synthesizer Card -->
        <div class="col-span-1 md:col-span-6 glass-panel rounded-3xl p-md md:p-lg border border-white/10 flex flex-col justify-between space-y-md">
          <div class="space-y-xs">
            <div class="flex justify-between items-center">
              <h3 class="font-display text-xl font-semibold text-moonlight-accent">Ambient Soundscape</h3>
              <span id="sound-status" class="text-xs font-semibold text-text-muted">Paused</span>
            </div>
            <p class="text-xs text-text-variant">Synthesized pure organic noise & binaural frequencies.</p>
          </div>

          <!-- Sound Preset Selectors -->
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

          <!-- Volume & Master Play Controls -->
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

export function attachWinddownListeners(app) {
  // Web Audio Synthesizer Logic
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
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function stopAudioNode() {
    if (currentSoundNode) {
      try {
        currentSoundNode.stop();
        currentSoundNode.disconnect();
      } catch (e) {}
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

      // Filter for rain vs ocean
      const filter = audioCtx.createBiquadFilter();
      filter.type = preset === 'ocean' ? 'lowpass' : 'bandpass';
      filter.frequency.value = preset === 'ocean' ? 350 : 800;

      whiteSource.connect(filter);
      filter.connect(gainNode);
      whiteSource.start();
      currentSoundNode = whiteSource;

    } else if (preset === 'binaural') {
      // 100Hz and 103Hz (3Hz Delta waves)
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

  // Volume slider listener
  volumeSlider?.addEventListener('input', (e) => {
    if (gainNode) {
      gainNode.gain.value = parseFloat(e.target.value);
    }
  });

  // Preset buttons
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

  // 4-7-8 Breathing Cycle Visualizer
  const btnBreathing = document.getElementById('btn-toggle-breathing');
  const phaseText = document.getElementById('breath-phase-text');
  const countdownText = document.getElementById('breath-countdown');
  const outerRing = document.getElementById('breath-outer-ring');
  const innerRing = document.getElementById('breath-inner-ring');

  let isBreathingActive = false;

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
    let phase = 'inhale'; // inhale(4), hold(7), exhale(8)
    let count = 4;

    const updateUI = () => {
      if (!isBreathingActive) return;
      phaseText.textContent = phase;
      countdownText.textContent = count;

      if (phase === 'inhale') {
        outerRing.style.transform = 'scale(1.3)';
        innerRing.style.transform = 'scale(1.25)';
      } else if (phase === 'hold') {
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
        if (phase === 'inhale') {
          phase = 'hold';
          count = 7;
        } else if (phase === 'hold') {
          phase = 'exhale';
          count = 8;
        } else if (phase === 'exhale') {
          phase = 'inhale';
          count = 4;
        }
      }
      updateUI();
    }, 1000);
  }
}
