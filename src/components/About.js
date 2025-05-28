import React, { useState, useEffect, useRef } from 'react';

const translations = {
  'hi': 'स्वागत है', // Hindi
  'mr': 'स्वागत आहे', // Marathi
  'ta': 'வரவேற்பு',  // Tamil
  'te': 'స్వాగతం',   // Telugu
  'kn': 'ಸ್ವಾಗತ',    // Kannada
  'bn': 'স্বাগতম',    // Bengali
  'gu': 'સ્વાગત છે', // Gujarati
  'pa': 'ਜੀ ਆਇਆਂ ਨੂੰ', // Punjabi (Gurmukhi)
  'ml': 'സ്വാഗതം',   // Malayalam
  'or': 'ସ୍ୱାଗତ',    // Odia
  'as': 'স্বাগতম',   // Assamese
  'fr': 'Bienvenue', // French
  'es': 'Bienvenido',// Spanish
  'de': 'Willkommen',// German
  // Add more languages as needed
  // You can also add specific regional codes if "Welcome" differs significantly
  // e.g., 'pt-br': 'Bem-vindo', 'pt-pt': 'Bem-vindo'
};

function About({ isDarkMode, toggleDarkMode }) {

  const languageKeys = Object.keys(translations);
  const [currentKeyIndex, setCurrentKeyIndex] = useState(0);
  const [welcomeMessage, setWelcomeMessage] = useState(() => {
    // Set initial message (first in the list or default if empty)
    const initialKey = languageKeys.includes('en') ? 'en' : (languageKeys.length > 0 ? languageKeys[0] : null);
    return initialKey ? translations[initialKey] : 'Welcome'; // Fallback if translations is empty
  });
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);
  const h1Ref = useRef(null); // Ref to the h1 element for the event listener

 useEffect(() => {
    // Don't cycle if there's only one or no translation
    if (languageKeys.length <= 1) {
      return;
    }

    const intervalId = setInterval(() => {
      setIsWelcomeVisible(false); // Trigger fade-out

    }, 2000); // Total time for one message cycle (e.g., 3 seconds)

    return () => {
      clearInterval(intervalId);
    };
  }, [languageKeys]); // Rerun if languageKeys array instance changes (though it shouldn't here)


  useEffect(() => {
    const h1Element = h1Ref.current;

    // If the h1 element doesn't exist, or if it's currently visible (not in a fade-out process), do nothing.
    if (!h1Element || isWelcomeVisible) {
      return;
    }

    // This function will be called when the fade-out transition ends
    const handleFadeOutComplete = (event) => {
      // Ensure the transition that ended was for the 'opacity' property on our h1
      if (event.propertyName === 'opacity' && event.target === h1Element) {
        setCurrentKeyIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % languageKeys.length;
          setWelcomeMessage(translations[languageKeys[nextIndex]]);
          setIsWelcomeVisible(true); // Trigger fade-in (removes 'fading-out' class)
          return nextIndex;
        });
      }
    };

    h1Element.addEventListener('transitionend', handleFadeOutComplete);

    // Cleanup: remove the event listener when the component unmounts or dependencies change
    return () => h1Element.removeEventListener('transitionend', handleFadeOutComplete);
  }, [isWelcomeVisible, languageKeys]); // Rerun when visibility changes or if languageKeys were to change


  return (
    <section id="about">
      <img
          src={process.env.PUBLIC_URL + '/images/my-profile-photo.jpg'}
          alt="My Profile"
          className="profile-image"
        />
      <div className="hero-text-content">
      <h1>
        Welcome{' '}
        <span
          ref={h1Ref}
          className={`dynamic-welcome-message ${!isWelcomeVisible ? 'fading-out' : ''}`}
        >
          {welcomeMessage}
        </span>
      </h1>
      <p className="hero-subtitle">thanks for stopping by!</p>
      <div className="hero-introduction">
        <p className="intro-prefix">I am a</p>
        <div className="intro-roles"> {/* This div will act as a flex container for the roles */}
          <span className="role">💻 Java backend engineer</span>
          <span className="role">🧠 Analytical</span>
          <span className="role">💡 Innovative Thinker</span>
          <span className="role">✨ Solution Designer</span>
          <span className="role">✅ Clean coder</span>
          <span className="role">🎯 TDD-BDD practitioner</span>
        </div>
      </div>
      </div>
    </section>
  );
}

export default About;