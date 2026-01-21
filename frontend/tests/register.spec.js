import { test, expect } from '@playwright/test';

test.describe('Page Inscription', () => {

  test('Création de compte réussie avec redirection flexible', async ({ page }) => {
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

    const successMsg = page.locator('p', { hasText: 'Inscription réussie !' });
    await expect(successMsg).toBeVisible({ timeout: 10000 });
    await expect(page).not.toHaveURL(/.*create_account/, { timeout: 7000 });
  });

  test('Validation erreur mots de passe', async ({ page }) => {
    await page.goto('/create_account');

    await page.locator('input[name="mail"]').fill('test@test.com');
    await page.locator('input[name="nom"]').fill('Nom');
    await page.locator('input[name="prenom"]').fill('Prenom');
    await page.locator('input[name="date_naissance"]').fill('2000-01-01');
    await page.locator('input[name="username"]').fill('testuser');

    await page.locator('input[name="mdp"]').fill('123456');
    await page.locator('input[name="confirmMdp"]').fill('999999');
    
    await page.click('button[type="submit"]');

    const errorMsg = page.locator('p').filter({ hasText: /mots de passe ne correspondent pas/i });
    await expect(errorMsg).toBeVisible();
  });

  // --- LE NOUVEAU TEST AJOUTÉ ---
  test('Blocage si champs obligatoires vides (Validation HTML5)', async ({ page }) => {
    await page.goto('/create_account');

    // On essaie de cliquer sans rien remplir
    await page.click('button[type="submit"]');

    // 1. L'URL ne doit pas avoir bougé (redirection impossible si bloqué par le navigateur)
    await expect(page).toHaveURL(/.*create_account/);

    // 2. Le message de succès ne doit pas exister
    const successMsg = page.locator('p', { hasText: 'Inscription réussie !' });
    await expect(successMsg).not.toBeVisible();

    // 3. On vérifie que le champ mail est marqué comme "invalide" par le navigateur
    const isMailInvalid = await page.$eval('input[name="mail"]', input => !input.validity.valid);
    expect(isMailInvalid).toBeTruthy();
    
    // 4. On vérifie qu'un message d'erreur natif est présent (checkValidity renvoie false)
    const formIsValid = await page.$eval('form', form => form.checkValidity());
    expect(formIsValid).toBeFalsy();
  });
});