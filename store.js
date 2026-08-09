/**
 * Somnus Store - Centralized Data State & LocalStorage Manager
 */

const STORAGE_KEYS = {
  PROFILE: 'somnus_profile',
  ASSESSMENT: 'somnus_assessment',
  SLEEP_LOGS: 'somnus_logs',
  CBT_PROGRESS: 'somnus_cbt',
  HABITS: 'somnus_habits'
};

// Initial default data if none exists
const DEFAULT_ASSESSMENT = {
  bedtime: "23:00",
  waketime: "07:00",
  quality: 3, // 1: Poor, 2: Fair, 3: Good, 4: Excellent
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

export const Store = {
  getProfile() {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return data ? JSON.parse(data) : DEFAULT_PROFILE;
  },

  saveProfile(profile) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  getAssessment() {
    const data = localStorage.getItem(STORAGE_KEYS.ASSESSMENT);
    return data ? JSON.parse(data) : DEFAULT_ASSESSMENT;
  },

  saveAssessment(assessment) {
    assessment.completed = true;
    localStorage.setItem(STORAGE_KEYS.ASSESSMENT, JSON.stringify(assessment));
  },

  getSleepLogs() {
    const data = localStorage.getItem(STORAGE_KEYS.SLEEP_LOGS);
    return data ? JSON.parse(data) : INITIAL_SLEEP_LOGS;
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
    localStorage.setItem(STORAGE_KEYS.SLEEP_LOGS, JSON.stringify(logs));
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
    const data = localStorage.getItem(STORAGE_KEYS.HABITS);
    return data ? JSON.parse(data) : DEFAULT_HABITS;
  },

  toggleHabit(habitId) {
    const habits = this.getHabits();
    const target = habits.find(h => h.id === habitId);
    if (target) {
      target.completed = !target.completed;
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    }
    return habits;
  },

  getCbtProgress() {
    const data = localStorage.getItem(STORAGE_KEYS.CBT_PROGRESS);
    return data ? JSON.parse(data) : { currentWeek: 1, progressPct: 25, completedLessons: ['lesson_1'] };
  },

  completeCbtLesson(lessonId) {
    const progress = this.getCbtProgress();
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
      progress.progressPct = Math.min(100, progress.completedLessons.length * 25);
      localStorage.setItem(STORAGE_KEYS.CBT_PROGRESS, JSON.stringify(progress));
    }
    return progress;
  },

  resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.ASSESSMENT);
    localStorage.removeItem(STORAGE_KEYS.SLEEP_LOGS);
    localStorage.removeItem(STORAGE_KEYS.CBT_PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.HABITS);
  }
};
