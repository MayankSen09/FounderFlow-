import { useState, useEffect } from 'react';

/**
 * Hook to execute responsive logic based on CSS media queries
 * @param query (e.g. "(max-width: 768px)")
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia(query).matches;
        }
        return false;
    });

    useEffect(() => {
        const matchMedia = window.matchMedia(query);
        const handleChange = () => setMatches(matchMedia.matches);

        // Listen for changes
        matchMedia.addEventListener('change', handleChange);
        return () => matchMedia.removeEventListener('change', handleChange);
    }, [query]);

    return matches;
}
