import React from 'react';
import { Container } from 'react-bootstrap';
import GastosList from './components/GastosList';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Container>
      <h1 className="text-center my-4">Control de Gastos</h1>
      <GastosList />
    </Container>
  );
}

export default App;
