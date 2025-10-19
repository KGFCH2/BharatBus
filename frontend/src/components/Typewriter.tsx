import { useEffect, useState } from 'react';

interface TypewriterProps {
    phrases: string[];
    typingSpeed?: number; // ms per char
    deletingSpeed?: number; // ms per char
    pause?: number; // ms pause after typing
}

export default function Typewriter({ phrases, typingSpeed = 80, deletingSpeed = 40, pause = 1500 }: TypewriterProps) {
    const [index, setIndex] = useState(0);
    const [display, setDisplay] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timeout: number;
        const current = phrases[index];

        if (!isDeleting) {
            // typing
            if (display.length < current.length) {
                timeout = window.setTimeout(() => {
                    setDisplay(current.slice(0, display.length + 1));
                }, typingSpeed);
            } else {
                // pause then start deleting
                timeout = window.setTimeout(() => setIsDeleting(true), pause);
            }
        } else {
            // deleting
            if (display.length > 0) {
                timeout = window.setTimeout(() => {
                    setDisplay(current.slice(0, display.length - 1));
                }, deletingSpeed);
            } else {
                // move to next phrase
                setIsDeleting(false);
                setIndex((i) => (i + 1) % phrases.length);
            }
        }

        return () => window.clearTimeout(timeout);
    }, [display, isDeleting, index, phrases, typingSpeed, deletingSpeed, pause]);

    return (
        <span aria-live="polite" className="inline-block">
            <span className="brand-gradient font-semibold">{display}</span>
            <span className="inline-block ml-2 animate-blink typewriter-cursor" aria-hidden="true"></span>
        </span>
    );
}
