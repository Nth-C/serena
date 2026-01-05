import { Routes, Route, Link, useLocation, Navigate, Outlet } from 'react-router-dom';
import './App.css'

import Nav from './components/nav/Nav';
import Header from './components/header/Header';

function Layout({submenu}) {
    const location = useLocation()

    const breadcrumbList = [
        // home
        { path : "/home/dashboard", breadcrumb: "Acceuil > Tableau de bord" },
        { path : "/home/my_day", breadcrumb: "Accueil > Ma Journée" },
        { path : "/home/last_visit_report", breadcrumb: "Accueil > Dernier Rapport" },
        // agenda
        { path : "/agenda", breadcrumb: "Agenda" },
        // suivi
        { path : "/suivi/visit_report", breadcrumb: "Suivi > Rapport de visite" },
        { path : "/suivi/medicine", breadcrumb: "Suivi > Médicament" },
        // document
        { path : "/document/explorateur", breadcrumb: "Document > Explorateur" },
        { path : "/document/aides", breadcrumb: "Document > Aides" }

        
    ]

    // recupere le bon file d'ariane en fonction le l'url
    const breadcrumb = () => {
        let i = 0

        while(i < breadcrumbList.length && !location.pathname.includes(breadcrumbList[i].path)) {
            i++
        }

        if(i !== breadcrumbList.length) {
            return breadcrumbList[i].breadcrumb
        }
        return ""
    }

    return (
        <>
            <Header submenu={submenu}/>
            <main>
                <Nav />
                <div className="content">
                    <p>{breadcrumb()}</p>
                    <Outlet />
                </div>
            </main>
        </>
    )
}

export default Layout