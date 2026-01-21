import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { getFormatDate, getFormatTime } from '../utils/timeFormat';
import Slide from '../components/slide/Slide';

function Dashboard() {
  // données
  const [medicaments, setMedicaments] = useState([])
  const [trajets, setTrajets] = useState([])
  const [taches, setTaches] = useState([])

  // trajet
  const [isTrajetOpen, setIsTrajetOpen] = useState(false)
  const [selectedTrajet, setSelectedTrajet] = useState(null);

  // loading fetch
  const [loading, setLoading] = useState({
    medicaments: true,
    trajets: true,
    taches: true
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  /**
   * recupère toutes les données du dashboard
   * (demande de trajets / alertes / prochaine tâche)
   */
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

    } catch (err) {
      console.error("Erreur de récupération dashboard:", err.message);
    } finally {
      setLoading({
        medicaments: false,
        trajets: false,
        taches: false
      });
    }
  };

  /**
   * une personne est accossier a un trajet
   * @param {*} id id du trajet
   */
  const accepterDemandeTrajet = async (id) => {
    try {
      const payload = {
          id_trajet: id 
      };

      const response = await fetch(`${apiUrl}/?route=trajet/accepter`, {
        credentials: 'include',
        body: JSON.stringify(payload),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }
      if (data.success) {
        fetchDashboard();
        setIsTrajetOpen(false);
      }
      
    } catch (err) {
      console.error("Erreur de récupération dashboard:", err.message);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [apiUrl]);

  /**
   * calcule le pourcentage dans un stock
   * @param {int} totalStock 
   * @param {int} currentStock 
   * @returns le poucentage restant
   */
  const calcProgressBar = (totalStock, currentStock) => {
    if (totalStock > 0) {
      return ((currentStock / totalStock) * 100).toFixed(0)
    }
    return 0
  }

  /**
   * Retourne la première tâche
   * @returns 
   */
  const getProchaineTache = () => {
    if (!taches || taches.length === 0) return null;
    return taches[0];
  }

  return (
    <>
    <div className="accueil">
      {/*SECTION DEMANDE (Trajets) */}
      <div>
        <h1>Demande</h1>
        {loading.trajets ? (
          <p>Chargement des demandes de trajet...</p>
        ) : trajets.length === 0 ? (
          <p className="aucun">Aucune demande de trajet.</p>
        ) : (
          <div className='list_trajet'>
            {trajets.map((m, i) => (
              <div key={i} className='alerte_dashbord' onClick={() => {setIsTrajetOpen(true); setSelectedTrajet(m)}}>
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#252525"><path d="m480-80-10-120h-10q-142 0-241-99t-99-241q0-142 99-241t241-99q71 0 132.5 26.5t108 73q46.5 46.5 73 108T800-540q0 75-24.5 144t-67 128q-42.5 59-101 107T480-80Zm80-146q71-60 115.5-140.5T720-540q0-109-75.5-184.5T460-800q-109 0-184.5 75.5T200-540q0 109 75.5 184.5T460-280h100v54Zm-101-95q17 0 29-12t12-29q0-17-12-29t-29-12q-17 0-29 12t-12 29q0 17 12 29t29 12Zm-29-127h60q0-30 6-42t38-44q18-18 30-39t12-45q0-51-34.5-76.5T460-720q-44 0-74 24.5T344-636l56 22q5-17 19-33.5t41-16.5q27 0 40.5 15t13.5 33q0 17-10 30.5T480-558q-35 30-42.5 47.5T430-448Zm30-65Z"/></svg>
                  <div>
                    <h3>Demande de Trajet</h3>
                    <p>{m.description || "Besoin d'un accompagnateur"}</p>
                  </div>
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
        {loading.medicaments ? (
          <p>Chargement des médicaments...</p>
        ) : medicaments.length === 0 ? (
          <p className="aucun">Aucune alerte de stock.</p>
        ) : (
          <div className='list_alerte'>
          {medicaments.map((m, i) => (
            <NavLink key={i} to={`/suivi/medicine`}>
            <div className='alerte_dashbord'>
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
            </NavLink>
          ))}
          </div>
        )}
      </div>

      {/*SECTION PROCHAINES TÂCHES */}
      <div>
        <h1>Prochaines tâches</h1>
        {loading.taches ? (
          <p>Chargement de la Prochaine tâche...</p>
        ) : !getProchaineTache() ? (
          <p className="aucun">Aucune tâche prévue prochainement.</p>
        ) : (
        <div className="list_task">
          <NavLink to={`/agenda`}>
            <div className="alerte_dashbord">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="35px">
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
        </div>
        )}
      </div>
    </div>
    
    <Slide
      title={"Détails du Trajet"}
      isOpen={isTrajetOpen}
      toggleOpen={() => setIsTrajetOpen(false)}
    >
      {selectedTrajet && (
        <div className="details_trajet">
          <div>
            <p><strong>Départ :</strong> {selectedTrajet.lieu_dep}</p>
            <p><strong>Arrivée :</strong> {selectedTrajet.lieu_arr}</p>
          </div>
          
          <div>
            <p><strong>Date prévue :</strong> {getFormatDate(new Date(selectedTrajet.date_deb))} {getFormatTime(new Date(selectedTrajet.date_deb))}</p>
          </div>

          <div className="actions">
            <button className="btn_blue" onClick={() => accepterDemandeTrajet(selectedTrajet.id_trajet)}>Accepter le trajet</button>
          </div>
        </div>
      )}
    </Slide>
    </>
  );
}

export default Dashboard