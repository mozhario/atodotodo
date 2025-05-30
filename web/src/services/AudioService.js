import { AUDIO_CONFIG } from '../config/audio';

class AudioService {
  constructor() {
    this.sounds = {
      add: [],
      delete: [],
      check: [],
      uncheck: []
    };
    this.currentAudio = null;
    this.currentTimer = null;
    this.preloadedAudios = new Map(); // Store preloaded audio elements
    const storedValue = localStorage.getItem(AUDIO_CONFIG.AUDIO_ENABLED_STORAGE_KEY);
    this.enabled = storedValue === null ? AUDIO_CONFIG.DEFAULT_AUDIO_ENABLED : storedValue !== 'false';
    this.loadSounds();
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    localStorage.setItem(AUDIO_CONFIG.AUDIO_ENABLED_STORAGE_KEY, enabled);
    if (!enabled) {
      this.fadeOutCurrentAudio();
    } else {
      // Start preloading when audio is enabled
      this.preloadSounds();
    }
  }

  isEnabled() {
    return this.enabled;
  }

  loadSounds() {
    const files = import.meta.glob('/public/audio/todo/*/*.{mp3,ogg,wav}', { as: 'url', eager: true });
  
    AUDIO_CONFIG.CATEGORIES.forEach(category => {
      this.sounds[category] = Object.entries(files)
        .filter(([path, url]) => path.includes(`/todo/${category}/`))
        .map(([path, url]) => url);
    });
  }
  
  getRandomSound(category) {
    const sounds = this.sounds[category];
    if (!sounds || sounds.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * sounds.length);
    return sounds[randomIndex];
  }

  fadeOutCurrentAudio() {
    if (!this.currentAudio) return;

    const startVolume = this.currentAudio.volume;
    const startTime = performance.now();
    
    const fadeOut = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      const progress = Math.min(elapsed / AUDIO_CONFIG.FADE_DURATION, 1);
      
      this.currentAudio.volume = startVolume * (1 - progress);
      
      if (progress < 1) {
        requestAnimationFrame(fadeOut);
      } else {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio = null;
      }
    };

    fadeOut();
  }

  preloadSounds() {
    // Clear existing preloaded audios
    this.preloadedAudios.clear();
    
    // Preload one random sound for each category
    AUDIO_CONFIG.CATEGORIES.forEach(category => {
      const soundPath = this.getRandomSound(category);
      if (soundPath) {
        const audio = new Audio(soundPath);
        audio.load(); // Start loading the audio
        this.preloadedAudios.set(soundPath, audio);
      }
    });
  }

  async playSound(category) {
    if (!this.enabled) return;

    const soundPath = this.getRandomSound(category);
    if (!soundPath) return;

    try {
      // Fade out previous sound if exists
      if (this.currentAudio) {
        this.fadeOutCurrentAudio();
      }

      // Use preloaded audio if available, otherwise create new
      let audio = this.preloadedAudios.get(soundPath);
      if (!audio) {
        audio = new Audio(soundPath);
      }
      
      this.currentAudio = audio;
      audio.volume = AUDIO_CONFIG.VOLUME;
      
      this.currentTimer = setTimeout(() => {
        this.fadeOutCurrentAudio();
      }, AUDIO_CONFIG.DURATION * 1000);

      audio.addEventListener('ended', () => {
        if (this.currentTimer) {
          clearTimeout(this.currentTimer);
          this.currentTimer = null;
        }
        this.currentAudio = null;
      });

      await audio.play();
    } catch (error) {
      console.error('Failed to play sound:', error);
    }
  }

  playAddSound() {
    return this.playSound('add');
  }

  playDeleteSound() {
    return this.playSound('delete');
  }

  playCheckSound() {
    return this.playSound('check');
  }

  playUncheckSound() {
    return this.playSound('uncheck');
  }
}

export const audioService = new AudioService(); 