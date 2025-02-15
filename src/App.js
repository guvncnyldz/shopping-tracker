import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './routes/unprotected/Login';
import MainPage from './routes/MainPage'

import ProtectedRoute from './routes/ProtectedRoute';
function App() {
  return (<>
    <BrowserRouter>
      <div className='h-full w-screen bg-gray-100'>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainPage />} />
          </Route>
        </Routes>
      </div>

    </BrowserRouter>
  </>
  );
}

export default App;
