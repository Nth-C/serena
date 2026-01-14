import { useEffect, useState } from 'react'

function LastVisitReport() {
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/?route=rapport/last`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setRapports(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      {rapports.map((rapport) => (
        <div key={rapport.id_rapport}>
          
          <div>
            <h2>{rapport.nom}</h2>
            <p>{rapport.heure ? rapport.heure.substring(0, 5) : "--:--"}</p>
          </div>

          <div>
            <h3>Médicaments pris :</h3>
            {rapport.medics_details && rapport.medics_details.length > 0 ? (
              <ul>
                {rapport.medics_details.map((m, i) => (
                  <li key={i}>
                    {m.quantite} {m.nom}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucun médicament enregistré.</p>
            )}
          </div>

          <div>
            <h3>Notes :</h3>
            <p>{rapport.description}</p>
          </div>

          <hr />
        </div>
      ))}
    </div>
  )
}

export default LastVisitReport;