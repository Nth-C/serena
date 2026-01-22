import { test, expect } from '@playwright/test';

test.describe('Page Accès Suivi - Mode Mock Complet', () => {

  test.beforeEach(async ({ page }) => {
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

    await page.route('**/*route=invitation/view*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id_invitation: 10, nom_famille: "Invitation Mamie", date: "2024-01-01" }
        ])
      });
    });

    await page.goto('/acce_suivi');
    await expect(page.locator('h1.bienvenue')).toBeVisible();
  });

  test('Affichage initial et bienvenue', async ({ page }) => {
    const bienvenue = page.locator('h1.bienvenue');
    await expect(bienvenue).toContainText(/Bienvenue/i);
    await expect(page.getByText('Espace du groupe : Groupe Robot')).toBeVisible();
  });

  test('Création d un nouveau groupe via le Slide', async ({ page }) => {
    await page.route('**/*route=famille/add*', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    await page.locator('button.creer_suivi').click();
    
    const slide = page.locator('.add_famille');
    await expect(slide).toBeInViewport();

    await slide.locator('input[name="nom_aide"]').fill('Test Robot');
    await slide.locator('input[name="nom_groupe"]').fill('Groupe Robot');
    
    await slide.locator('button:has-text("Créer")').click();
    await expect(page.locator('.success-msg')).toBeVisible();
  });

  test('Ouverture d un groupe et redirection vers le dashboard', async ({ page }) => {
    await page.route('**/*route=famille/select*', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    const sectionGroupes = page.locator('.list').first();
    const premierGroupe = sectionGroupes.locator('.container_suivi_groupe').first();
    
    await premierGroupe.locator('.principal_infos').click();
    
    const btnEntrer = premierGroupe.getByRole('button', { name: /Entrer/i });
    await expect(btnEntrer).toBeVisible();
    
    await btnEntrer.click();
    await expect(page).toHaveURL(/.*home\/dashboard/);
  });

  test('Modification des informations d un groupe', async ({ page }) => {
    await page.route('**/*route=famille/update*', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    const premierGroupe = page.locator('.container_suivi_groupe').first();
    await premierGroupe.locator('.principal_infos').click();
    await premierGroupe.getByRole('button', { name: /Modifier/i }).click();

    const formModif = page.locator('form').filter({ hasText: /Enregistrer/i });
    await expect(formModif).toBeVisible();

    await formModif.locator('input[name="nom_aide"]').fill('Jean-Pierre (Modifié)');
    await formModif.locator('input[name="nom_groupe"]').fill('Groupe Modifié');
    
    await formModif.getByRole('button', { name: /Enregistrer/i }).click();
    
    await expect(page.locator('.success-msg')).toContainText(/Modification enregistrée/i);
  });

  test('Vérification de la fermeture du Slide (Annuler)', async ({ page }) => {
    await page.locator('button.creer_suivi').click();
    const slide = page.locator('.add_famille');
    
    await expect(slide).toBeInViewport();
    
    const btnAnnuler = slide.locator('button').filter({ hasText: /^Annuler$/i });
    await btnAnnuler.click({ force: true });

    await expect(slide).not.toBeInViewport({ timeout: 10000 });
  });

  test('Vérification des invitations reçues', async ({ page }) => {
    const sectionInvitations = page.locator('.list').last();
    const invitations = sectionInvitations.locator('.container_suivi_groupe');
    
    await expect(invitations).toHaveCount(1);
    
    await invitations.first().click();
    await expect(invitations.first().getByRole('button', { name: /Accepter/i })).toBeVisible();
  });

});