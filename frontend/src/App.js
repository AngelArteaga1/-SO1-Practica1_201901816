import './App.css';
import Calculadora from './components/Calculadora/Calculadora';
import Listado from './components/Listado/Listado';
import { BrowserRouter as Router, Routes, Route, Link, Redirect, BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <BrowserRouter>
          <Routes>
            <Route exact path='/' element={<Calculadora/>}/>
            <Route exact path='/Listado' element={<Listado/>}/>
          </Routes>
        </BrowserRouter>
    </header>
    </div>
  );
}

export default App;
