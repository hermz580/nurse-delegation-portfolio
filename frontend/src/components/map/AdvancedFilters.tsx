import React, { useState } from 'react';
import {
    Box,
    Typography,
    Chip,
    Button,
    Slider,
    FormControlLabel,
    Switch,
    Paper,
    Collapse,
    IconButton,
    Divider,
    Alert,
    CircularProgress,
    Tooltip,
    Stack,
    useTheme
} from '@mui/material';
import {
    MyLocation,
    LocationOff,
    FilterList,
    ExpandMore,
    ExpandLess,
    Close,
    Tune,
    Clear,
    Language,
    MedicalServices,
    CheckCircle
} from '@mui/icons-material';

import {
    AVAILABLE_SPECIALTIES,
    AVAILABLE_LANGUAGES,
    RADIUS_OPTIONS,
    UserLocation
} from '../../hooks/useProviderSearch';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface AdvancedFiltersProps {
    // Location
    userLocation: UserLocation | null;
    isLocating: boolean;
    locationError: string | null;
    onRequestLocation: () => void;
    onClearLocation: () => void;
    onManualLocationSet?: (location: UserLocation) => void;

    // Radius
    radiusMiles: number | null;
    onRadiusChange: (radius: number | null) => void;

    // Accepting clients
    acceptingClients: boolean | null;
    onAcceptingClientsChange: (value: boolean | null) => void;

    // Specialties
    selectedSpecialties: string[];
    onToggleSpecialty: (specialty: string) => void;

    // Languages
    selectedLanguages: string[];
    onToggleLanguage: (language: string) => void;

    // Reset
    onClearAdvancedFilters: () => void;

    // Stats
    isFiltered: boolean;
}

// ============================================================================
// GEOLOCATION BUTTON COMPONENT
// ============================================================================

interface NearMeButtonProps {
    userLocation: UserLocation | null;
    isLocating: boolean;
    locationError: string | null;
    onRequestLocation: () => void;
    onClearLocation: () => void;
    onManualLocationSet?: (location: UserLocation) => void;
}

