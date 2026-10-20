import React, { useEffect, useRef, useState } from 'react';
import './professional-services.css';

const WHATSAPP_NUMBER = '573011360508';
const FORM_ID = 'professional-services-form';
const ASSET_BASE_PATH = `${import.meta.env.BASE_URL}agentejota-profesionales`;
const OWN_CENTER_ASSET_PATH = `${ASSET_BASE_PATH}/own-center`;

type SectionMediaPreferences = { isMobile: boolean; prefersReducedMotion: boolean };

const readSectionMediaPreferences = (): SectionMediaPreferences => {
  if (typeof window === 'undefined') return { isMobile: false, prefersReducedMotion: true };
  return {
    isMobile: window.matchMedia('(max-width: 760px)').matches,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  };
};

const ProfessionalServicesMotionVideo: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const source = `${OWN_CENTER_ASSET_PATH}/${isMobile ? 'mobile' : 'desktop'}.mp4`;
  const poster = `${OWN_CENTER_ASSET_PATH}/${isMobile ? 'mobile-7.30' : 'desktop-7.30'}.png`;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const applyPlaybackRate = () => { video.playbackRate = 1.5; };
    video.addEventListener('loadedmetadata', applyPlaybackRate);
    video.src = source;
    video.load();
    if (video.readyState >= 1) applyPlaybackRate();
    return () => {
      video.removeEventListener('loadedmetadata', applyPlaybackRate);
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [source]);

  return <>
    <div className="ps-own-center-frame">
      <video
        ref={videoRef}
        className="ps-own-center-video"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  </>;
};

const ProfessionalServicesMotion: React.FC = () => {
  const [preferences, setPreferences] = useState<SectionMediaPreferences>(readSectionMediaPreferences);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 760px)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreferences = () => setPreferences({
      isMobile: mobileQuery.matches,
      prefersReducedMotion: reducedMotionQuery.matches,
    });
    updatePreferences();
    mobileQuery.addEventListener('change', updatePreferences);
    reducedMotionQuery.addEventListener('change', updatePreferences);
    return () => {
      mobileQuery.removeEventListener('change', updatePreferences);
      reducedMotionQuery.removeEventListener('change', updatePreferences);
    };
  }, []);

  const poster = `${OWN_CENTER_ASSET_PATH}/${preferences.isMobile ? 'mobile-7.30' : 'desktop-7.30'}.png`;
  return <div className="ps-own-center-asset">
    {preferences.prefersReducedMotion
      ? <div className="ps-own-center-frame"><img className="ps-own-center-poster" src={poster} alt="" aria-hidden="true" /></div>
      : <ProfessionalServicesMotionVideo isMobile={preferences.isMobile} />}
  </div>;
};

const useScrollReveal = <T extends HTMLElement = HTMLElement,>(threshold = 0.18) => {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof window.IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    setReady(true);
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold });
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible, ready };
};

const goToForm = (event: React.MouseEvent<HTMLAnchorElement>) => {
  event.preventDefault();
  const target = document.getElementById(FORM_ID);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' });
  target?.focus({ preventScroll: true });
};

