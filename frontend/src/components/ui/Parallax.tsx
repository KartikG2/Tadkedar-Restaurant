'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface ParallaxProps {
    children: ReactNode;
    className?: string;
    speed?: number; // 0.1 = slow, 0.5 = medium
}

export default function Parallax({
    children,
    className = '',
    speed = 0.3,
}: ParallaxProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const elementCenter = rect.top + rect.height / 2;
            const distFromCenter = elementCenter - windowHeight / 2;
            setOffset(distFromCenter * speed * -1);
        };

        // Use passive listener for performance
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [speed]);

    return (
        <div ref={ref} className={`overflow-hidden ${className}`}>
            <div
                style={{
                    transform: `translateY(${offset}px)`,
                    willChange: 'transform',
                }}
            >
                {children}
            </div>
        </div>
    );
}
