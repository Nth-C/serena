import { test, expect } from '@playwright/test';

test.describe('Dashboard - Mode Mock Complet', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      sessionStorage.clear();
      sessionStorage.setItem('isConnected', 'true');
      sessionStorage.setItem('id_famille', '123');
      sessionStorage.setItem('user', JSON.stringify({ id: 999, nom: 'Robot', prenom: 'Test' }));
    });

    await page.route('**/*route=dashboard/view*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          trajets: [{ id_trajet: 77, description: "Course", lieu_dep: "A", lieu_arr: "B", date_deb: "2026-02-15T10:00:00" }],
          medicaments: [{ nomMedicament: "Aspegic", stock: 2, stockTotal: 20 }],
          taches: [{ nom: "Pain", note: "Urgent" }]
        }),
      });
    });

    await page.goto('/home/dashboard');
    await expect(page.getByText(/Chargement des/)).toHaveCount(0, { timeout: 10000 });
  });

  test('Vérification de l alerte médicament', async ({ page }) => {
    const container = page.locator('.list_alerte');
    await expect(container).toBeVisible(); 
    await expect(container).toContainText('Aspegic');
  });

  test('Acceptation d un trajet via le Slide', async ({ page }) => {
    const listTrajet = page.locator('.list_trajet');
    await expect(listTrajet).toBeVisible();
    await listTrajet.locator('.alerte_dashbord').first().click();

    const slide = page.locator('.details_trajet');
    await expect(slide).toBeInViewport();

    await page.route('**/*route=trajet/accepter*', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    const responsePromise = page.waitForResponse(r => r.url().includes('trajet/accepter') && r.status() === 200);

    await page.getByRole('button', { name: 'Accepter le trajet' }).click();

    await responsePromise;

    await expect(slide).not.toBeInViewport();
  });

  test('Affichage de la tâche prioritaire', async ({ page }) => {
    const container = page.locator('.list_task');
    await expect(container).toBeVisible();
    await expect(container).toContainText('Pain');
  });

  test('Cas de liste vide', async ({ page }) => {
    await page.unroute('**/*route=dashboard/view*');
    await page.route('**/*route=dashboard/view*', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ trajets: [], medicaments: [], taches: [] }),
      });
    });

    await page.reload();
    await expect(page.getByText(/Chargement des/)).toHaveCount(0);
    await expect(page.getByText('Aucune demande de trajet.')).toBeVisible();
  });
});