const ProfessionalSpecimen: React.FC = () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTitleRef = useRef<HTMLSpanElement>(null);
  const commercialCopyRef = useRef<HTMLDivElement>(null);
  const [titleRevealed, setTitleRevealed] = useState(false);
  const [commercialCopyRevealed, setCommercialCopyRevealed] = useState(false);
  const lightHistory = useRef<Array<{ x: string; y: string; time: number }>>([]);
  const trailTimer = useRef<number | null>(null);
  const touchHoldTimer = useRef<number | null>(null);
  const activeTouch = useRef<number | null>(null);
  const staticPortrait = reducedMotion || typeof window.PointerEvent === 'undefined';
  useEffect(() => {
    const title = revealTitleRef.current;
    if (!title) return;
    if (window.matchMedia('(min-width: 601px)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof window.IntersectionObserver === 'undefined') {
      setTitleRevealed(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setTitleRevealed(true);
        observer.disconnect();
      }
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    observer.observe(title);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const commercialCopy = commercialCopyRef.current;
    if (!commercialCopy) return;
    if (window.matchMedia('(min-width: 601px)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof window.IntersectionObserver === 'undefined') {
      setCommercialCopyRevealed(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setCommercialCopyRevealed(true);
        observer.disconnect();
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
    observer.observe(commercialCopy);
    return () => observer.disconnect();
  }, []);
  useEffect(() => () => {
    if (trailTimer.current !== null) window.clearTimeout(trailTimer.current);
    if (touchHoldTimer.current !== null) window.clearTimeout(touchHoldTimer.current);
  }, []);
  const setPenumbra = (hero: HTMLElement) => {
    if (touchHoldTimer.current !== null) window.clearTimeout(touchHoldTimer.current);
    touchHoldTimer.current = null;
    hero.dataset.revealActive = 'false';
    if (trailTimer.current !== null) window.clearTimeout(trailTimer.current);
    trailTimer.current = null;
    lightHistory.current = [];
    hero.style.setProperty('--trail-strength', '0');
    hero.style.setProperty('--reveal-shoulder', '0');
    hero.style.setProperty('--reveal-identity', '0');
    hero.style.setProperty('--reveal-gaze', '0');
  };
  const updateReveal = (event: React.PointerEvent<HTMLElement>) => {
    const isDesktopMouse = event.pointerType === 'mouse' && window.matchMedia('(min-width: 901px)').matches;
    const hero = event.currentTarget;
    const frame = hero.querySelector('.ps-portrait-frame');
    if (!frame) return false;
    const rect = frame.getBoundingClientRect();
    const insideFrame = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!insideFrame || rect.width === 0 || rect.height === 0) {
      if (event.pointerType === 'mouse') setPenumbra(hero);
      return false;
    }
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    const closeness = (targetX: number, targetY: number, radius: number) => Math.max(0, Math.min(1, 1 - Math.hypot(x - targetX, y - targetY) / radius));
    const light = { x: `${(x * 100).toFixed(2)}%`, y: `${(y * 100).toFixed(2)}%` };
    if (isDesktopMouse && !reducedMotion) {
      const now = window.performance.now();
      lightHistory.current.push({ ...light, time: now });
      lightHistory.current = lightHistory.current.filter((point) => now - point.time <= 250);
      const trailPoint = lightHistory.current.find((point) => now - point.time >= 70) ?? lightHistory.current[0];
      hero.style.setProperty('--trail-x', trailPoint.x);
      hero.style.setProperty('--trail-y', trailPoint.y);
      hero.style.setProperty('--trail-strength', '.28');
      if (trailTimer.current !== null) window.clearTimeout(trailTimer.current);
      trailTimer.current = window.setTimeout(() => {
        hero.style.setProperty('--trail-strength', '0');
        trailTimer.current = null;
      }, 105);
    } else {
      if (trailTimer.current !== null) window.clearTimeout(trailTimer.current);
      trailTimer.current = null;
      lightHistory.current = [];
      hero.style.setProperty('--trail-strength', '0');
    }
    hero.style.setProperty('--light-x', light.x);
    hero.style.setProperty('--light-y', light.y);
    hero.style.setProperty('--reveal-shoulder', closeness(0.67, 0.75, 0.5).toFixed(2));
    hero.style.setProperty('--reveal-identity', '1');
    hero.style.setProperty('--reveal-gaze', (closeness(0.42, 0.29, 0.16) * 0.78).toFixed(2));
    return true;
  };
  const isInteractiveTarget = (event: React.PointerEvent<HTMLElement>) =>
    Boolean((event.target as Element).closest('a, button, input, select, textarea, [role="button"]'));
  const startReveal = (event: React.PointerEvent<HTMLElement>) => {
    if (isInteractiveTarget(event) || (event.pointerType !== 'mouse' && (!event.isPrimary || activeTouch.current !== null))) return;
    if (!updateReveal(event)) return;
    if (event.pointerType !== 'mouse') {
      activeTouch.current = event.pointerId;
      if (touchHoldTimer.current !== null) window.clearTimeout(touchHoldTimer.current);
      touchHoldTimer.current = null;
      event.currentTarget.dataset.revealInput = 'touch';
      event.currentTarget.dataset.revealActive = 'true';
      event.currentTarget.dataset.revealUsed = 'true';
    }
  };
  const moveReveal = (event: React.PointerEvent<HTMLElement>) => {
    if (isInteractiveTarget(event)) return;
    if (event.pointerType !== 'mouse' && activeTouch.current !== event.pointerId) return;
    updateReveal(event);
  };
  const finishReveal = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse' || activeTouch.current !== event.pointerId) return;
    activeTouch.current = null;
    const hero = event.currentTarget;
    // Preserve the first glimpse when a short tap or native vertical scroll ends the pointer stream.
    touchHoldTimer.current = window.setTimeout(() => setPenumbra(hero), 800);
  };
  const leaveReveal = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse') setPenumbra(event.currentTarget);
  };
  const revealWithKeyboard = (event: React.MouseEvent<HTMLButtonElement>) => {
    const hero = event.currentTarget.closest<HTMLElement>('.professional-services-hero');
    if (!hero) return;
    if (touchHoldTimer.current !== null) window.clearTimeout(touchHoldTimer.current);
    touchHoldTimer.current = null;
    hero.style.setProperty('--light-x', '42%');
    hero.style.setProperty('--light-y', '29%');
    hero.style.setProperty('--reveal-identity', '1');
    hero.style.setProperty('--reveal-gaze', '.78');
  };
  return <section className={`professional-services-hero${staticPortrait ? ' has-static-portrait' : ''}`} aria-labelledby="professional-services-title" onPointerMove={moveReveal} onPointerDown={startReveal} onPointerUp={finishReveal} onPointerCancel={finishReveal} onPointerLeave={leaveReveal}>
    <div className="ps-hero-copy">
      <h1 id="professional-services-title" aria-label="Tu marca personal no necesita inventarse. Necesita revelarse"><span className="ps-title-first"><span className="ps-title-first-line">Tu marca personal</span> <span className="ps-title-first-line">no necesita inventarse</span></span> <span ref={revealTitleRef} className={`ps-title-reveal ${titleRevealed ? 'is-visible' : 'is-pending'}`}>
        {['Necesita', 'revelarse'].map((word, wordIndex) => <React.Fragment key={word}>
          {wordIndex > 0 ? <br aria-hidden="true" /> : null}
          <span className="ps-title-word" aria-hidden="true">{Array.from(word).map((letter, letterIndex) => <span className="ps-title-letter" key={`${word}-${letterIndex}`} style={{ transitionDelay: `${(wordIndex * 8 + letterIndex) * 28}ms` }}>{letter}</span>)}</span>
        </React.Fragment>)}
      </span></h1>
      <div ref={commercialCopyRef} className={`ps-commercial-copy ${commercialCopyRevealed ? 'is-visible' : 'is-pending'}`}>
        <p className="professional-services-eyebrow">Para profesionales que quieren una web premium</p>
        <p className="professional-services-hero-copy">Hacemos que tu presencia digital adquiera la reputación y el estilo que se merece. Cuando tu trabajo se percibe mejor, aumentas tu valor.</p>
        <a className="ps-advance-link" href="#professional-services-convergence">Ver cómo se conecta todo <span aria-hidden="true">↓</span></a>
      </div>
    </div>
    <div className="ps-portrait-frame" role="img" aria-label="Retrato artístico de una profesional, parcialmente de perfil y en luz tenue"><img className="ps-portrait-presence" src={`${ASSET_BASE_PATH}/professional-presence-portrait.png`} alt="" fetchPriority="high" /><img className="ps-portrait-shoulder" src={`${ASSET_BASE_PATH}/professional-presence-portrait.png`} alt="" /><img className="ps-portrait-identity" src={`${ASSET_BASE_PATH}/professional-presence-portrait.png`} alt="" /><img className="ps-portrait-gaze" src={`${ASSET_BASE_PATH}/professional-presence-portrait.png`} alt="" /></div>
    <span className="ps-reveal-hint" aria-hidden="true">Desliza para revelar</span>
    <button className="ps-reveal-keyboard" type="button" onClick={revealWithKeyboard} onBlur={(event) => {
      const hero = event.currentTarget.closest<HTMLElement>('.professional-services-hero');
      if (hero) setPenumbra(hero);
    }} onKeyDown={(event) => {
      const hero = event.currentTarget.closest<HTMLElement>('.professional-services-hero');
      if (event.key === 'Escape' && hero) setPenumbra(hero);
    }}>Revelar el retrato</button>
    <div className="ps-hero-wash" aria-hidden="true" />
  </section>;
};
type ProfessionalBenefit = {
  number: string;
  category: string;
  title: string;
  copy: string;
  visual: 'visibility' | 'value' | 'trust';
};

const useBenefitVisualReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [observerReady, setObserverReady] = useState(false);

  useEffect(() => {
    const visual = ref.current;
    if (!visual) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof window.IntersectionObserver === 'undefined') return;

    setObserverReady(true);
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.18)) {
        setActive(true);
        observer.disconnect();
      }
    }, { threshold: [0, 0.18], rootMargin: '0px 0px -4% 0px' });
    observer.observe(visual);
    return () => observer.disconnect();
  }, []);

  return { ref, active, observerReady };
};

