import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';

function Dashboard() {
  const [medicaments, setMedicaments] = useState([])
  const [trajets, setTrajets] = useState([])
  const [taches, setTaches] = useState([])
  const [error, setError] = useState(null)

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchDashboard = async () => {
    try {
      const response = await fetch(`${apiUrl}/?route=dashboard/view`, {
        credentials: 'include'
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // On met à jour les différents états avec les données du PHP
      setMedicaments(data.medicaments || []);
      setTrajets(data.trajets || []);
      setTaches(data.taches || []);

      setError(null);
    } catch (err) {
      console.error("Erreur de récupération dashboard:", err.message);
      setError(err.message || "Impossible de contacter le serveur");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const calcProgressBar = (totalStock, currentStock) => {
    if (totalStock > 0) {
      return ((currentStock / totalStock) * 100).toFixed(0)
    }
    return 0
  }

  const getProchaineTache = () => {
    if (!taches || taches.length === 0) return null;
    // Retourne la première tâche (supposée être déjà triée par date)
    return taches[0];
  }

  return (
    <div className="accueil">
      
      {/*SECTION DEMANDE (Trajets) */}
      <div>
        <h1>Demande</h1>
        {trajets?.length === 0 ? (
          <p className="aucun">Aucune demande de trajet</p>
        ) : (
          <div className='list_alerte'>
            {trajets.map((m, i) => (
              <div key={i} className='alerte_dashbord'>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z" /></svg>
                <div>
                  <h3>Demande de Trajet</h3>
                  <p>{m.description || "Besoin d'un accompagnateur"}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" /></svg>
              </div>
            ))}
          </div>
        )}
      </div>

      {/*SECTION ALERTES (Médicaments) */}
      <div>
        <h1>Alertes</h1>
        <div className='list_alerte'>
          {medicaments.length === 0 ? (
            <p className="aucun">Aucune alerte de stock</p>
          ) : (
            medicaments.map((m, i) => (
              <div key={i} className='alerte_dashbord'>
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z" /></svg>
                  <div>
                    <h3>Médicaments</h3>
                    <p>Stock de {m.nomMedicament} faible</p>
                    <progress
                      className={
                        calcProgressBar(m.stockTotal, m.stock) < 33 ? "red_bar" :
                        calcProgressBar(m.stockTotal, m.stock) < 66 ? "pink_bar" : "blue_bar"
                      }
                      max="100"
                      value={calcProgressBar(m.stockTotal, m.stock)}
                    ></progress>
                  </div>
                </div>
                <svg className="arrow_forward" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px">
                  <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
                </svg>              
              </div>
            ))
          )}
        </div>
      </div>

      {/*SECTION PROCHAINES TÂCHES */}
      <div>
        <h1>Prochaines tâches</h1>
        <div className="list_task">
          {getProchaineTache() ? (
            <NavLink to={`/agenda`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="alerte_dashbord">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="35px" fill="white">
                    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
                  </svg>
                  <div className="tache_info">
                    <h3>{getProchaineTache().nom}</h3>
                    <p>{getProchaineTache().note || "Aucune description"}</p>
                  </div>
                </div>
                <svg className="arrow_forward" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px">
                  <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
                </svg>
              </div>
            </NavLink>
          ) : (
            <p className="aucun">Aucune tâche prévue prochainement</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard