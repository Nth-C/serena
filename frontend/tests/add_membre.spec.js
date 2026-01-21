import { test, expect } from '@playwright/test';

test.describe('Page Inviter des contacts - Mode Mock Complet', () => {

  const mockUsers = [
    { id_personne: 1, nom: "Doe", prenom: "John", username: "jdoe", invite: false },
    { id_personne: 2, nom: "Smith", prenom: "Jane", username: "jsmith", invite: true },
    { id_personne: 3, nom: "Connor", prenom: "Sarah", username: "sconnor", invite: false }
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      sessionStorage.clear();
      sessionStorage.setItem('isConnected', 'true');
      sessionStorage.setItem('id_famille', '123');
      sessionStorage.setItem('role', 'Createur');
      sessionStorage.setItem('user', JSON.stringify({ id: 999, nom: 'Robot', prenom: 'Test' }));
    });

    // 1. Définition du mock pour la liste
    await page.route('**/*route=allpersonne/view*', async (route) => {
      const postData = route.request().postDataJSON();
      
      // Simulation du filtre de recherche backend
      let responseData = mockUsers;
      if (postData && postData.texte) {
        const search = postData.texte.toLowerCase();
        responseData = mockUsers.filter(u => 
          u.nom.toLowerCase().includes(search) || 
          u.prenom.toLowerCase().includes(search)
        );
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(responseData)
      });
    });

    // 2. Navigation + Attente explicite de la réponse réseau
    // Cela empêche le test de commencer avant que les données soient chargées
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('allpersonne/view') && response.status() === 200
    );

    await page.goto('/add_contact'); // Assurez-vous que c'est la bonne URL
    await responsePromise;
  });

  test('Affichage initial et recherche de membre', async ({ page }) => {
    // On attend que le titre soit visible pour être sûr que la page est chargée
    await expect(page.getByText('Inviter des contact')).toBeVisible(); // Titre du LayoutMenu
    
    // On attend que la liste soit rendue
    await expect(page.locator('.membre_list')).toBeVisible();
    await expect(page.getByText('Doe John')).toBeVisible();

    // Test de la recherche
    // On doit attendre la nouvelle réponse après la frappe
    const searchResponsePromise = page.waitForResponse(response => 
      response.url().includes('allpersonne/view') && response.status() === 200
    );

    await page.locator('input[type="search"]').fill('Sarah');
    await searchResponsePromise;

    await expect(page.getByText('Connor Sarah')).toBeVisible();
    await expect(page.getByText('Doe John')).not.toBeVisible();
  });

  test('Envoyer une invitation (changement d icône)', async ({ page }) => {
    await page.route('**/*route=invitepersonnefamille/add*', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    // On attend que la liste soit là
    await expect(page.locator('.membre_list')).toBeVisible();

    const userRow = page.locator('.membre_list > div').filter({ hasText: 'Doe John' });
    const actionButton = userRow.locator('button');

    await expect(actionButton).toHaveClass('btn-add');
    
    await actionButton.click();

    // On attend que le bouton change d'état (loading puis success)
    await expect(actionButton).toHaveClass('btn-invited');
  });

  test('Annuler une invitation', async ({ page }) => {
    await page.route('**/*route=invitepersonnefamille/delete*', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    await expect(page.locator('.membre_list')).toBeVisible();

    const userRow = page.locator('.membre_list > div').filter({ hasText: 'Smith Jane' });
    const actionButton = userRow.locator('button');

    // Jane est déjà invitée dans le mock
    await expect(actionButton).toHaveClass('btn-invited');

    await actionButton.click();

    await expect(actionButton).toHaveClass('btn-add');
  });

});