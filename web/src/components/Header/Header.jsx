import { useState } from 'react';
import { audioService } from '../../services/AudioService';
import './Header.css';

function Header({ onLogout }) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(audioService.isEnabled());

  const handleAudioToggle = () => {
    const newState = !isAudioEnabled;
    setIsAudioEnabled(newState);
    audioService.setEnabled(newState);
  };

  return (
    <header className="header">
      <h1>a todo to do</h1>
      <div className="header-controls">
        <button 
          onClick={handleAudioToggle} 
          className="btn-icon"
          title={isAudioEnabled ? 'Disable sounds' : 'Enable sounds'}
        >
          {isAudioEnabled ? '🔉' : '🔇'}
        </button>
        <button 
          onClick={onLogout} 
          className="btn-icon"
          title="Logout"
        >
          ❌
        </button>
      </div>
    </header>
  );
}

export default Header; 