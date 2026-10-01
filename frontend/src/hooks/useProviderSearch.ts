import { useState, useMemo, useCallback } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ProviderLocation {
    county: string;
    lat: number;
    lng: number;
}

export interface ProviderGroup {
    id: string;
    name: string;
    displayName: string;
    phone: string;
    email: string;
    providerId: string;
    locations: ProviderLocation[];
    counties: string[];
    // Advanced filter fields (optional, for future enhancement)
    specialties?: string[];
    languages?: string[];
    acceptingClients?: boolean;
    website?: string;
}

export interface UserLocation {
    lat: number;
    lng: number;
    accuracy?: number;
    timestamp?: number;
    isManual?: boolean; // True if location was entered manually instead of GPS
}

export interface SearchFilters {
    query: string;
    selectedCounties: Set<string>;
    radiusMiles: number | null;  // null = no radius filter
    userLocation: UserLocation | null;
    acceptingClients: boolean | null;  // null = any, true = yes only
    specialties: string[];
    languages: string[];
}

export interface SearchState {
    isLocating: boolean;
    locationError: string | null;
    locationGranted: boolean;
}

export interface UseProviderSearchReturn {
    // Filtered results
    filteredProviders: ProviderGroup[];

    // Filters
    filters: SearchFilters;
    setSearchQuery: (query: string) => void;
    setSelectedCounties: (counties: Set<string>) => void;
    toggleCounty: (county: string) => void;
    selectAllCounties: () => void;
    clearAllCounties: () => void;
    setRadiusMiles: (radius: number | null) => void;
    setAcceptingClients: (value: boolean | null) => void;
    toggleSpecialty: (specialty: string) => void;
    toggleLanguage: (language: string) => void;
    clearAdvancedFilters: () => void;

    // Geolocation
    userLocation: UserLocation | null;
    isLocating: boolean;
    locationError: string | null;
    requestLocation: () => void;
    clearLocation: () => void;

    // Computed stats
    totalResults: number;
    isFiltered: boolean;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate the distance between two coordinates using the Haversine formula.
 * @param lat1 Latitude of point 1
 * @param lng1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lng2 Longitude of point 2
 * @returns Distance in miles
 */
function calculateDistanceMiles(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const R = 3958.8; // Earth's radius in miles
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * Check if any of a provider's locations are within the specified radius.
 */
function isWithinRadius(
    provider: ProviderGroup,
    userLocation: UserLocation,
    radiusMiles: number
): boolean {
    return provider.locations.some(loc => {
        const distance = calculateDistanceMiles(
            userLocation.lat,
            userLocation.lng,
            loc.lat,
            loc.lng
        );
        return distance <= radiusMiles;
    });
}

// ============================================================================
// AVAILABLE OPTIONS (for UI)
// ============================================================================

export const AVAILABLE_SPECIALTIES = [
    'Pediatric',
    'Geriatric',
    'Mental Health',
    'Chronic Care',
    'Wound Care',
    'Diabetes Management',
    'Hospice',
    'Post-Surgical',
    'Rehabilitation',
    'Palliative Care'
];

export const AVAILABLE_LANGUAGES = [
    'English',
    'Spanish',
    'Vietnamese',
    'Chinese (Mandarin)',
    'Chinese (Cantonese)',
    'Korean',
    'Russian',
    'Tagalog',
    'Somali',
    'Arabic',
    'Amharic',
    'ASL (Sign Language)'
];

export const RADIUS_OPTIONS = [
    { value: 5, label: '5 miles' },
    { value: 10, label: '10 miles' },
    { value: 25, label: '25 miles' },
    { value: 50, label: '50 miles' },
    { value: 100, label: '100 miles' },
    { value: null, label: 'Any distance' }
];

// ============================================================================
// MAIN HOOK
// ============================================================================

/**
 * Custom hook for provider search with geolocation, radius, and advanced filters.
 * Centralizes all search and filter logic for the map and provider list.
 */
export function useProviderSearch(
    providers: ProviderGroup[],
    allCounties: string[]
): UseProviderSearchReturn {
    // ========================================================================
    // STATE
    // ========================================================================

    // Search filters state
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCounties, setSelectedCounties] = useState<Set<string>>(new Set(allCounties));
    const [radiusMiles, setRadiusMiles] = useState<number | null>(null);
    const [acceptingClients, setAcceptingClients] = useState<boolean | null>(null);
    const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

    // Geolocation state
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);

    // ========================================================================
    // GEOLOCATION HANDLERS
    // ========================================================================

