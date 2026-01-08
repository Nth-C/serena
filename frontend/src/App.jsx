import { Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react'; // <--- INDISPENSABLE
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

function App() {
  const location = useLocation();
  const navigate = useNavigate(); // Pour pouvoir rediriger

  // ---------------------------------------------------------
  // 1. DÉFINITION DE LA VARIABLE USER (C'est ça qui manquait !)
  // ---------------------------------------------------------
  const [user, setUser] = useState(() => {
    // Au démarrage, on regarde si une info est déjà stockée
    const savedUser = localStorage.getItem('app_user');
    // Attention : si 'app_user' contient un JSON (objet), il faut le parser, 
    // sinon si c'est juste du texte, on le prend tel quel.
    try {
      return JSON.parse(savedUser);
    } catch (e) {
      return savedUser;
    }
  });

  // Fonction appelée par Login.jsx quand la connexion réussit
  const handleLogin = (userData) => {
    setUser(userData);
    // On sauvegarde en format texte (ou JSON si c'est un objet)
    localStorage.setItem('app_user', JSON.stringify(userData));
    navigate('/acce_suivi'); // Redirection vers le choix du groupe
  };

  // Fonction pour se déconnecter (optionnel, pour le bouton dans Dashboard)
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('app_user');
    navigate('/login');
  };
  // ---------------------------------------------------------

  return (
    <>
      <Routes location={location} key={location.pathname}>
        <Route path="">
          {/* Si on est connecté, on va au dashboard (ou acce_suivi), sinon login */}
          <Route index element={<Navigate to={user ? "home/dashboard" : "login"} replace />} />
        </Route>
        
        {/* SE CONNECTER */}
        <Route path="login" element={
          /* 👇 IMPORTANT : On passe la fonction au composant Login */
          <Login onLogin={handleLogin} />
        }>
        </Route>

        {/* CREER UN COMPTE */}
        <Route path="create_account" element={
          <CreateAccount />
        }>
        </Route>

        {/* ACCES AU SUIVI DES GROUPES */}
        <Route path="acce_suivi" element={
          <AcceSuivi user={user} />
        }>
        </Route>

        {/* ACCUEIL */}
        <Route path="home" element={
          <Layout submenu={[
              { label: "Tableau de bord", path: "home/dashboard" },
              { label: "Ma journée", path: "home/my_day" },
              { label: "Dernier rapport", path: "home/last_visit_report" },
            ]}
          />
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          
          {/* 👇 C'est ici que 'user' est utilisé et causait l'erreur avant */}
          <Route path="dashboard" element={
            <Dashboard user={user} onLogout={handleLogout} />
          } />

          <Route path="my_day" element={<MyDay />} />
          <Route path="last_visit_report" element={<LastVisitReport  />} />
        </Route>

        {/* AGENDA */}
        <Route path="agenda" element={<Layout submenu={[]} />}>
          <Route index element={<Agenda />} />
        </Route>

        {/* SUIVI */}
        <Route path="suivi" element= {
          <Layout submenu={[
              { label: "Rapport de visite", path: "suivi/visit_report" },
              { label: "Médicament", path: "suivi/medicine" },
            ]}/>
          }>
          
          <Route index element={<Navigate to="visit_report" replace />}/>

          <Route path="visit_report" element={<VisitReport />} />
          <Route path="medicine" element={<Medecine />} />
        </Route>

        {/* DOCUMENT */}
        <Route path="document" element= {
          <Layout submenu={[
              { label: "Explorateur", path: "document/explorateur" },
              { label: "Aides", path: "document/aides" },
            ]}/>
          }>
          
          <Route index element={<Navigate to="explorateur" replace />}/>

          <Route path="explorateur" element={<FileExplorer />} />
          <Route path="aides" element={<Assistance />} />
        </Route>
      </Routes>
    </>
  )
}

export default App