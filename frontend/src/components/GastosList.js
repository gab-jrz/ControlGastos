import React, { useEffect, useState } from 'react';
import GastoForm from './GastoForm';
import GastoItem from './GastoItem';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

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

  // Filtros de año, mes y categoría
  const [filtroAnio, setFiltroAnio] = useState('');
  const [filtroMes, setFiltroMes] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  // Lógica de filtrado y resumen
  const meses = [
    '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const anios = Array.from(new Set(gastos.map(g => new Date(g.fecha).getFullYear())));
  const categoriasUnicas = Array.from(new Set(gastos.map(g => g.categoria)));

  const gastosFiltrados = gastos.filter(g =>
    (!filtroAnio || new Date(g.fecha).getFullYear().toString() === filtroAnio) &&
    (!filtroMes || (new Date(g.fecha).getMonth() + 1).toString() === filtroMes) &&
    (!filtroCategoria || g.categoria === filtroCategoria)
  );

  // Resumen por categoría
  const resumenPorCategoria = categoriasUnicas.map(cat => ({
    categoria: cat,
    total: gastosFiltrados.filter(g => g.categoria === cat).reduce((acc, g) => acc + Number(g.monto), 0)
  }));
  const totalGeneral = gastosFiltrados.reduce((acc, g) => acc + Number(g.monto), 0);

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltroAnio(''); setFiltroMes(''); setFiltroCategoria('');
  };

  return (
    <div className="container-fluid p-0" style={{ minHeight: '100vh', background: 'none' }}>
      <h2 className="mb-1 mt-4 text-center" style={{ fontWeight: 'normal' }}>Control de Gastos</h2>
      <h4 className="mb-3 text-center" style={{ fontWeight: 'normal' }}>Lista de Gastos</h4>
      {/* Filtros */}
      <div className="row g-2 align-items-end mb-2 w-100" style={{ margin: 0 }}>
        <div className="col-12 col-md-2">
          <label style={{ fontSize: 14 }}>Año</label>
          <input className="form-control form-control-sm" value={filtroAnio} onChange={e => setFiltroAnio(e.target.value)} list="anios-list" />
          <datalist id="anios-list">
            {anios.map(a => <option key={a} value={a} />)}
          </datalist>
        </div>
        <div className="col-12 col-md-2">
          <label style={{ fontSize: 14 }}>Mes</label>
          <select className="form-control form-control-sm" value={filtroMes} onChange={e => setFiltroMes(e.target.value)}>
            <option value="">Todos</option>
            {meses.slice(1).map((m, i) => <option key={m} value={i+1}>{m}</option>)}
          </select>
        </div>
        <div className="col-12 col-md-3">
          <label style={{ fontSize: 14 }}>Categoría</label>
          <select className="form-control form-control-sm" value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}>
            <option value="">Todas las categorías</option>
            {categoriasUnicas.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="col-12 col-md-2">
          <button className="btn btn-secondary btn-sm w-100" style={{ height: 32 }} onClick={limpiarFiltros}>Limpiar Filtros</button>
        </div>
      </div>
      {/* Cards en fila completa */}
      <div className="row mb-2 w-100" style={{ margin: 0 }}>
        <div className="col-12 col-md-6">
          <div className="card h-100">
            <div className="card-header py-1 px-2" style={{ fontSize: 15 }}>Resumen por Categoría</div>
            <div className="card-body p-2">
              <table className="table table-sm mb-0 w-100">
                <thead>
                  <tr><th style={{ fontSize: 14 }}>Categoría</th><th style={{ fontSize: 14 }}>Total</th></tr>
                </thead>
                <tbody>
                  {resumenPorCategoria.map(rc => (
                    <tr key={rc.categoria}><td>{rc.categoria}</td><td>${rc.total.toFixed(2)}</td></tr>
                  ))}
                  <tr><th>Total General</th><th>${totalGeneral.toFixed(2)}</th></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card h-100">
            <div className="card-header py-1 px-2" style={{ fontSize: 15 }}>Información de Filtros</div>
            <div className="card-body p-2">
              <div style={{ fontSize: 14 }}><b>Período:</b> {filtroMes ? meses[parseInt(filtroMes)] : 'Todos'}/{filtroAnio || 'Todos'}</div>
              <div style={{ fontSize: 14 }}><b>Categoría:</b> {filtroCategoria || 'Todas las categorías'}</div>
              <div style={{ fontSize: 14 }}><b>Total de registros:</b> {gastosFiltrados.length}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Botón debajo de cards */}
      <div className="row mb-2 w-100" style={{ margin: 0 }}>
        <div className="col-12">
          <button className="btn btn-primary btn-sm mb-2" style={{ minWidth: 140 }} onClick={() => setEditando({})}>Agregar Nuevo Gasto</button>
          <Modal isOpen={!!editando} toggle={() => setEditando(null)} size="md" centered>
            <ModalHeader toggle={() => setEditando(null)}>
              {editando && editando.id ? 'Editar Gasto' : 'Nuevo Gasto'}
            </ModalHeader>
            <ModalBody>
              <GastoForm
                onSubmit={editando && editando.id ? actualizarGasto : agregarGasto}
                initialData={editando && editando.id ? editando : null}
                onCancel={() => setEditando(null)}
                submitLabel={editando && editando.id ? 'Guardar Cambios' : 'Crear Gasto'}
              />
            </ModalBody>
          </Modal>
        </div>
      </div>
      {/* Tabla de gastos */}
      <div className="row w-100" style={{ margin: 0 }}>
        <div className="col-12">
          {error && <div className="alert alert-danger">{error}</div>}
          {cargando ? (
            <div>Cargando...</div>
          ) : (
            <table className="table table-bordered table-sm w-100">
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
                {gastosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      <div className="alert alert-info mb-0">
                        No hay gastos registrados para los filtros seleccionados
                      </div>
                    </td>
                  </tr>
                ) : (
                  gastosFiltrados.map(gasto => (
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
          )}
        </div>
      </div>
    </div>
  );
}