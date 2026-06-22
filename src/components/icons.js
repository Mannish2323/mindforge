// =====================================================
// VELMORTH — SVG ICON SYSTEM
// Custom vector icons with gradients and animations
// =====================================================

// Helper to wrap SVG markup with size, styling, and classes
function svgWrapper(name, innerHTML, viewBox = "0 0 24 24", className = "", style = "") {
  return `
    <svg class="v-icon v-icon-${name} ${className}" 
         viewBox="${viewBox}" 
         style="width: 1em; height: 1em; fill: currentColor; stroke: none; vertical-align: middle; transition: all var(--t-spring); ${style}"
         xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Gradients for premium styling -->
        <linearGradient id="v-grad-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffe082" />
          <stop offset="50%" stop-color="#ffb300" />
          <stop offset="100%" stop-color="#ff8f00" />
        </linearGradient>
        <linearGradient id="v-grad-fire" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#ff3d00" />
          <stop offset="50%" stop-color="#ff9100" />
          <stop offset="100%" stop-color="#ffea00" />
        </linearGradient>
        <linearGradient id="v-grad-heart" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ff8a80" />
          <stop offset="50%" stop-color="#ff1744" />
          <stop offset="100%" stop-color="#d50000" />
        </linearGradient>
        <linearGradient id="v-grad-gem" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#b2ebf2" />
          <stop offset="50%" stop-color="#00e5ff" />
          <stop offset="100%" stop-color="#00b0ff" />
        </linearGradient>
        <linearGradient id="v-grad-green" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#a7f3d0" />
          <stop offset="50%" stop-color="#10b981" />
          <stop offset="100%" stop-color="#047857" />
        </linearGradient>
        <linearGradient id="v-grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#bfdbfe" />
          <stop offset="50%" stop-color="#3b82f6" />
          <stop offset="100%" stop-color="#1d4ed8" />
        </linearGradient>
        <linearGradient id="v-grad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ddd6fe" />
          <stop offset="50%" stop-color="#8b5cf6" />
          <stop offset="100%" stop-color="#6d28d9" />
        </linearGradient>
      </defs>
      ${innerHTML}
    </svg>
  `;
}

