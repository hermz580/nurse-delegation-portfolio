import { Box } from '@mui/material';
import InteractiveMapSection from '../components/InteractiveMapSection';

/**
 * MapPage - Dedicated full-screen map page
 * Requires login (protected route)
 */
export default function MapPage() {
    return (
        <Box
            sx={{
                height: 'calc(100vh - 64px)', // Account for navbar
                width: '100%',
                overflow: 'hidden'
            }}
        >
            <InteractiveMapSection />
        </Box>
    );
}
