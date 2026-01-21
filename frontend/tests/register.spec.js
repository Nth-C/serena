import { test, expect } from '@playwright/test';

test.describe('Page Inscription', () => {

  test('Création de compte réussie et fermeture de la popup', async ({ page }) => {
    await page.goto('/create_account');

    const uniqueUser = `user_${Date.now()}`;
    const uniqueEmail = `test_${Date.now()}@exemple.com`;

    await page.locator('input[name="mail"]').fill(uniqueEmail);
    await page.locator('input[name="mdp"]').fill('Test1234!');
    await page.locator('input[name="confirmMdp"]').fill('Test1234!');
    await page.locator('input[name="nom"]').fill('Gardette');
    await page.locator('input[name="prenom"]').fill('Mathis');
    await page.locator('input[name="date_naissance"]').fill('2000-01-01');
    await page.locator('input[name="username"]').fill(uniqueUser);

    await page.click('button[type="submit"]');

    const popup = page.locator('.popup_content');
    await expect(popup).toBeVisible({ timeout: 10000 });
    await expect(popup.locator('h2')).toContainText('Inscription réussie !');

    await popup.locator('button:has-text("Retour à la connexion")').click();
    await expect(page).toHaveURL(/.*login/);
  });

  test('Validation erreur mots de passe', async ({ page }) => {
    await page.goto('/create_account');

    // --- CORRECTION : Remplir TOUS les champs requis pour passer la validation HTML5 ---
    await page.locator('input[name="mail"]').fill('test_erreur@test.com');
    await page.locator('input[name="nom"]').fill('Nom');
    await page.locator('input[name="prenom"]').fill('Prenom');
    await page.locator('input[name="date_naissance"]').fill('2000-01-01');
    await page.locator('input[name="username"]').fill('testuser_error');

    // On met des mots de passe différents
    await page.locator('input[name="mdp"]').fill('123456');
    await page.locator('input[name="confirmMdp"]').fill('999999');
    
    await page.click('button[type="submit"]');

    // Maintenant le formulaire est envoyé, et ton JS React peut afficher l'erreur
    const errorMsg = page.locator('p').filter({ hasText: /mots de passe ne correspondent pas/i });
    await expect(errorMsg).toBeVisible();
  });

  test('Blocage si champs obligatoires vides (Validation HTML5)', async ({ page }) => {
    await page.goto('/create_account');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*create_account/);

    const isMailInvalid = await page.$eval('input[name="mail"]', input => !input.validity.valid);
    expect(isMailInvalid).toBeTruthy();
  });
});