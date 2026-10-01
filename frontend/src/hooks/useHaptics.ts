/**
 * useHaptics - Custom hook for haptic feedback on supported devices
 * Uses navigator.vibrate API with graceful fallback for unsupported devices
 */
export function useHaptics() {
    const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

    const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning') => {
        if (!isSupported) return;

        const patterns: Record<string, number | number[]> = {
            light: 10,
            medium: 25,
            heavy: 50,
            success: [10, 50, 10],
            error: [50, 50, 50],
            warning: [30, 30],
        };

        try {
            navigator.vibrate(patterns[type] || 10);
        } catch (e) {
            // Silently fail if vibration not available
        }
    };

    return { triggerHaptic, isSupported };
}

/**
 * Trigger haptic feedback imperatively (for use outside of components)
 */
export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning') {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        const patterns: Record<string, number | number[]> = {
            light: 10,
            medium: 25,
            heavy: 50,
            success: [10, 50, 10],
            error: [50, 50, 50],
            warning: [30, 30],
        };

        try {
            navigator.vibrate(patterns[type] || 10);
        } catch (e) {
            // Silently fail
        }
    }
}

export default useHaptics;
