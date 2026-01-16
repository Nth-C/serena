import { useState, useEffect } from 'react';
import LayoutMenu from '../LayoutMenu';

const Accessibilite = () => {
    const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
    const [fontSizeBase, setFontSizeBase] = useState(parseFloat(localStorage.getItem('fontSizeScale')) || 1.0);
    const [colorBlindMode, setColorBlindMode] = useState(localStorage.getItem('colorBlindMode') || 'normal');

    useEffect(() => {
        const root = document.documentElement;

        // --- 1. THEME SOMBRE / CLAIR ---
        if (darkMode) {
            root.style.setProperty('--white', '#252525');
            root.style.setProperty('--black', '#FFFBF2');
            root.style.setProperty('--bg-black', 'rgba(255, 251, 242, .2)');
        } else {
            root.style.setProperty('--white', '#FFFBF2');
            root.style.setProperty('--black', '#252525');
            root.style.setProperty('--bg-black', 'rgba(37, 37, 37, .2)');
        }

        // --- 2. MODES DALTONIENS ---
        const colorPresets = {
            normal: { blue: '#84AFFB', pink: '#FFBABA', red: '#BF443D' },
            protanopia: { blue: '#0072B2', pink: '#F0E442', red: '#D55E00' },
            deuteranopia: { blue: '#56B4E9', pink: '#CC79A7', red: '#E69F00' },
            tritanopia: { blue: '#004949', pink: '#924900', red: '#009292' } 
        };

        const colors = colorPresets[colorBlindMode];
        root.style.setProperty('--blue', colors.blue);
        root.style.setProperty('--pink', colors.pink);
        root.style.setProperty('--red', colors.red);

        // --- 3. TAILLES DE POLICE ---
        root.style.setProperty('--font-sm', `${1.5 * fontSizeBase}rem`);
        root.style.setProperty('--font-md', `${1.8 * fontSizeBase}rem`);
        root.style.setProperty('--font-lg', `${2.0 * fontSizeBase}rem`);

        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
        localStorage.setItem('fontSizeScale', fontSizeBase);
        localStorage.setItem('colorBlindMode', colorBlindMode);

    }, [darkMode, fontSizeBase, colorBlindMode]);

    return (
        <LayoutMenu title={"Accessibilité"}>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* ZONE D'APERÇU - Pour voir les changements en direct */}
                <section style={{ 
                    padding: '15px', 
                    border: '2px solid var(--gray)', 
                    borderRadius: '12px',
                    background: 'var(--white)',
                    color: 'var(--black)'
                }}>
                    <h4 style={{ marginTop: 0 }}>Aperçu en direct</h4>
                    <p style={{ fontSize: 'var(--font-sm)' }}>Ceci est un exemple de texte (Taille SM)</p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--blue)' }}></div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--red)' }}></div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--pink)' }}></div>
                    </div>
                </section>

                {/* APPARENCE */}
                <section>
                    <h3>Apparence</h3>
                    <button 
                        style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '8px', border: 'none', background: 'var(--blue)', color: 'white' }}
                        onClick={() => setDarkMode(!darkMode)}
                    >
                        Passer au mode {darkMode ? 'Clair' : 'Sombre'}
                    </button>
                </section>

                {/* TEXTE */}
                <section>
                    <h3>Taille du texte</h3>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button onClick={() => setFontSizeBase(prev => Math.max(0.7, prev - 0.1))}>A-</button>
                        <span style={{ fontWeight: 'bold' }}>{Math.round(fontSizeBase * 100)}%</span>
                        <button onClick={() => setFontSizeBase(prev => Math.min(1.6, prev + 0.1))}>A+</button>
                    </div>
                </section>

                {/* DALTONISME */}
                <section>
                    <h3>Mode daltonien</h3>
                    <select 
                        value={colorBlindMode} 
                        onChange={(e) => setColorBlindMode(e.target.value)}
                        style={{ padding: '10px', width: '100%', maxWidth: '300px', borderRadius: '8px', border: '1px solid var(--gray)' }}
                    >
                        <option value="normal">Vision normale</option>
                        <option value="protanopia">Protanopie (Déficience Rouge)</option>
                        <option value="deuteranopia">Deutéranopie (Déficience Vert)</option>
                        <option value="tritanopia">Tritanopie (Déficience Bleu)</option>
                    </select>
                </section>
            </div>
        </LayoutMenu>
    );
};

export default Accessibilite;