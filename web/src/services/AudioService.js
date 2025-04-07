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
    const storedValue = localStorage.getItem(AUDIO_CONFIG.AUDIO_ENABLED_STORAGE_KEY);
    this.enabled = storedValue === null ? AUDIO_CONFIG.DEFAULT_AUDIO_ENABLED : storedValue !== 'false';
    this.loadSounds();
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    localStorage.setItem(AUDIO_CONFIG.AUDIO_ENABLED_STORAGE_KEY, enabled);
    if (!enabled) {
      this.stopCurrentAudio();
    }
  }

  isEnabled() {
    return this.enabled;
  }

  loadSounds() {
    AUDIO_CONFIG.CATEGORIES.forEach(category => {
      const files = Object.keys(
        import.meta.glob('/public/audio/todo/*/*.{mp3,ogg,wav}', { 
          as: 'url',
          eager: true 
        })
      );
      
      this.sounds[category] = files
        .filter(path => path.includes(`/todo/${category}/`))
        .map(path => path.replace('/public', ''));
    });
  }

  getRandomSound(category) {
    const sounds = this.sounds[category];
    if (!sounds || sounds.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * sounds.length);
    return sounds[randomIndex];
  }

  stopCurrentAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (this.currentTimer) {
      clearTimeout(this.currentTimer);
      this.currentTimer = null;
    }
  }

  async playSound(category) {
    if (!this.enabled) return;

    const soundPath = this.getRandomSound(category);
    if (!soundPath) return;

    try {
      this.stopCurrentAudio();

      const audio = new Audio(soundPath);
      this.currentAudio = audio;
      audio.volume = AUDIO_CONFIG.VOLUME;
      
      this.currentTimer = setTimeout(() => {
        this.stopCurrentAudio();
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