import React, { useState, useEffect } from 'react';

/* ============================================
   MAIN APP COMPONENT
   ============================================ */
export default function App() {
  const [loading, setLoading] = useState(true);
  const [loadingFading, setLoadingFading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [showAccepted, setShowAccepted] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [secretCount, setSecretCount] = useState(0);
  const [showSecret, setShowSecret] = useState(false);

  // Loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingFading(true);
      setTimeout(() => setLoading(false), 800);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Scroll handler for navbar
  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll reveal observer
  useEffect(() => {
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
      const heart = document.createElement('span');
      heart.className = 'cursor-heart';
      heart.textContent = '❤';
      heart.style.left = `${e.clientX}px`;
      heart.style.top = `${e.clientY}px`;
      heart.style.color = '#B21F45';
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 1500);
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
    setTimeout(() => setLoading(false), 800);
  };

  // Scroll to section
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  // Open heart button
  const openHeart = () => {
    scrollTo('letter');
    // Trigger heart burst
    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        const heart = document.createElement('span');
        heart.className = 'cursor-heart';
        heart.textContent = '❤';
        heart.style.left = `${window.innerWidth / 2 + (Math.random() - 0.5) * 100}px`;
        heart.style.top = `${window.innerHeight / 2}px`;
        heart.style.color = '#B21F45';
        heart.style.fontSize = '1.5rem';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1500);
      }, i * 100);
    }
  };

  return (
    <>
      {/* Loading Screen */}
      {loading && <LoadingScreen fading={loadingFading} onSkip={skipLoading} />}

      {/* Navbar */}
      <Navbar
        scrolled={navScrolled}
        mobileOpen={mobileMenuOpen}
        onToggleMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        onCloseMenu={() => setMobileMenuOpen(false)}
        onNavigate={scrollTo}
      />

      {/* Main Content */}
      <main>
        <HeroSection onOpenHeart={openHeart} />
        <LoveLetterSection />
        <WhyYouSection />
        <OurNamesSection />
        <TimelineSection />
        <PhotoGallerySection onOpenLightbox={setLightboxImage} />
        <LittleThingsSection />
        <LoveCounterSection />
        <FinalMessageSection />
        <ProposalSection onAccept={() => setShowAccepted(true)} />
      </main>

      {/* Footer */}
      <Footer
        secretCount={secretCount}
        onSecretClick={handleSecretClick}
        showSecret={showSecret}
      />

      {/* Lightbox */}
      {lightboxImage && (
        <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
      )}

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
      <div className="text-center animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          Prince ❤️ Princes
        </h1>
        <div className="animate-heartbeat text-4xl mb-6">❤️</div>
        <p className="text-lg text-pink-200" style={{ fontFamily: 'var(--font-body)' }}>
          Something special was made for you...
        </p>
      </div>
    </div>
  );
}

/* ============================================
   NAVBAR
   ============================================ */
