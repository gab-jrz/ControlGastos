import React from 'react';
import GastosList from './components/GastosList';

function App() {
  return (
    <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>
      <h1 className="text-center my-4" style={{ fontWeight: 'normal' }}>Control de Gastos</h1>
      <GastosList />
    </div>
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