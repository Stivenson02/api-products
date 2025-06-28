'use client';

import { useEffect, useState } from 'react';

type Lead = {
  id: number;
  name: string | null;
  email: string | null;
  phone: string;
  searchTerm: string | null;
  tipoLead: string | null;
  promedio: number | null;
  createdAt: string;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const fetchLeads = async (currentPage: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchName && { name: searchName }),
        ...(searchEmail && { email: searchEmail }),
        ...(searchCategory && { searchTerm: searchCategory }),
      });

      const res = await fetch(`/api/leads?${params.toString()}`);
      const data = await res.json();
      setLeads(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };


  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchCategory, setSearchCategory] = useState('');

  useEffect(() => {
    fetchLeads(page);
  }, [page]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Leads registrados</h1>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Filtrar por nombre"
              className="border px-3 py-2 rounded"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filtrar por email"
              className="border px-3 py-2 rounded"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filtrar por categoría"
              className="border px-3 py-2 rounded"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            />
            <button
              onClick={() => fetchLeads(1)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Buscar
            </button>
          </div>

          <div className="overflow-x-auto mb-4">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Nombre</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Teléfono</th>
                  <th className="px-4 py-2 border">Categoría</th>
                  <th className="px-4 py-2 border">Promedio</th>
                  <th className="px-4 py-2 border">Tipo Lead</th>
                  <th className="px-4 py-2 border">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="px-4 py-2 border text-center">{lead.id}</td>
                    <td className="px-4 py-2 border">{lead.name || '—'}</td>
                    <td className="px-4 py-2 border">{lead.email || '—'}</td>
                    <td className="px-4 py-2 border">{lead.phone}</td>
                    <td className="px-4 py-2 border">{lead.searchTerm || '—'}</td>
                    <td className="px-4 py-2 border">${lead.promedio?.toFixed(2) || '—'}</td>
                    <td className="px-4 py-2 border">{lead.tipoLead || '—'}</td>
                    <td className="px-4 py-2 border">
                      {new Date(lead.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              ← Anterior
            </button>
            <span>Página {page} de {totalPages}</span>
            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Siguiente →
            </button>
          </div>
        </>
      )}
    </main>
  );
}