const PROFESSIONAL_BENEFITS: ProfessionalBenefit[] = [
  {
    number: '01',
    category: 'Visibilidad',
    title: 'Aparece donde tus clientes te buscan',
    copy: 'Tu experiencia merece estar presente cuando alguien busca un profesional como tú',
    visual: 'visibility',
  },
  {
    number: '02',
    category: 'Percepción de valor',
    title: 'Haz que tu trabajo valga más',
    copy: 'Una presencia a la altura de tu trayectoria ayuda a sostener el valor de tus servicios',
    visual: 'value',
  },
  {
    number: '03',
    category: 'Confianza',
    title: 'Genera confianza antes del primer contacto',
    copy: 'Que tu experiencia, tus resultados y tu reputación hablen por ti incluso antes del primer mensaje',
    visual: 'trust',
  },
];

const ProfessionalBenefitBand: React.FC<{ benefit: ProfessionalBenefit }> = ({ benefit }) => {
  const { ref, active, observerReady } = useBenefitVisualReveal();
  const motionClass = observerReady ? active ? 'is-visible' : 'is-pending' : '';
  return <li className={`ps-benefit-band ps-benefit-band--${benefit.visual} ${motionClass}`}>
    <p className="ps-benefit-category"><span>{benefit.number}</span>{benefit.category}</p>
    <div className="ps-benefit-copy">
      <h2>{benefit.title}</h2>
      <p>{benefit.copy}</p>
    </div>
    <div ref={ref} className={`ps-benefit-visual ps-benefit-visual--${benefit.visual}`} aria-hidden="true">
      {benefit.visual === 'visibility' ? <><div className="ps-benefit-search-field"><span className="ps-benefit-search-query">Profesional cerca de mí</span><svg className="ps-benefit-search" viewBox="0 0 120 120" focusable="false"><circle cx="50" cy="50" r="29" /><path d="m71 71 26 26" /></svg></div><span className="ps-benefit-search-copy">Te están buscando</span></> : null}
      {benefit.visual === 'value' ? <><span className="ps-benefit-value-caption">PRESENCIA PROPIA</span><span className="ps-benefit-value-type"><span className="ps-benefit-value-clip"><span className="ps-benefit-value-word">Valor</span></span><span className="ps-benefit-value-plus">+</span></span><span className="ps-benefit-value-rule" /></> : null}
      {benefit.visual === 'trust' ? <><span>Trayectoria</span><span>Resultados</span><span>Reputación</span><div className="ps-benefit-stars">{Array.from({ length: 5 }, (_, index) => <span key={index}>★</span>)}</div></> : null}
    </div>
  </li>;
};

