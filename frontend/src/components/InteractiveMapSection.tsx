import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip as LeafletTooltip, useMap, Circle } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import Papa from 'papaparse';
import L from 'leaflet';
import { Box, Typography, TextField, Button, Chip, Stack, Paper, IconButton, Tooltip, Divider } from '@mui/material';
import { Search, Layers, FilterList, MyLocation, Analytics, Clear } from '@mui/icons-material';
import { CoverageLayer, AnalyticsPanel, AdvancedFilters } from './map';
import { useCoverageStats } from '../hooks/useCoverageStats';
import { useProviderSearch, ProviderGroup } from '../hooks/useProviderSearch';

// Fix for default marker icon in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Marker Icon with shimmer effect - Style Guide Gold & Cyan
const markerSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffd000" stroke="#00ffd5" stroke-width="2" filter="drop-shadow(0px 3px 6px rgba(255,208,0,0.6))">
  <defs>
    <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffd000;stop-opacity:1">
        <animate attributeName="stop-color" values="#ffd000;#00ffd5;#ffd000" dur="3s" repeatCount="indefinite"/>
      </stop>
      <stop offset="50%" style="stop-color:#00ffd5;stop-opacity:1">
        <animate attributeName="stop-color" values="#00ffd5;#ffd000;#00ffd5" dur="3s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" style="stop-color:#ffd000;stop-opacity:1">
        <animate attributeName="stop-color" values="#ffd000;#00ffd5;#ffd000" dur="3s" repeatCount="indefinite"/>
      </stop>
    </linearGradient>
  </defs>
  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="url(#shimmer)"/>
  <circle cx="12" cy="9" r="2.5" fill="#0a0f14"/>
</svg>
`;

const customIcon = new L.Icon({
    iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(markerSvg)}`,
    iconSize: [35, 35],
    iconAnchor: [17.5, 35],
    popupAnchor: [0, -35],
    className: 'custom-marker-icon'
});

// Washington State Bounds (approximate)
const waBounds = new L.LatLngBounds(
    [45.0, -125.0], // South West
    [49.0, -116.0]  // North East
);

// Population-weighted county centers (major cities/towns, not geographic centroids)
// This ensures markers appear where people actually live, not in forests/mountains
const countyPopulationCenters: { [key: string]: { lat: number; lng: number } } = {
    'Adams': { lat: 46.9754, lng: -118.5486 }, // Ritzville
    'Asotin': { lat: 46.4166, lng: -117.0167 }, // Clarkston
    'Benton': { lat: 46.2856, lng: -119.2845 }, // Kennewick/Richland
    'Chelan': { lat: 47.4235, lng: -120.3103 }, // Wenatchee
    'Clallam': { lat: 48.1187, lng: -123.4307 }, // Port Angeles
    'Clark': { lat: 45.6387, lng: -122.6615 }, // Vancouver
    'Columbia': { lat: 46.2568, lng: -117.8823 }, // Dayton
    'Cowlitz': { lat: 46.1429, lng: -122.9062 }, // Longview
    'Douglas': { lat: 47.3984, lng: -120.2750 }, // East Wenatchee
    'Ferry': { lat: 48.7573, lng: -118.7340 }, // Republic
    'Franklin': { lat: 46.2396, lng: -119.1006 }, // Pasco
    'Garfield': { lat: 46.4143, lng: -117.0419 }, // Pomeroy
    'Grant': { lat: 47.1301, lng: -119.2781 }, // Moses Lake
    'Grays Harbor': { lat: 46.9754, lng: -123.8157 }, // Aberdeen
    'Island': { lat: 48.1918, lng: -122.6047 }, // Oak Harbor
    'Jefferson': { lat: 48.1148, lng: -122.7605 }, // Port Townsend
    'King': { lat: 47.6062, lng: -122.3321 }, // Seattle downtown
    'Kitsap': { lat: 47.5650, lng: -122.6269 }, // Bremerton
    'Kittitas': { lat: 46.9965, lng: -120.5478 }, // Ellensburg
    'Klickitat': { lat: 45.8276, lng: -121.1574 }, // Goldendale
    'Lewis': { lat: 46.7177, lng: -122.9536 }, // Centralia
    'Lincoln': { lat: 47.6219, lng: -118.6990 }, // Davenport
    'Mason': { lat: 47.2321, lng: -123.1007 }, // Shelton
    'Okanogan': { lat: 48.3796, lng: -119.4346 }, // Omak
    'Pacific': { lat: 46.3360, lng: -123.9986 }, // Long Beach
    'Pend Oreille': { lat: 48.3110, lng: -117.2754 }, // Newport
    'Pierce': { lat: 47.2529, lng: -122.4443 }, // Tacoma
    'San Juan': { lat: 48.5343, lng: -123.0183 }, // Friday Harbor
    'Skagit': { lat: 48.4201, lng: -122.3375 }, // Mount Vernon
    'Skamania': { lat: 45.7763, lng: -121.9610 }, // Stevenson
    'Snohomish': { lat: 47.9790, lng: -122.2021 }, // Everett
    'Spokane': { lat: 47.6588, lng: -117.4260 }, // Spokane downtown
    'Stevens': { lat: 48.2653, lng: -117.8226 }, // Colville
    'Thurston': { lat: 47.0379, lng: -122.9007 }, // Olympia
    'Wahkiakum': { lat: 46.2932, lng: -123.4307 }, // Cathlamet
    'Walla Walla': { lat: 46.0646, lng: -118.3430 }, // Walla Walla
    'Whatcom': { lat: 48.7519, lng: -122.4787 }, // Bellingham
    'Whitman': { lat: 46.7324, lng: -117.1817 }, // Pullman
    'Yakima': { lat: 46.6021, lng: -120.5059 }, // Yakima
};

