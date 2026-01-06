import { useEffect, useState } from 'react'

function FileExplorer() {
  
  return (
    <div className="file_explorer">
      <h1>Explorateur</h1>
      <input 
              type="text" 
              value={search_text} 
              onChange={(e) => setSearchText(e.target.value)} 
              required 
      />
    </div>
  )
}

export default FileExplorer