export const Icons = {
  // Logo
  logo: (cls = "", style = "") => svgWrapper("logo", `
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.47.16.03.3-.08.3-.24V19.9a13.9 13.9 0 0 1-2.45-.63c-1-.38-1.57-1.12-1.69-2.2-.17-1.5 1-2.73 2.5-2.73 1.12 0 2.05.67 2.45 1.63.4.96.2 2.06-.52 2.8a6.52 6.52 0 0 0 .86.13V21.8c0 .16.14.27.3.24A10 10 0 0 0 22 12 10 10 0 0 0 12 2zm1 14.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm4.5-3.5A2 2 0 0 1 15.5 15c-.75 0-1.42-.4-1.75-1a3.5 3.5 0 0 0-3.5-2 1 1 0 1 0 0 2c2 0 3.5.78 4.25 2 .75 1.22 2 2 3.5 2a4 4 0 1 0 0-8c-.5 0-1 .1-1.5.3V10a1 1 0 1 0-2 0v4.2c0 .55.45 1 1 1s1-.45 1-1v-1.7a2 2 0 0 1 1.5.5z" fill="url(#v-grad-green)"/>
  `, "0 0 24 24", cls, style),

  // XP Star
  xp: (cls = "", style = "") => svgWrapper("xp", `
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="url(#v-grad-gold)" filter="drop-shadow(0 2px 5px rgba(251,191,36,0.3))"/>
  `, "0 0 24 24", cls, style),

  // Streak Flame
  streak: (cls = "", style = "") => svgWrapper("streak", `
    <path d="M12 2C12 2 16 6 16 10C16 14.5 12 19 12 19C12 19 8 14.5 8 10C8 6 12 2 12 2Z" fill="url(#v-grad-fire)" />
    <path d="M12 7C12 7 14.5 9.5 14.5 12C14.5 15 12 17 12 17C12 17 9.5 15 9.5 12C9.5 9.5 12 7 12 7Z" fill="#ffeb3b" opacity="0.8"/>
  `, "0 0 24 24", `v-anim-flame ${cls}`, style),

  // Hearts Life
  hearts: (cls = "", style = "") => svgWrapper("hearts", `
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#v-grad-heart)" filter="drop-shadow(0 2px 5px rgba(239,68,68,0.3))"/>
  `, "0 0 24 24", `v-anim-pulse ${cls}`, style),

  // Gems Diamond
  gems: (cls = "", style = "") => svgWrapper("gems", `
    <path d="M12 2L2 9l10 13 10-13L12 2z" fill="url(#v-grad-gem)" />
    <path d="M12 2L8.5 9h7L12 2z" fill="#ffffff" opacity="0.3" />
    <path d="M2 9h20L12 22 2 9z" fill="none" stroke="#ffffff" stroke-width="0.5" opacity="0.5" />
    <circle cx="12" cy="11" r="2" fill="#ffffff" opacity="0.6" filter="blur(1px)"/>
  `, "0 0 24 24", cls, style),

  // Trophy
  trophy: (cls = "", style = "") => svgWrapper("trophy", `
    <path d="M19 5h-2V3H7v2H5C3.34 5 2 6.34 2 8v2c0 2.2 1.5 4.1 3.5 4.7.7 1.8 2.2 3.1 4.1 3.3V20H7v2h10v-2h-2.6v-2c1.9-.2 3.4-1.5 4.1-3.3 2-.6 3.5-2.5 3.5-4.7V8c0-1.66-1.34-3-3-3zM4 10V8c0-.55.45-1 1-1h2v4H5c-.55 0-1-.45-1-1zm15 0c0 .55-.45 1-1 1h-2V7h2c.55 0 1 .45 1 1v2z" fill="url(#v-grad-gold)"/>
  `, "0 0 24 24", cls, style),

  // Crown
  crown: (cls = "", style = "") => svgWrapper("crown", `
    <path d="M2 4l3 12h14l3-12-5 4-5-6-5 6-5-4z" fill="url(#v-grad-gold)"/>
    <rect x="5" y="17" width="14" height="2" rx="1" fill="#ff8f00" />
    <circle cx="2" cy="4" r="1.5" fill="#ffffff" />
    <circle cx="12" cy="2" r="1.5" fill="#ffffff" />
    <circle cx="22" cy="4" r="1.5" fill="#ffffff" />
  `, "0 0 24 24", cls, style),

  // Book/Lessons
  book: (cls = "", style = "") => svgWrapper("book", `
    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z" fill="url(#v-grad-green)"/>
  `, "0 0 24 24", cls, style),

  // Review (Reload)
  review: (cls = "", style = "") => svgWrapper("review", `
    <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm-6.2 3.8L4.34 6.34C3.25 7.86 2.5 9.77 2.5 12c0 4.42 3.58 8 8 8v-3l4 4-4 4v-3c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8z" fill="url(#v-grad-blue)"/>
  `, "0 0 24 24", cls, style),

  // User Profile
  user: (cls = "", style = "") => svgWrapper("user", `
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="url(#v-grad-purple)"/>
  `, "0 0 24 24", cls, style),

  // Kana / Text
  kana: (cls = "", style = "") => svgWrapper("kana", `
    <rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="url(#v-grad-green)" stroke-width="2"/>
    <path d="M9 7c0 4 1 6 3 6s3-2 3-6M7 11h10M12 13v4" stroke="url(#v-grad-green)" stroke-width="2" stroke-linecap="round" fill="none"/>
  `, "0 0 24 24", cls, style),

  // Padlock
  lock: (cls = "", style = "") => svgWrapper("lock", `
    <rect x="3" y="11" width="18" height="11" rx="2" fill="url(#v-grad-gold)"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="url(#v-grad-gold)" stroke-width="3" stroke-linecap="round"/>
    <circle cx="12" cy="16" r="1.5" fill="#000" />
  `, "0 0 24 24", cls, style),

  // Check Badge
  check: (cls = "", style = "") => svgWrapper("check", `
    <circle cx="12" cy="12" r="10" fill="url(#v-grad-green)" />
    <path d="M9 12l2 2 4-4" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  `, "0 0 24 24", cls, style),

  // Close / Cross
  close: (cls = "", style = "") => svgWrapper("close", `
    <line x1="18" y1="6" x2="6" y2="18" stroke="url(#v-grad-heart)" stroke-width="2" stroke-linecap="round" />
    <line x1="6" y1="6" x2="18" y2="18" stroke="url(#v-grad-heart)" stroke-width="2" stroke-linecap="round" />
  `, "0 0 24 24", cls, style),

  // Speaker / Sound
  speaker: (cls = "", style = "") => svgWrapper("speaker", `
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="url(#v-grad-blue)" />
  `, "0 0 24 24", cls, style),

  // Loading
  loading: (cls = "", style = "") => svgWrapper("loading", `
    <circle cx="12" cy="12" r="10" fill="none" stroke="url(#v-grad-green)" stroke-width="2" stroke-dasharray="32" opacity="0.3"/>
    <circle cx="12" cy="12" r="10" fill="none" stroke="url(#v-grad-green)" stroke-width="2" stroke-dasharray="24" stroke-dashoffset="12">
      <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
    </circle>
  `, "0 0 24 24", cls, style),

  // Categories & Study Tips
  greetings: (cls = "", style = "") => svgWrapper("greetings", `
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10 10-4.48 10-10z" fill="url(#v-grad-purple)" opacity="0.2"/>
    <path d="M12 14c1.66 0 3-1.34 3-3V7c0-1.66-1.34-3-3-3S9 5.34 9 7v4c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" fill="url(#v-grad-purple)"/>
  `, "0 0 24 24", cls, style),

  numbers: (cls = "", style = "") => svgWrapper("numbers", `
    <rect x="3" y="3" width="7" height="7" rx="1.5" fill="url(#v-grad-blue)" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" fill="url(#v-grad-blue)" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" fill="url(#v-grad-blue)" />
    <path d="M16 14.5v6M14.5 16h3" stroke="url(#v-grad-blue)" stroke-width="2" stroke-linecap="round" fill="none" />
  `, "0 0 24 24", cls, style),

  food: (cls = "", style = "") => svgWrapper("food", `
    <path d="M2 12c0 4.42 3.58 8 8 8h4c4.42 0 8-3.58 8-8H2z" fill="url(#v-grad-orange)" />
    <path d="M20 7L4 4" stroke="#ffeb3b" stroke-width="2" stroke-linecap="round"/>
    <path d="M19 9L3 6" stroke="#ffeb3b" stroke-width="2" stroke-linecap="round"/>
  `, "0 0 24 24", cls, style),

  art: (cls = "", style = "") => svgWrapper("art", `
    <path d="M12 3a9 9 0 0 0 0 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.75-.39-1.04-.23-.29-.38-.68-.38-1.11 0-.83.67-1.49 1.5-1.49H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="url(#v-grad-purple)"/>
  `, "0 0 24 24", cls, style),

  family: (cls = "", style = "") => svgWrapper("family", `
    <path d="M12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-6 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm12 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-6 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm-6 2.6c.2-.71 2.22-1.6 4-1.6V19H4v-2.4zm12 0V19h4v-2.4c-1.78 0-3.8.89-4 1.6z" fill="url(#v-grad-blue)"/>
  `, "0 0 24 24", cls, style),

  time: (cls = "", style = "") => svgWrapper("time", `
    <circle cx="12" cy="12" r="10" fill="none" stroke="url(#v-grad-gold)" stroke-width="2"/>
    <path d="M12 6v6l4 2" fill="none" stroke="url(#v-grad-gold)" stroke-width="2" stroke-linecap="round"/>
  `, "0 0 24 24", cls, style),

  location: (cls = "", style = "") => svgWrapper("location", `
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" fill="url(#v-grad-red)"/>
  `, "0 0 24 24", cls, style),

  verb: (cls = "", style = "") => svgWrapper("verb", `
    <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 10.2l-.3-.9c-.4-1-.1-2.1.8-2.6 1-.5 2.2-.2 2.7.8l1.3 2.2c.4.7 1.2 1.1 2.1 1.1h1.4v2h-1.4c-1.3 0-2.5-.7-3.2-1.7l-.6-.9L9.1 16V22H7v-7.2l2.3-2.3.5-3.6zM17 12.2l-3-1.2V9.8l3 1.2v1.2zm1-5l-4-1.6V4.4L18 6v1.2z" fill="url(#v-grad-green)"/>
  `, "0 0 24 24", cls, style),

  alert: (cls = "", style = "") => svgWrapper("alert", `
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="url(#v-grad-heart)"/>
  `, "0 0 24 24", cls, style),

  tips: (cls = "", style = "") => svgWrapper("tips", `
    <path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z" fill="url(#v-grad-gold)"/>
  `, "0 0 24 24", cls, style),

  // Level roadmap elements
  level1: (cls = "", style = "") => svgWrapper("level1", `
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="url(#v-grad-green)" opacity="0.15"/>
    <path d="M12 18s-4-3-4-6a4 4 0 0 1 8 0c0 3-4 6-4 6z" fill="url(#v-grad-green)"/>
    <circle cx="12" cy="11" r="1.5" fill="#ffffff" />
  `, "0 0 24 24", cls, style),

  level2: (cls = "", style = "") => svgWrapper("level2", `
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="url(#v-grad-blue)" opacity="0.15"/>
    <path d="M12 18c-3 0-5-2-5-5a5 5 0 0 1 10 0c0 3-2 5-5 5z" fill="url(#v-grad-blue)" />
    <path d="M12 10a3 3 0 0 1 3 3H9a3 3 0 0 1 3-3z" fill="#ffffff" opacity="0.7"/>
  `, "0 0 24 24", cls, style),

  level3: (cls = "", style = "") => svgWrapper("level3", `
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="url(#v-grad-purple)" opacity="0.15"/>
    <path d="M12 19c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z" fill="url(#v-grad-purple)" />
    <path d="M12 8c2.2 0 4 1.8 4 4h-8c0-2.2 1.8-4 4-4z" fill="#ffffff" opacity="0.7"/>
  `, "0 0 24 24", cls, style),

  level4: (cls = "", style = "") => svgWrapper("level4", `
    <path d="M12 2L2 22h20L12 2z" fill="url(#v-grad-gold)" opacity="0.15"/>
    <path d="M12 6l7 12H5l7-12z" fill="url(#v-grad-gold)" />
    <circle cx="12" cy="13" r="2.5" fill="#ffffff" opacity="0.8" />
  `, "0 0 24 24", cls, style),

  level5: (cls = "", style = "") => svgWrapper("level5", `
    <path d="M12 2L2 7l10 5 10-5-10-5z" fill="url(#v-grad-heart)" />
    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" fill="none" stroke="url(#v-grad-heart)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  `, "0 0 24 24", cls, style),

  hard: (cls = "", style = "") => svgWrapper("hard", `
    <circle cx="12" cy="12" r="10" fill="url(#v-grad-heart)" />
    <circle cx="8.5" cy="10" r="1.5" fill="#ffffff" />
    <circle cx="15.5" cy="10" r="1.5" fill="#ffffff" />
    <path d="M9 16.5c1.5-1.5 4.5-1.5 6 0" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
  `, "0 0 24 24", cls, style),

  ok: (cls = "", style = "") => svgWrapper("ok", `
    <circle cx="12" cy="12" r="10" fill="url(#v-grad-gold)" />
    <circle cx="8.5" cy="10" r="1.5" fill="#ffffff" />
    <circle cx="15.5" cy="10" r="1.5" fill="#ffffff" />
    <line x1="8.5" y1="15" x2="15.5" y2="15" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
  `, "0 0 24 24", cls, style),

  easy: (cls = "", style = "") => svgWrapper("easy", `
    <circle cx="12" cy="12" r="10" fill="url(#v-grad-green)" />
    <circle cx="8.5" cy="10" r="1.5" fill="#ffffff" />
    <circle cx="15.5" cy="10" r="1.5" fill="#ffffff" />
    <path d="M8.5 14c1 1.5 2.5 1.5 3.5 1.5s2.5 0 3.5-1.5" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
  `, "0 0 24 24", cls, style),
};
