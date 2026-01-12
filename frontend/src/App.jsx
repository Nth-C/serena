import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState } from 'react';
import './App.css'

// ... (tes imports de pages restent identiques)

// --- COMPOSANT DE PROTECTION AMÉLIORÉ ---
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
          <ProtectedRoute><Layout submenu={[/*...*/]} /></ProtectedRoute>
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