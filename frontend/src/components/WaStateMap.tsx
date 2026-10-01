import React, { useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { Box, Typography, Paper, Tooltip as MuiTooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Using a publicly available TopoJSON for US Counties
const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";

// Mock Data for WA Counties (FIPS starting with 53)
const MOCK_DATA: { [key: string]: { name: string; value: number; compliance: number } } = {
    "53033": { name: "King", value: 12500, compliance: 98 }, // Seattle
    "53053": { name: "Pierce", value: 4200, compliance: 96 }, // Tacoma
    "53061": { name: "Snohomish", value: 3800, compliance: 97 }, // Everett
    "53063": { name: "Spokane", value: 3100, compliance: 94 },
    "53011": { name: "Clark", value: 2500, compliance: 95 },
    "53067": { name: "Thurston", value: 1800, compliance: 96 },
    "53035": { name: "Kitsap", value: 1200, compliance: 93 },
    "53077": { name: "Yakima", value: 1500, compliance: 91 },
    "53073": { name: "Whatcom", value: 1100, compliance: 95 },
};

const WaStateMap = () => {
    const theme = useTheme();
    const [tooltipContent, setTooltipContent] = useState<string | null>(null);
    const [hoveredCounty, setHoveredCounty] = useState<any | null>(null);

    // Color Scale
    const colorScale = (scaleLinear as any)()
        .domain([0, 13000])
        .range(["#CFFAFE", "#0F766E"]); // Cyan-50 to Teal-700

    // Filter for Washington State (State Code '53')
    const isWashington = (geo: any) => geo.id.startsWith('53');

    return (
        <Box sx={{ position: 'relative', width: '100%', height: 600, bgcolor: '#0f172a', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>

            {/* Map Header Overlay */}
            <Box sx={{ position: 'absolute', top: 30, left: 30, zIndex: 10 }}>
                <Typography variant="h5" color="white" fontWeight="bold">WA State Live Delegation Data</Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.6)">Real-time active nurse distribution</Typography>

                {hoveredCounty && (
                    <Paper sx={{ mt: 2, p: 2, bgcolor: 'rgba(255,255,255,0.95)', minWidth: 200, backdropFilter: 'blur(10px)' }}>
                        <Typography variant="h6" color="primary.main" fontWeight="bold">{hoveredCounty.name} County</Typography>
                        <Box sx={{ mt: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Active Delegates:</Typography>
                                <Typography variant="body2" fontWeight="bold">{(hoveredCounty.value || 150).toLocaleString()}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">Compliance:</Typography>
                                <Typography variant="body2" fontWeight="bold" color="success.main">{hoveredCounty.compliance || 92}%</Typography>
                            </Box>
                        </Box>
                    </Paper>
                )}
            </Box>

            {/* Legend */}
            <Box sx={{ position: 'absolute', bottom: 30, right: 30, zIndex: 10, bgcolor: 'rgba(0,0,0,0.5)', p: 2, borderRadius: 2 }}>
                <Typography variant="caption" color="white" sx={{ display: 'block', mb: 1 }}>Delegation Density</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, bgcolor: '#CFFAFE' }} />
                    <Typography variant="caption" color="rgba(255,255,255,0.7)">Low</Typography>
                    <Box sx={{ width: 60, height: 4, background: 'linear-gradient(to right, #CFFAFE, #0F766E)' }} />
                    <Typography variant="caption" color="rgba(255,255,255,0.7)">High</Typography>
                    <Box sx={{ width: 10, height: 10, bgcolor: '#0F766E' }} />
                </Box>
            </Box>

            <ComposableMap
                projection="geoAlbersUsa"
                projectionConfig={{ scale: 3500 }} // Zoomed in scale
                width={800}
                height={500}
                style={{ width: '100%', height: '100%' }}
            >
                {/* Focusing on WA state coordinates (roughly) */}
                <ZoomableGroup center={[-120.5, 47.3]} zoom={1} minZoom={1} maxZoom={5}>
                    <Geographies geography={GEO_URL}>
                        {({ geographies }: { geographies: any[] }) =>
                            geographies
                                .filter(isWashington)
                                .map((geo: any) => {
                                    const countyData = MOCK_DATA[geo.id as string] || { name: geo.properties.name, value: Math.random() * 500, compliance: 90 + Math.floor(Math.random() * 9) };

                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill={colorScale(countyData.value)}
                                            stroke="#1e293b" // Dark Slate boundary
                                            strokeWidth={0.5}
                                            style={{
                                                default: { outline: "none", transition: "all 0.3s" },
                                                hover: { fill: "#F43F5E", outline: "none", stroke: "#fff", strokeWidth: 1, cursor: 'pointer' }, // Rose on hover
                                                pressed: { fill: "#E2E8F0", outline: "none" },
                                            }}
                                            onMouseEnter={() => {
                                                setHoveredCounty(countyData);
                                            }}
                                            onMouseLeave={() => {
                                                setHoveredCounty(null);
                                            }}
                                        />
                                    );
                                })
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>
        </Box>
    );
};

export default WaStateMap;