    const requestLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser.');
            return;
        }

        setIsLocating(true);
        setLocationError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp
                });
                setIsLocating(false);
                setLocationError(null);

                // Auto-set a reasonable radius when getting location
                if (radiusMiles === null) {
                    setRadiusMiles(25);
                }
            },
            (error) => {
                setIsLocating(false);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError('Location permission denied. Please allow location access in your browser settings.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setLocationError('Location information is unavailable.');
                        break;
                    case error.TIMEOUT:
                        setLocationError('Location request timed out. Please try again.');
                        break;
                    default:
                        setLocationError('An unknown error occurred while getting location.');
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000 // Cache location for 1 minute
            }
        );
    }, [radiusMiles]);

    const clearLocation = useCallback(() => {
        setUserLocation(null);
        setRadiusMiles(null);
        setLocationError(null);
    }, []);

    // ========================================================================
    // FILTER HANDLERS
    // ========================================================================

    const toggleCounty = useCallback((county: string) => {
        setSelectedCounties(prev => {
            const next = new Set(prev);
            if (next.has(county)) {
                next.delete(county);
            } else {
                next.add(county);
            }
            return next;
        });
    }, []);

    const selectAllCounties = useCallback(() => {
        setSelectedCounties(new Set(allCounties));
    }, [allCounties]);

    const clearAllCounties = useCallback(() => {
        setSelectedCounties(new Set());
    }, []);

    const toggleSpecialty = useCallback((specialty: string) => {
        setSelectedSpecialties(prev =>
            prev.includes(specialty)
                ? prev.filter(s => s !== specialty)
                : [...prev, specialty]
        );
    }, []);

    const toggleLanguage = useCallback((language: string) => {
        setSelectedLanguages(prev =>
            prev.includes(language)
                ? prev.filter(l => l !== language)
                : [...prev, language]
        );
    }, []);

    const clearAdvancedFilters = useCallback(() => {
        setAcceptingClients(null);
        setSelectedSpecialties([]);
        setSelectedLanguages([]);
    }, []);

    // ========================================================================
    // FILTER LOGIC
    // ========================================================================

    const filteredProviders = useMemo(() => {
        const lowerQuery = searchQuery.toLowerCase().trim();

        return providers.filter(provider => {
            // 1. Text search filter
            if (lowerQuery) {
                const textMatch =
                    provider.displayName.toLowerCase().includes(lowerQuery) ||
                    provider.name.toLowerCase().includes(lowerQuery) ||
                    provider.email.toLowerCase().includes(lowerQuery) ||
                    provider.providerId.includes(lowerQuery) ||
                    provider.counties.some(c => c.toLowerCase().includes(lowerQuery)) ||
                    (provider.specialties?.some(s => s.toLowerCase().includes(lowerQuery)) ?? false) ||
                    (provider.languages?.some(l => l.toLowerCase().includes(lowerQuery)) ?? false);

                if (!textMatch) return false;
            }

            // 2. County filter (when not using radius)
            if (radiusMiles === null || !userLocation) {
                const countyMatch = provider.counties.some(c => selectedCounties.has(c));
                if (!countyMatch) return false;
            }

            // 3. Radius filter (when user location is available)
            if (radiusMiles !== null && userLocation) {
                if (!isWithinRadius(provider, userLocation, radiusMiles)) {
                    return false;
                }
            }

            // 4. Accepting clients filter
            if (acceptingClients !== null) {
                // If provider doesn't have this data, assume they are accepting
                const isAccepting = provider.acceptingClients ?? true;
                if (acceptingClients && !isAccepting) return false;
            }

            // 5. Specialty filter
            if (selectedSpecialties.length > 0) {
                const providerSpecialties = provider.specialties || [];
                const hasMatchingSpecialty = selectedSpecialties.some(s =>
                    providerSpecialties.includes(s)
                );
                // For now, if no specialty data, include in results
                if (providerSpecialties.length > 0 && !hasMatchingSpecialty) {
                    return false;
                }
            }

            // 6. Language filter
            if (selectedLanguages.length > 0) {
                const providerLanguages = provider.languages || [];
                const hasMatchingLanguage = selectedLanguages.some(l =>
                    providerLanguages.includes(l)
                );
                // For now, if no language data, include in results (assume English)
                if (providerLanguages.length > 0 && !hasMatchingLanguage) {
                    return false;
                }
            }

            return true;
        });
    }, [
        providers,
        searchQuery,
        selectedCounties,
        radiusMiles,
        userLocation,
        acceptingClients,
        selectedSpecialties,
        selectedLanguages
    ]);

    // ========================================================================
    // COMPUTED VALUES
    // ========================================================================

    const isFiltered = useMemo(() => {
        return (
            searchQuery.length > 0 ||
            selectedCounties.size !== allCounties.length ||
            radiusMiles !== null ||
            acceptingClients !== null ||
            selectedSpecialties.length > 0 ||
            selectedLanguages.length > 0
        );
    }, [
        searchQuery,
        selectedCounties.size,
        allCounties.length,
        radiusMiles,
        acceptingClients,
        selectedSpecialties.length,
        selectedLanguages.length
    ]);

    const filters: SearchFilters = {
        query: searchQuery,
        selectedCounties,
        radiusMiles,
        userLocation,
        acceptingClients,
        specialties: selectedSpecialties,
        languages: selectedLanguages
    };

    // ========================================================================
    // RETURN
    // ========================================================================

    return {
        // Results
        filteredProviders,

        // Filters
        filters,
        setSearchQuery,
        setSelectedCounties,
        toggleCounty,
        selectAllCounties,
        clearAllCounties,
        setRadiusMiles,
        setAcceptingClients,
        toggleSpecialty,
        toggleLanguage,
        clearAdvancedFilters,

        // Geolocation
        userLocation,
        isLocating,
        locationError,
        requestLocation,
        clearLocation,

        // Stats
        totalResults: filteredProviders.length,
        isFiltered
    };
}

export default useProviderSearch;