function Navbar({ scrolled, mobileOpen, onToggleMenu, onCloseMenu, onNavigate }: {
  scrolled: boolean;
  mobileOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onNavigate: (id: string) => void;
}) {
  const links = [
    { label: 'Home', id: 'hero' },
    { label: 'Letter', id: 'letter' },
    { label: 'Our Story', id: 'timeline' },
    { label: 'Memories', id: 'photos' },
    { label: 'The Question', id: 'proposal' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); onNavigate('hero'); }}
            className="text-lg font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: scrolled ? 'var(--color-primary)' : 'white' }}
          >
            Prince ❤️ Princes
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex gap-6">
            {links.map(link => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => { e.preventDefault(); onNavigate(link.id); }}
                style={{ color: scrolled ? 'var(--color-primary)' : 'white' }}
                className="text-sm font-medium hover:opacity-80 transition-opacity"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={onToggleMenu}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className={`block h-0.5 w-full transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`}
                style={{ backgroundColor: scrolled ? 'var(--color-primary)' : 'white' }} />
              <span className={`block h-0.5 w-full transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`}
                style={{ backgroundColor: scrolled ? 'var(--color-primary)' : 'white' }} />
              <span className={`block h-0.5 w-full transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`}
                style={{ backgroundColor: scrolled ? 'var(--color-primary)' : 'white' }} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div className={`mobile-overlay ${mobileOpen ? 'open' : ''}`} onClick={onCloseMenu} />

      {/* Mobile menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <div className="flex flex-col gap-6">
          {links.map(link => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => { e.preventDefault(); onNavigate(link.id); }}
              className="text-lg font-medium"
              style={{ color: 'var(--color-primary)' }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

/* ============================================
   HERO SECTION
   ============================================ */
function HeroSection({ onOpenHeart }: { onOpenHeart: () => void }) {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    duration: `${6 + Math.random() * 4}s`,
    size: `${0.8 + Math.random() * 0.8}rem`,
  }));

  return (
    <section id="hero" className="hero-section">
      {/* Floating hearts */}
      <div className="hero-particles">
        {particles.map(p => (
          <span
            key={p.id}
            className="hero-particle"
            style={{
              left: p.left,
              bottom: '-20px',
              animationDelay: p.delay,
              animationDuration: p.duration,
              fontSize: p.size,
            }}
          >
            ❤
          </span>
        ))}
      </div>

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 animate-fade-in" style={{ fontFamily: 'var(--font-heading)' }}>
          Prince ❤️ Princes
        </h1>
        <p className="text-xl md:text-2xl text-pink-200 mb-6 animate-fade-in" style={{ animationDelay: '0.3s', fontFamily: 'var(--font-heading)', fontStyle: 'italic' }}>
          A little story about two hearts...
        </p>
        <p className="text-base md:text-lg text-pink-100 mb-10 animate-fade-in max-w-xl mx-auto" style={{ animationDelay: '0.6s' }}>
          Made especially for the girl who quietly found a special place in my heart.
        </p>
        <button
          onClick={onOpenHeart}
          className="proposal-btn proposal-btn-yes animate-fade-in"
          style={{ animationDelay: '0.9s' }}
        >
          Open My Heart ❤️
        </button>
        <div className="mt-16 animate-scroll-indicator">
          <p className="text-pink-200 text-sm">Scroll to discover our story ↓</p>
        </div>
      </div>
    </section>
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
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 reveal" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
          My Dearest Princes ❤️
        </h2>
        <div className="letter-card reveal">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="mb-5 leading-relaxed text-base md:text-lg reveal"
              style={{ color: 'var(--color-dark-text)', transitionDelay: `${i * 0.05}s` }}
            >
              {p}
            </p>
          ))}
          <div className="mt-8 text-right">
            <p className="text-xl md:text-2xl font-semibold" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
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
    { icon: '✨', title: 'The Little Things', desc: 'The tiny details about you that you probably don\'t even notice — I notice all of them.' },
    { icon: '🥹', title: 'The Way You Make Me Feel', desc: 'You make me feel like the best version of myself, just by being you.' },
    { icon: '👑', title: 'Simply You', desc: 'Not because of what you do, but because of who you are. That\'s enough.' },
  ];

  return (
    <section className="py-20 md:py-32 px-6" style={{ background: 'var(--color-white)' }}>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 reveal" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
          Why You? ❤️
        </h2>
        <p className="text-center text-lg mb-12 reveal" style={{ color: 'var(--color-dark-text)', opacity: 0.7 }}>
          I could give you a hundred reasons...
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <div key={i} className="romantic-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="text-3xl mb-3">{card.icon}</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-dark-text)', opacity: 0.8 }}>
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
    <section className="py-20 md:py-32 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--color-light-pink), var(--color-white))' }}>
      <div className="max-w-4xl mx-auto text-center">
        <div className="reveal">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-8">
            <h2 className="text-5xl md:text-7xl font-bold" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
              PRINCE
            </h2>
            <span className="text-4xl md:text-5xl animate-pulse-slow" style={{ color: 'var(--color-romantic)' }}>+</span>
            <h2 className="text-5xl md:text-7xl font-bold" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
              PRINCES
            </h2>
          </div>
          <div className="text-5xl animate-heartbeat mb-8">❤️</div>
          <p className="text-xl md:text-2xl mb-4 reveal" style={{ color: 'var(--color-dark-text)', fontFamily: 'var(--font-heading)', fontStyle: 'italic' }}>
            Maybe it's just a coincidence...
          </p>
          <p className="text-lg md:text-xl reveal" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-accent)', fontSize: '2rem' }}>
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
    { title: 'Where I Hope We Go', text: 'Wherever life takes us, I hope it\'s together — creating memories, sharing laughter, and growing side by side.' },
  ];

  return (
    <section id="timeline" className="py-20 md:py-32 px-6" style={{ background: 'var(--color-white)' }}>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 reveal" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
          Our Story ❤️
        </h2>
        <div className="timeline">
          {entries.map((entry, i) => (
            <div key={i} className="timeline-item reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
                {entry.title}
              </h3>
              <p className="leading-relaxed" style={{ color: 'var(--color-dark-text)', opacity: 0.8 }}>
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
   PHOTO GALLERY SECTION
   ============================================ */
function PhotoGallerySection({ onOpenLightbox }: { onOpenLightbox: (src: string) => void }) {
  const [images, setImages] = useState<(string | null)[]>([null, null, null, null, null, null]);
  const placeholders = [
    'Your memory goes here ❤️',
    'A moment to remember ❤️',
    'Together ❤️',
    'Our story ❤️',
    'Beautiful times ❤️',
    'Forever ❤️',
  ];

  useEffect(() => {
    const photoPaths = [
      '/assets/images/photo1.jpg',
      '/assets/images/photo2.jpg',
      '/assets/images/photo3.jpg',
      '/assets/images/photo4.jpg',
      '/assets/images/photo5.jpg',
      '/assets/images/photo6.jpg',
    ];

    photoPaths.forEach((path, i) => {
      const img = new Image();
      img.onload = () => {
        setImages(prev => {
          const next = [...prev];
          next[i] = path;
          return next;
        });
      };
      img.src = path;
    });
  }, []);

  return (
    <section id="photos" className="py-20 md:py-32 px-6" style={{ background: 'var(--color-light-pink)' }}>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 reveal" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
          Beautiful Moments 📸
        </h2>
        <p className="text-center text-lg mb-12 reveal" style={{ color: 'var(--color-dark-text)', opacity: 0.7 }}>
          Some memories deserve a place to stay.
        </p>
        <div className="photo-grid">
          {images.map((src, i) => (
            <div
              key={i}
              className="photo-card reveal"
              style={{ transitionDelay: `${i * 0.1}s` }}
              onClick={() => src && onOpenLightbox(src)}
              role={src ? 'button' : undefined}
              tabIndex={src ? 0 : undefined}
              onKeyDown={(e) => e.key === 'Enter' && src && onOpenLightbox(src)}
              aria-label={src ? `View photo ${i + 1}` : undefined}
            >
              {src ? (
                <img src={src} alt={`Memory ${i + 1}`} loading="lazy" />
              ) : (
                <div className="photo-placeholder">
                  <span>{placeholders[i]}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   LIGHTBOX
   ============================================ */
function Lightbox({ image, onClose }: { image: string; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-label="Image lightbox">
      <button className="lightbox-close" onClick={onClose} aria-label="Close lightbox">
        ✕
      </button>
      <img src={image} alt="Memory" onClick={(e) => e.stopPropagation()} />
    </div>
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
    <section className="py-20 md:py-32 px-6" style={{ background: 'var(--color-white)' }}>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 reveal" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
          Little Things I Love About You ❤️
        </h2>
        <div className="space-y-4">
          {things.map((thing, i) => (
            <div
              key={i}
              className="romantic-card reveal flex items-start gap-4"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <span className="text-2xl flex-shrink-0 mt-1">❤️</span>
              <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--color-dark-text)' }}>
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
    <section className="py-20 md:py-32 px-6" style={{ background: 'linear-gradient(135deg, var(--color-light-pink), var(--color-soft-pink))' }}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 reveal" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
          Things I Never Get Tired Of
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {counters.map((counter, i) => (
            <div key={i} className="counter-item reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="counter-value">{counter.value}</div>
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
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="hero-particle"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: '-20px',
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
              fontSize: '0.8rem',
              opacity: 0.2,
            }}
          >
            ❤
          </span>
        ))}
      </div>

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        {lines.map((line, i) => (
          <p
            key={i}
            className="text-xl md:text-3xl text-white mb-6 reveal"
            style={{
              fontFamily: 'var(--font-heading)',
              fontStyle: 'italic',
              transitionDelay: `${i * 0.2}s`,
              lineHeight: 1.6,
            }}
          >
            {line}
          </p>
        ))}
        <div className="text-5xl mt-8 animate-heartbeat reveal">❤️</div>
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
      <div className="text-center px-6 max-w-3xl mx-auto">
        <p className="text-xl md:text-2xl mb-6 reveal" style={{ color: 'var(--color-dark-text)', fontFamily: 'var(--font-heading)' }}>
          Princes, I have one question...
        </p>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 reveal" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
          Will you be my girl? ❤️
        </h2>
        <p className="text-xl mb-12 reveal" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
          — Prince 👑
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center reveal">
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
  const [confetti, setConfetti] = useState<Array<{ id: number; left: string; delay: string; emoji: string }>>([]);

  useEffect(() => {
    // Generate confetti hearts
    const items = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      emoji: ['❤️', '💕', '💖', '✨', '🌹', '💗'][Math.floor(Math.random() * 6)],
    }));
    setConfetti(items);

    // Try to play audio if exists
    const audio = new Audio('/assets/audio/romantic.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {}); // Silently fail if no audio

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="accepted-overlay">
      {/* Confetti */}
      {confetti.map(item => (
        <span
          key={item.id}
          className="confetti-heart"
          style={{
            left: item.left,
            top: '-20px',
            animationDelay: item.delay,
          }}
        >
          {item.emoji}
        </span>
      ))}

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
          YOU JUST MADE PRINCE THE HAPPIEST MAN ❤️
        </h2>
        <p className="text-xl md:text-2xl text-pink-200 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          Welcome to our story, Princes. 👑
        </p>
        <p className="text-lg text-pink-100 mb-10" style={{ fontFamily: 'var(--font-body)' }}>
          Here's to the memories we're going to create together.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            className="proposal-btn"
            style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
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
      </div>
    </div>
  );
}

/* ============================================
   FOOTER
   ============================================ */
function Footer({ onSecretClick, showSecret }: { secretCount: number; onSecretClick: () => void; showSecret: boolean }) {
  return (
    <footer className="py-16 px-6 text-center" style={{ background: 'var(--color-deep)' }}>
      <div className="max-w-3xl mx-auto">
        <p className="text-lg text-pink-200 mb-4" style={{ fontFamily: 'var(--font-body)' }}>
          Made with ❤️ by Prince
        </p>
        <p className="text-2xl text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          Prince ❤️ Princes
        </p>
        <p className="text-pink-200 italic mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
          Maybe this is the beginning of something beautiful...
        </p>

        {/* Secret heart */}
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

        {showSecret && (
          <div className="secret-message mt-6 p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <p className="text-pink-200 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              You found my little secret ❤️
            </p>
            <p className="text-pink-100 mb-2">
              I love the moments we share more than I can put into words.
            </p>
            <p className="text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              — Prince
            </p>
          </div>
        )}
      </div>
    </footer>
  );
}
