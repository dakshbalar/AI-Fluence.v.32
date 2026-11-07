import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { ArrowLeft, ExternalLink, ArrowUpRight } from 'lucide-react';

interface JackCreatorPageProps {
  onBackToHome?: () => void;
}

/* ==========================================================================
   REUSABLE COMPONENTS
   ========================================================================== */

/**
 * ContactButton: Rounded-full pill button with multi-stop vibrant gradient & inner shadow
 */
export const ContactButton: React.FC<{ onClick?: () => void; className?: string }> = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
        outline: '2px solid white',
        outlineOffset: '-3px',
      }}
      className={`rounded-full text-white font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200 shadow-2xl select-none ${className}`}
    >
      Contact Me
    </button>
  );
};

/**
 * LiveProjectButton: Ghost outline pill button with border-2 #D7E2EA
 */
export const LiveProjectButton: React.FC<{ href?: string; className?: string }> = ({ href = '#', className = '' }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-6 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-sm hover:bg-[#D7E2EA]/10 transition-colors duration-200 cursor-pointer select-none ${className}`}
    >
      <span>Live Project</span>
      <ArrowUpRight className="w-4 h-4" />
    </a>
  );
};

/**
 * FadeIn: Framer Motion wrapper for scroll-triggered entry
 */
export const FadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
}> = ({ children, delay = 0, duration = 0.7, x = 0, y = 30, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Magnet: Mouse-following magnetic hover effect
 */
export const Magnet: React.FC<{
  children: React.ReactNode;
  padding?: number;
  strength?: number;
  className?: string;
}> = ({ children, padding = 150, strength = 3, className = '' }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState('translate3d(0px, 0px, 0px)');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distToLeft = rect.left - e.clientX;
      const distToRight = e.clientX - rect.right;
      const distToTop = rect.top - e.clientY;
      const distToBottom = e.clientY - rect.bottom;

      const isWithinBounds =
        distToLeft < padding &&
        distToRight < padding &&
        distToTop < padding &&
        distToBottom < padding;

      if (isWithinBounds) {
        setIsActive(true);
        const offsetX = (e.clientX - centerX) / strength;
        const offsetY = (e.clientY - centerY) / strength;
        setTransform(`translate3d(${offsetX}px, ${offsetY}px, 0px)`);
      } else if (isActive) {
        setIsActive(false);
        setTransform('translate3d(0px, 0px, 0px)');
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [padding, strength, isActive]);

  return (
    <div
      ref={ref}
      style={{
        transform,
        transition: isActive ? 'transform 0.3s ease-out' : 'transform 0.6s ease-in-out',
        willChange: 'transform',
      }}
      className={className}
    >
      {children}
    </div>
  );
};

/**
 * CharacterSpan: Single character animated by scroll progress
 */
const CharacterSpan: React.FC<{
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}> = ({ char, progress, range }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);

  return (
    <span className="relative inline-block">
      <span className="opacity-0">{char}</span>
      <motion.span style={{ opacity }} className="absolute left-0 top-0">
        {char}
      </motion.span>
    </span>
  );
};

/**
 * AnimatedText: Character-by-character scroll-reveal animation
 */
export const AnimatedText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const containerRef = useRef<HTMLParagraphElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const characters = text.split('');
  const total = characters.length;

  return (
    <p ref={containerRef} className={className}>
      {characters.map((char, index) => {
        const start = index / total;
        const end = Math.min(1, start + 0.1);
        return (
          <CharacterSpan
            key={index}
            char={char === ' ' ? '\u00A0' : char}
            progress={scrollYProgress}
            range={[start, end]}
          />
        );
      })}
    </p>
  );
};

/* ==========================================================================
   MARQUEE ASSETS (21 URLs from motionsites.ai)
   ========================================================================== */
const MARQUEE_IMAGES = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif',
];

const ROW_1_IMAGES = [...MARQUEE_IMAGES.slice(0, 11), ...MARQUEE_IMAGES.slice(0, 11), ...MARQUEE_IMAGES.slice(0, 11)];
const ROW_2_IMAGES = [...MARQUEE_IMAGES.slice(11), ...MARQUEE_IMAGES.slice(11), ...MARQUEE_IMAGES.slice(11)];

/* ==========================================================================
   SERVICES DATA
   ========================================================================== */