const ProfessionalServicesBenefits: React.FC = () => <section className="ps-benefits-section" aria-label="Beneficios de una presencia digital propia">
  <div className="professional-services-container">
    <ol className="ps-benefits-list">
      {PROFESSIONAL_BENEFITS.map((benefit) => <ProfessionalBenefitBand key={benefit.number} benefit={benefit} />)}
    </ol>
  </div>
</section>;

const ProfessionalServicesPresentation: React.FC = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  return <section className="ps-presentation-section" id="professional-services-presentation" aria-label="Tu experiencia merece una marca propia">
    <div className="professional-services-video-frame ps-presentation-video">
      {videoLoaded ? <iframe src="https://www.youtube.com/embed/xRJkmFE9w9w" title="Tu experiencia merece una marca propia — presentación de Jota" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> : <button className="professional-services-video-poster ps-presentation-play" type="button" aria-label="Reproducir Tu experiencia merece una marca propia en YouTube" onClick={() => setVideoLoaded(true)}>
        <img className="ps-presentation-thumbnail" src="https://i.ytimg.com/vi/xRJkmFE9w9w/maxresdefault.jpg" alt="" loading="lazy" decoding="async" />
        <span className="ps-presentation-play-label"><span aria-hidden="true">▶</span> Ver video</span>
      </button>}
    </div>
  </section>;
};

