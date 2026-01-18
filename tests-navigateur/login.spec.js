// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Page de Connexion', () => {

  // On va sur la page de login avant chaque test
  test.beforeEach(async ({ page }) => {
    await page.goto('/login'); // Adapte si ta route est juste '/'
  });

  test('Doit afficher une erreur avec de mauvais identifiants', async ({ page }) => {
    // Vérifie bien que les sélecteurs correspondent à ton code React
    await page.fill('input[name="username"]', 'utilisateur_fantome');
    await page.fill('input[name="mdp"]', 'mauvais_mdp'); // "mdp" et non "password"

    await page.click('button.btn_blue');

    const errorMessage = page.locator('.error_message');
    await expect(errorMessage).toBeVisible();
  });


  test('Connexion réussie et redirection', async ({ page }) => {
    await page.goto('/login');

    // Assure-toi que ces identifiants existent dans ta DB 'ma_base'
    await page.fill('input[name="username"]', 'c'); 
    await page.fill('input[name="mdp"]', 'c'); 

    await page.click('button[type="submit"]');

    // AJOUT : On attend un peu pour voir si un message d'erreur apparaît à l'écran
    const error = page.locator('.error_message');
    if (await error.isVisible()) {
        console.log("Erreur affichée sur l'écran : " + await error.innerText());
    }

    // Vérifier la redirection
    await expect(page).toHaveURL(/\/acce_suivi/, { timeout: 10000 });
  });

  test('Navigation vers la création de compte', async ({ page }) => {
    await page.click('text=Créer un compte');
    await expect(page).toHaveURL(/\/create_account/);
  });
});