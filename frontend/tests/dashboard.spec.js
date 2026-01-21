import { test, expect } from '@playwright/test';

test.describe('Dashboard - Mode Mock Complet', () => {

  test.beforeEach(async ({ page }) => {
    // 1. FORCER LA SESSION (On simule d'être déjà connecté et d'avoir choisi une famille)
    await page.goto('/');
    await page.evaluate(() => {
      sessionStorage.clear();
      sessionStorage.setItem('isConnected', 'true');
      sessionStorage.setItem('id_famille', '123'); // ID fictif
      sessionStorage.setItem('user', JSON.stringify({
        id: 999,
        nom: 'Robot',
        prenom: 'Playwright'
      }));
    });

    // 2. MOCK DE L'API DASHBOARD (La réponse que ton fetch attend)
    await page.route('**/index.php?route=dashboard/view', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          trajets: [
            { 
              id_trajet: 77, 
              description: "Course urgente", 
              lieu_dep: "Maison", 
              lieu_arr: "Pharmacie", 
              date_deb: "2026-02-15T10:00:00" 
            }
          ],
          medicaments: [
            { nomMedicament: "Aspegic", stock: 2, stockTotal: 20 }
          ],
          taches: [
            { nom: "Acheter du pain", note: "Boulangerie fermée le lundi" }
          ]
        }),
      });
    });

    // 3. NAVIGATION DIRECTE
    await page.goto('/home/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('Vérification visuelle du Dashboard mocké', async ({ page }) => {
    // Test des Médicaments (Alertes)
    await expect(page.locator('.list_alerte')).toContainText('Aspegic');
    
    // Vérification de la couleur de la barre (stock 2/20 = < 33% donc rouge)
    const progress = page.locator('progress');
    await expect(progress).toHaveClass(/red_bar/);

    // Test des Tâches
    await expect(page.locator('.list_task')).toContainText('Acheter du pain');
  });

  test('Interaction avec le Slide Trajet en mode Mock', async ({ page }) => {
    // On clique sur le trajet mocké
    await page.locator('.list_trajet .alerte_dashbord').first().click();

    // Le Slide doit s'ouvrir avec les infos mockées
    const slide = page.locator('.details_trajet');
    await expect(slide).toBeVisible();
    await expect(slide).toContainText('Pharmacie');

    // MOCK de l'action "Accepter"
    await page.route('**/index.php?route=trajet/accepter', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    // On accepte
    await page.getByRole('button', { name: /Accepter le trajet/i }).click();

    // Le slide doit se fermer (React rappelle fetchDashboard, donc on vérifie la fermeture)
    await expect(slide).toBeHidden();
  });

  test('Navigation vers les autres pages depuis le Dashboard', async ({ page }) => {
    // Clic sur l'alerte médicament -> doit aller vers /suivi/medicine
    await page.locator('.list_alerte a').first().click();
    await expect(page).toHaveURL(/.*suivi\/medicine/);

    await page.goBack();

    // Clic sur la tâche -> doit aller vers /agenda
    await page.locator('.list_task a').first().click();
    await expect(page).toHaveURL(/.*agenda/);
  });

});