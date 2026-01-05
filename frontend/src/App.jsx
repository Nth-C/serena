import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import './App.css'

import Dashboard from './pages/Dashboard';
import MyDay from './pages/MyDay'
import LastVisitReport from './pages/LastVisitReport'
import Agenda from './pages/Agenda'
import VisitReport from './pages/VisitReport'
import Medecine from './pages/Medecine'
import FileExplorer from './pages/FileExplorer'
import Assistance from './pages/Assistance'

import Layout from './Layout'

function App() {
  const location = useLocation();

  return (
    <>
      {/* REDIRECTION / */}
      <Routes location={location} key={location.pathname}>
        <Route path="">
          {/* quand on est sur / dans l'url on redirige vers home/dashboard */}
          <Route index element={<Navigate to="home/dashboard" replace />} />
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
          {/* quand on est sur /home dans l'url on redirige vers dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
          
          {/* routes pour les sous partie avec leurs contenu */}
          <Route path="dashboard" element={<Dashboard />} />
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
          
          {/* quand on est sur /suivi dans l'url on redirige vers visit_report */}
          <Route index element={<Navigate to="visit_report" replace />}/>

          {/* routes pour les sous partie avec leurs contenu */}
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
          
          {/* quand on est sur /suivi dans l'url on redirige vers visit_report */}
          <Route index element={<Navigate to="explorateur" replace />}/>

          {/* routes pour les sous partie avec leurs contenu */}
          <Route path="explorateur" element={<FileExplorer />} />
          <Route path="aides" element={<Assistance />} />
        </Route>
      </Routes>
    </>
  )
}

export default App