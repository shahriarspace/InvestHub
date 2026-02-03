import { Startup, StartupStatus, PaginatedResponse } from '../../types';
export declare const startupService: {
    getAllStartups: (page?: number, size?: number) => Promise<PaginatedResponse<Startup>>;
    getStartupById: (id: string) => Promise<Startup>;
    getStartupsByUserId: (userId: string, page?: number, size?: number) => Promise<PaginatedResponse<Startup>>;
    getStartupsByStatus: (status: StartupStatus, page?: number, size?: number) => Promise<PaginatedResponse<Startup>>;
    createStartup: (startup: Partial<Startup>) => Promise<Startup>;
    updateStartup: (id: string, startup: Partial<Startup>) => Promise<Startup>;
    deleteStartup: (id: string) => Promise<void>;
};