export const NearMeButton: React.FC<NearMeButtonProps> = ({
    userLocation,
    isLocating,
    locationError,
    onRequestLocation,
    onClearLocation,
    onManualLocationSet
}) => {
    const hasLocation = userLocation !== null;
    const [showManualEntry, setShowManualEntry] = useState(false);
    const [manualAddress, setManualAddress] = useState('');
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [geocodeError, setGeocodeError] = useState<string | null>(null);

    // Geocode address using OpenStreetMap Nominatim (free, no API key needed)
    const geocodeAddress = async () => {
        if (!manualAddress.trim()) return;

        setIsGeocoding(true);
        setGeocodeError(null);

        try {
            // Add "Washington State" to improve accuracy for WA searches
            const searchQuery = manualAddress.includes('WA') || manualAddress.includes('Washington')
                ? manualAddress
                : `${manualAddress}, Washington, USA`;

            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
                { headers: { 'User-Agent': 'Nurse-Delegation-Network-Demo' } }
            );

            const results = await response.json();

            if (results && results.length > 0) {
                const { lat, lon } = results[0];
                onManualLocationSet?.({
                    lat: parseFloat(lat),
                    lng: parseFloat(lon),
                    accuracy: 500, // Manual entry has ~500m accuracy
                    isManual: true
                });
                setShowManualEntry(false);
                setManualAddress('');
            } else {
                setGeocodeError('Location not found. Try adding city or zip code.');
            }
        } catch (err) {
            setGeocodeError('Failed to find location. Please check your connection.');
        } finally {
            setIsGeocoding(false);
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Button
                fullWidth
                variant={hasLocation ? 'contained' : 'outlined'}
                color={hasLocation ? 'success' : 'primary'}
                onClick={hasLocation ? onClearLocation : onRequestLocation}
                disabled={isLocating}
                startIcon={
                    isLocating ? (
                        <CircularProgress size={18} color="inherit" />
                    ) : hasLocation ? (
                        <LocationOff />
                    ) : (
                        <MyLocation />
                    )
                }
                sx={{
                    py: 1.25,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    bgcolor: hasLocation ? '#10b981' : 'transparent',
                    borderColor: hasLocation ? '#10b981' : 'rgba(34, 211, 238, 0.5)',
                    color: hasLocation ? 'white' : '#22d3ee',
                    '&:hover': {
                        bgcolor: hasLocation ? '#059669' : 'rgba(34, 211, 238, 0.1)',
                        borderColor: hasLocation ? '#059669' : '#22d3ee'
                    },
                    '&:disabled': {
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.5)'
                    }
                }}
            >
                {isLocating
                    ? 'Finding your location...'
                    : hasLocation
                        ? 'Using My Location ✓'
                        : '📍 Near Me'}
            </Button>

            {/* Manual Location Entry - Shows when geolocation fails or user chooses */}
            {(locationError || showManualEntry) && !hasLocation && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2, border: '1px solid rgba(255, 215, 0, 0.3)' }}>
                    <Typography variant="body2" sx={{ color: '#FFD700', mb: 1.5, fontWeight: 600 }}>
                        📍 Enter Your Location Manually
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Box
                            component="input"
                            type="text"
                            placeholder="City, Address, or ZIP code..."
                            value={manualAddress}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManualAddress(e.target.value)}
                            onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && geocodeAddress()}
                            sx={{
                                flex: 1,
                                px: 2,
                                py: 1,
                                borderRadius: 1,
                                border: '1px solid rgba(255,255,255,0.2)',
                                bgcolor: 'rgba(255,255,255,0.08)',
                                color: 'white',
                                fontSize: '0.9rem',
                                '&::placeholder': { color: 'rgba(255,255,255,0.4)' },
                                '&:focus': {
                                    outline: 'none',
                                    borderColor: '#FFD700',
                                    boxShadow: '0 0 0 2px rgba(255, 215, 0, 0.2)'
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={geocodeAddress}
                            disabled={isGeocoding || !manualAddress.trim()}
                            sx={{
                                minWidth: 'auto',
                                px: 2,
                                bgcolor: '#FFD700',
                                color: '#0a0a0b',
                                fontWeight: 600,
                                '&:hover': { bgcolor: '#e6c200' },
                                '&:disabled': { bgcolor: 'rgba(255,215,0,0.3)', color: 'rgba(0,0,0,0.3)' }
                            }}
                        >
                            {isGeocoding ? <CircularProgress size={20} color="inherit" /> : 'Set'}
                        </Button>
                    </Box>

                    {geocodeError && (
                        <Typography variant="caption" sx={{ color: '#f87171', display: 'block', mt: 1 }}>
                            {geocodeError}
                        </Typography>
                    )}

                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mt: 1 }}>
                        Examples: "Seattle", "98101", "1234 Main St, Tacoma"
                    </Typography>
                </Box>
            )}

            {locationError && !showManualEntry && (
                <Alert
                    severity="warning"
                    sx={{
                        mt: 1,
                        py: 0.5,
                        fontSize: '0.75rem',
                        bgcolor: 'rgba(255, 215, 0, 0.15)',
                        color: '#FFD700',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                        '& .MuiAlert-icon': {
                            color: '#FFD700'
                        }
                    }}
                    action={
                        <Button
                            size="small"
                            onClick={() => setShowManualEntry(true)}
                            sx={{ color: '#FFD700', fontWeight: 600, fontSize: '0.7rem' }}
                        >
                            Enter Location
                        </Button>
                    }
                >
                    {locationError}
                </Alert>
            )}

            {hasLocation && (
                <Typography
                    variant="caption"
                    sx={{
                        display: 'block',
                        mt: 0.5,
                        color: 'rgba(255,255,255,0.5)',
                        textAlign: 'center'
                    }}
                >
                    {userLocation.isManual
                        ? '📍 Manual location set'
                        : `Accuracy: ±${Math.round(userLocation.accuracy || 0)}m`}
                </Typography>
            )}
        </Box>
    );
};

// ============================================================================
// RADIUS SLIDER COMPONENT
// ============================================================================

interface RadiusSliderProps {
    value: number | null;
    onChange: (value: number | null) => void;
    disabled?: boolean;
}

