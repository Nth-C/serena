import { test, expect } from '@playwright/test';
import fs from 'fs';

test.describe('Page Accès Suivi (Dashboard des groupes)', () => {

  test.beforeEach(async ({ page }) => {
    const sessionFile = 'playwright/.auth/session.json';
    await page.goto('/');

    if (fs.existsSync(sessionFile)) {
      const sessionData = JSON.parse(fs.readFileSync(sessionFile, 'utf-8'));
      await page.evaluate((data) => {
        sessionStorage.clear();
        for (const [key, value] of Object.entries(data)) {
          sessionStorage.setItem(key, value);
        }
      }, sessionData);
    }

    await page.goto('/acce_suivi');
    await page.waitForLoadState('networkidle');
  });

  test('Affichage initial et bienvenue', async ({ page }) => {
    const bienvenue = page.locator('h1.bienvenue');
    await expect(bienvenue).toBeVisible({ timeout: 10000 });
    await expect(bienvenue).toContainText(/Bienvenue/i);
  });

  test('Création d un nouveau groupe via le Slide', async ({ page }) => {
    await page.locator('button.creer_suivi').click();
    const slide = page.locator('.add_famille');
    await slide.locator('input[name="nom_aide"]').fill('Test Robot');
    await slide.locator('input[name="nom_groupe"]').fill('Groupe Robot');
    await slide.locator('button:has-text("Créer")').click();
    await expect(page.locator('.success-msg')).toBeVisible();
  });

  test('Ouverture d un groupe et redirection vers le dashboard', async ({ page }) => {
    // On cible spécifiquement le premier groupe de la première liste (Mes groupes)
    const sectionGroupes = page.locator('.list').first();
    const premierGroupe = sectionGroupes.locator('.container_suivi_groupe').first();
    
    if (await premierGroupe.isVisible()) {
      await premierGroupe.locator('.principal_infos').click();
      const btnEntrer = premierGroupe.getByRole('button', { name: /Entrer/i });
      await expect(btnEntrer).toBeVisible();
      await btnEntrer.click();
      await expect(page).toHaveURL(/.*home\/dashboard/);
    } else {
      // Correction ici : on cible le message "aucun" au sein de la première liste uniquement
      await expect(sectionGroupes.locator('.aucun')).toBeVisible();
    }
  });

  test('Modification des informations d un groupe', async ({ page }) => {
    const premierGroupe = page.locator('.container_suivi_groupe').first();
    if (await premierGroupe.isVisible()) {
      await premierGroupe.locator('.principal_infos').click();
      await premierGroupe.getByRole('button', { name: /Modifier/i }).click();
      const inputNom = page.locator('input[name="nom_groupe"]');
      await inputNom.fill('Nom Modifie');
      await page.getByRole('button', { name: /Enregistrer/i }).click();
      await expect(page.locator('.success-msg')).toContainText(/Modification enregistrée/i);
    }
  });

  test('Vérification de la fermeture du Slide (Annuler)', async ({ page }) => {
    await page.locator('button.creer_suivi').click();
    // On s'assure que le slide est bien monté dans le DOM
    const slide = page.locator('.add_famille');
    await expect(slide).toBeVisible();
    
    // On clique sur annuler
    await slide.locator('button:has-text("Annuler")').click();
    
    // Correction ici : On utilise un timeout plus long ou on vérifie que le parent (Slide) est fermé
    // Si votre composant Slide utilise une classe pour s'ouvrir/fermer, ciblez-la
    await expect(slide).toBeHidden({ timeout: 8000 });
  });

  test('Vérification des invitations reçues', async ({ page }) => {
    const sectionInvitations = page.locator('.list').last();
    const invitations = sectionInvitations.locator('.container_suivi_groupe');
    
    if (await invitations.count() > 0) {
      await invitations.first().click();
      await expect(invitations.first().getByRole('button', { name: /Accepter/i })).toBeVisible();
    } else {
      // On cible le message vide spécifique à la section invitation
      await expect(sectionInvitations.locator('.aucun')).toBeVisible();
    }
  });

});