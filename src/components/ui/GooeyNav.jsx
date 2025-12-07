import { useRef, useEffect, useState } from 'react';

const GooeyNav = ({
  items,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = ['#fff', '#60a5fa', '#a78bfa', '#34d399'],
  initialActiveIndex = 0,
  onItemClick
}) => {
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const filterRef = useRef(null);
  const textRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (distance, pointIndex, totalPoints) => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (i, t, d, r) => {
    let rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
    };
  };

  const makeParticles = element => {
    const d = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty('--time', `${bubbleTime}ms`);

    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove('active');

      setTimeout(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');
        
        particle.style.cssText = `
          position: absolute;
          left: 50%;
          top: 50%;
          pointer-events: none;
          animation: particle-move ${p.time}ms ease-out forwards;
          --start-x: ${p.start[0]}px;
          --start-y: ${p.start[1]}px;
          --end-x: ${p.end[0]}px;
          --end-y: ${p.end[1]}px;
        `;
        
        point.style.cssText = `
          display: block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${p.color};
          transform: scale(${p.scale}) rotate(${p.rotate}deg);
          filter: blur(1px);
        `;
        
        particle.appendChild(point);
        element.appendChild(particle);
        
        requestAnimationFrame(() => {
          element.classList.add('active');
        });
        
        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch {
            // Do nothing
          }
        }, t);
      }, 30);
    }
  };

  const updateEffectPosition = element => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();

    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.innerText;
  };

  const handleClick = (e, index, item) => {
    e.preventDefault();
    const liEl = e.currentTarget;
    if (activeIndex === index) return;

    setActiveIndex(index);
    updateEffectPosition(liEl);

    if (filterRef.current) {
      const particles = filterRef.current.querySelectorAll('span');
      particles.forEach(p => {
        try { filterRef.current.removeChild(p); } catch {}
      });
    }

    if (textRef.current) {
      textRef.current.classList.remove('active');
      void textRef.current.offsetWidth;
      textRef.current.classList.add('active');
    }

    if (filterRef.current) {
      makeParticles(filterRef.current);
    }

    if (onItemClick) {
      onItemClick(item, index);
    }
  };

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    const activeLi = navRef.current.querySelectorAll('li')[activeIndex];
    if (activeLi) {
      updateEffectPosition(activeLi);
      textRef.current?.classList.add('active');
    }

    const resizeObserver = new ResizeObserver(() => {
      const currentActiveLi = navRef.current?.querySelectorAll('li')[activeIndex];
      if (currentActiveLi) {
        updateEffectPosition(currentActiveLi);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeIndex]);

  return (
    <>
      <style>{`
        @keyframes particle-move {
          0% {
            transform: translate(var(--start-x), var(--start-y));
            opacity: 1;
          }
          100% {
            transform: translate(var(--end-x), var(--end-y));
            opacity: 0;
          }
        }
        .gooey-effect {
          position: absolute;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          transition: all 0.3s ease;
        }
        .gooey-effect.filter {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(4px);
        }
        .gooey-effect.text {
          color: white;
          font-weight: 500;
          font-size: 0.875rem;
          opacity: 0;
        }
        .gooey-effect.text.active {
          opacity: 1;
        }
      `}</style>
      <div className="relative" ref={containerRef}>
        <nav>
          <ul ref={navRef} className="flex items-center gap-1 p-1 bg-gray-900/50 backdrop-blur-sm rounded-full border border-gray-800">
            {items.map((item, index) => (
              <li 
                key={index} 
                className={`relative cursor-pointer transition-colors duration-200 ${activeIndex === index ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
                onClick={(e) => handleClick(e, index, item)}
              >
                <span className="block px-4 py-2 text-sm font-medium">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </nav>
        <span className="gooey-effect filter" ref={filterRef} />
        <span className="gooey-effect text" ref={textRef} />
      </div>
    </>
  );
};

export default GooeyNav;