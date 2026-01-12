import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState } from 'react';
import './App.css'
import Dashboard from './pages/Dashboard';
import MyDay from './pages/MyDay'
import LastVisitReport from './pages/LastVisitReport'
import Agenda from './pages/Agenda'
import VisitReport from './pages/VisitReport'
import Medecine from './pages/Medecine'
import FileExplorer from './pages/FileExplorer'
import Assistance from './pages/Assistance'
import Login from './pages/Login'
import CreateAccount from './pages/CreateAccount';
import Layout from './Layout'
import AcceSuivi from './pages/AcceSuivi';


const ProtectedRoute = ({ children, requireFamily = true }) => {
  const isConnected = sessionStorage.getItem('isConnected') === 'true';
  const hasFamily = sessionStorage.getItem('id_famille') !== null;

  if (!isConnected) {
    return <Navigate to="/login" replace />;
  }
  if (requireFamily && !hasFamily) {
    return <Navigate to="/acce_suivi" replace />;
  }

  return children;
};

function App() {
  const location = useLocation();
  const [auth, setAuth] = useState(sessionStorage.getItem('isConnected') === 'true');

  return (
    <>
      <Routes location={location} key={location.pathname}>
        {/* ROUTES PUBLIQUES */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="login" element={<Login setAuth={setAuth} />} />
        <Route path="create_account" element={<CreateAccount />} />

        {/* ROUTE DE SÉLECTION (Connecté requis, mais pas encore de famille) */}
        <Route path="acce_suivi" element={
          <ProtectedRoute requireFamily={false}>
            <AcceSuivi />
          </ProtectedRoute>
        } />

        {/* ROUTES PROTÉGÉES (Connexion + Famille requise) */}
        <Route path="home" element={
          <Layout submenu={[
              { label: "Journal de bord", path: "home/dashboard" },
              { label: "Ma journée", path: "home/my_day" },
              { label: "Dernier rapport", path: "home/last_visit_report" },
            ]}
          />
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          {/* ... autres routes home */}
        </Route>

        {/* On applique la même logique à SUIVI, AGENDA et DOCUMENT */}
        <Route path="suivi" element={<ProtectedRoute><Layout submenu={[/*...*/]} /></ProtectedRoute>}>
            <Route index element={<Navigate to="visit_report" replace />}/>
            <Route path="visit_report" element={<VisitReport />} />
        </Route>

        <Route path="document" element={<ProtectedRoute><Layout submenu={[/*...*/]} /></ProtectedRoute>}>
            <Route index element={<Navigate to="explorateur" replace />}/>
            <Route path="explorateur" element={<FileExplorer />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}

export default App;