export const getToken = (): string | null => {
    return localStorage.getItem('token');
};

export const getRole = (): string | null => {
    return localStorage.getItem('role');
};

export const setAuth = (token: string, role: string): void => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
};

export const clearAuth = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
};

export const isAuthenticated = (): boolean => {
    return !!getToken();
};

export const isSystemAdmin = (): boolean => {
    return getRole() === 'SYSTEM_ADMIN';
};
