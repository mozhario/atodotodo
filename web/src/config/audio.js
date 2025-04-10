export const AUDIO_CONFIG = {
  VOLUME: 0.5, // 50% volume (0.0 to 1.0)
  DURATION: 3, // seconds to play
  FADE_DURATION: 0.33, // seconds to fade out previous sound
  CATEGORIES: ['add', 'delete', 'check', 'uncheck'],
  AUDIO_ENABLED_STORAGE_KEY: 'audio_enabled', // localStorage key to persist audio enabled/disabled state
  DEFAULT_AUDIO_ENABLED: false, // audio is disabled by default
}; 