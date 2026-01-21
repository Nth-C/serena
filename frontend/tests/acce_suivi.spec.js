import { test, expect } from '@playwright/test';

test.describe('Page Accès Suivi - Mode Mock Complet', () => {

  test.beforeEach(async ({ page }) => {
    // 1. SESSION STORAGE (On simule un utilisateur connecté)
    await page.goto('/');
    await page.evaluate(() => {
      sessionStorage.clear();
      sessionStorage.setItem('isConnected', 'true');
      sessionStorage.setItem('user', JSON.stringify({
        id: 999,
        username: 'TestUser',
        nom: 'Robot',
        prenom: 'Playwright'
      }));
    });

    // 2. MOCKS GLOBAUX (Données affichées au chargement)
    
    // Mock : Liste des groupes (Familles)
    await page.route('**/*route=famille/all*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id_famille: 1, nom: "Groupe Robot", description: "Test Description" },
          { id_famille: 2, nom: "Groupe Secondaire", description: "Autre groupe" }
        ])
      });
    });

    // Mock : Liste des invitations
    await page.route('**/*route=invitation/view*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id_invitation: 10, nom_famille: "Invitation Mamie", date: "2024-01-01" }
        ])
      });
    });

    // 3. NAVIGATION
    await page.goto('/acce_suivi');
    // On attend que le titre soit là pour être sûr que la page est chargée
    await expect(page.locator('h1.bienvenue')).toBeVisible();
  });

  test('Affichage initial et bienvenue', async ({ page }) => {
    const bienvenue = page.locator('h1.bienvenue');
    await expect(bienvenue).toContainText(/Bienvenue/i);
    // On vérifie que nos mocks sont bien affichés
    await expect(page.getByText('Espace du groupe : Groupe Robot')).toBeVisible();
  });

  test('Création d un nouveau groupe via le Slide', async ({ page }) => {
    // Mock du POST de création
    await page.route('**/*route=famille/add*', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    await page.locator('button.creer_suivi').click();
    
    const slide = page.locator('.add_famille');
    await expect(slide).toBeInViewport(); // Vérifie que le slide est entré

    await slide.locator('input[name="nom_aide"]').fill('Test Robot');
    await slide.locator('input[name="nom_groupe"]').fill('Groupe Robot');
    
    // On clique et on attend la réaction
    await slide.locator('button:has-text("Créer")').click();
    await expect(page.locator('.success-msg')).toBeVisible();
  });

  test('Ouverture d un groupe et redirection vers le dashboard', async ({ page }) => {
    // Mock de la sélection de famille (mise en session côté serveur)
    await page.route('**/*route=famille/select*', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    const sectionGroupes = page.locator('.list').first();
    const premierGroupe = sectionGroupes.locator('.container_suivi_groupe').first();
    
    // On ouvre le détail
    await premierGroupe.locator('.principal_infos').click();
    
    const btnEntrer = premierGroupe.getByRole('button', { name: /Entrer/i });
    await expect(btnEntrer).toBeVisible();
    
    await btnEntrer.click();
    await expect(page).toHaveURL(/.*home\/dashboard/);
  });

  test('Modification des informations d un groupe', async ({ page }) => {
    // 1. Mock de la réponse serveur pour la mise à jour
    await page.route('**/*route=famille/update*', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    // 2. Ouvrir le menu "Modifier"
    const premierGroupe = page.locator('.container_suivi_groupe').first();
    await premierGroupe.locator('.principal_infos').click();
    await premierGroupe.getByRole('button', { name: /Modifier/i }).click();

    // 3. CIBLAGE DU FORMULAIRE VISIBLE
    // On cherche le formulaire qui contient le bouton "Enregistrer" pour être sûr de ne pas prendre celui de création
    const formModif = page.locator('form').filter({ hasText: /Enregistrer/i });
    await expect(formModif).toBeVisible();

    // 4. REMPLISSAGE (Correction : on remplit aussi "Nom de l'aidé" car il est required)
    await formModif.locator('input[name="nom_aide"]').fill('Jean-Pierre (Modifié)');
    await formModif.locator('input[name="nom_groupe"]').fill('Groupe Modifié');
    
    // 5. ENREGISTREMENT
    await formModif.getByRole('button', { name: /Enregistrer/i }).click();
    
    // 6. VÉRIFICATION
    await expect(page.locator('.success-msg')).toContainText(/Modification enregistrée/i);
  });

  test('Vérification de la fermeture du Slide (Annuler)', async ({ page }) => {
    await page.locator('button.creer_suivi').click();
    const slide = page.locator('.add_famille');
    
    // On vérifie qu'il est bien visible à l'écran
    await expect(slide).toBeInViewport();
    
    // Clic forcé sur Annuler
    const btnAnnuler = slide.locator('button').filter({ hasText: /^Annuler$/i });
    await btnAnnuler.click({ force: true });

    // CORRECTION MAJEURE : On vérifie qu'il sort de l'écran (animation CSS)
    await expect(slide).not.toBeInViewport({ timeout: 10000 });
  });

  test('Vérification des invitations reçues', async ({ page }) => {
    const sectionInvitations = page.locator('.list').last();
    const invitations = sectionInvitations.locator('.container_suivi_groupe');
    
    // Comme on a mocké une invitation dans le beforeEach, le compteur doit être > 0
    await expect(invitations).toHaveCount(1);
    
    await invitations.first().click();
    await expect(invitations.first().getByRole('button', { name: /Accepter/i })).toBeVisible();
  });

});