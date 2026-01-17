import { useEffect, useState } from 'react'

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

  return (
    <div className="accueil">
      
      {/* 1. SECTION DEMANDE (Trajets) */}
      <div>
        <h1>Demande</h1>
        {trajets.length === 0 ? (
          <p className="aucun">Aucune demande de trajet</p>
        ) : (
          trajets.map((t, i) => (
            <div key={i} className='alerte_dashbord'>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z" /></svg>
              <div>
                <h3>Demande de Trajet</h3>
                <p>{t.description || "Description du trajet"}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" /></svg>
            </div>
          ))
        )}
      </div>

      {/* 2. SECTION ALERTES (Médicaments) */}
      <div>
        <h1>Alertes</h1>
        <div className='list_alerte'>
          {medicaments.length === 0 ? (
            <p className="aucun">Aucune alerte de stock</p>
          ) : (
            medicaments.map((m, i) => (
              <div key={i} className='alerte_dashbord'>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z" /></svg>
                  <div style={{ flex: 1 }}>
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
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" /></svg>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. SECTION PROCHAINES TÂCHES (Le style de ton image) */}
      <div>
        <h1>Prochaines tâches</h1>
        <div className="list_alerte">
          {taches && taches.length > 0 ? (
            taches.map((tache, index) => (
              <div key={index} className="alerte_dashbord agenda_card">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  
                  {/* Carré bleu avec l'icône check blanche */}
                  <div className="icon_container_agenda">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="35px" fill="white">
                      {/* C'est ce "path" qui dessine la coche de validation (Check) */}
                      <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
                    </svg>
                  </div>

                  {/* Textes (Nom et Note) */}
                  <div className="tache_info">
                    <h3>{tache.nom}</h3>
                    <p>{tache.note || "Aucune description"}</p>
                  </div>
                </div>

                {/* Flèche bleue à droite */}
                <svg className="arrow_forward" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px">
                  <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
                </svg>
              </div>
            ))
          ) : (
            <p className="aucun">Aucune tâche prévue prochainement</p>
          )}
        </div>
      </div>

    </div>
  )
}

export default Dashboard