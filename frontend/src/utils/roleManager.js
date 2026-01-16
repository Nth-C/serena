export const ROLES = {
    CREATEUR: 'Createur',
    FAMILLE: 'Famille',
    PROCHE: 'Proche',
    PROFESSIONNELLE: 'Professionelle'
};

const ROLE_LEVELS = {
    [ROLES.PROFESSIONNELLE]: 1,
    [ROLES.PROCHE]: 2,
    [ROLES.FAMILLE]: 3,
    [ROLES.CREATEUR]: 4
};

/**
 * Vérifie automatiquement si l'utilisateur en session a les droits
 * @param {string} requiredRole - Le rôle minimal requis (ex: ROLES.FAMILLE)
 * @returns {boolean}
 */
export const hasPermission = (requiredRole) => {
    // On récupère le rôle directement ici
    const currentRole = sessionStorage.getItem('role');
    
    const currentLevel = ROLE_LEVELS[currentRole] || 0;
    const requiredLevel = ROLE_LEVELS[requiredRole] || 0;
    
    return currentLevel >= requiredLevel;
};