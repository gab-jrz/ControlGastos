import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

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
        cargarGastos();
    }, []);

    const cargarGastos = async () => {
        try {
            const response = await axios.get('/api/Gastos');
            setGastos(response.data);
            setError(null);
        } catch (error) {
            console.error('Error al cargar los gastos:', error);
            setError('Error al cargar los gastos. Por favor, intente nuevamente.');
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
            const gastoData = {
                ...formData,
                monto: parseFloat(formData.monto),
                fecha: new Date(formData.fecha).toISOString()
            };

            if (gastoSeleccionado) {
                await axios.put(`/api/Gastos/${gastoSeleccionado.id}`, gastoData);
            } else {
                await axios.post('/api/Gastos', gastoData);
            }
            
            setShowModal(false);
            cargarGastos();
            limpiarFormulario();
        } catch (error) {
            console.error('Error al guardar el gasto:', error);
            setError('Error al guardar el gasto. Por favor, verifique los datos e intente nuevamente.');
        }
    };

    const handleEdit = (gasto) => {
        setGastoSeleccionado(gasto);
        setFormData({
            monto: gasto.monto.toString(),
            descripcion: gasto.descripcion,
            fecha: gasto.fecha.split('T')[0],
            categoria: gasto.categoria
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de que desea eliminar este gasto?')) {
            try {
                await axios.delete(`/api/Gastos/${id}`);
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
            fecha: '',
            categoria: ''
        });
        setGastoSeleccionado(null);
        setError(null);
    };

    return (
        <div className="container mt-4">
            <h2>Gastos</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button variant="primary" className="mb-3" onClick={() => {
                limpiarFormulario();
                setShowModal(true);
            }}>
                Nuevo Gasto
            </Button>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Descripción</th>
                        <th>Categoría</th>
                        <th>Monto</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {gastos.map(gasto => (
                        <tr key={gasto.id}>
                            <td>{new Date(gasto.fecha).toLocaleDateString()}</td>
                            <td>{gasto.descripcion}</td>
                            <td>{gasto.categoria}</td>
                            <td>${gasto.monto.toFixed(2)}</td>
                            <td>
                                <Button variant="info" size="sm" className="me-2" onClick={() => handleEdit(gasto)}>
                                    Editar
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(gasto.id)}>
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
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
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Monto</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                name="monto"
                                value={formData.monto}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                type="text"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Fecha</Form.Label>
                            <Form.Control
                                type="date"
                                name="fecha"
                                value={formData.fecha}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Control
                                type="text"
                                name="categoria"
                                value={formData.categoria}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            {gastoSeleccionado ? 'Actualizar' : 'Guardar'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default GastosList; 