interface ProviderRecord {
    name: string;
    county: string;
    lat: number;
    lng: number;
    phone: string;
    email: string;
    providerId: string;
    displayName: string;
}


// Component to handle bounds updates
const BoundsUpdater = ({ locations }: { locations: { lat: number; lng: number }[] }) => {
    const map = useMap();
    useEffect(() => {
        if (locations.length > 0) {
            const bounds = L.latLngBounds(locations.map(l => [l.lat, l.lng]));
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
        }
    }, [locations, map]);
    return null;
};

export default function InteractiveMapSection() {
    const [allData, setAllData] = useState<ProviderRecord[]>([]);
    const [providers, setProviders] = useState<ProviderGroup[]>([]);
    const [filteredProviders, setFilteredProviders] = useState<ProviderGroup[]>([]);
    const [counties, setCounties] = useState<string[]>([]);
    const [countyCounts, setCountyCounts] = useState<{ [key: string]: number }>({});
    const [selectedCounties, setSelectedCounties] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [showMarkers, setShowMarkers] = useState(true);
    const [showCoverageLayer, setShowCoverageLayer] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);

    // === PHASE 2: Geolocation & Advanced Filters ===
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [radiusMiles, setRadiusMiles] = useState<number | null>(null);
    const [acceptingClients, setAcceptingClients] = useState<boolean | null>(null);
    const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

    // Geolocation handlers
    const requestLocation = () => {
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
                    accuracy: position.coords.accuracy
                });
                setIsLocating(false);
                // Auto-set reasonable radius when getting location
                if (radiusMiles === null) {
                    setRadiusMiles(25);
                }
            },
            (error) => {
                setIsLocating(false);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError('Location permission denied.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setLocationError('Location unavailable.');
                        break;
                    case error.TIMEOUT:
                        setLocationError('Location request timed out.');
                        break;
                    default:
                        setLocationError('Unknown location error.');
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
    };

    const clearLocation = () => {
        setUserLocation(null);
        setRadiusMiles(null);
        setLocationError(null);
    };

    const toggleSpecialty = (specialty: string) => {
        setSelectedSpecialties(prev =>
            prev.includes(specialty) ? prev.filter(s => s !== specialty) : [...prev, specialty]
        );
    };

    const toggleLanguage = (language: string) => {
        setSelectedLanguages(prev =>
            prev.includes(language) ? prev.filter(l => l !== language) : [...prev, language]
        );
    };

    const clearAdvancedFilters = () => {
        setAcceptingClients(null);
        setSelectedSpecialties([]);
        setSelectedLanguages([]);
    };

    // Handle manually entered location (from geocoding)
    const handleManualLocationSet = (location: { lat: number; lng: number; accuracy?: number; isManual?: boolean }) => {
        setUserLocation(location);
        setLocationError(null);
        // Auto-set a reasonable radius for manual locations
        if (radiusMiles === null) {
            setRadiusMiles(25);
        }
    };

    // Haversine distance calculation (miles)
    const calculateDistanceMiles = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
        const R = 3958.8; // Earth's radius in miles
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    const isFiltered = searchQuery.length > 0 ||
        selectedCounties.size !== counties.length ||
        radiusMiles !== null ||
        acceptingClients !== null ||
        selectedSpecialties.length > 0 ||
        selectedLanguages.length > 0;

    // Calculate coverage statistics for analytics panel
    const coverageStats = useCoverageStats(providers);

    // Load Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.BASE_URL}Updated_Provider_List.csv`);
                if (!response.ok) throw new Error('Failed to load CSV');
                const csvText = await response.text();

                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const parsed: ProviderRecord[] = [];
                        results.data.forEach((row: any) => {
                            // Get county name from Address column
                            const county = String(row['Address'] || '').trim();

                            // Use population center for the county with gaussian spread
                            let lat: number;
                            let lng: number;

                            if (county && countyPopulationCenters[county]) {
                                // Use population center with gaussian-like spread (~5-10km radius)
                                const center = countyPopulationCenters[county];
                                // Box-Muller transform for gaussian distribution
                                const u1 = Math.random();
                                const u2 = Math.random();
                                const gaussLat = Math.sqrt(-2 * Math.log(u1 || 0.001)) * Math.cos(2 * Math.PI * u2);
                                const gaussLng = Math.sqrt(-2 * Math.log(u1 || 0.001)) * Math.sin(2 * Math.PI * u2);
                                lat = center.lat + gaussLat * 0.04; // ~4km std dev
                                lng = center.lng + gaussLng * 0.05; // ~5km std dev
                            } else {
                                // Fallback to CSV coordinates
                                const newLat = Number(String(row['New Latitude'] || '').trim());
                                const newLng = Number(String(row['New Longitude'] || '').trim());
                                const oldLat = Number(String(row['Latitude'] || '').trim());
                                const oldLng = Number(String(row['Longitude'] || '').trim());
                                lat = (!isNaN(newLat) && newLat !== 0) ? newLat : oldLat;
                                lng = (!isNaN(newLng) && newLng !== 0) ? newLng : oldLng;
                            }

                            // Valid check
                            if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
                                // Format Name
                                let display = row['Name'] || 'Unknown Provider';
                                if (display.includes(',')) {
                                    const parts = display.split(',');
                                    if (parts.length === 2) {
                                        display = `${parts[1].trim()} ${parts[0].trim()}`;
                                    }
                                }
                                display = display.replace(/['"]/g, '');

                                parsed.push({
                                    name: row['Name'],
                                    county: county,
                                    lat,
                                    lng,
                                    phone: row['Notes'] || '',
                                    email: row['Button Link'] || '',
                                    providerId: (row['Tags'] || '').replace(/[^0-9]/g, ''),
                                    displayName: display
                                });
                            }
                        });
                        setAllData(parsed);
                        processProviders(parsed);
                        setLoading(false);
                    }
                });
            } catch (error) {
                console.error("Error loading map data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const processProviders = (data: ProviderRecord[]) => {
        const groups: { [key: string]: ProviderGroup } = {};
        const countySet = new Set<string>();
        const counts: { [key: string]: number } = {};

        data.forEach(p => {
            if (p.county) {
                countySet.add(p.county);
                counts[p.county] = (counts[p.county] || 0) + 1;
            }

            if (!groups[p.name]) {
                groups[p.name] = {
                    id: p.name + p.providerId,
                    name: p.name,
                    displayName: p.displayName,
                    phone: p.phone,
                    email: p.email,
                    providerId: p.providerId,
                    locations: [],
                    counties: []
                };
            }
            groups[p.name].locations.push({ county: p.county, lat: p.lat, lng: p.lng });
            if (!groups[p.name].counties.includes(p.county)) {
                groups[p.name].counties.push(p.county);
            }
        });

        const groupArray = Object.values(groups);
        setProviders(groupArray);
        setFilteredProviders(groupArray);

        const sortedCounties = Array.from(countySet).sort();
        setCounties(sortedCounties);
        setCountyCounts(counts);
        // Start with NO counties selected - users must choose which to view
        setSelectedCounties(new Set());
    };

    // Filter Logic - Now includes radius search
    useEffect(() => {
        const lowerQuery = searchQuery.toLowerCase();

        const filtered = providers.filter(p => {
            // 1. Text search
            const textMatch = !lowerQuery ||
                p.displayName.toLowerCase().includes(lowerQuery) ||
                p.email.toLowerCase().includes(lowerQuery) ||
                p.providerId.includes(lowerQuery) ||
                p.counties.some(c => c.toLowerCase().includes(lowerQuery));

            if (!textMatch) return false;

            // 2. Radius filter (takes priority when location is set)
            if (userLocation && radiusMiles !== null) {
                const withinRadius = p.locations.some(loc => {
                    const distance = calculateDistanceMiles(
                        userLocation.lat, userLocation.lng,
                        loc.lat, loc.lng
                    );
                    return distance <= radiusMiles;
                });
                if (!withinRadius) return false;
            } else {
                // 3. County filter (when no radius search)
                const countyMatch = p.counties.some(c => selectedCounties.has(c));
                if (!countyMatch) return false;
            }

            return true;
        });

        setFilteredProviders(filtered);
    }, [searchQuery, selectedCounties, providers, userLocation, radiusMiles]);


    const toggleCounty = (c: string) => {
        const next = new Set(selectedCounties);
        if (next.has(c)) next.delete(c);
        else next.add(c);
        setSelectedCounties(next);
    };

    const selectAll = () => setSelectedCounties(new Set(counties));
    const clearAll = () => setSelectedCounties(new Set());

    // Calculate Map Markers
    const mapMarkers = useMemo(() => {
        const markers: JSX.Element[] = [];
        filteredProviders.forEach(p => {
            p.locations.forEach((loc, idx) => {
                if (selectedCounties.has(loc.county)) {
                    markers.push(
                        <Marker
                            key={`${p.id}-${idx}`}
                            position={[loc.lat, loc.lng]}
                            icon={customIcon}
                            eventHandlers={{
                                mouseover: (e) => {
                                    e.target.openTooltip();
                                },
                                mouseout: (e) => {
                                    e.target.closeTooltip();
                                }
                            }}
                        >
                            {/* Tooltip - Shows on Hover - Style Guide Colors */}
                            <LeafletTooltip
                                permanent={false}
                                direction="top"
                                offset={[0, -35]}
                                opacity={1}
                                className="custom-tooltip"
                            >
                                <Box sx={{
                                    minWidth: 220,
                                    background: 'linear-gradient(135deg, #0a0f14 0%, #1e293b 100%)',
                                    borderRadius: 2,
                                    p: 1.5,
                                    border: '2px solid #00ffd5',
                                    boxShadow: '0 8px 24px rgba(0, 255, 213, 0.3), 0 0 12px rgba(255, 208, 0, 0.2)'
                                }}>
                                    <Typography
                                        variant="subtitle2"
                                        fontWeight="bold"
                                        sx={{
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '14px',
                                            mb: 0.5,
                                            background: 'linear-gradient(90deg, #ffd000 0%, #00ffd5 50%, #ff006e 100%)',
                                            backgroundSize: '200% auto',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            animation: 'shimmer 3s linear infinite',
                                            '@keyframes shimmer': {
                                                '0%': { backgroundPosition: '0% center' },
                                                '100%': { backgroundPosition: '200% center' }
                                            }
                                        }}
                                    >
                                        {p.displayName}
                                    </Typography>
                                    <Typography variant="caption" sx={{ display: 'block', color: '#00ffd5', fontSize: '11px' }}>
                                        📍 {loc.county} County
                                    </Typography>
                                    <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>
                                        Serves: {p.counties.length} {p.counties.length === 1 ? 'county' : 'counties'}
                                    </Typography>
                                    <Chip
                                        label="Click for details"
                                        size="small"
                                        sx={{
                                            height: 18,
                                            fontSize: '0.65rem',
                                            background: 'linear-gradient(135deg, #ffd000 0%, #ff006e 100%)',
                                            color: '#0a0f14',
                                            mt: 0.5,
                                            fontWeight: 700,
                                            border: 'none'
                                        }}
                                    />
                                </Box>
                            </LeafletTooltip>

                            {/* Popup - Shows on Click */}
                            <Popup className="custom-popup">
                                <Box sx={{ p: 1 }}>
                                    <Typography variant="subtitle1" fontWeight="bold" color="primary">{p.displayName}</Typography>
                                    <Chip label="Accepting Clients" size="small" sx={{ height: 16, fontSize: '0.6rem', bgcolor: '#d1fae5', color: '#059669', border: '1px solid #10b981', my: 0.5, width: 'fit-content' }} />
                                    <Stack spacing={0.5} mt={1}>
                                        {p.providerId && <Typography variant="caption" sx={{ bgcolor: 'rgba(0,0,0,0.05)', p: 0.5, borderRadius: 1 }}>ID: {p.providerId}</Typography>}
                                        <Typography variant="body2">📍 {loc.county} County</Typography>
                                        {p.phone && <Typography variant="body2">📞 {p.phone}</Typography>}
                                        {p.email && <Typography variant="body2">✉️ {p.email}</Typography>}
                                        <Typography variant="caption" color="text.secondary" mt={1}>
                                            Serves: {p.counties.slice(0, 5).join(', ')}{p.counties.length > 5 ? ` +${p.counties.length - 5} more` : ''}
                                        </Typography>
                                    </Stack>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="primary"
                                        sx={{ mt: 1, width: '100%', fontSize: '0.75rem' }}
                                        onClick={() => alert(`Contacting ${p.displayName}...`)}
                                    >
                                        Contact Provider
                                    </Button>
                                </Box>
                            </Popup>
                        </Marker>
                    );
                }
            });
        });
        return markers;
    }, [filteredProviders, selectedCounties]);

    const [activeProvider, setActiveProvider] = useState<ProviderGroup | null>(null);

    // Map Controller for Flight Animations
    const MapController = () => {
        const map = useMap();

        useEffect(() => {
            if (activeProvider && activeProvider.locations.length > 0) {
                const loc = activeProvider.locations[0];
                map.flyTo([loc.lat, loc.lng], 13, {
                    duration: 2,
                    easeLinearity: 0.25
                });
            }
        }, [activeProvider, map]);

        return null;
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: '85vh', bgcolor: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>

            {/* Sidebar Controls */}
            <Paper
                elevation={0}
                sx={{
                    width: { xs: '100%', md: 360 },
                    maxHeight: { xs: '40vh', md: '100%' },
                    overflowY: 'auto',
                    bgcolor: '#1e293b',
                    borderRight: { md: '1px solid rgba(255,255,255,0.1)' },
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                {/* Search */}
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search providers, counties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: <Search sx={{ color: 'rgba(255,255,255,0.5)', mr: 1 }} />,
                        endAdornment: searchQuery && (
                            <IconButton size="small" onClick={() => setSearchQuery('')} sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                <Clear fontSize="small" />
                            </IconButton>
                        ),
                        sx: { bgcolor: 'rgba(255,255,255,0.05)', color: 'white', '& input::placeholder': { color: 'rgba(255,255,255,0.5)' } }
                    }}
                />

                {/* === PHASE 2: Advanced Filters Section === */}
                <AdvancedFilters
                    userLocation={userLocation}
                    isLocating={isLocating}
                    locationError={locationError}
                    onRequestLocation={requestLocation}
                    onClearLocation={clearLocation}
                    onManualLocationSet={handleManualLocationSet}
                    radiusMiles={radiusMiles}
                    onRadiusChange={setRadiusMiles}
                    acceptingClients={acceptingClients}
                    onAcceptingClientsChange={setAcceptingClients}
                    selectedSpecialties={selectedSpecialties}
                    onToggleSpecialty={toggleSpecialty}
                    selectedLanguages={selectedLanguages}
                    onToggleLanguage={toggleLanguage}
                    onClearAdvancedFilters={clearAdvancedFilters}
                    isFiltered={isFiltered}
                />

                {/* County Filter Header - Disabled when using radius search */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    opacity: userLocation && radiusMiles ? 0.5 : 1,
                    pointerEvents: userLocation && radiusMiles ? 'none' : 'auto'
                }}>
                    <Typography variant="subtitle2" color="white" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FilterList fontSize="small" />
                        Counties ({selectedCounties.size}/{counties.length})
                        {userLocation && radiusMiles && (
                            <Chip
                                label={`${radiusMiles}mi radius active`}
                                size="small"
                                sx={{
                                    height: 18,
                                    fontSize: '0.6rem',
                                    bgcolor: '#10b981',
                                    color: 'white',
                                    ml: 1
                                }}
                            />
                        )}
                    </Typography>
                    <Box>
                        <Button size="small" onClick={selectAll} sx={{ color: '#22d3ee', minWidth: 'auto', px: 1 }}>All</Button>
                        <Button size="small" onClick={clearAll} sx={{ color: '#f87171', minWidth: 'auto', px: 1 }}>None</Button>
                    </Box>
                </Box>

                {/* County Chips */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {counties.map(c => (
                        <Chip
                            key={c}
                            label={`${c} (${countyCounts[c] || 0})`}
                            size="small"
                            onClick={() => toggleCounty(c)}
                            sx={{
                                bgcolor: selectedCounties.has(c) ? '#22d3ee' : 'rgba(255,255,255,0.1)',
                                color: selectedCounties.has(c) ? '#0f172a' : 'rgba(255,255,255,0.7)',
                                '&:hover': { bgcolor: selectedCounties.has(c) ? '#06b6d4' : 'rgba(255,255,255,0.2)' },
                                fontSize: '0.7rem',
                                height: 24
                            }}
                        />
                    ))}
                </Box>

                {/* Provider Count Summary (list removed for better UX) */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: 'rgba(255,208,0,0.1)',
                    border: '1px solid rgba(255,208,0,0.3)',
                    borderRadius: 2,
                    p: 1.5
                }}>
                    <Typography variant="subtitle2" sx={{
                        color: '#ffd000',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}>
                        <span style={{ fontSize: '18px' }}>📍</span>
                        {loading ? 'Loading...' : `${filteredProviders.length} Providers Found`}
                    </Typography>
                    {filteredProviders.length > 0 && !loading && (
                        <Chip
                            label="View on Map"
                            size="small"
                            sx={{
                                bgcolor: 'transparent',
                                border: '1px solid #00ffd5',
                                color: '#00ffd5',
                                fontSize: '0.65rem',
                                height: 22,
                                fontWeight: 600
                            }}
                        />
                    )}
                </Box>
            </Paper>

            {/* Map */}
            <Box sx={{ flex: 1, position: 'relative' }}>
                <MapContainer
                    center={[47.5, -120.5]}
                    zoom={7}
                    style={{ height: '100%', width: '100%' }}
                    maxBounds={waBounds}
                    minZoom={6}
                >
                    {/* Satellite Layer */}
                    <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution='Tiles &copy; Esri'
                    />
                    {/* Labels overlay */}
                    <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                        attribution=''
                    />
                    <MapController />

                    {/* Coverage Layer - County boundaries with provider density */}
                    <CoverageLayer
                        countyCounts={countyCounts}
                        visible={showCoverageLayer}
                        onCountyClick={(county) => {
                            setSearchQuery(county);
                        }}
                    />

                    {/* User Location Radius Circle */}
                    {userLocation && radiusMiles && (
                        <>
                            <Circle
                                center={[userLocation.lat, userLocation.lng]}
                                radius={radiusMiles * 1609.34} // Convert miles to meters
                                pathOptions={{
                                    color: '#10b981',
                                    fillColor: '#10b981',
                                    fillOpacity: 0.1,
                                    weight: 2,
                                    dashArray: '5, 5'
                                }}
                            />
                            <Marker
                                position={[userLocation.lat, userLocation.lng]}
                                icon={new L.Icon({
                                    iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#10b981" stroke="white" stroke-width="2">
                                            <circle cx="12" cy="12" r="8" fill="#10b981"/>
                                            <circle cx="12" cy="12" r="4" fill="white"/>
                                        </svg>
                                    `)}`,
                                    iconSize: [24, 24],
                                    iconAnchor: [12, 12]
                                })}
                            >
                                <Popup>
                                    <Typography variant="body2" fontWeight="bold" color="primary">
                                        📍 Your Location
                                    </Typography>
                                    <Typography variant="caption">
                                        Searching within {radiusMiles} miles
                                    </Typography>
                                </Popup>
                            </Marker>
                        </>
                    )}

                    <MarkerClusterGroup chunkedLoading>
                        {showMarkers && mapMarkers}
                    </MarkerClusterGroup>
                </MapContainer>

                {/* Map Controls */}
                <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Tooltip title={showMarkers ? "Hide Markers" : "Show Markers"} placement="left">
                        <IconButton
                            onClick={() => setShowMarkers(!showMarkers)}
                            sx={{
                                bgcolor: showMarkers ? '#22d3ee' : 'white',
                                color: showMarkers ? 'white' : 'inherit',
                                '&:hover': { bgcolor: showMarkers ? '#06b6d4' : '#f1f5f9' }
                            }}
                        >
                            <Layers />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={showCoverageLayer ? "Hide Coverage" : "Show Coverage Layer"} placement="left">
                        <IconButton
                            onClick={() => setShowCoverageLayer(!showCoverageLayer)}
                            sx={{
                                bgcolor: showCoverageLayer ? '#10b981' : 'white',
                                color: showCoverageLayer ? 'white' : 'inherit',
                                '&:hover': { bgcolor: showCoverageLayer ? '#059669' : '#f1f5f9' }
                            }}
                        >
                            <MyLocation />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={showAnalytics ? "Hide Analytics" : "Show Analytics Panel"} placement="left">
                        <IconButton
                            onClick={() => setShowAnalytics(!showAnalytics)}
                            sx={{
                                bgcolor: showAnalytics ? '#8b5cf6' : 'white',
                                color: showAnalytics ? 'white' : 'inherit',
                                '&:hover': { bgcolor: showAnalytics ? '#7c3aed' : '#f1f5f9' }
                            }}
                        >
                            <Analytics />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Analytics Panel - Slides in from right */}
                {showAnalytics && (
                    <Box sx={{
                        position: 'absolute',
                        top: 10,
                        right: 60,
                        zIndex: 1000,
                        width: 320,
                        maxHeight: 'calc(100% - 20px)',
                        overflowY: 'auto'
                    }}>
                        <AnalyticsPanel
                            stats={coverageStats}
                            onCountySelect={(county) => setSearchQuery(county)}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
}
