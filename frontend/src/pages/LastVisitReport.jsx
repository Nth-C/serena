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


  return (
    <div className="last_report">
      {rapports.map((rapport) => (
        <div key={rapport.id_rapport}>

          <div>
            <div>
              <h2>{rapport.nom}</h2>
              <p>{rapport.heure ? rapport.heure.substring(0, 5) : "--:--"}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M280-280h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm-80 480q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>
          </div>

          <div className='info_report'>
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
          </div>

          <hr />
        </div>
      ))}
    </div>
  )
}

export default LastVisitReport;