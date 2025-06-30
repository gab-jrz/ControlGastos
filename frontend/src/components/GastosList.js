import React, { useEffect, useState } from 'react';
import GastoForm from './GastoForm';
import GastoItem from './GastoItem';

export default function GastosList() {
  const [gastos, setGastos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "/api/gastos"; // Usa el proxy configurado

  const fetchGastos = async () => {
    setCargando(true);
    try {
      const res = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include' // Importante para CORS
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setGastos(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar los gastos:', err);
      setError(`Error al cargar los gastos: ${err.message}`);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchGastos();
  }, []);

  const agregarGasto = async (gasto) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gasto)
    });
    if (res.ok) fetchGastos();
  };

  const actualizarGasto = async (gasto) => {
    const res = await fetch(`${API_URL}/${editando.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editando, ...gasto })
    });
    if (res.ok) {
      setEditando(null);
      fetchGastos();
    }
  };

  const eliminarGasto = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este gasto?")) return;
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (res.ok) fetchGastos();
  };

  return (
    <div className="container mt-4">
      <h2>Gestión de Gastos</h2>
      <div className="card p-3 mb-4">
        <h5>{editando ? 'Editar gasto' : 'Agregar nuevo gasto'}</h5>
        <GastoForm
          onSubmit={editando ? actualizarGasto : agregarGasto}
          initialData={editando}
          onCancel={() => setEditando(null)}
        />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {cargando ? (
        <div>Cargando...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {gastos.length === 0 ? (
                <tr><td colSpan="5">No hay gastos registrados.</td></tr>
              ) : (
                gastos.map(gasto => (
                  <GastoItem
                    key={gasto.id}
                    gasto={gasto}
                    onEdit={setEditando}
                    onDelete={eliminarGasto}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}