const ProfessionalServicesProcess: React.FC = () => {
  const { ref, visible } = useScrollReveal(0.12);
  return <section ref={ref} className={`professional-services-section professional-services-trust ${visible ? 'is-visible' : 'is-pending'}`} aria-labelledby="video-title">
    <div className="professional-services-container professional-services-trust-grid">
      <div className="ps-process-intro"><p className="professional-services-eyebrow">Diseñar empieza por entender</p><h2 id="video-title">Primero te escuchamos y luego diseñamos</h2><p className="professional-services-lead">Trabajamos directamente contigo. Antes de pensar en pantallas, entendemos tu trayectoria, qué te distingue y qué merece ocupar el centro.</p></div>
      <div className="ps-process-story">
        <ol className="ps-process-steps" aria-label="Cómo empieza el trabajo">
          <li><span className="ps-process-index">01</span><div><h3>Escuchamos</h3><p>¿Qué haces? ¿Qué has construido? ¿Por qué te buscan?</p></div></li>
          <li><span className="ps-process-index">02</span><div><h3>Entendemos</h3><p>¿Qué te diferencia? ¿Qué merece protagonismo? ¿Qué percepción quieres elevar?</p></div></li>
          <li><span className="ps-process-index">03</span><div><h3>Diseñamos</h3><p>Identidad. Jerarquía. Contenido. Experiencia.</p></div></li>
        </ol>
      </div>
    </div>
  </section>;
};

