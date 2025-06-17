import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';

const API_BASE_URL = '/api';

function GastosList() {
    const [gastos, setGastos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [gastoSeleccionado, setGastoSeleccionado] = useState(null);
    const [formData, setFormData] = useState({
        monto: '',
        descripcion: '',
        fecha: '',
        categoria: ''
    });
    const [filtros, setFiltros] = useState({
        año: new Date().getFullYear().toString(),
        mes: (new Date().getMonth() + 1).toString(),
        categoria: ''
    });

    useEffect(() => {
        cargarGastos();
    }, [filtros]);

    const cargarGastos = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Iniciando carga de gastos con filtros:', filtros);
            
            const params = new URLSearchParams();
            if (filtros.año) params.append('año', filtros.año);
            if (filtros.mes) params.append('mes', filtros.mes);
            if (filtros.categoria) params.append('categoria', filtros.categoria);

            const response = await axios.get(`${API_BASE_URL}/Gastos?${params.toString()}`);
            console.log('Respuesta de la API:', response.data);

            if (!Array.isArray(response.data)) {
                console.error('La respuesta no es un array:', response.data);
                setError('Error: Formato de datos inválido');
                return;
            }

            const gastosProcesados = response.data.map(gasto => ({
                id: gasto.id || gasto.Id,
                monto: parseFloat(gasto.monto || gasto.Monto),
                descripcion: gasto.descripcion || gasto.Descripcion,
                fecha: gasto.fecha || gasto.Fecha,
                categoria: gasto.categoria || gasto.Categoria
            }));

            console.log('Gastos procesados:', gastosProcesados);
            setGastos(gastosProcesados);
        } catch (error) {
            console.error('Error al cargar gastos:', error);
            if (error.response) {
                console.error('Datos del error:', error.response.data);
                console.error('Estado del error:', error.response.status);
                setError(`Error al cargar los gastos: ${error.response.status} - ${error.response.data}`);
            } else if (error.request) {
                console.error('No se recibió respuesta:', error.request);
                setError('No se pudo conectar con el servidor. Por favor, intente nuevamente.');
            } else {
                console.error('Error:', error.message);
                setError('Error al cargar los gastos: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const limpiarFiltros = () => {
        setFiltros({
            año: new Date().getFullYear().toString(),
            mes: (new Date().getMonth() + 1).toString(),
            categoria: ''
        });
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
                Id: gastoSeleccionado ? gastoSeleccionado.id : undefined,
                Monto: parseFloat(formData.monto),
                Descripcion: formData.descripcion.trim(),
                Fecha: new Date(formData.fecha).toISOString(),
                Categoria: formData.categoria
            };

            console.log('Enviando datos:', gastoData);

            if (gastoSeleccionado) {
                const response = await axios.put(`${API_BASE_URL}/Gastos/${gastoSeleccionado.id}`, gastoData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                console.log('Respuesta de actualización:', response.data);
            } else {
                const response = await axios.post(`${API_BASE_URL}/Gastos`, gastoData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                console.log('Respuesta de creación:', response.data);
            }

            setShowModal(false);
            limpiarFormulario();
            await cargarGastos();
        } catch (error) {
            console.error('Error al guardar el gasto:', error);
            if (error.response) {
                console.error('Datos del error:', error.response.data);
                console.error('Estado del error:', error.response.status);
                setError(`Error al guardar el gasto: ${error.response.data || error.response.statusText}`);
            } else {
                setError('Error al guardar el gasto. Por favor, intente nuevamente.');
            }
        }
    };

    const handleEdit = (gasto) => {
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
        if (window.confirm('¿Está seguro de que desea eliminar este gasto?')) {
            try {
                await axios.delete(`${API_BASE_URL}/Gastos/${id}`);
                await cargarGastos();
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
            categoria: ''
        });
        setGastoSeleccionado(null);
    };

    const calcularTotales = () => {
        const totalesPorCategoria = {};
        let totalGeneral = 0;

        gastos.forEach(gasto => {
            const categoria = gasto.categoria;
            const monto = gasto.monto;

            if (!totalesPorCategoria[categoria]) {
                totalesPorCategoria[categoria] = 0;
            }
            totalesPorCategoria[categoria] += monto;
            totalGeneral += monto;
        });

        return { totalesPorCategoria, totalGeneral };
    };

    const { totalesPorCategoria, totalGeneral } = calcularTotales();

    if (loading) {
        return <div>Cargando gastos...</div>;
    }

    return (
        <div>
            <h2>Lista de Gastos</h2>
            {error && <Alert variant="danger">{error}</Alert>}

            <div className="mb-4">
                <h4>Filtros</h4>
                <Row>
                    <Col md={3}>
                        <Form.Group className="mb-3">
                            <Form.Label>Año</Form.Label>
                            <Form.Control
                                type="number"
                                name="año"
                                value={filtros.año}
                                onChange={handleFiltroChange}
                                min="2000"
                                max="2100"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group className="mb-3">
                            <Form.Label>Mes</Form.Label>
                            <Form.Select
                                name="mes"
                                value={filtros.mes}
                                onChange={handleFiltroChange}
                            >
                                <option value="">Todos los meses</option>
                                <option value="1">Enero</option>
                                <option value="2">Febrero</option>
                                <option value="3">Marzo</option>
                                <option value="4">Abril</option>
                                <option value="5">Mayo</option>
                                <option value="6">Junio</option>
                                <option value="7">Julio</option>
                                <option value="8">Agosto</option>
                                <option value="9">Septiembre</option>
                                <option value="10">Octubre</option>
                                <option value="11">Noviembre</option>
                                <option value="12">Diciembre</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group className="mb-3">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Select
                                name="categoria"
                                value={filtros.categoria}
                                onChange={handleFiltroChange}
                            >
                                <option value="">Todas las categorías</option>
                                <option value="Alimentación">Alimentación</option>
                                <option value="Transporte">Transporte</option>
                                <option value="Entretenimiento">Entretenimiento</option>
                                <option value="Servicios">Servicios</option>
                                <option value="Otros">Otros</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={3} className="d-flex align-items-end">
                        <Button 
                            variant="secondary" 
                            onClick={limpiarFiltros}
                            className="mb-3"
                        >
                            Limpiar Filtros
                        </Button>
                    </Col>
                </Row>
            </div>

            <div className="mb-4">
                <Row>
                    <Col md={6}>
                        <Card className="mb-3">
                            <Card.Header>Resumen por Categoría</Card.Header>
                            <Card.Body>
                                <Table striped bordered hover size="sm">
                                    <thead>
                                        <tr>
                                            <th>Categoría</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(totalesPorCategoria).map(([categoria, total]) => (
                                            <tr key={categoria}>
                                                <td>{categoria}</td>
                                                <td>${total.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th>Total General</th>
                                            <th>${totalGeneral.toFixed(2)}</th>
                                        </tr>
                                    </tfoot>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card>
                            <Card.Header>Información de Filtros</Card.Header>
                            <Card.Body>
                                <p><strong>Período:</strong> {
                                    filtros.mes ? 
                                    `${filtros.mes}/${filtros.año}` : 
                                    `Año ${filtros.año}`
                                }</p>
                                <p><strong>Categoría:</strong> {
                                    filtros.categoria ? 
                                    filtros.categoria : 
                                    'Todas las categorías'
                                }</p>
                                <p><strong>Total de registros:</strong> {gastos.length}</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>

            <Button 
                variant="primary" 
                className="mb-3" 
                onClick={() => {
                    limpiarFormulario();
                    setShowModal(true);
                }}
            >
                Agregar Nuevo Gasto
            </Button>

            {gastos.length === 0 ? (
                <Alert variant="info">No hay gastos registrados para los filtros seleccionados</Alert>
            ) : (
                <Table striped bordered hover>
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
                        {gastos.map(gasto => (
                            <tr key={gasto.id}>
                                <td>{gasto.descripcion}</td>
                                <td>${gasto.monto.toFixed(2)}</td>
                                <td>{new Date(gasto.fecha).toLocaleDateString()}</td>
                                <td>{gasto.categoria}</td>
                                <td>
                                    <Button 
                                        variant="warning" 
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
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colSpan="1">Total</th>
                            <th>${totalGeneral.toFixed(2)}</th>
                            <th colSpan="3"></th>
                        </tr>
                    </tfoot>
                </Table>
            )}

            <Modal show={showModal} onHide={() => {
                setShowModal(false);
                limpiarFormulario();
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {gastoSeleccionado ? 'Editar Gasto' : 'Nuevo Gasto'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Monto</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                name="monto"
                                value={formData.monto}
                                onChange={handleInputChange}
                                placeholder="Ingrese el monto"
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
                                placeholder="Ingrese la descripción"
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
                            <Form.Select
                                name="categoria"
                                value={formData.categoria}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccione una categoría</option>
                                <option value="Alimentación">Alimentación</option>
                                <option value="Transporte">Transporte</option>
                                <option value="Entretenimiento">Entretenimiento</option>
                                <option value="Servicios">Servicios</option>
                                <option value="Otros">Otros</option>
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
}

export default GastosList; 