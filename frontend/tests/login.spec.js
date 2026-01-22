import { test, expect } from '@playwright/test';

test.describe('Page Login - Mode Mock', () => {

  test('Connexion réussie (Simulation API)', async ({ page }) => {
    
    await page.route('**/*route=login*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          success: true, 
          user: { id: 1, username: 'test_user', role: 'admin' }
        })
      });
    });

    await page.goto('/login');

    await page.locator('input[name="username"]').fill('nimporte_quoi');
    await page.locator('input[name="mdp"]').fill('mot_de_passe_bidon');

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*acce_suivi/, { timeout: 10000 });
  });

  test('Échec de connexion (Simulation API)', async ({ page }) => {
    
    await page.route('**/*route=login*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          success: false, 
          message: "Identifiants incorrects" 
        })
      });
    });

    await page.goto('/login');

    await page.locator('input[name="username"]').fill('mauvais_user');
    await page.locator('input[name="mdp"]').fill('mauvais_mdp');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*login/);

    const errorMessage = page.locator('.error_message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText("Identifiants incorrects");
  });

});