const ProfessionalServicesForm: React.FC = () => {
  const [name, setName] = useState('');
  const [profession, setProfession] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return;
    const cleanProfession = profession.trim();
    const workContext = cleanProfession ? ` Soy ${cleanProfession}.` : '';
    const message = `Hola Jota, soy ${cleanName}.${workContext} Vi tu propuesta sobre presencia digital y quiero conversar sobre cómo darle a mi nombre el reconocimiento que merece.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    setWhatsappUrl(url);
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  const cleanName = name.trim();
  const cleanProfession = profession.trim();
  const firstName = cleanName.split(/\s+/)[0];
  const whatsappCtaLabel = firstName
    ? `${firstName}, hagamos brillar tu presencia`
    : 'Hagamos brillar tu presencia';
  return <form className="professional-services-form ps-personalized-form ps-recognition-form" onSubmit={handleSubmit} aria-describedby="professional-services-form-explanation">
    <div className="ps-recognition-copy">
      <p className="professional-services-eyebrow">Conversar</p>
      <h2 id="form-title">Te imaginas teniendo el reconocimiento que te mereces</h2>
      <p className="professional-services-lead">Tu nombre ya tiene historia</p>
      <div className="ps-recognition-fields">
        <label htmlFor="professional-services-name"><span>Escribe tu nombre aquí</span><input id="professional-services-name" name="name" type="text" required pattern=".*\S.*" maxLength={48} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} /></label>
        <label htmlFor="professional-services-profession"><span>Profesión <em>(opcional)</em></span><input id="professional-services-profession" name="profession" type="text" maxLength={72} autoComplete="organization-title" value={profession} onChange={(event) => setProfession(event.target.value)} /></label>
      </div>
      <p className="professional-services-form-note" id="professional-services-form-explanation">WhatsApp abrirá un borrador editable para que lo revises antes de enviarlo.</p>
    </div>
    <div className="ps-recognition-cover" aria-label="Composición editorial personalizada">
      <img className="ps-recognition-cover-image" src={`${ASSET_BASE_PATH}/recognition-editorial-studio.png`} alt="" aria-hidden="true" />
      <div className="ps-recognition-cover-wash" aria-hidden="true" />
      <div className="ps-recognition-cover-masthead">
        <p className="ps-recognition-cover-brand">BRAND</p>
        <span className="ps-recognition-cover-year">2026</span>
      </div>
      <p className="ps-recognition-cover-teaser"><span>EN ESTA EDICIÓN</span>Top 10 de profesionales en Colombia</p>
      <div className="ps-recognition-cover-content">
        <p className="ps-recognition-cover-name" aria-live="polite">{cleanName ? cleanName.toLocaleUpperCase('es-CO') : 'TU NOMBRE'}</p>
        <p className="ps-recognition-cover-profession" aria-live="polite">
          <span>{cleanProfession || 'Una presencia propia'}</span>
          <strong>N° 1</strong>
        </p>
      </div>
      <p className="ps-recognition-cover-foot">UNA HISTORIA QUE MERECE SER VISTA</p>
      <span className="ps-recognition-cover-barcode" aria-hidden="true" />
    </div>
    <div className="ps-recognition-action">
      <button className="professional-services-button" type="submit">
        <svg className="ps-whatsapp-icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
          <path d="M16 3.5a12.5 12.5 0 0 0-10.7 18.96L3.5 28.5l6.2-1.63A12.5 12.5 0 1 0 16 3.5Z" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" /><path d="M10.1 8.8c-.4 0-.8.2-1.1.5-.4.4-1.5 1.5-1.5 3.6s1.5 4.2 1.7 4.5c.2.3 2.8 4.5 6.9 6.1.8.3 1.5.5 2 .6.8.2 1.6.2 2.2.1.7-.1 2.1-.8 2.4-1.7.3-.8.3-1.5.2-1.7-.1-.2-.4-.3-.8-.5-.4-.2-2.1-1.1-2.5-1.2-.4-.1-.6-.2-.9.3-.3.4-1 1.1-1.2 1.4-.2.2-.4.3-.8.1-.4-.2-1.7-.6-3.1-1.9-1.1-1-1.9-2.3-2.1-2.7-.2-.4 0-.6.2-.8.2-.2.4-.4.6-.7.2-.2.3-.4.4-.7.1-.3.1-.5 0-.7l-.7-1.4c-.2-.5-.4-1.1-.7-1.1h-.6Z" fill="currentColor" />
        </svg>
        <span>{whatsappCtaLabel}</span>
      </button>
      <div className="professional-services-form-result" aria-live="polite">{whatsappUrl ? <p>Si WhatsApp no se abrió, <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">abre aquí tu mensaje para revisarlo y enviarlo</a>.</p> : null}</div>
    </div>
  </form>;
};

export const ProfessionalServicesLanding: React.FC = () => {
  return <div className="professional-services-page">
    <header className="professional-services-header professional-services-container"><a className="professional-services-brand" href={import.meta.env.BASE_URL} aria-label="Jota Growth Partner, inicio"><img src={`${ASSET_BASE_PATH}/jota-growth-partner-logo.png`} alt="Jota Growth Partner" /></a><nav aria-label="Navegación principal"><a href={`#${FORM_ID}`} onClick={goToForm}><svg className="ps-whatsapp-icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path d="M16 3.5a12.5 12.5 0 0 0-10.7 18.96L3.5 28.5l6.2-1.63A12.5 12.5 0 1 0 16 3.5Z" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" /><path d="M10.1 8.8c-.4 0-.8.2-1.1.5-.4.4-1.5 1.5-1.5 3.6s1.5 4.2 1.7 4.5c.2.3 2.8 4.5 6.9 6.1.8.3 1.5.5 2 .6.8.2 1.6.2 2.2.1.7-.1 2.1-.8 2.4-1.7.3-.8.3-1.5.2-1.7-.1-.2-.4-.3-.8-.5-.4-.2-2.1-1.1-2.5-1.2-.4-.1-.6-.2-.9.3-.3.4-1 1.1-1.2 1.4-.2.2-.4.3-.8.1-.4-.2-1.7-.6-3.1-1.9-1.1-1-1.9-2.3-2.1-2.7-.2-.4 0-.6.2-.8.2-.2.4-.4.6-.7.2-.3.3-.4.4-.7.1-.3.1-.5 0-.7l-.7-1.4c-.2-.5-.4-1.1-.7-1.1h-.6Z" fill="currentColor" /></svg><span>Hablemos</span></a></nav></header>
    <main>
      <ProfessionalSpecimen />
      <section className="professional-services-convergence" id="professional-services-convergence" aria-labelledby="professional-services-convergence-title"><div className="professional-services-container"><h2 id="professional-services-convergence-title" className="ps-visually-hidden">Todo lo que ya construiste, conectado en un solo lugar</h2><p className="ps-visually-hidden">Tus canales siguen siendo tuyos. Tu web les da un centro propio.</p><p className="ps-visually-hidden">Google, Instagram, WhatsApp, Agenda, Calendly y Facebook convergen en tu nombre, tu dominio y tu web.</p><ProfessionalServicesMotion /></div></section>
      <ProfessionalServicesPresentation />
      <ProfessionalServicesBenefits />
      <ProfessionalServicesProcess />
      <section className="professional-services-final-section" id={FORM_ID} tabIndex={-1} aria-labelledby="form-title"><div className="professional-services-container"><ProfessionalServicesForm /></div></section>
    </main><footer className="professional-services-footer"><div className="professional-services-container"><span>Jota Ochoa · Diseño con nombre propio.</span><a href="https://www.agentejota.com/politica-de-privacidad">Política de privacidad</a><a href="mailto:jotaochoa@gmail.com">jotaochoa@gmail.com ↗</a></div></footer>
  </div>;
};
