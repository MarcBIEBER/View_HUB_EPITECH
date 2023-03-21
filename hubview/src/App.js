import { BrowserRouter, Routes , Route } from 'react-router-dom';

import Navbar from './layouts/navbar';
import Login from './layouts/login';
import Register from './layouts/register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
