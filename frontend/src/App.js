import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { Home }from './components/Home.js';
import GastosList from './components/GastosList';

function App() {
  return (
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gastos" element={<GastosList />} />
        </Routes>
      </Layout>
  );
}

export default App;

/*import React from 'react';
import GastosList from './components/GastosList';

function App() {
  return (
    <div className="container">
      <h1 className="text-center my-4">Control de Gastos</h1>
      <GastosList />
    </div>
  );
}

export default App;
*/