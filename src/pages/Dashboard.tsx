import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workshopClient } from '../api/apiClient';
import { clearAuth } from '../utils/auth';
import WorkshopTable from '../components/WorkshopTable';
import type { Workshop } from '../types';

type TabType = 'pending' | 'active';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<TabType>('pending');
    const [pendingWorkshops, setPendingWorkshops] = useState<Workshop[]>([]);
    const [activeWorkshops, setActiveWorkshops] = useState<Workshop[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Función auxiliar para extraer el array de la respuesta, sea cual sea la estructura
    const extractArrayFromResponse = (data: any): Workshop[] => {
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.data)) return data.data;
        if (data && Array.isArray(data.workshops)) return data.workshops;
        if (data && Array.isArray(data.items)) return data.items;
        return [];
    };

    // Cargar talleres pendientes
    const loadPendingWorkshops = async () => {
        setLoading(true);
        setError('');
        try {
            // Usamos <any> para poder inspeccionar la respuesta sin errores de TS
            const response = await workshopClient.get<any>('/admin/pending');
            
            console.log("📦 PENDIENTES RAW:", response.data); // Debug en consola

            const data = extractArrayFromResponse(response.data);
            setPendingWorkshops(data);
        } catch (err: any) {
            console.error("Error cargando pendientes:", err);
            setError(err.response?.data?.message || 'Error al cargar talleres pendientes');
        } finally {
            setLoading(false);
        }
    };

    // Cargar talleres activos
    const loadActiveWorkshops = async () => {
        setLoading(true);
        setError('');
        try {
            // NOTA: Dejamos comillas vacías '' para no duplicar la barra /workshops/
            const response = await workshopClient.get<any>(''); 
            
            console.log("📦 ACTIVOS RAW:", response.data); // Debug en consola

            const data = extractArrayFromResponse(response.data);
            
            // Filtrar solo los aprobados si es necesario, o usar todos si el backend ya filtra
            const approved = data.filter((w) => w.isApproved);
            setActiveWorkshops(approved);
        } catch (err: any) {
            console.error("Error cargando activos:", err);
            setError(err.response?.data?.message || 'Error al cargar talleres activos');
        } finally {
            setLoading(false);
        }
    };

    // Aprobar taller
    const handleApprove = async (id: string) => {
        if (!confirm('¿Estás seguro de aprobar este taller?')) return;

        try {
            await workshopClient.patch(`/${id}/approve`);
            // Recargar listas
            await Promise.all([loadPendingWorkshops(), loadActiveWorkshops()]);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error al aprobar el taller');
        }
    };

    // Rechazar taller
    const handleReject = async (id: string) => {
        if (!confirm('¿Estás seguro de rechazar este taller?')) return;

        try {
            await workshopClient.patch(`/${id}/reject`);
            // Recargar listas
            await Promise.all([loadPendingWorkshops(), loadActiveWorkshops()]);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error al rechazar el taller');
        }
    };

    // Cerrar sesión
    const handleLogout = () => {
        clearAuth();
        navigate('/login');
    };

    // Cargar datos al montar
    useEffect(() => {
        loadPendingWorkshops();
        loadActiveWorkshops();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Panel Administrativo</h1>
                            <p className="text-sm text-gray-600 mt-1">AutoDiag - Gestión de Talleres</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="card">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Talleres Pendientes</p>
                                <p className="text-2xl font-bold text-gray-900">{pendingWorkshops.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Talleres Activos</p>
                                <p className="text-2xl font-bold text-gray-900">{activeWorkshops.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {/* Tabs */}
                <div className="card">
                    <div className="border-b border-gray-200 mb-6">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'pending'
                                    ? 'border-primary-600 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Talleres Pendientes
                                {pendingWorkshops.length > 0 && (
                                    <span className="ml-2 bg-yellow-100 text-yellow-800 py-0.5 px-2.5 rounded-full text-xs font-medium">
                                        {pendingWorkshops.length}
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={() => setActiveTab('active')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'active'
                                    ? 'border-primary-600 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Talleres Activos
                                {activeWorkshops.length > 0 && (
                                    <span className="ml-2 bg-green-100 text-green-800 py-0.5 px-2.5 rounded-full text-xs font-medium">
                                        {activeWorkshops.length}
                                    </span>
                                )}
                            </button>
                        </nav>
                    </div>

                    {/* Table Content */}
                    {activeTab === 'pending' ? (
                        <WorkshopTable
                            workshops={pendingWorkshops}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            showActions={true}
                            loading={loading}
                        />
                    ) : (
                        <WorkshopTable
                            workshops={activeWorkshops}
                            showActions={false}
                            loading={loading}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}