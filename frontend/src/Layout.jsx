import { useLocation, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';

import './App.css'

import Nav from './components/nav/Nav';
import Header from './components/header/Header';

import Menu from './components/menu/Menu';

function Layout({submenu}) {
    const location = useLocation()

    const [isMenuOpen , setIsMenuOpen] = useState(false)

    const breadcrumbList = [
        // home
        { path : "/home/dashboard", breadcrumb: "Accueil > Journal de bord" },
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

    // fonction pour ouvrir/fermer le menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    useEffect(() => {
        if (isMenuOpen) {
            document.documentElement.classList.add('menu-active');
        } else {
            document.documentElement.classList.remove('menu-active');
        }
    }, [isMenuOpen]);

    return (
        <>
            <Header submenu={submenu} onHamburgerClick={toggleMenu} /> {/*  on passe la focntion toggleMenu pour pouvoir l'utiliser dans le header */}
            <Menu isOpen={isMenuOpen} onHamburgerClick={toggleMenu}/>
            <main>
                <Nav />
                <div className="content">
                    <p className="breadcrumb">{breadcrumb()}</p>
                    <Outlet />
                </div>
            </main>
        </>
    )
}

export default Layout