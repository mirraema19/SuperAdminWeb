export interface User {
    id: string;
    email: string;
    fullName: string;
    role: 'VEHICLE_OWNER' | 'WORKSHOP_ADMIN' | 'SYSTEM_ADMIN';
    phone?: string;
}

export interface WorkshopSpecialty {
    id: string;
    workshopId: string;
    specialtyType: string;
    description: string | null;
    yearsOfExperience: number | null;
    createdAt: Date;
}

export interface Workshop {
    id: string;
    ownerId: string;
    businessName: string;
    description: string | null;
    phone: string;
    email: string | null;
    website: string | null;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude: number;
    longitude: number;
    priceRange: string;
    overallRating: number;
    totalReviews: number;
    photoUrls: string[];
    isApproved: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    specialties?: WorkshopSpecialty[];
    schedule?: WorkshopSchedule[];
}

export interface WorkshopSchedule {
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
}

export interface LoginResponse {
    // Ajustado a la estructura real de tu backend
    tokens: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    };
    user: User;
}

export interface ApiError {
    message: string;
    statusCode?: number;
}