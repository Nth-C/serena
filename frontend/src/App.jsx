import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
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

const ProtectedRoute = ({ children }) => {

  const isConnected = sessionStorage.getItem('isConnected') === 'true'; 

  if (!isConnected) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const location = useLocation();
  
  // État de connexion (à mettre à jour lors du login réussi)
  const [auth, setAuth] = useState(sessionStorage.getItem('isConnected') === 'true');

  return (
    <>
      <Routes location={location} key={location.pathname}>
        {/* REDIRECTION INITIALE */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* ROUTES PUBLIQUES */}
        <Route path="login" element={<Login setAuth={setAuth} />} />
        <Route path="create_account" element={<CreateAccount />} />

        {/* ROUTES PROTÉGÉES */}
        {/* On enveloppe le Layout dans ProtectedRoute */}
        
        <Route path="acce_suivi" element={
          <ProtectedRoute><AcceSuivi /></ProtectedRoute>
        } />

        {/* ACCUEIL */}
        <Route path="home" element={
          <ProtectedRoute>
            <Layout submenu={[
                { label: "Tableau de bord", path: "home/dashboard" },
                { label: "Ma journée", path: "home/my_day" },
                { label: "Dernier rapport", path: "home/last_visit_report" },
              ]}
            />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="my_day" element={<MyDay />} />
          <Route path="last_visit_report" element={<LastVisitReport  />} />
        </Route>

        {/* AGENDA */}
        <Route path="agenda" element={
          <ProtectedRoute>
            <Layout submenu={[]} />
          </ProtectedRoute>
        }>
          <Route index element={<Agenda />} />
        </Route>

        {/* SUIVI */}
        <Route path="suivi" element= {
          <ProtectedRoute>
            <Layout submenu={[
                { label: "Rapport de visite", path: "suivi/visit_report" },
                { label: "Médicament", path: "suivi/medicine" },
              ]}/>
          </ProtectedRoute>
          }>
          <Route index element={<Navigate to="visit_report" replace />}/>
          <Route path="visit_report" element={<VisitReport />} />
          <Route path="medicine" element={<Medecine />} />
        </Route>

        {/* DOCUMENT */}
        <Route path="document" element= {
          <ProtectedRoute>
            <Layout submenu={[
                { label: "Explorateur", path: "document/explorateur" },
                { label: "Aides", path: "document/aides" },
              ]}/>
          </ProtectedRoute>
          }>
          <Route index element={<Navigate to="explorateur" replace />}/>
          <Route path="explorateur" element={<FileExplorer />} />
          <Route path="aides" element={<Assistance />} />
        </Route>

        {/* Fallback : si la route n'existe pas, retour au login ou dashboard */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}

export default App;