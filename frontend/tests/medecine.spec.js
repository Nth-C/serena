import { test, expect } from '@playwright/test';

test.describe('Page Médicaments - Mode Mock Complet', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      sessionStorage.clear();
      sessionStorage.setItem('isConnected', 'true');
      sessionStorage.setItem('id_famille', '123');
      sessionStorage.setItem('user', JSON.stringify({ id: 999, nom: 'Robot', prenom: 'Test' }));
    });

    await page.route('**/*route=medicament/list*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id_medicament: 1, nomMedicament: "Doliprane", type: "Gélule", stock: 5, stockTotal: 20 }
        ]),
      });
    });

    await page.goto('/suivi/medicine');
    await expect(page.getByText('Chargement des médicaments...')).toBeHidden();
  });

  test('Affichage de la liste et des couleurs de barres', async ({ page }) => {
    const card = page.locator('.container_medecine').first();
    await expect(card).toBeVisible();
    await expect(card.locator('progress')).toHaveClass(/red_bar/);
  });

  test('Ajout d un nouveau médicament avec recherche', async ({ page }) => {
    await page.route('**/*route=nommedicament/search*', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          resultats: [{ denomination_substance: "Amoxicilline" }],
          isUnique: true,
          types: [{ id_medics: 10, designation_elem_pharma: "Sirop" }]
        }),
      });
    });

    await page.route('**/*route=medicament/add*', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    await page.locator('.btn_add_container').click();
    await expect(page.getByRole('heading', { name: 'Ajouter un médicament' })).toBeVisible();

    await page.locator('input[type="text"]').fill('Amox');
    await page.locator('select').selectOption({ label: 'Sirop' });
    await page.locator('input[type="number"]').first().fill('10');
    await page.locator('input[type="number"]').last().fill('10');

    await page.locator('form.new_medecine').getByRole('button', { name: 'Ajouter' }).click();
    await expect(page.getByText(/bien été ajouter/)).toBeVisible();
  });

  test('Modification du stock d un médicament existant', async ({ page }) => {
    await page.locator('.principal_infos').first().click();
    await page.locator('.container_medecine').first().getByRole('button', { name: 'Modifier' }).click();

    await page.route('**/*route=medicament/update*', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    const form = page.locator('form.new_medecine');
    await form.locator('input[type="number"]').last().fill('8');
    await form.getByRole('button', { name: 'Modifier' }).click();

    await expect(page.getByText(/bien été modifier/)).toBeVisible();
  });

  test('Suppression d un médicament', async ({ page }) => {
    await page.locator('.principal_infos').first().click();
    await page.getByRole('button', { name: 'Supprimer' }).click();

    await expect(page.getByText('Suppression ?')).toBeVisible();

    await page.route('**/*route=medicament/delete*', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    await page.getByRole('button', { name: /^Supprimer$/ }).last().click();
    await expect(page.getByText(/bien été supprimé/)).toBeVisible();
  });
});