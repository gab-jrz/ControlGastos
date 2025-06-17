import React from 'react';

export default function GastoItem({ gasto, onEdit, onDelete }) {
  return (
    <tr>
      <td>{gasto.descripcion}</td>
      <td>${gasto.monto.toFixed(2)}</td>
      <td>{gasto.fecha.slice(0, 10)}</td>
      <td>{gasto.categoria}</td>
      <td>
        <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(gasto)}>Editar</button>
        <button className="btn btn-sm btn-danger" onClick={() => onDelete(gasto.id)}>Eliminar</button>
      </td>
    </tr>
  );
} 