import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../api/apiClient';
import { setAuth } from '../utils/auth';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Usamos <any> aquí para adaptarnos a la estructura real de tu backend
            // sin que TypeScript se queje si no has actualizado types.ts
            const response = await authClient.post<any>('/auth/login', {
                email,
                password,
            });

            console.log("🔍 DATOS RECIBIDOS DEL BACKEND:", response.data);

            // --- CORRECCIÓN CLAVE ---
            // Tu backend devuelve: { tokens: { accessToken: "..." }, user: { ... } }
            const { tokens, user } = response.data;
            const accessToken = tokens?.accessToken;

            // 1. Validar que el token exista realmente
            if (!accessToken) {
                console.error("❌ Estructura inesperada. Se recibió:", response.data);
                throw new Error("Error interno: El servidor no devolvió el token en la ruta esperada (tokens.accessToken).");
            }

            // 2. Validar que el usuario sea SYSTEM_ADMIN
            if (user?.role !== 'SYSTEM_ADMIN') {
                setError('Acceso denegado. Solo usuarios SYSTEM_ADMIN pueden acceder a este panel.');
                setLoading(false);
                return;
            }

            // 3. Guardar token CORRECTO y rol en LocalStorage
            setAuth(accessToken, user.role);

            // 4. Redireccionar al dashboard
            navigate('/dashboard');

        } catch (err: any) {
            console.error("Error en Login:", err);
            const mensajeError = err.response?.data?.message || err.message || 'Error de autenticación. Verifica tus credenciales.';
            setError(mensajeError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 px-4">
            <div className="max-w-md w-full">
                {/* Card */}
                <div className="card animate-fade-in">
                    {/* Logo/Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
                        Panel Administrativo
                    </h1>
                    <p className="text-center text-gray-600 mb-8">
                        AutoDiag - Sistema de Gestión
                    </p>

                    {/* Error Alert */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Correo Electrónico
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                placeholder="admin@autodiag.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Iniciando sesión...
                                </span>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Solo para administradores del sistema
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}