import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Venda from './paginas/Venda/Venda';
import ConsultaVendas from './paginas/Consulta/Consulta';
import Navbar from './components/NavBar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/venda" element={<Venda></Venda>} />
        <Route path="/consulta" element={<ConsultaVendas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
