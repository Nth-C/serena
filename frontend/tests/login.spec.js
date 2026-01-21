import { test, expect } from '@playwright/test';

test('Test de connexion avec c et c', async ({ page }) => {
  await page.goto('/login');

  await page.locator('input[name="username"]').fill('c');
  await page.locator('input[name="mdp"]').fill('c');

  // On clique et on attend la réponse réseau
  await page.click('button[type="submit"]');

  // Si le login échoue, un message d'erreur devrait apparaître
  // On attend un peu pour voir si l'URL change
  try {
    await expect(page).toHaveURL(/.*acce_suivi/, { timeout: 5000 });
  } catch (error) {
    // Si ça échoue, on regarde s'il y a un message d'erreur class="error_message"
    const errorMsg = await page.locator('.error_message').textContent();
    console.log("Message d'erreur affiché à l'écran :", errorMsg);
    throw error;
  }
});

test('Échec de connexion avec mauvais identifiants', async ({ page }) => {
  await page.goto('/login');

  // On entre des identifiants bidon
  await page.locator('input[name="username"]').fill('mauvais_user');
  await page.locator('input[name="mdp"]').fill('mauvais_mdp');
  await page.click('button[type="submit"]');

  // On vérifie qu'on est TOUJOURS sur la page de login (pas de redirection)
  await expect(page).toHaveURL(/.*login/);

  // On vérifie qu'un message d'erreur est bien affiché à l'utilisateur
  // (Adapte le sélecteur .error_message si ta classe est différente)
  const errorMessage = page.locator('.error_message');
  await expect(errorMessage).toBeVisible();
  console.log("Erreur détectée :", await errorMessage.textContent());
});