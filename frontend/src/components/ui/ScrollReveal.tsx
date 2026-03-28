'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    duration?: number;
    once?: boolean;
}

export default function ScrollReveal({
    children,
    className = '',
    delay = 0,
    direction = 'up',
    duration = 700,
    once = true,
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Set initial styles
        el.style.opacity = '0';
        el.style.transition = `opacity ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}ms`;

        const translateMap = {
            up: 'translateY(30px)',
            down: 'translateY(-30px)',
            left: 'translateX(30px)',
            right: 'translateX(-30px)',
            none: 'none',
        };
        el.style.transform = translateMap[direction];

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        el.style.opacity = '1';
                        el.style.transform = 'translate(0, 0)';
                        if (once) observer.unobserve(el);
                    } else if (!once) {
                        el.style.opacity = '0';
                        el.style.transform = translateMap[direction];
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [delay, direction, duration, once]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}