export const RadiusSlider: React.FC<RadiusSliderProps> = ({
    value,
    onChange,
    disabled = false
}) => {
    // Map null to the last option (100+ which represents 'any')
    const sliderValue = value === null ? 6 : RADIUS_OPTIONS.findIndex(opt => opt.value === value);

    const marks = RADIUS_OPTIONS.map((opt, idx) => ({
        value: idx,
        label: opt.value === null ? 'Any' : `${opt.value}mi`
    }));

    const handleChange = (_: Event, newValue: number | number[]) => {
        const idx = newValue as number;
        const option = RADIUS_OPTIONS[idx];
        onChange(option ? option.value : null);
    };

    return (
        <Box sx={{ px: 1 }}>
            <Typography
                variant="body2"
                sx={{
                    color: disabled ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}
            >
                <MyLocation fontSize="small" />
                Search Radius:
                <strong style={{ color: disabled ? 'rgba(255,255,255,0.3)' : '#22d3ee' }}>
                    {value === null ? 'Any distance' : `${value} miles`}
                </strong>
            </Typography>

            <Slider
                value={sliderValue >= 0 ? sliderValue : 5}
                onChange={handleChange}
                step={1}
                min={0}
                max={5}
                marks={marks}
                disabled={disabled}
                sx={{
                    color: '#22d3ee',
                    '& .MuiSlider-mark': {
                        bgcolor: 'rgba(255,255,255,0.3)'
                    },
                    '& .MuiSlider-markLabel': {
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: '0.65rem'
                    },
                    '& .MuiSlider-thumb': {
                        width: 16,
                        height: 16,
                        '&:hover, &.Mui-focusVisible': {
                            boxShadow: '0 0 0 8px rgba(34, 211, 238, 0.16)'
                        }
                    },
                    '& .MuiSlider-track': {
                        height: 4
                    },
                    '& .MuiSlider-rail': {
                        height: 4,
                        bgcolor: 'rgba(255,255,255,0.2)'
                    },
                    '&.Mui-disabled': {
                        color: 'rgba(255,255,255,0.3)',
                        '& .MuiSlider-thumb': {
                            bgcolor: 'rgba(255,255,255,0.3)'
                        }
                    }
                }}
            />
        </Box>
    );
};

// ============================================================================
// CHIP FILTER GROUP COMPONENT
// ============================================================================

interface ChipFilterGroupProps {
    title: string;
    icon: React.ReactNode;
    options: string[];
    selected: string[];
    onToggle: (option: string) => void;
    color?: string;
}

const ChipFilterGroup: React.FC<ChipFilterGroupProps> = ({
    title,
    icon,
    options,
    selected,
    onToggle,
    color = '#22d3ee'
}) => {
    const [expanded, setExpanded] = useState(false);
    const displayOptions = expanded ? options : options.slice(0, 6);
    const hasMore = options.length > 6;

    return (
        <Box>
            <Typography
                variant="body2"
                sx={{
                    color: 'rgba(255,255,255,0.7)',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}
            >
                {icon}
                {title}
                {selected.length > 0 && (
                    <Chip
                        label={selected.length}
                        size="small"
                        sx={{
                            height: 18,
                            fontSize: '0.65rem',
                            bgcolor: color,
                            color: 'white'
                        }}
                    />
                )}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {displayOptions.map(option => (
                    <Chip
                        key={option}
                        label={option}
                        size="small"
                        onClick={() => onToggle(option)}
                        sx={{
                            bgcolor: selected.includes(option) ? color : 'rgba(255,255,255,0.08)',
                            color: selected.includes(option) ? 'white' : 'rgba(255,255,255,0.7)',
                            fontSize: '0.7rem',
                            height: 26,
                            '&:hover': {
                                bgcolor: selected.includes(option)
                                    ? color
                                    : 'rgba(255,255,255,0.15)'
                            },
                            transition: 'all 0.2s ease'
                        }}
                    />
                ))}

                {hasMore && (
                    <Chip
                        label={expanded ? 'Show less' : `+${options.length - 6} more`}
                        size="small"
                        onClick={() => setExpanded(!expanded)}
                        sx={{
                            bgcolor: 'transparent',
                            color: color,
                            fontSize: '0.7rem',
                            height: 26,
                            border: `1px dashed ${color}`,
                            '&:hover': {
                                bgcolor: 'rgba(34, 211, 238, 0.1)'
                            }
                        }}
                    />
                )}
            </Box>
        </Box>
    );
};

// ============================================================================
// MAIN ADVANCED FILTERS COMPONENT
// ============================================================================

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
    userLocation,
    isLocating,
    locationError,
    onRequestLocation,
    onClearLocation,
    onManualLocationSet,
    radiusMiles,
    onRadiusChange,
    acceptingClients,
    onAcceptingClientsChange,
    selectedSpecialties,
    onToggleSpecialty,
    selectedLanguages,
    onToggleLanguage,
    onClearAdvancedFilters,
    isFiltered
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const activeFilterCount = [
        userLocation !== null,
        acceptingClients !== null,
        selectedSpecialties.length > 0,
        selectedLanguages.length > 0
    ].filter(Boolean).length;

    return (
        <Paper
            elevation={0}
            sx={{
                bgcolor: 'rgba(255,255,255,0.03)',
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.1)',
                overflow: 'hidden'
            }}
        >
            {/* Header - Always visible */}
            <Box
                onClick={() => setIsExpanded(!isExpanded)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    cursor: 'pointer',
                    '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.03)'
                    }
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tune sx={{ color: '#22d3ee', fontSize: 20 }} />
                    <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                        Advanced Filters
                    </Typography>
                    {activeFilterCount > 0 && (
                        <Chip
                            label={activeFilterCount}
                            size="small"
                            sx={{
                                height: 20,
                                fontSize: '0.7rem',
                                bgcolor: '#8b5cf6',
                                color: 'white'
                            }}
                        />
                    )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {activeFilterCount > 0 && (
                        <Tooltip title="Clear all advanced filters">
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClearAdvancedFilters();
                                    onClearLocation();
                                }}
                                sx={{ color: '#f87171', p: 0.5 }}
                            >
                                <Clear fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                    <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.5)', p: 0.5 }}>
                        {isExpanded ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </Box>
            </Box>

            {/* Expandable Content */}
            <Collapse in={isExpanded}>
                <Box sx={{ p: 2, pt: 0 }}>
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />

                    <Stack spacing={2.5}>
                        {/* Near Me Button */}
                        <NearMeButton
                            userLocation={userLocation}
                            isLocating={isLocating}
                            locationError={locationError}
                            onRequestLocation={onRequestLocation}
                            onClearLocation={onClearLocation}
                            onManualLocationSet={onManualLocationSet}
                        />

                        {/* Radius Slider */}
                        <RadiusSlider
                            value={radiusMiles}
                            onChange={onRadiusChange}
                            disabled={!userLocation}
                        />

                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                        {/* Accepting Clients Toggle */}
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={acceptingClients === true}
                                    onChange={(e) =>
                                        onAcceptingClientsChange(e.target.checked ? true : null)
                                    }
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                            color: '#10b981'
                                        },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                            bgcolor: '#10b981'
                                        }
                                    }}
                                />
                            }
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CheckCircle
                                        sx={{
                                            fontSize: 18,
                                            color: acceptingClients ? '#10b981' : 'rgba(255,255,255,0.5)'
                                        }}
                                    />
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'rgba(255,255,255,0.7)' }}
                                    >
                                        Accepting New Clients Only
                                    </Typography>
                                </Box>
                            }
                            sx={{ m: 0 }}
                        />

                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                        {/* Specialties Filter */}
                        <ChipFilterGroup
                            title="Specialties"
                            icon={<MedicalServices sx={{ fontSize: 18 }} />}
                            options={AVAILABLE_SPECIALTIES}
                            selected={selectedSpecialties}
                            onToggle={onToggleSpecialty}
                            color="#8b5cf6"
                        />

                        {/* Languages Filter */}
                        <ChipFilterGroup
                            title="Languages Spoken"
                            icon={<Language sx={{ fontSize: 18 }} />}
                            options={AVAILABLE_LANGUAGES}
                            selected={selectedLanguages}
                            onToggle={onToggleLanguage}
                            color="#f59e0b"
                        />
                    </Stack>
                </Box>
            </Collapse>
        </Paper>
    );
};

export default AdvancedFilters;
