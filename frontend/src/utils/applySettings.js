export const applyAccessibilitySettings = () => {
    const root = document.documentElement;
    const darkMode = localStorage.getItem('theme') === 'dark';
    const fontSizeBase = parseFloat(localStorage.getItem('fontSizeScale')) || 1.0;
    const colorBlindMode = localStorage.getItem('colorBlindMode') || 'normal';

    // 1. Thème
    if (darkMode) {
        root.style.setProperty('--white', '#252525');
        root.style.setProperty('--black', '#FFFBF2');
        root.style.setProperty('--bg-black', 'rgba(255, 251, 242, .2)');
    } else {
        root.style.setProperty('--white', '#FFFBF2');
        root.style.setProperty('--black', '#252525');
        root.style.setProperty('--bg-black', 'rgba(37, 37, 37, .2)');
    }

    // 2. Daltonisme
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

    // 3. Font Size
    root.style.setProperty('--font-sm', `${(1.5 * fontSizeBase)}rem`);
    root.style.setProperty('--font-md', `${(1.8 * fontSizeBase)}rem`);
    root.style.setProperty('--font-lg', `${(2.0 * fontSizeBase)}rem`);
};