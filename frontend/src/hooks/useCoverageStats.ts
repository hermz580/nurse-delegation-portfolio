import { useMemo } from 'react';

interface ProviderGroup {
    id: string;
    name: string;
    displayName: string;
    counties: string[];
    locations: { county: string; lat: number; lng: number }[];
}

interface CountyInfo {
    county: string;
    count: number;
}

interface CoverageStats {
    totalProviders: number;
    countiesCovered: number;
    totalCounties: number;
    coveragePercentage: number;
    averagePerCounty: number;
    underservedCounties: CountyInfo[];  // 0-2 providers
    moderateCounties: CountyInfo[];      // 3-5 providers
    wellServedCounties: CountyInfo[];    // 6+ providers
    countyCounts: { [county: string]: number };
    criticalGaps: string[];              // 0 providers
}

// All 39 Washington State counties
const WA_COUNTIES = [
    'Adams', 'Asotin', 'Benton', 'Chelan', 'Clallam', 'Clark', 'Columbia', 'Cowlitz',
    'Douglas', 'Ferry', 'Franklin', 'Garfield', 'Grant', 'Grays Harbor', 'Island',
    'Jefferson', 'King', 'Kitsap', 'Kittitas', 'Klickitat', 'Lewis', 'Lincoln',
    'Mason', 'Okanogan', 'Pacific', 'Pend Oreille', 'Pierce', 'San Juan', 'Skagit',
    'Skamania', 'Snohomish', 'Spokane', 'Stevens', 'Thurston', 'Wahkiakum',
    'Walla Walla', 'Whatcom', 'Whitman', 'Yakima'
];

/**
 * Custom hook to calculate coverage statistics from provider data.
 * Provides analytics for identifying gaps and well-served areas.
 */
export function useCoverageStats(providers: ProviderGroup[]): CoverageStats {
    return useMemo(() => {
        // Count providers per county
        const countyCounts: { [county: string]: number } = {};

        // Initialize all counties with 0
        WA_COUNTIES.forEach(county => {
            countyCounts[county] = 0;
        });

        // Count unique providers per county (not locations)
        providers.forEach(provider => {
            const uniqueCounties = new Set(provider.counties);
            uniqueCounties.forEach(county => {
                if (countyCounts.hasOwnProperty(county)) {
                    countyCounts[county]++;
                }
            });
        });

        // Categorize counties
        const underservedCounties: CountyInfo[] = [];
        const moderateCounties: CountyInfo[] = [];
        const wellServedCounties: CountyInfo[] = [];
        const criticalGaps: string[] = [];

        Object.entries(countyCounts).forEach(([county, count]) => {
            const info = { county, count };

            if (count === 0) {
                criticalGaps.push(county);
                underservedCounties.push(info);
            } else if (count <= 2) {
                underservedCounties.push(info);
            } else if (count <= 5) {
                moderateCounties.push(info);
            } else {
                wellServedCounties.push(info);
            }
        });

        // Sort underserved by count (lowest first)
        underservedCounties.sort((a, b) => a.count - b.count);
        wellServedCounties.sort((a, b) => b.count - a.count);

        const countiesCovered = WA_COUNTIES.filter(c => countyCounts[c] > 0).length;
        const totalProvidersInCounties = Object.values(countyCounts).reduce((sum, c) => sum + c, 0);

        return {
            totalProviders: providers.length,
            countiesCovered,
            totalCounties: WA_COUNTIES.length,
            coveragePercentage: Math.round((countiesCovered / WA_COUNTIES.length) * 100),
            averagePerCounty: parseFloat((totalProvidersInCounties / WA_COUNTIES.length).toFixed(1)),
            underservedCounties,
            moderateCounties,
            wellServedCounties,
            countyCounts,
            criticalGaps
        };
    }, [providers]);
}

export { WA_COUNTIES };
export type { CoverageStats, CountyInfo };
