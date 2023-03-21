import { BrowserRouter, Routes , Route } from 'react-router-dom';

import Navbar from './layouts/navbar';
import Login from './layouts/login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
