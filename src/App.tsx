import React, { useState, useEffect, useRef } from 'react';

/* ============================================
   WHATSAPP CONFIG
   ============================================ */
const WHATSAPP_NUMBER = '233552380231';
const WHATSAPP_MESSAGE = encodeURIComponent("Yes! I'll be your girl ❤️ — Princes");
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

/* ============================================
   MAIN APP COMPONENT
   ============================================ */
export default function App() {
  const [loading, setLoading] = useState(true);
  const [loadingFading, setLoadingFading] = useState(false);
  const [showAccepted, setShowAccepted] = useState(false);
  const [secretCount, setSecretCount] = useState(0);
  const [showSecret, setShowSecret] = useState(false);
  const [globalHearts, setGlobalHearts] = useState<Array<{ id: number; left: string; delay: string; duration: string; size: string; emoji: string; type: string }>>([]);
  const heartIdRef = useRef(0);

  // Loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingFading(true);
      setTimeout(() => setLoading(false), 1000);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Global floating hearts system
  useEffect(() => {
    if (loading) return;

    const emojis = ['❤️', '💕', '💖', '💗', '💓', '💝', '🌹', '✨', '💘', '♥️'];
    const interval = setInterval(() => {
      const newHeart = {
        id: heartIdRef.current++,
        left: `${Math.random() * 100}%`,
        delay: '0s',
        duration: `${6 + Math.random() * 8}s`,
        size: `${0.8 + Math.random() * 1.5}rem`,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        type: Math.random() > 0.5 ? 'fast' : 'slow',
      };
      setGlobalHearts(prev => {
        const next = [...prev, newHeart];
        // Keep only last 20 hearts for performance
        if (next.length > 20) return next.slice(-20);
        return next;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [loading]);

  // Scroll reveal observer
  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  // Heart cursor (desktop only)
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window;
    if (isTouchDevice) return;

    const handleClick = (e: MouseEvent) => {
      const hearts = ['❤', '💕', '💖', '♥'];
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const heart = document.createElement('span');
          heart.className = 'cursor-heart';
          heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
          heart.style.left = `${e.clientX + (Math.random() - 0.5) * 30}px`;
          heart.style.top = `${e.clientY}px`;
          heart.style.fontSize = `${0.8 + Math.random() * 0.8}rem`;
          document.body.appendChild(heart);
          setTimeout(() => heart.remove(), 2000);
        }, i * 100);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Secret heart click handler
  const handleSecretClick = () => {
    const newCount = secretCount + 1;
    setSecretCount(newCount);
    if (newCount >= 5) {
      setShowSecret(true);
      setSecretCount(0);
    }
  };

  // Skip loading
  const skipLoading = () => {
    setLoadingFading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  // Handle YES - redirect to WhatsApp
  const handleYes = () => {
    setShowAccepted(true);
    // After showing celebration for a moment, redirect to WhatsApp
    setTimeout(() => {
      window.open(WHATSAPP_URL, '_blank');
    }, 2500);
  };

  return (
    <>
      {/* Loading Screen */}
      {loading && <LoadingScreen fading={loadingFading} onSkip={skipLoading} />}

      {/* Global Floating Hearts */}
      {!loading && (
        <div className="hearts-container">
          {globalHearts.map(heart => (
            <span
              key={heart.id}
              className={heart.type === 'fast' ? 'floating-heart' : 'floating-heart-slow'}
              style={{
                left: heart.left,
                animationDuration: heart.duration,
                fontSize: heart.size,
              }}
            >
              {heart.emoji}
            </span>
          ))}
        </div>
      )}

      {/* Main Content */}
      <main>
        <HeroSection />
        <LoveLetterSection />
        <WhyYouSection />
        <OurNamesSection />
        <TimelineSection />
        <LittleThingsSection />
        <LoveCounterSection />
        <FinalMessageSection />
        <ProposalSection onAccept={handleYes} />
      </main>

      {/* Footer */}
      <Footer
        onSecretClick={handleSecretClick}
        showSecret={showSecret}
      />

      {/* Accepted Overlay */}
      {showAccepted && (
        <AcceptedOverlay
          onClose={() => setShowAccepted(false)}
          onReplay={() => {
            setShowAccepted(false);
            setTimeout(() => setShowAccepted(true), 100);
          }}
        />
      )}
    </>
  );
}

/* ============================================
   LOADING SCREEN
   ============================================ */
function LoadingScreen({ fading, onSkip }: { fading: boolean; onSkip: () => void }) {
  return (
    <div
      className={`loading-screen ${fading ? 'hidden' : ''}`}
      onClick={onSkip}
      role="button"
      aria-label="Skip loading screen"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSkip()}
    >
      {/* Background floating hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="floating-heart"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${4 + Math.random() * 6}s`,
              animationDelay: `${Math.random() * 3}s`,
              fontSize: `${0.6 + Math.random() * 1}rem`,
              opacity: 0.3,
            }}
          >
            {['❤️', '💕', '💖', '💗', '✨'][Math.floor(Math.random() * 5)]}
          </span>
        ))}
      </div>

      <div className="text-center animate-fade-in relative z-10">
        <div className="loading-heart-container mx-auto mb-8">
          <span className="text-5xl animate-heartbeat">❤️</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          Prince ❤️ Princes
        </h1>
        <p className="text-lg md:text-xl text-pink-200 mt-6" style={{ fontFamily: 'var(--font-body)' }}>
          Something special was made for you...
        </p>
        <p className="text-sm text-pink-300 mt-8 opacity-60">tap anywhere to enter</p>
      </div>
    </div>
  );
}

/* ============================================
   HERO SECTION
   ============================================ */
function HeroSection() {
  const bgHearts = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 10}s`,
    duration: `${8 + Math.random() * 12}s`,
    size: `${1.5 + Math.random() * 3}rem`,
    opacity: 0.03 + Math.random() * 0.06,
  }));

  return (
    <section id="hero" className="hero-section">
      {/* Large background hearts */}
      <div className="hero-bg-hearts">
        {bgHearts.map(h => (
          <span
            key={h.id}
            className="hero-bg-heart"
            style={{
              left: h.left,
              bottom: '-50px',
              animationDuration: h.duration,
              animationDelay: h.delay,
              fontSize: h.size,
              opacity: h.opacity,
            }}
          >
            ❤
          </span>
        ))}
      </div>

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.05) 0%, transparent 70%)'
      }} />

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <div className="animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
          <span className="text-6xl md:text-8xl block mb-6 animate-heartbeat">❤️</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in" style={{ fontFamily: 'var(--font-heading)', animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards' }}>
          Prince <span className="inline-block animate-pulse-slow">❤️</span> Princes
        </h1>
        
        <p className="text-xl md:text-2xl text-pink-200 mb-6 animate-fade-in" style={{ animationDelay: '0.8s', opacity: 0, animationFillMode: 'forwards', fontFamily: 'var(--font-heading)', fontStyle: 'italic' }}>
          A little story about two hearts...
        </p>
        
        <p className="text-base md:text-lg text-pink-100 mb-12 animate-fade-in max-w-xl mx-auto leading-relaxed" style={{ animationDelay: '1.1s', opacity: 0, animationFillMode: 'forwards' }}>
          Made especially for the girl who quietly found a special place in my heart.
        </p>

        <div className="animate-fade-in" style={{ animationDelay: '1.4s', opacity: 0, animationFillMode: 'forwards' }}>
          <a
            href="#letter"
            className="inline-block proposal-btn proposal-btn-yes"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('letter')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Open My Heart ❤️
          </a>
        </div>

        <div className="mt-20 animate-scroll-indicator">
          <p className="text-pink-200 text-sm tracking-wide">Scroll to discover our story ↓</p>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   SECTION DIVIDER
   ============================================ */
function SectionDivider() {
  return (
    <div className="section-divider">
      <div className="section-divider-line" />
      <span className="text-lg animate-pulse-slow">❤️</span>
      <div className="section-divider-line" />
    </div>
  );
}

/* ============================================
   LOVE LETTER SECTION
   ============================================ */
function LoveLetterSection() {
  const paragraphs = [
    "Sometimes I sit and wonder how someone can slowly become so important to you without even realizing it. And whenever I think about that person, I think of you.",
    "Princes, there's something about you that I honestly can't fully explain. Maybe it's your smile, the way we talk, the little moments we share, or simply the way your presence makes my day better.",
    "I won't lie… I kind of feel bored and incomplete when I don't get to spend some time with you, especially in the evenings. I find myself looking forward to seeing you, talking to you, laughing with you, and just being around you.",
    "Somehow, without me even noticing, you found a special place in my heart.",
    "And then there's our names… Prince and Princes. Isn't that something? Maybe it's just a beautiful coincidence, or maybe life is quietly writing a little story for us.",
    "I know I'm not perfect, and I don't promise that I'll always get everything right. But if you give me the chance, I promise I'll keep trying to make you smile, listen when you need someone, support your dreams, respect you, and be someone you can always feel comfortable with.",
    "I don't just want to know the happy version of you. I want to know all of you—your dreams, your fears, your bad days, your little habits, the things that make you laugh, and even the things that annoy you.",
    "I want us to create memories together. The simple moments, the random conversations, the laughter, the walks, the evenings together… the kind of memories that we'll look back on one day and smile.",
    "Princes, the truth is…",
    "I don't just enjoy talking to you anymore. I've genuinely developed feelings for you.",
    "And I've reached a point where I don't want to keep those feelings hidden."
  ];

  return (
    <section id="letter" className="py-20 md:py-32 px-6" style={{ background: 'var(--color-light-pink)' }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-4xl block mb-4 animate-float">💌</span>
          <h2 className="text-3xl md:text-4xl font-bold reveal" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
            My Dearest Princes ❤️
          </h2>
        </div>
        <div className="letter-card reveal">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="mb-5 leading-relaxed text-base md:text-lg reveal"
              style={{ color: 'var(--color-dark-text)', transitionDelay: `${i * 0.05}s`, lineHeight: '1.8' }}
            >
              {p}
            </p>
          ))}
          <div className="mt-10 text-right pt-6" style={{ borderTop: '1px solid var(--color-soft-pink)' }}>
            <p className="text-2xl md:text-3xl font-semibold" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-accent)' }}>
              — Prince 👑
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   WHY YOU SECTION
   ============================================ */
function WhyYouSection() {
  const cards = [
    { icon: '😊', title: 'Your Smile', desc: 'Your smile has a way of making an ordinary moment feel special.' },
    { icon: '❤️', title: 'Your Presence', desc: 'Being around you feels like coming home to somewhere I never knew I was missing.' },
    { icon: '💬', title: 'Our Conversations', desc: 'Every conversation with you feels like a little adventure I never want to end.' },
    { icon: '✨', title: 'The Little Things', desc: "The tiny details about you that you probably don't even notice — I notice all of them." },
    { icon: '🥹', title: 'The Way You Make Me Feel', desc: 'You make me feel like the best version of myself, just by being you.' },
    { icon: '👑', title: 'Simply You', desc: "Not because of what you do, but because of who you are. That's enough." },
  ];

  return (
    <section className="py-20 md:py-32 px-6 relative" style={{ background: 'var(--color-white)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 reveal" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
            Why You? ❤️
          </h2>
          <p className="text-lg reveal" style={{ color: 'var(--color-dark-text)', opacity: 0.7, fontStyle: 'italic' }}>
            I could give you a hundred reasons...
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <div key={i} className="romantic-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="text-4xl mb-4 animate-float" style={{ animationDelay: `${i * 0.3}s` }}>{card.icon}</div>
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-dark-text)', opacity: 0.8, lineHeight: '1.7' }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   OUR NAMES SECTION
   ============================================ */
function OurNamesSection() {
  return (
    <section className="py-20 md:py-32 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--color-light-pink), var(--color-white), var(--color-light-pink))' }}>
      {/* Decorative hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="floating-heart-slow"
            style={{
              left: `${10 + Math.random() * 80}%`,
              animationDuration: `${10 + Math.random() * 8}s`,
              animationDelay: `${Math.random() * 5}s`,
              fontSize: `${1 + Math.random() * 1.5}rem`,
              opacity: 0.15,
            }}
          >
            💕
          </span>
        ))}
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="reveal">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-10">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold animate-glow rounded-2xl px-6 py-3" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
              PRINCE
            </h2>
            <span className="text-4xl md:text-6xl animate-heartbeat" style={{ color: 'var(--color-romantic)' }}>❤️</span>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold animate-glow rounded-2xl px-6 py-3" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)', animationDelay: '0.5s' }}>
              PRINCES
            </h2>
          </div>
          <p className="text-xl md:text-2xl mb-6 reveal" style={{ color: 'var(--color-dark-text)', fontFamily: 'var(--font-heading)', fontStyle: 'italic' }}>
            Maybe it's just a coincidence...
          </p>
          <p className="reveal" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-accent)', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
            Or maybe our names were meant to meet.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   TIMELINE SECTION
   ============================================ */
function TimelineSection() {
  const entries = [
    { title: 'Where It Started', text: 'Somewhere between conversations and moments, you became special to me.' },
    { title: 'Getting To Know You', text: 'Every message, every call, every little thing you shared — I treasured it all.' },
    { title: 'The Little Moments', text: 'The random laughs, the late-night talks, the silences that felt comfortable...' },
    { title: 'When I Realized', text: 'Somewhere along the way, talking to you stopped being just something I enjoyed... it became something I looked forward to.' },
    { title: 'Today', text: 'Here I am, putting my heart into words, hoping you can feel what I feel.' },
    { title: 'Where I Hope We Go', text: "Wherever life takes us, I hope it's together — creating memories, sharing laughter, and growing side by side." },
  ];

  return (
    <section id="timeline" className="py-20 md:py-32 px-6" style={{ background: 'var(--color-white)' }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-4xl block mb-4 animate-float">📖</span>
          <h2 className="text-3xl md:text-4xl font-bold reveal" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
            Our Story ❤️
          </h2>
        </div>
        <div className="timeline">
          {entries.map((entry, i) => (
            <div key={i} className="timeline-item reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
                {entry.title}
              </h3>
              <p className="leading-relaxed" style={{ color: 'var(--color-dark-text)', opacity: 0.8, lineHeight: '1.8' }}>
                {entry.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   LITTLE THINGS SECTION
   ============================================ */
function LittleThingsSection() {
  const things = [
    "The way you make conversations feel easy.",
    "The way your presence can change my mood.",
    "The little things you probably don't realize I notice.",
    "The moments when we simply enjoy being together.",
    "How somehow, an ordinary evening can become my favorite part of the day.",
    "The person you are.",
  ];

  return (
    <section className="py-20 md:py-32 px-6 relative" style={{ background: 'var(--color-light-pink)' }}>
      {/* Background hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className="floating-heart-slow"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${12 + Math.random() * 8}s`,
              animationDelay: `${Math.random() * 6}s`,
              fontSize: '1.2rem',
              opacity: 0.1,
            }}
          >
            💗
          </span>
        ))}
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold reveal" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
            Little Things I Love About You ❤️
          </h2>
        </div>
        <div className="space-y-5">
          {things.map((thing, i) => (
            <div
              key={i}
              className="romantic-card reveal flex items-start gap-4"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <span className="text-2xl flex-shrink-0 mt-1 animate-pulse-slow" style={{ animationDelay: `${i * 0.5}s` }}>❤️</span>
              <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--color-dark-text)', lineHeight: '1.7' }}>
                {thing}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   LOVE COUNTER SECTION
   ============================================ */
function LoveCounterSection() {
  const counters = [
    { value: '∞', label: 'Thinking about you' },
    { value: 'Too many', label: 'Wanting to see you' },
    { value: 'Still counting', label: 'Smiling because of you' },
    { value: 'Always', label: 'Reasons to love you' },
  ];

  return (
    <section className="py-20 md:py-32 px-6" style={{ background: 'linear-gradient(135deg, var(--color-light-pink), var(--color-soft-pink), var(--color-light-pink))' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-4xl block mb-4 animate-heartbeat">💝</span>
          <h2 className="text-3xl md:text-4xl font-bold reveal" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
            Things I Never Get Tired Of
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {counters.map((counter, i) => (
            <div key={i} className="counter-item reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="counter-value animate-text-glow">{counter.value}</div>
              <p className="text-sm md:text-base" style={{ color: 'var(--color-dark-text)', opacity: 0.8 }}>
                {counter.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   FINAL MESSAGE SECTION
   ============================================ */
function FinalMessageSection() {
  const lines = [
    'Princes...',
    "You've become someone I genuinely care about.",
    "I don't know exactly what the future holds...",
    "But I know I'd love to discover it with you.",
  ];

  return (
    <section className="final-message-section">
      {/* Lots of floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="floating-heart"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${8 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 8}s`,
              fontSize: `${0.6 + Math.random() * 1}rem`,
              opacity: 0.15 + Math.random() * 0.15,
            }}
          >
            {['❤', '💕', '✨', '💖'][Math.floor(Math.random() * 4)]}
          </span>
        ))}
      </div>

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.08) 0%, transparent 60%)'
      }} />

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        {lines.map((line, i) => (
          <p
            key={i}
            className="text-xl md:text-3xl text-white mb-8 reveal"
            style={{
              fontFamily: 'var(--font-heading)',
              fontStyle: 'italic',
              transitionDelay: `${i * 0.3}s`,
              lineHeight: 1.6,
            }}
          >
            {line}
          </p>
        ))}
        <div className="text-6xl mt-10 animate-heartbeat reveal">❤️</div>
      </div>
    </section>
  );
}

/* ============================================
   PROPOSAL SECTION
   ============================================ */
function ProposalSection({ onAccept }: { onAccept: () => void }) {
  return (
    <section id="proposal" className="proposal-section">
      {/* Background hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <span
            key={i}
            className="floating-heart-slow"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${10 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 5}s`,
              fontSize: `${1 + Math.random() * 2}rem`,
              opacity: 0.08 + Math.random() * 0.08,
            }}
          >
            {['❤️', '💕', '💖', '💗', '💝'][Math.floor(Math.random() * 5)]}
          </span>
        ))}
      </div>

      <div className="text-center px-6 max-w-3xl mx-auto relative z-10">
        <span className="text-5xl block mb-8 animate-float">💍</span>
        
        <p className="text-xl md:text-2xl mb-6 reveal" style={{ color: 'var(--color-dark-text)', fontFamily: 'var(--font-heading)' }}>
          Princes, I have one question...
        </p>
        
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 reveal" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
          Will you be my girl? ❤️
        </h2>
        
        <p className="text-xl mb-14 reveal" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-accent)', fontSize: 'clamp(1.3rem, 3vw, 1.8rem)' }}>
          — Prince 👑
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center reveal">
          <button className="proposal-btn proposal-btn-yes" onClick={onAccept}>
            YES ❤️
          </button>
          <button className="proposal-btn proposal-btn-yes" onClick={onAccept} style={{ background: 'linear-gradient(135deg, var(--color-romantic), var(--color-primary))' }}>
            YES, OF COURSE 🥹
          </button>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   ACCEPTED OVERLAY
   ============================================ */
function AcceptedOverlay({ onClose, onReplay }: { onClose: () => void; onReplay: () => void }) {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: string; delay: string; emoji: string; size: string }>>([]);

  useEffect(() => {
    const items = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      emoji: ['❤️', '💕', '💖', '✨', '🌹', '💗', '💝', '💘', '🥰', '😍'][Math.floor(Math.random() * 10)],
      size: `${1 + Math.random() * 1.5}rem`,
    }));
    setConfetti(items);

    // Try to play audio if exists
    const audio = new Audio('/assets/audio/romantic.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="accepted-overlay">
      {/* Massive confetti */}
      {confetti.map(item => (
        <span
          key={item.id}
          className="confetti-heart"
          style={{
            left: item.left,
            top: '-30px',
            animationDelay: item.delay,
            fontSize: item.size,
          }}
        >
          {item.emoji}
        </span>
      ))}

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl">
        <div className="text-6xl mb-6 animate-heartbeat">🎉</div>
        
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-8 animate-bounceIn" style={{ fontFamily: 'var(--font-heading)', lineHeight: 1.4 }}>
          YOU JUST MADE PRINCE<br />THE HAPPIEST MAN ❤️
        </h2>
        
        <p className="text-xl md:text-2xl text-pink-200 mb-4 animate-fade-in" style={{ fontFamily: 'var(--font-heading)', animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards' }}>
          Welcome to our story, Princes. 👑
        </p>
        
        <p className="text-lg text-pink-100 mb-12 animate-fade-in" style={{ fontFamily: 'var(--font-body)', animationDelay: '1s', opacity: 0, animationFillMode: 'forwards' }}>
          Here's to the memories we're going to create together.
        </p>

        <div className="animate-fade-in flex flex-col sm:flex-row gap-4 justify-center items-center" style={{ animationDelay: '1.5s', opacity: 0, animationFillMode: 'forwards' }}>
          <button
            className="proposal-btn"
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)' }}
            onClick={onReplay}
          >
            Replay the moment ❤️
          </button>
          <button
            className="proposal-btn"
            style={{ background: 'white', color: 'var(--color-primary)' }}
            onClick={onClose}
          >
            Back to our story
          </button>
        </div>

        <p className="text-pink-300 text-sm mt-8 animate-fade-in" style={{ animationDelay: '2s', opacity: 0, animationFillMode: 'forwards' }}>
          Sending your answer via WhatsApp... 💬
        </p>
      </div>
    </div>
  );
}

/* ============================================
   FOOTER (No Navigation)
   ============================================ */
function Footer({ onSecretClick, showSecret }: { onSecretClick: () => void; showSecret: boolean }) {
  return (
    <footer className="py-20 px-6 text-center relative overflow-hidden" style={{ background: 'var(--color-deep)' }}>
      {/* Background hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="floating-heart-slow"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${15 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 8}s`,
              fontSize: '1rem',
              opacity: 0.05,
            }}
          >
            ❤️
          </span>
        ))}
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="mb-8">
          <span className="text-3xl block mb-4 animate-heartbeat">❤️</span>
          <p className="text-lg text-pink-200 mb-4" style={{ fontFamily: 'var(--font-body)' }}>
            Made with ❤️ by Prince
          </p>
          <p className="text-2xl md:text-3xl text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Prince ❤️ Princes
          </p>
          <p className="text-pink-200 italic" style={{ fontFamily: 'var(--font-accent)', fontSize: 'clamp(1.2rem, 3vw, 1.6rem)' }}>
            Maybe this is the beginning of something beautiful...
          </p>
        </div>

        {/* Secret heart */}
        <div className="mt-10 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <span
            className="secret-heart text-2xl inline-block"
            onClick={onSecretClick}
            role="button"
            tabIndex={0}
            aria-label="Secret"
            onKeyDown={(e) => e.key === 'Enter' && onSecretClick()}
          >
            💝
          </span>
        </div>

        {showSecret && (
          <div className="secret-message mt-6 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
            <p className="text-pink-200 mb-3 text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
              You found my little secret ❤️
            </p>
            <p className="text-pink-100 mb-3 leading-relaxed">
              I love the moments we share more than I can put into words.
            </p>
            <p className="text-white" style={{ fontFamily: 'var(--font-accent)', fontSize: '1.5rem' }}>
              — Prince
            </p>
          </div>
        )}
      </div>
    </footer>
  );
}
