import React, { useState, useEffect } from 'react';

const categorias = [
  'Alimentación',
  'Transporte',
  'Vivienda',
  'Entretenimiento',
  'Salud',
  'Otros'
];

export default function GastoForm({ onSubmit, initialData, onCancel }) {
  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');
  const [categoria, setCategoria] = useState('');

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre || '');
      setMonto(initialData.monto || '');
      setFecha(initialData.fecha ? initialData.fecha.slice(0, 10) : '');
      setCategoria(initialData.categoria || '');
    } else {
      setNombre(''); setMonto(''); setFecha(''); setCategoria('');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !monto || !fecha || !categoria) return;
    onSubmit({ nombre, monto: parseFloat(monto), fecha, categoria });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="form-group mb-2">
        <label>Nombre</label>
        <input className="form-control" value={nombre} onChange={e => setNombre(e.target.value)} required />
      </div>
      <div className="form-group mb-2">
        <label>Monto</label>
        <input type="number" className="form-control" value={monto} onChange={e => setMonto(e.target.value)} required min="0" step="0.01" />
      </div>
      <div className="form-group mb-2">
        <label>Fecha</label>
        <input type="date" className="form-control" value={fecha} onChange={e => setFecha(e.target.value)} required />
      </div>
      <div className="form-group mb-2">
        <label>Categoría</label>
        <select className="form-control" value={categoria} onChange={e => setCategoria(e.target.value)} required>
          <option value="">Selecciona una categoría</option>
          {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      <div className="d-flex gap-2 mt-2">
        <button type="submit" className="btn btn-primary">{initialData ? 'Guardar cambios' : 'Agregar gasto'}</button>
        {onCancel && <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>}
      </div>
    </form>
  );
} 