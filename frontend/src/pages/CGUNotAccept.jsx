import { useEffect, useState, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';

function CGUNotAccept() {

    return (
        <div className='CGU_not_accept'>
            <img src="/img/logo-name.png" alt="Logo" />
            <div>
                <h1>Merci de votre visite !</h1>
                <p>Nous comprenons que vous soyez réticent. Serena traite des données de santé sensibles, l'acceptation des CGU est indispensable pour garantir la protection de vos données et le respect du RGPD.</p>
                <NavLink to="/CGU_start">
                    <button className='btn_blue'>Réessayer</button>
                </NavLink>
            </div>
        </div>
    );
}

export default CGUNotAccept;