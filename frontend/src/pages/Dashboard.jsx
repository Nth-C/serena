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

  

  // quand la page se lance on affiche les medicaments
  useEffect(() => {
    fetchDashboard()
  }, []);

  return (
    <div className="accueil">
      <h1>Demande</h1>

      
    <h1>Alertes</h1>
    {medicaments.length === 0 ? (
        <p className="aucun">Aucune alerte</p>
      ) : (
          <>
            {medicaments.map((m) => (
            <tr key={m.id_medicament}>
              <td>{m.id_medicament}</td>
              <td>{m.nomMedicament}</td>
              <td>{m.stock}</td>
            </tr>
          ))}
          </>
      )}
    <h1>Prochaine tâches</h1>
    </div>
  )
}

export default Dashboard