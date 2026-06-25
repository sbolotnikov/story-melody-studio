'use client';
import React, { useState } from 'react';

export type ButtonEffect = 'glitch' | 'ripple' | 'soundwave' | 'tilt' | 'firework' | 'glass';
export type ButtonStyle = 'solid' | 'gradient' | 'neon';
export type IconAnimation = 'none' | 'spin' | 'pulse' | 'bounce' | 'ping' | 'wiggle' | 'shake';

interface CustomButtonProps {
  text?: string;
  icon?: React.ElementType;
  iconAnimation?: IconAnimation;
  baseStyle?: ButtonStyle;
  hoverEffects?: ButtonEffect[];
  clickEffects?: ButtonEffect[];
  bgColor?: string;
  textColor?: string;
  className?: string;
  borderRadius?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function CustomButton({ 
  text = "Custom Button", 
  icon: Icon,
  iconAnimation = 'none',
  baseStyle = 'solid',
  hoverEffects = [], 
  clickEffects = [],
  bgColor, 
  textColor, 
  className = '',
  borderRadius,
  onClick 
}: CustomButtonProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [charScales, setCharScales] = useState<number[]>([]);
  const [ripples, setRipples] = useState<{x: number, y: number, id: number}[]>([]);
  const [particles, setParticles] = useState<{id: number, x: number, y: number, tx: string, ty: string, color: string, size: number}[]>([]);
  
  const [clickActive, setClickActive] = useState(false);

  const hasHover = (ef: ButtonEffect) => hoverEffects.includes(ef);
  const hasClick = (ef: ButtonEffect) => clickEffects.includes(ef);
  const isEffectActive = (ef: ButtonEffect) => {
    return (hasHover(ef) && isHovering) || (hasClick(ef) && clickActive);
  };
  const hasEffect = (ef: ButtonEffect) => hasHover(ef) || hasClick(ef);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (hasEffect('ripple')) {
      const characters = e.currentTarget.querySelectorAll<HTMLSpanElement>('[data-ripple-character]');
      setCharScales(
        Array.from(characters, (node) => {
          const charX = node.offsetLeft + node.offsetWidth / 2;
          const charY = node.offsetTop + node.offsetHeight / 2;
          const distance = Math.hypot(x - charX, y - charY);
          return distance < 50
            ? 1 + Math.pow((50 - distance) / 50, 1.5) * 0.8
            : 1;
        }),
      );
    }
    if (hasEffect('tilt')) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      setRotate({
        x: -((y - centerY) / centerY) * 15,
        y: ((x - centerX) / centerX) * 15
      });
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setClickActive(true);
    setTimeout(() => setClickActive(false), 800);

    if (onClick) onClick(e);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (hasClick('ripple') || hasHover('ripple')) {
      const newRipple = { x, y, id: Date.now() };
      setRipples(prev => [...prev, newRipple]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 1000);
    }
    
    if (hasClick('firework') || hasHover('firework')) {
      const newParticles = Array.from({ length: 24 }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / 24;
        const distance = 60 + Math.random() * 80;
        const tx = `${Math.cos(angle) * distance}px`;
        const ty = `${Math.sin(angle) * distance}px`;
        const colors = ['#fcd34d', '#f472b6', '#38bdf8', '#fb7185', '#4ade80', '#e879f9'];
        return {
          id: Date.now() + i,
          x, y, tx, ty,
          size: 4 + Math.random() * 4,
          color: colors[Math.floor(Math.random() * colors.length)]
        };
      });

      setParticles(prev => [...prev, ...newParticles]);
      setTimeout(() => {
        setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
      }, 800);
    }
  };

  let classes = `relative px-6 py-3 rounded-lg font-semibold transition-all duration-300 ease-out active:scale-95 group ${className} `;
  
  if (hasEffect('soundwave') || hasEffect('firework')) {
    classes += "overflow-visible ";
  } else {
    classes += "overflow-hidden ";
  }

  const style: React.CSSProperties = {};
  if (bgColor) style.backgroundColor = bgColor;
  if (textColor) style.color = textColor;
  if (borderRadius) style.borderRadius = borderRadius;

  if (baseStyle === 'gradient') {
    classes += "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-[length:200%_auto] hover:bg-right shadow-lg hover:shadow-pink-500/50 ";
    if (!textColor) classes += "text-white ";
  } else if (baseStyle === 'neon') {
    classes += "bg-transparent border-2 border-purple-500 hover:bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] ";
    if (!textColor) classes += "text-purple-400 hover:text-white ";
  } else {
    if (!bgColor) classes += "bg-slate-700 ";
    if (!textColor) classes += "text-white ";
    classes += "shadow-lg ";
  }

  if (isEffectActive('tilt')) {
    style.transform = `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.05, 1.05, 1.05)`;
    style.transformStyle = 'preserve-3d';
  }

  return (
    <button
      className={classes}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setRotate({ x: 0, y: 0 });
        setCharScales([]);
      }}
      onClick={handleClick}
    >
      <span 
        className="relative z-10 pointer-events-none flex justify-center items-center gap-2"
        style={isEffectActive('tilt') ? { transform: 'translateZ(15px)' } : {}}
      >
        {Icon && (
          <div className={`${
            (isHovering || clickActive) ? (
              iconAnimation === 'spin' ? 'animate-spin' :
              iconAnimation === 'pulse' ? 'animate-pulse' :
              iconAnimation === 'bounce' ? 'animate-bounce' :
              iconAnimation === 'ping' ? 'animate-ping' :
              iconAnimation === 'wiggle' ? 'animate-wiggle' :
              iconAnimation === 'shake' ? 'animate-shake' : ''
            ) : ''
          }`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        {hasEffect('ripple') ? (
          text.split('').map((char, i) => {
            const scale = isEffectActive('ripple') ? (charScales[i] ?? 1) : 1;
            return (
              <span
                key={i}
                data-ripple-character
                className="inline-block transition-transform duration-75 ease-out"
                style={{ 
                  transform: `scale(${scale})`,
                  transformOrigin: 'center',
                  marginInlineEnd: char === ' ' ? 0 : '-0.055em',
                  whiteSpace: char === ' ' ? 'pre' : 'normal'
                }}
              >
                {char}
              </span>
            );
          })
        ) : <span>{text}</span>}
      </span>

      {hasEffect('glitch') && (
        <>
          <span className={`absolute inset-0 z-10 flex items-center justify-center gap-2 transition-opacity duration-200 text-pink-500 pointer-events-none ${isEffectActive('glitch') ? 'opacity-100 animate-glitch-1' : 'opacity-0'}`} aria-hidden="true" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)', transform: 'translate(-2px, 2px)' }}>
            {Icon && <Icon className="w-5 h-5" />}
            {text}
          </span>
          <span className={`absolute inset-0 z-10 flex items-center justify-center gap-2 transition-opacity duration-200 text-cyan-500 pointer-events-none ${isEffectActive('glitch') ? 'opacity-100 animate-glitch-2' : 'opacity-0'}`} aria-hidden="true" style={{ clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)', transform: 'translate(2px, -2px)' }}>
            {Icon && <Icon className="w-5 h-5" />}
            {text}
          </span>
        </>
      )}

      {hasEffect('ripple') && (
        <>
          {ripples.map(r => (
            <span
              key={r.id}
              className="absolute bg-white/30 pointer-events-none origin-center animate-liquid-ripple z-0"
              style={{ left: r.x, top: r.y, width: '40px', height: '40px' }}
            />
          ))}
        </>
      )}

      {hasEffect('soundwave') && (
        <div className="absolute inset-0 pointer-events-none rounded-[inherit]">
          <span className={`absolute inset-0 rounded-[inherit] border-2 border-indigo-400 opacity-0 ${isEffectActive('soundwave') ? 'animate-sound-wave-outward-glitch' : ''}`} style={{ animationDelay: '0s' }} />
          <span className={`absolute inset-0 rounded-[inherit] border-2 border-fuchsia-400 opacity-0 ${isEffectActive('soundwave') ? 'animate-sound-wave-outward-glitch' : ''}`} style={{ animationDelay: '0.4s' }} />
          <span className={`absolute inset-0 rounded-[inherit] border-2 border-cyan-400 opacity-0 ${isEffectActive('soundwave') ? 'animate-sound-wave-outward-glitch' : ''}`} style={{ animationDelay: '0.8s' }} />
        </div>
      )}

      {hasEffect('tilt') && (
        <div 
          className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${50 + rotate.y * 3}% ${50 - rotate.x * 3}%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 60%)`,
            opacity: isEffectActive('tilt') ? 1 : 0,
            transform: 'translateZ(1px)'
          }}
        />
      )}

      {hasEffect('firework') && particles.map(p => (
        <span
          key={p.id}
          className="absolute rounded-full pointer-events-none animate-firework-particle z-0"
          style={{
            left: p.x,
            top: p.y,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            '--tx': p.tx,
            '--ty': p.ty
          } as React.CSSProperties}
        />
      ))}

      {hasEffect('glass') && (
        <div className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden">
          <div className={`absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-linear-to-r from-transparent via-white to-transparent opacity-30 ${isEffectActive('glass') ? 'animate-shine' : ''}`} />
        </div>
      )}
    </button>
  );
}
