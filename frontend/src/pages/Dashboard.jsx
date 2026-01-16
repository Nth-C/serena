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

      if (data.medicaments && Array.isArray(data.medicaments)) {
        setMedicaments(data.medicaments);
        setTrajets(data.trajets);
        console.log("Médicaments chargés :", data.medicaments);
      } else {
        setMedicaments([]);
      }

      setError(null);
    } catch (err) {
      console.error("Erreur de récupération dashboard:", err.message);
      setError(err.message || "Impossible de contacter le serveur");
      setMedicaments([]);
    } finally {
      if (typeof setLoading === "function") setLoading(false);
    }
  };

  const calcProgressBar = (totalStock, currentStock) => {
    if (totalStock > 0) {
      return ((currentStock / totalStock) * 100).toFixed(0)
    }
    return 0
  }


  // quand la page se lance on affiche les medicaments
  useEffect(() => {
    fetchDashboard()
  }, []);

  return (
    <div className="accueil">
      <div>
        <h1>Demande</h1>
        {trajets.length === 0 ? (
            <p className="aucun">Aucune demande de trajet</p>
          ) : (
            <>
                {trajets.map((m) => (
                  <div className='alerte_dashbord'>
                  
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z" /></svg>


                    <div>
                      <div>
                        <h3>Demande de Trajet</h3>
                        <p>Description</p>
                      </div>
                      
                    </div>


                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" /></svg>
                  </div>
                ))}
              

            </>
          )}
      </div>
      <div>
        <h1>Alertes</h1>
        <div className='list_alerte'>
          {medicaments.length === 0 ? (
            <p className="aucun">Aucune alerte</p>
          ) : (
            <>
                {medicaments.map((m) => (
                  <div className='alerte_dashbord'>
                  
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z" /></svg>

                      <div>
                        <div>
                          <h3>Médicaments</h3>
                          <p>Stock de {m.nomMedicament} faible</p>
                        </div>
                        <progress
                          className={
                            calcProgressBar(m.stockTotal, m.stock) < 33 ? "red_bar" :
                              calcProgressBar(m.stockTotal, m.stock) < 66 ? "pink_bar" :
                                "blue_bar"
                          }
                          max="100"
                          value={calcProgressBar(m.stockTotal, m.stock)}
                        ></progress>
                      </div>
                    </div>


                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" /></svg>
                  </div>
                ))}
              

            </>
          )}
        </div>
      </div>
      <div>
        <h1>Prochaine tâches</h1>
      </div>
    </div>
  )
}

export default Dashboard