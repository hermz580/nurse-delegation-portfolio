import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, userApi } from '../services/api';
import toast from 'react-hot-toast';

// 🚧 DEV MODE: Set to true to bypass authentication for development testing.
// When true, you'll be auto-logged in as an admin. Set to false for production or to test login/logout.
const DEV_MODE = true;

// Mock user for dev mode
const MOCK_DEV_USER: User = {
    id: 'dev-user-001',
    first_name: 'Dev',
    last_name: 'Admin',
    email: 'admin@nurse-d.org',
    role: 'admin',
    license_type: 'RN',
    is_active: true,
    email_verified: true,
};

export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: 'caregiver' | 'provider' | 'admin' | 'organization_admin';
    license_type?: 'RN' | 'LPN' | 'None';
    is_active: boolean;
    email_verified: boolean;
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (data: any) => Promise<void>;
    logout: () => void;
    register: (data: any) => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(DEV_MODE ? MOCK_DEV_USER : null);
    const [isLoading, setIsLoading] = useState(DEV_MODE ? false : true);

    // Initial auth check
    useEffect(() => {
        if (!DEV_MODE) {
            checkAuth();
        }
    }, []);

    const checkAuth = async () => {
        if (DEV_MODE) {
            setUser(MOCK_DEV_USER);
            setIsLoading(false);
            return;
        }

        const token = localStorage.getItem('nurse-delegation-network_token');
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await userApi.getCurrentUser() as any;
            setUser(response.user || response.data?.user);
        } catch (error) {
            console.error('Auth check failed:', error);
            // Token might be invalid/expired and refresh failed
            localStorage.removeItem('nurse-delegation-network_token');
            localStorage.removeItem('nurse-delegation-network_refresh_token');
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (data: any) => {
        try {
            const response = await authApi.login(data);
            // Response structure is { success, message, data: { user, tokens } }
            const { user, tokens } = response.data;

            localStorage.setItem('nurse-delegation-network_token', tokens.accessToken);
            localStorage.setItem('nurse-delegation-network_refresh_token', tokens.refreshToken);
            setUser(user);
            toast.success(`Welcome back, ${user.first_name}!`);
        } catch (error: any) {
            console.error('Login error:', error);
            throw error; // Re-throw for component to handle errors
        }
    };

    const register = async (data: any) => {
        // DEV MODE: Mock successful registration
        if (DEV_MODE) {
            const mockUser: User = {
                id: 'dev-user-' + Date.now(),
                first_name: data.firstName || 'Dev',
                last_name: data.lastName || 'User',
                email: data.email || 'dev@nurse-d.org',
                role: data.role === 'provider' ? 'provider' : 'caregiver',
                license_type: data.licenseType || 'RN',
                is_active: true,
                email_verified: false,
            };
            setUser(mockUser);
            toast.success(`Welcome, ${mockUser.first_name}! Account created (DEV MODE)`);
            return;
        }

        try {
            const response = await authApi.register(data);
            // Response structure is { success, message, data: { user, tokens } }
            const { user, tokens } = response.data;

            localStorage.setItem('nurse-delegation-network_token', tokens.accessToken);
            localStorage.setItem('nurse-delegation-network_refresh_token', tokens.refreshToken);
            setUser(user);
            toast.success('Account created successfully!');
        } catch (error: any) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = () => {
        authApi.logout(); // Call API to revoke token
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoggedIn: !!user,
            isLoading,
            login,
            logout,
            register,
            checkAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
