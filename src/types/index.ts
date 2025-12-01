export interface User {
    id: string;
    email: string;
    fullName: string;
    role: 'VEHICLE_OWNER' | 'WORKSHOP_ADMIN' | 'SYSTEM_ADMIN';
    phone?: string;
}

export interface Workshop {
    id: string;
    name: string;
    description?: string;
    address: string;
    phone: string;
    email?: string;
    latitude?: number;
    longitude?: number;
    isApproved: boolean;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
    specialties?: string[];
    schedule?: WorkshopSchedule[];
}

export interface WorkshopSchedule {
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
}

export interface LoginResponse {
    access_token: string;
    user: User;
}

export interface ApiError {
    message: string;
    statusCode?: number;
}
