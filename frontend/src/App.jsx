import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

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
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AuditLog from './pages/AuditLog';
import AddMembre from './pages/AddMembre';
import RoleMembre from './pages/RoleMembre';
import ListeMembre from './pages/ListeMembre';
import Compte from './pages/Compte';
import Notification from './pages/Notification';
import CGU from './pages/CGU';
import Privacy from './pages/Privacy';
import Accessibilite from './pages/Accessibilite';
import Signalement from './pages/Signalement';
import VerifyAccount from './pages/VerifyAccount';
import LegalMention from './pages/legalMention';
import Ocr from './pages/Ocr';
import CGUStart from './pages/CGUStart';

import { ROLES, hasPermission } from './utils/roleManager';

import { applyAccessibilitySettings } from './utils/applySettings';
import CGUNotAccept from './pages/CGUNotAccept';




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

  useEffect(() => {
        // Applique les réglages sauvegardés dès le boot de l'app
        applyAccessibilitySettings();
    }, []);

  return (
    <>
      {/* REDIRECTION / */}
      <Routes location={location} key={location.pathname}>
        <Route path="">
          {/* quand on est sur / dans l'url on redirige vers home/dashboard */}
          <Route index element={<Navigate to="CGU_start" replace />} />
        </Route>

        {/* PAGES MENU */}
        {/* uniquement accessible pour le createur de la famille */}
        {hasPermission("Famille") && (
          <>
          <Route path="logs"
            element={
            <ProtectedRoute>
              <AuditLog />
            </ProtectedRoute>
            }>
          </Route>
          <Route path="notification" 
          element={
          <ProtectedRoute requireFamily={false}>
            <Notification />
          </ProtectedRoute>}>
        </Route>

          <Route path="add_contact" 
            element={
            <ProtectedRoute>
              <AddMembre />
            </ProtectedRoute>
            }>
          </Route>

          <Route path="role_membre" 
            element={
              <ProtectedRoute>
                <RoleMembre />
              </ProtectedRoute>
            }>
          </Route>
          </>
        )}
        <Route path="liste_membre" 
          element={
          <ProtectedRoute>
            <ListeMembre />
          </ProtectedRoute>}>
        </Route>

        <Route path="compte" 
          element={
          <ProtectedRoute>
            <Compte />
          </ProtectedRoute>}>
        </Route>

        <Route path="notification" 
          element={
          <ProtectedRoute>
            <Notification />
          </ProtectedRoute>}>
        </Route>

        <Route path="cgu" 
          element={
          <ProtectedRoute>
            <CGU />
          </ProtectedRoute>
          }>
        </Route>

        <Route path="legals_mentions" 
          element={
          <ProtectedRoute>
            <LegalMention />
          </ProtectedRoute>
          }>
        </Route>

        

        <Route path="privacy" 
          element={
          <ProtectedRoute>
            <Privacy />
          </ProtectedRoute>}>
        </Route>
        
        <Route path="accessibilite" 
          element={
          <ProtectedRoute>
            <Accessibilite />
          </ProtectedRoute>}>
        </Route>

        <Route path="signalement" 
          element={
          <ProtectedRoute>
            <Signalement />
          </ProtectedRoute>}>
        </Route>

        {/* ACCEPTATION DES CGU */}
        <Route path="CGU_start" element={
          <CGUStart />
        }>
        </Route>

        {/* REFUS DES CGU */}
        <Route path="CGU_not_accept" element={
          <CGUNotAccept />
        }>
        </Route>
        
        {/* SE CONNECTER */}
        <Route path="login" element={
          <Login setAuth={setAuth} />
        }>
        </Route>
        {/* MOT DE PASSE OUBLIÉ (Demande email) */}
        <Route path="forgot_password" element={<ForgotPassword />} > </Route>

        {/* RÉINITIALISATION (Nouveau mot de passe) */}
        <Route path="reset-password" element={<ResetPassword />} > </Route>
        {/* CREER UN COMPTE */}
        <Route path="create_account" element={<CreateAccount />} > </Route>
        
        <Route path="verify-account" element={<VerifyAccount />} > </Route>
        {/* ACCE AU SUIVI DES GROUPES */}
        <Route path="acce_suivi" element={
          <ProtectedRoute requireFamily={false}>
            <AcceSuivi />
          </ProtectedRoute>
        }>
        </Route>

        {/* ACCUEIL */}
        <Route path="home" element={
          <ProtectedRoute>
            <Layout submenu={[
                { label: "Alerte", path: "home/dashboard" },
                { label: "programme du jour", path: "home/my_day" },
                { label: "Dernier nouvelles", path: "home/last_visit_report" },
              ]}
            />
          </ProtectedRoute>
        }>
          {/* quand on est sur /home dans l'url on redirige vers dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
          
          {/* routes pour les sous partie avec leurs contenu */}
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

        {/* OCR */}
        <Route path="ocr" element={
          <ProtectedRoute>
            <Layout submenu={[]} />
          </ProtectedRoute>
        }>
          <Route index element={<Ocr />} />
        </Route>

        {/* SUIVI */}
        <Route path="suivi" element= {
          <ProtectedRoute>
            <Layout submenu={[
                { label: "Notes de Visites", path: "suivi/visit_report" },
                ...(hasPermission("Proche") 
                ? [{ label: "Médicament", path: "suivi/medicine" }] 
                : [])
              ]}/>
          </ProtectedRoute>
          }>
          
          {/* quand on est sur /suivi dans l'url on redirige vers visit_report */}
          <Route index element={<Navigate to="visit_report" replace />}/>

          {/* routes pour les sous partie avec leurs contenu */}
          <Route path="visit_report" element={<VisitReport />} />
          <Route path="medicine" element={<Medecine />} />
        </Route>

        {/* DOCUMENT */}
        <Route path="document" element= {
          <ProtectedRoute>
            <Layout submenu={[
            { label: "Documents", path: "document/explorateur" },
            // On ajoute "Aides" seulement si l'utilisateur est Aidant
            ...(hasPermission("Famille") 
                ? [{ label: "Trouver des aides", path: "document/aides" }] 
                : [])
          ]}/>
          </ProtectedRoute>
          }>
          
          {/* quand on est sur /suivi dans l'url on redirige vers visit_report */}
          <Route index element={<Navigate to="explorateur" replace />}/>

          {/* routes pour les sous partie avec leurs contenu */}
          <Route path="explorateur" element={<FileExplorer />} />
          <Route path="aides" element={<Assistance />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}

export default App