const SERVICES = [
  {
    num: '01',
    name: '3D Modeling',
    desc: 'Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.',
  },
  {
    num: '02',
    name: 'Rendering',
    desc: 'High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.',
  },
  {
    num: '03',
    name: 'Motion Design',
    desc: 'Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.',
  },
  {
    num: '04',
    name: 'Branding',
    desc: 'Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence.',
  },
  {
    num: '05',
    name: 'Web Design',
    desc: 'Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.',
  },
];

/* ==========================================================================
   PROJECTS DATA
   ========================================================================== */
const PROJECTS = [
  {
    num: '01',
    title: 'Nextlevel Studio',
    category: 'Client',
    col1Top: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
    col1Bottom: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
    col2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
  },
  {
    num: '02',
    title: 'Aura Brand Identity',
    category: 'Personal',
    col1Top: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
    col1Bottom: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
    col2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
  },
  {
    num: '03',
    title: 'Solaris Digital',
    category: 'Client',
    col1Top: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
    col1Bottom: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
    col2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
  },
];

/* ==========================================================================
   STICKY CARD COMPONENT (ProjectsSection)
   ========================================================================== */
interface ProjectCardProps {
  project: typeof PROJECTS[0];
  index: number;
  totalCards: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, totalCards }) => {
  const cardContainerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: cardContainerRef,
    offset: ['start end', 'start start'],
  });

  // Calculate targetScale: targetScale = 1 - (totalCards - 1 - index) * 0.03
  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div
      ref={cardContainerRef}
      className="sticky h-[85vh] flex items-start justify-center"
      style={{
        top: `calc(6rem + ${index * 28}px)`,
      }}
    >
      <motion.div
        style={{ scale }}
        className="w-full max-w-6xl rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden"
      >
        {/* Top row: Number, category label, project name, Live Project button */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#D7E2EA]/15">
          <div className="flex items-baseline gap-4 sm:gap-6">
            <span className="font-black text-4xl sm:text-6xl md:text-7xl text-[#D7E2EA] tracking-tighter">
              {project.num}
            </span>
            <div>
              <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#D7E2EA]/60 font-medium block">
                {project.category}
              </span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase text-[#D7E2EA] tracking-tight">
                {project.title}
              </h3>
            </div>
          </div>
          <LiveProjectButton />
        </div>

        {/* Bottom row: Two-column image grid (Left 40% with 2 stacked images, Right 60% with 1 tall image) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 pt-6 flex-1 min-h-0">
          {/* Left Column (40% / 5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-4 sm:gap-6 justify-between">
            <div className="w-full h-[140px] sm:h-[180px] md:h-[clamp(130px,16vw,230px)] rounded-[30px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden border border-[#D7E2EA]/20 bg-neutral-900">
              <img
                src={project.col1Top}
                alt={`${project.title} Render 1`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full h-[180px] sm:h-[240px] md:h-[clamp(160px,22vw,340px)] rounded-[30px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden border border-[#D7E2EA]/20 bg-neutral-900">
              <img
                src={project.col1Bottom}
                alt={`${project.title} Render 2`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column (60% / 7 cols) */}
          <div className="md:col-span-7 h-[330px] sm:h-[440px] md:h-full min-h-[280px] rounded-[30px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden border border-[#D7E2EA]/20 bg-neutral-900">
            <img
              src={project.col2}
              alt={`${project.title} Showcase`}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* ==========================================================================
   MAIN JACK CREATOR PAGE
   ========================================================================== */
export const JackCreatorPage: React.FC<JackCreatorPageProps> = ({ onBackToHome }) => {
  const marqueeSectionRef = useRef<HTMLDivElement | null>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  // Set document title to "Jack -- 3D Creator"
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Jack -- 3D Creator';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  // Marquee scroll listener calculation: (window.scrollY - sectionTop + window.innerHeight) * 0.3
  useEffect(() => {
    const handleScroll = () => {
      if (!marqueeSectionRef.current) return;
      const rect = marqueeSectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setScrollOffset(offset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleReturn = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      window.history.pushState({}, '', '/');
      window.location.reload();
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#0C0C0C',
        fontFamily: "'Kanit', sans-serif",
        overflowX: 'clip',
      }}
      className="min-h-screen text-[#D7E2EA] selection:bg-purple-600 selection:text-white"
    >
      {/* Inject .hero-heading gradient rule and smooth scrolling */}
      <style>{`
        .hero-heading {
          background: linear-gradient(180deg, #646973 0%, #BBCCD7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* Floating Return Pill to AI Fluence */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={handleReturn}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#141414]/90 border border-[#D7E2EA]/20 text-[#D7E2EA] hover:text-white hover:border-[#D7E2EA]/60 text-xs font-medium backdrop-blur-xl shadow-2xl transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>AI Fluence</span>
        </button>
      </div>

      {/* ====================================================================
          1. HERO SECTION
          Full viewport height (h-screen), flex column layout with overflowX: clip
          ==================================================================== */}
      <section
        id="hero"
        style={{ overflowX: 'clip' }}
        className="relative h-screen w-full flex flex-col justify-between overflow-hidden bg-[#0C0C0C] select-none"
      >
        {/* Navbar: 4 links evenly spaced with justify-between */}
        <FadeIn delay={0} y={-20}>
          <nav className="w-full max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8">
            <a
              href="#about"
              className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200"
            >
              About
            </a>
            <a
              href="#services"
              className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200"
            >
              Price
            </a>
            <a
              href="#projects"
              className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200"
            >
              Projects
            </a>
            <a
              href="#contact"
              className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200"
            >
              Contact
            </a>
          </nav>
        </FadeIn>

        {/* Hero Heading: Massive h1 "Hi, i'm jack" */}
        <div className="w-full overflow-hidden text-center z-0 mt-6 sm:mt-4 md:-mt-5">
          <FadeIn delay={0.15} y={40}>
            <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]">
              Hi, i&apos;m jack
            </h1>
          </FadeIn>
        </div>

        {/* Hero Portrait: Centered absolutely with Magnet */}
        <div className="absolute left-1/2 -translate-x-1/2 z-10 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px] top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0 pointer-events-auto">
          <FadeIn delay={0.6} y={30}>
            <Magnet padding={150} strength={3}>
              <img
                src="https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png"
                alt="Jack 3D Creator Portrait"
                className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              />
            </Magnet>
          </FadeIn>
        </div>

        {/* Bottom bar: Flexbox justify-between items-end with pb-7 sm:pb-8 md:pb-10 */}
        <div className="w-full max-w-7xl mx-auto px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 flex items-end justify-between z-20">
          {/* Left Text */}
          <FadeIn delay={0.35} y={20}>
            <p
              style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
              className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
            >
              a 3d creator driven by crafting striking and unforgettable projects
            </p>
          </FadeIn>

          {/* Right Contact Button */}
          <FadeIn delay={0.5} y={20}>
            <ContactButton
              onClick={() => {
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </FadeIn>
        </div>
      </section>

      {/* ====================================================================
          2. MARQUEE SECTION
          Two rows of images that scroll horizontally based on page scroll position.
          ==================================================================== */}
      <section
        ref={marqueeSectionRef}
        id="marquee"
        className="w-full bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden"
      >
        <div className="flex flex-col gap-3">
          {/* Row 1: first 11 images, tripled. Moves RIGHT on scroll: translateX(offset - 200) */}
          <div
            style={{
              transform: `translateX(${scrollOffset - 200}px)`,
              willChange: 'transform',
            }}
            className="flex gap-3"
          >
            {ROW_1_IMAGES.map((src, i) => (
              <div
                key={`row1-${i}`}
                className="w-[420px] h-[270px] shrink-0 rounded-2xl overflow-hidden bg-neutral-900 border border-white/5"
              >
                <img
                  src={src}
                  alt={`Showcase Animation ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            ))}
          </div>

          {/* Row 2: remaining 10 images, tripled. Moves LEFT on scroll: translateX(-(offset - 200)) */}
          <div
            style={{
              transform: `translateX(-${scrollOffset - 200}px)`,
              willChange: 'transform',
            }}
            className="flex gap-3"
          >
            {ROW_2_IMAGES.map((src, i) => (
              <div
                key={`row2-${i}`}
                className="w-[420px] h-[270px] shrink-0 rounded-2xl overflow-hidden bg-neutral-900 border border-white/5"
              >
                <img
                  src={src}
                  alt={`Showcase Animation ${i + 12}`}
                  loading="lazy"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. ABOUT SECTION
          Full-height centered section with min-h-screen, padding px-5 sm:px-8 md:px-10 py-20
          ==================================================================== */}
      <section
        id="about"
        className="relative min-h-screen w-full flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 bg-[#0C0C0C] overflow-hidden"
      >
        {/* Four Decorative 3D Images Positioned Absolutely */}
        {/* Top-Left: Moon icon */}
        <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] pointer-events-none z-0">
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
            alt="Moon 3D icon"
            className="w-[120px] sm:w-[160px] md:w-[210px] h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          />
        </FadeIn>

        {/* Bottom-Left: 3D object */}
        <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] pointer-events-none z-0">
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
            alt="3D Abstract Object"
            className="w-[100px] sm:w-[140px] md:w-[180px] h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          />
        </FadeIn>

        {/* Top-Right: Lego icon */}
        <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] pointer-events-none z-0">
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
            alt="Lego 3D icon"
            className="w-[120px] sm:w-[160px] md:w-[210px] h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          />
        </FadeIn>

        {/* Bottom-Right: 3D group */}
        <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] pointer-events-none z-0">
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
            alt="3D Group Object"
            className="w-[130px] sm:w-[170px] md:w-[220px] h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          />
        </FadeIn>

        {/* About Center Content */}
        <div className="relative z-10 flex flex-col items-center text-center gap-10 sm:gap-14 md:gap-16 max-w-4xl">
          {/* Heading: "About me" */}
          <FadeIn delay={0} y={40}>
            <h2
              style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
              className="hero-heading font-black uppercase leading-none tracking-tight text-center"
            >
              About me
            </h2>
          </FadeIn>

          {/* Animated paragraph: character scroll-driven opacity */}
          <AnimatedText
            text="With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!"
            className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[560px] px-4"
          />

          {/* Contact Button */}
          <div className="pt-6 sm:pt-10">
            <FadeIn delay={0.3} y={20}>
              <ContactButton />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. SERVICES SECTION
          White background (#FFFFFF), rounded top corners, vertical service list
          ==================================================================== */}
      <section
        id="services"
        className="relative w-full bg-[#FFFFFF] text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 z-0"
      >
        <div className="max-w-5xl mx-auto">
          {/* Heading: "Services" */}
          <FadeIn delay={0} y={30}>
            <h2
              style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
              className="font-black uppercase text-center text-[#0C0C0C] leading-none mb-16 sm:mb-20 md:mb-28 tracking-tight"
            >
              Services
            </h2>
          </FadeIn>

          {/* 5 Service Items with Staggered FadeIn */}
          <div className="divide-y divide-[#0C0C0C]/15 border-t border-b border-[#0C0C0C]/15">
            {SERVICES.map((service, i) => (
              <FadeIn key={service.num} delay={i * 0.1} y={25}>
                <div className="py-8 sm:py-10 md:py-12 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-12 group hover:pl-2 transition-all duration-300">
                  {/* Left: Number */}
                  <div
                    style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
                    className="font-black text-[#0C0C0C] leading-none tracking-tighter shrink-0 select-none"
                  >
                    {service.num}
                  </div>

                  {/* Right: Name + Description */}
                  <div className="flex-1 flex flex-col gap-2">
                    <h3
                      style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
                      className="font-medium uppercase text-[#0C0C0C] tracking-wide"
                    >
                      {service.name}
                    </h3>
                    <p
                      style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}
                      className="font-light leading-relaxed max-w-2xl text-[#0C0C0C] opacity-60"
                    >
                      {service.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. PROJECTS SECTION
          Dark background (#0C0C0C), rounded-t, pulled up with -mt-10 sm:-mt-12 md:-mt-14, z-10
          ==================================================================== */}
      <section
        id="projects"
        className="relative w-full bg-[#0C0C0C] text-[#D7E2EA] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 pt-20 sm:pt-24 md:pt-28 pb-32 z-10 px-4 sm:px-6 md:px-10"
      >
        <div className="max-w-6xl mx-auto">
          {/* Heading: "Project" */}
          <FadeIn delay={0} y={30}>
            <div className="text-center mb-16 sm:mb-20 md:mb-24">
              <h2
                style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
                className="hero-heading font-black uppercase leading-none tracking-tight"
              >
                Project
              </h2>
            </div>
          </FadeIn>

          {/* Sticky Stacking Project Cards */}
          <div className="relative flex flex-col gap-12 sm:gap-16 pb-12">
            {PROJECTS.map((project, index) => (
              <ProjectCard
                key={project.num}
                project={project}
                index={index}
                totalCards={PROJECTS.length}
              />
            ))}
          </div>
        </div>

        {/* Footer info & CTA */}
        <div className="mt-24 text-center max-w-xl mx-auto space-y-6">
          <p className="text-xs uppercase tracking-widest text-[#D7E2EA]/50">
            Ready to initiate a custom 3D collaboration?
          </p>
          <ContactButton />
          <div className="pt-12 text-[11px] text-[#D7E2EA]/30 uppercase tracking-widest">
            Jack — 3D Creator Portfolio • Built with React, TypeScript & Framer Motion
          </div>
        </div>
      </section>
    </div>
  );
};
