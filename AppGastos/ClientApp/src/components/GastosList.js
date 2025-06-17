import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const API_BASE_URL = 'https://localhost:5001/api';

const GastosList = () => {
    const [gastos, setGastos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [gastoSeleccionado, setGastoSeleccionado] = useState(null);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        monto: '',
        descripcion: '',
        fecha: '',
        categoria: ''
    });

    useEffect(() => {
        console.log('Componente montado, cargando gastos...');
        cargarGastos();
    }, []);

    const cargarGastos = async () => {
        try {
            console.log('Iniciando carga de gastos...');
            const response = await axios.get(`${API_BASE_URL}/Gastos`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Respuesta del servidor:', response.data);
            
            if (!Array.isArray(response.data)) {
                console.error('La respuesta no es un array:', response.data);
                setError('Error: Formato de datos inválido');
                return;
            }

            // Asegurarnos de que los IDs sean números y no sean 0
            const gastosConIds = response.data
                .filter(gasto => {
                    console.log('Filtrando gasto:', gasto);
                    return gasto && gasto.Id;
                })
                .map(gasto => {
                    console.log('Procesando gasto:', gasto);
                    return {
                        id: parseInt(gasto.Id, 10),
                        monto: parseFloat(gasto.Monto),
                        descripcion: gasto.Descripcion,
                        fecha: gasto.Fecha ? new Date(gasto.Fecha).toISOString() : new Date().toISOString(),
                        categoria: gasto.Categoria
                    };
                });
            
            console.log('Gastos procesados:', gastosConIds);
            setGastos(gastosConIds);
            setError(null);
        } catch (error) {
            console.error('Error al cargar los gastos:', error);
            if (error.response) {
                console.error('Datos del error:', error.response.data);
                setError(`Error al cargar los gastos: ${error.response.data}`);
            } else {
                setError('Error al cargar los gastos. Por favor, intente nuevamente.');
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        try {
            if (!formData.monto || !formData.descripcion || !formData.fecha || !formData.categoria) {
                setError('Por favor, complete todos los campos');
                return;
            }

            // Validar que el monto sea un número válido
            const monto = parseFloat(formData.monto);
            if (isNaN(monto) || monto <= 0) {
                setError('El monto debe ser un número mayor que 0');
                return;
            }

            const gastoData = {
                Id: gastoSeleccionado ? gastoSeleccionado.id : undefined,
                Monto: monto,
                Descripcion: formData.descripcion.trim(),
                Fecha: new Date(formData.fecha).toISOString(),
                Categoria: formData.categoria
            };

            console.log('Enviando datos del gasto:', gastoData);

            if (gastoSeleccionado && gastoSeleccionado.id) {
                console.log('Actualizando gasto:', gastoSeleccionado.id, gastoData);
                const response = await axios.put(`${API_BASE_URL}/Gastos/${gastoSeleccionado.id}`, gastoData, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Respuesta de actualización:', response.data);
            } else {
                console.log('Creando nuevo gasto:', gastoData);
                const response = await axios.post(`${API_BASE_URL}/Gastos`, gastoData, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Respuesta de creación:', response.data);
            }
            
            setShowModal(false);
            await cargarGastos();
            limpiarFormulario();
        } catch (error) {
            console.error('Error al guardar el gasto:', error);
            if (error.response) {
                // El servidor respondió con un código de error
                console.error('Datos del error:', error.response.data);
                console.error('Estado del error:', error.response.status);
                console.error('Headers del error:', error.response.headers);
                
                let mensajeError = 'Error al guardar el gasto: ';
                if (typeof error.response.data === 'string') {
                    mensajeError += error.response.data;
                } else if (error.response.data && error.response.data.message) {
                    mensajeError += error.response.data.message;
                } else if (error.response.data && error.response.data.title) {
                    mensajeError += error.response.data.title;
                } else {
                    mensajeError += 'Error en el servidor';
                }
                setError(mensajeError);
            } else if (error.request) {
                // La petición fue hecha pero no se recibió respuesta
                console.error('No se recibió respuesta del servidor:', error.request);
                setError('No se pudo conectar con el servidor. Por favor, intente nuevamente.');
            } else {
                // Algo ocurrió al configurar la petición
                console.error('Error en la configuración de la petición:', error.message);
                setError('Error al procesar la solicitud. Por favor, intente nuevamente.');
            }
        }
    };

    const handleEdit = (gasto) => {
        console.log('Editando gasto:', gasto);
        setGastoSeleccionado(gasto);
        setFormData({
            monto: gasto.monto.toString(),
            descripcion: gasto.descripcion,
            fecha: new Date(gasto.fecha).toISOString().split('T')[0],
            categoria: gasto.categoria
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        console.log('Intentando eliminar gasto con ID:', id);
        
        if (!id || id <= 0 || isNaN(Number(id))) {
            console.error('ID inválido:', id);
            setError('Error: ID de gasto no válido');
            return;
        }

        const idNumerico = Number(id);

        if (window.confirm('¿Está seguro de que desea eliminar este gasto?')) {
            try {
                console.log('Eliminando gasto:', idNumerico);
                await axios.delete(`${API_BASE_URL}/Gastos/${idNumerico}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                cargarGastos();
                setError(null);
            } catch (error) {
                console.error('Error al eliminar el gasto:', error);
                setError('Error al eliminar el gasto. Por favor, intente nuevamente.');
            }
        }
    };

    const limpiarFormulario = () => {
        setFormData({
            monto: '',
            descripcion: '',
            fecha: new Date().toISOString().split('T')[0],
            categoria: 'Varios'
        });
        setGastoSeleccionado(null);
    };

    return (
        <div className="container mt-4">
            <h2>Lista de Gastos</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button variant="primary" className="mb-3" onClick={() => {
                setGastoSeleccionado(null);
                limpiarFormulario();
                setShowModal(true);
            }}>
                Agregar Gasto
            </Button>

            {/* Debug info */}
            <div className="mb-3">
                <small className="text-muted">
                    Número de gastos: {gastos ? gastos.length : 0}
                </small>
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Descripción</th>
                        <th>Categoría</th>
                        <th>Monto</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {gastos && gastos.length > 0 ? (
                        gastos.map((gasto) => {
                            console.log('Renderizando gasto:', gasto);
                            if (!gasto || !gasto.id) {
                                console.log('Gasto inválido:', gasto);
                                return null;
                            }
                            return (
                                <tr key={gasto.id}>
                                    <td>{gasto.id}</td>
                                    <td>{new Date(gasto.fecha).toLocaleDateString()}</td>
                                    <td>{gasto.descripcion}</td>
                                    <td>{gasto.categoria}</td>
                                    <td>${gasto.monto.toFixed(2)}</td>
                                    <td>
                                        <Button 
                                            variant="info" 
                                            size="sm" 
                                            className="me-2" 
                                            onClick={() => handleEdit(gasto)}
                                        >
                                            Editar
                                        </Button>
                                        <Button 
                                            variant="danger" 
                                            size="sm" 
                                            onClick={() => handleDelete(gasto.id)}
                                        >
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">
                                No hay gastos registrados
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => {
                setShowModal(false);
                limpiarFormulario();
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>{gastoSeleccionado ? 'Editar Gasto' : 'Nuevo Gasto'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Monto</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                value={formData.monto}
                                onChange={(e) => setFormData({...formData, monto: e.target.value})}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.descripcion}
                                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Fecha</Form.Label>
                            <Form.Control
                                type="date"
                                value={formData.fecha}
                                onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Select
                                value={formData.categoria}
                                onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                                required
                            >
                                <option value="Varios">Varios</option>
                                <option value="Alimentación">Alimentación</option>
                                <option value="Transporte">Transporte</option>
                                <option value="Entretenimiento">Entretenimiento</option>
                                <option value="Servicios">Servicios</option>
                            </Form.Select>
                        </Form.Group>
                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" className="me-2" onClick={() => {
                                setShowModal(false);
                                limpiarFormulario();
                            }}>
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit">
                                {gastoSeleccionado ? 'Guardar Cambios' : 'Crear Gasto'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default GastosList; 