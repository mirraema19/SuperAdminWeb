import type { Workshop } from '../types';

interface WorkshopTableProps {
    workshops: Workshop[];
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
    showActions?: boolean;
    loading?: boolean;
}

export default function WorkshopTable({
    workshops,
    onApprove,
    onReject,
    showActions = false,
    loading = false,
}: WorkshopTableProps) {
    
    // --- PROTECCIÓN CONTRA PANTALLA BLANCA ---
    // Si 'workshops' llega como undefined, null o un objeto, lo forzamos a ser un array vacío.
    const safeWorkshops = Array.isArray(workshops) ? workshops : [];
    
    if (!Array.isArray(workshops)) {
        console.warn("⚠️ WorkshopTable recibió datos inválidos (no es un array). Se usará lista vacía.", workshops);
    }
    // -----------------------------------------

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <svg className="animate-spin h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    if (safeWorkshops.length === 0) {
        return (
            <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay talleres</h3>
                <p className="mt-1 text-sm text-gray-500">
                    {showActions ? 'No hay talleres pendientes de aprobación.' : 'No hay talleres activos.'}
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Dirección
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Teléfono
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Especialidades
                        </th>
                        {showActions && (
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {safeWorkshops.map((workshop) => (
                        <tr key={workshop.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{workshop.name}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">{workshop.address}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{workshop.phone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{workshop.email || '-'}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1">
                                    {workshop.specialties && workshop.specialties.length > 0 ? (
                                        workshop.specialties.map((specialty, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                                            >
                                                {specialty}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm text-gray-500">-</span>
                                    )}
                                </div>
                            </td>
                            {showActions && (
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => onApprove?.(workshop.id)}
                                            className="btn-success text-sm py-1 px-3"
                                        >
                                            Aprobar
                                        </button>
                                        <button
                                            onClick={() => onReject?.(workshop.id)}
                                            className="btn-danger text-sm py-1 px-3"
                                        >
                                            Rechazar
                                        </button>
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}