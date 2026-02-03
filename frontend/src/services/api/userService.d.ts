import { User, UserRole, UserStatus, PaginatedResponse } from '../../types';
export declare const userService: {
    getAllUsers: (page?: number, size?: number) => Promise<PaginatedResponse<User>>;
    getUserById: (id: string) => Promise<User>;
    getUserByEmail: (email: string) => Promise<User>;
    getUsersByRole: (role: UserRole, page?: number, size?: number) => Promise<PaginatedResponse<User>>;
    getUsersByStatus: (status: UserStatus, page?: number, size?: number) => Promise<PaginatedResponse<User>>;
    createUser: (user: Partial<User>) => Promise<User>;
    updateUser: (id: string, user: Partial<User>) => Promise<User>;
    deleteUser: (id: string) => Promise<void>;
};
