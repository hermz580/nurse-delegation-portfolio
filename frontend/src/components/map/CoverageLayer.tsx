import React, { useEffect, useState } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Box, Typography } from '@mui/material';

interface CoverageLayerProps {
    countyCounts: { [county: string]: number };
    visible: boolean;
    onCountyClick?: (county: string, count: number) => void;
}

// Enhanced color scheme - more distinct and visible
const getCoverageStyle = (count: number, isFlashing: boolean = false) => {
    // Critical gap - pulsing red
    if (count === 0) {
        return {
            fillColor: '#dc2626',  // Bright red
            fillOpacity: isFlashing ? 0.8 : 0.5,
            color: '#fef2f2',      // Light red border
            weight: 2,
            dashArray: '5, 5'
        };
    }
    // Low coverage - orange
    if (count <= 2) {
        return {
            fillColor: '#ea580c',  // Deep orange
            fillOpacity: 0.45,
            color: '#fff7ed',
            weight: 1.5
        };
    }
    // Moderate - amber/yellow
    if (count <= 5) {
        return {
            fillColor: '#d97706',  // Amber
            fillOpacity: 0.35,
            color: '#fefce8',
            weight: 1
        };
    }
    // Good coverage - teal
    if (count <= 10) {
        return {
            fillColor: '#0d9488',  // Teal
            fillOpacity: 0.35,
            color: '#f0fdfa',
            weight: 1
        };
    }
    // Excellent - emerald green
    return {
        fillColor: '#059669',  // Emerald
        fillOpacity: 0.4,
        color: '#ecfdf5',
        weight: 1.5
    };
};

// Get status label and color for legend
export const getCoverageLabel = (count: number): { label: string; color: string; bgColor: string } => {
    if (count === 0) return { label: 'Critical Gap', color: '#dc2626', bgColor: '#fef2f2' };
    if (count <= 2) return { label: 'Low Coverage', color: '#ea580c', bgColor: '#fff7ed' };
    if (count <= 5) return { label: 'Moderate', color: '#d97706', bgColor: '#fefce8' };
    if (count <= 10) return { label: 'Good', color: '#0d9488', bgColor: '#f0fdfa' };
    return { label: 'Excellent', color: '#059669', bgColor: '#ecfdf5' };
};

const CoverageLayer: React.FC<CoverageLayerProps> = ({ countyCounts, visible, onCountyClick }) => {
    const map = useMap();
    const [geoData, setGeoData] = useState<any>(null);
    const [flashState, setFlashState] = useState(false);
    const [_hoveredCounty, setHoveredCounty] = useState<string | null>(null);

    // Load GeoJSON
    useEffect(() => {
        fetch('/WA_County_Boundaries.geojson')
            .then(res => res.json())
            .then(data => setGeoData(data))
            .catch(err => console.error('Failed to load county boundaries:', err));
    }, []);

    // Pulsing animation for critical gaps
    useEffect(() => {
        if (!visible) return;

        const interval = setInterval(() => {
            setFlashState(prev => !prev);
        }, 800); // Pulse every 800ms

        return () => clearInterval(interval);
    }, [visible]);

    if (!visible || !geoData) return null;

    const onEachFeature = (feature: any, layer: L.Layer) => {
        const countyName = feature.properties?.NAME;
        const count = countyCounts[countyName] || 0;
        const { label, color } = getCoverageLabel(count);

        // Tooltip on hover
        layer.bindTooltip(
            `<div style="text-align: center; padding: 4px;">
                <strong style="font-size: 14px;">${countyName} County</strong><br/>
                <span style="color: ${color}; font-weight: bold;">${count} provider${count !== 1 ? 's' : ''}</span><br/>
                <span style="font-size: 11px; color: #666;">${label}</span>
            </div>`,
            {
                permanent: false,
                direction: 'center',
                className: 'county-tooltip'
            }
        );

        // Click handler
        layer.on({
            click: () => {
                if (onCountyClick) {
                    onCountyClick(countyName, count);
                }
                // Zoom to county
                const bounds = (layer as L.Polygon).getBounds();
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
            },
            mouseover: (e) => {
                setHoveredCounty(countyName);
                const l = e.target;
                l.setStyle({
                    weight: 3,
                    color: '#22d3ee',
                    fillOpacity: 0.7
                });
                l.bringToFront();
            },
            mouseout: (e) => {
                setHoveredCounty(null);
                const l = e.target;
                const count = countyCounts[countyName] || 0;
                l.setStyle(getCoverageStyle(count, count === 0 && flashState));
            }
        });
    };

    const style = (feature: any) => {
        const countyName = feature.properties?.NAME;
        const count = countyCounts[countyName] || 0;
        return getCoverageStyle(count, count === 0 && flashState);
    };

    return (
        <>
            <GeoJSON
                key={`coverage-${flashState}`} // Re-render on flash state change
                data={geoData}
                style={style}
                onEachFeature={onEachFeature}
            />

            {/* Floating Legend */}
            <div style={{
                position: 'absolute',
                bottom: 20,
                left: 20,
                zIndex: 1000,
                background: 'rgba(15, 23, 42, 0.95)',
                borderRadius: 8,
                padding: 12,
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}>
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold', display: 'block', mb: 1 }}>
                    Coverage Legend
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {[
                        { range: '0', label: 'Critical Gap', color: '#dc2626', flash: true },
                        { range: '1-2', label: 'Low', color: '#ea580c' },
                        { range: '3-5', label: 'Moderate', color: '#d97706' },
                        { range: '6-10', label: 'Good', color: '#0d9488' },
                        { range: '11+', label: 'Excellent', color: '#059669' },
                    ].map(item => (
                        <Box key={item.range} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{
                                width: 16,
                                height: 16,
                                borderRadius: 2,
                                bgcolor: item.color,
                                animation: item.flash ? 'pulse 1.6s infinite' : 'none',
                                '@keyframes pulse': {
                                    '0%, 100%': { opacity: 1 },
                                    '50%': { opacity: 0.4 }
                                }
                            }} />
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                {item.range} - {item.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </div>
        </>
    );
};

export default CoverageLayer;
