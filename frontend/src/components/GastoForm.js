import React, { useState, useEffect } from 'react';

const categorias = [ //Lista de categorias
  'Alimentación',
  'Transporte',
  'Vivienda',
  'Entretenimiento',
  'Salud',
  'Otros'
];

export default function GastoForm({ onSubmit, initialData, onCancel, submitLabel }) {  //Funcion para agregar gastos
  const [descripcion, setDescripcion] = useState(''); //Estado de la descripcion
  const [monto, setMonto] = useState(''); //Estado del monto
  const [fecha, setFecha] = useState(''); //Estado de la fecha
  const [categoria, setCategoria] = useState(''); //Estado de la categoria

  useEffect(() => { //Funcion para editar gastos
    if (initialData && typeof initialData === 'object') {
      setDescripcion(initialData.descripcion || '');
      setMonto(initialData.monto?.toString() || '');
      setFecha(initialData.fecha ? new Date(initialData.fecha).toISOString().split('T')[0] : '');
      setCategoria(initialData.categoria || '');
    } else {
      setDescripcion('');
      setMonto('');
      setFecha('');
      setCategoria('');
    }//Reinicia los estados
  }, [initialData]); //Reinicia los estados

  const handleSubmit = (e) => { //Funcion para agregar gastos
    e.preventDefault();
    if (!descripcion.trim() || !monto || !fecha || !categoria) {
      console.error('Por favor complete todos los campos requeridos');
      return;
    }
    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      console.error('El monto debe ser un número mayor a 0');
      return;
    }
    onSubmit({ 
      descripcion: descripcion.trim(), 
      monto: montoNum, 
      fecha, 
      categoria 
    });
  };//Envia los datos al componente padre

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="form-group mb-2">
        <label>Descripción</label>
        <input className="form-control" value={descripcion} onChange={e => setDescripcion(e.target.value)} required />
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
        <button type="submit" className="btn btn-primary">{submitLabel || (initialData ? 'Guardar cambios' : 'Agregar gasto')}</button>
        {onCancel && <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>}
      </div>
    </form>
  );
}
