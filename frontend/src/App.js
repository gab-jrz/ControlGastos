import React from 'react';
import GastosList from './components/GastosList';
import NavMenu from './components/NavMenu';

function App() {
  return (
    <>
      <NavMenu />
      <div className="container">
        <h1 className="text-center my-4">Control de Gastos</h1>
        <GastosList />
      </div>
    </>
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