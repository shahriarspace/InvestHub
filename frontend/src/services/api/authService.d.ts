import { User } from '../../types';
export interface LoginRequest {
    email: string;
    password: string;
}
export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    userRole: string;
}
export interface AuthResponse {
    token: string;
    user: User;
    expiresIn: number;
}
export declare const authService: {
    login: (credentials: LoginRequest) => Promise<AuthResponse>;
    register: (data: RegisterRequest) => Promise<AuthResponse>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<AuthResponse>;
    getCurrentUser: () => Promise<User>;
    googleLogin: (googleToken: string) => Promise<AuthResponse>;
};
