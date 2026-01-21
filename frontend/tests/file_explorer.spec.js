import { test, expect } from '@playwright/test';

test.describe('Page Documents - Mode Mock Complet', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      sessionStorage.clear();
      sessionStorage.setItem('isConnected', 'true');
      sessionStorage.setItem('id_famille', '123');
      sessionStorage.setItem('role', 'Createur'); // Role demandé
      sessionStorage.setItem('user', JSON.stringify({ id: 999, nom: 'Robot', prenom: 'Test' }));
    });

    await page.route('**/*route=document/list*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id_cat: 1,
            nom: "Santé",
            documents: [
              { id_doc: 101, nom_doc: "Ordonnance.pdf", type: "pdf", url: "uploads/doc1.pdf" }
            ]
          },
          {
            id_cat: 2,
            nom: "Administratif",
            documents: []
          }
        ]),
      });
    });

    await page.goto('/document/explorateur');
  });

  test('Affichage des catégories et des documents', async ({ page }) => {
    const categories = page.locator('.container_categorie');
    await expect(categories).toHaveCount(2, { timeout: 10000 });
    
    // On cible le titre exact dans la case catégorie
    const santeTitle = page.locator('.case_categorie p strong').filter({ hasText: /^Santé$/ });
    await expect(santeTitle).toBeVisible();
    
    await expect(page.getByText('Ordonnance.pdf')).toBeVisible();
  });

  test('Création d une nouvelle catégorie', async ({ page }) => {
    await page.route('**/*route=categorie/add*', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    await page.locator('.new_categories div').click();
    
    // On cible le formulaire spécifique pour éviter de cliquer sur le mauvais bouton "Ajouter"
    const slideForm = page.locator('form.new_categorie');
    await expect(slideForm).toBeVisible();

    await slideForm.locator('input[type="text"]').fill('Factures');
    await slideForm.locator('select').selectOption('Professionelle');
    
    await slideForm.getByRole('button', { name: 'Ajouter' }).click();

    await expect(page.locator('.popup_confirmation')).toBeVisible();
    await expect(page.getByText(/La catégorie Factures a bien été ajouté/)).toBeVisible();
  });

  test('Modification d une catégorie existante', async ({ page }) => {
    await page.route('**/*route=categorie/update*', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    await page.locator('.container_categorie').first().locator('button').click();
    
    const slideForm = page.locator('form.new_categorie');
    await expect(slideForm).toBeVisible();

    await slideForm.locator('input[type="text"]').fill('Santé Mentale');
    await slideForm.getByRole('button', { name: 'Modifier' }).click();

    await expect(page.getByText(/La catégorie Santé Mentale a bien été modifié/)).toBeVisible();
  });

  test('Ajout d un document avec upload simulé', async ({ page }) => {
    await page.route('**/*route=document/add*', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    await page.locator('.btn_add_container').click();
    
    const slideForm = page.locator('form.new_document');
    await expect(slideForm).toBeVisible();

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('label.drop_zone').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'test.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('dummy content'),
    });

    await expect(page.locator('.doc_warning')).toBeVisible();

    // On utilise l'index pour le select car les values sont dynamiques (id_cat)
    await slideForm.locator('select').selectOption({ index: 1 });
    await slideForm.locator('input[type="text"]').fill('Mon Document Test');

    await slideForm.getByRole('button', { name: 'Ajouter' }).click();

    await expect(page.getByText(/Le document Mon Document Test a bien été ajouté/)).toBeVisible();
  });

  test('Suppression d un document', async ({ page }) => {
    await page.route('**/*route=document/delete*', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    await page.locator('.container_document img[alt="bin"]').first().click();
    
    // On filtre la popup par le texte qu'elle contient pour différencier celle des Docs et des Cats
    const popup = page.locator('.popup_delete').filter({ hasText: 'Ordonnance.pdf' });
    await expect(popup).toBeVisible();

    await popup.getByRole('button', { name: /Supprimer/i }).click();

    await expect(page.locator('.popup_confirmation')).toBeVisible();
  });

  test('Suppression d une catégorie', async ({ page }) => {
    await page.route('**/*route=categorie/delete*', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    await page.locator('.container_categorie').first().locator('button').click();
    await page.getByRole('button', { name: 'Supprimer' }).click();

    // On filtre la popup par le nom de la catégorie pour être sûr de cibler la bonne
    const popup = page.locator('.popup_delete').filter({ hasText: 'Santé' });
    await expect(popup).toBeVisible();
    
    await popup.getByRole('button', { name: /Supprimer/i }).click();

    await expect(page.locator('.popup_confirmation')).toBeVisible();
  });

  test('Recherche de document filtrée', async ({ page }) => {
    const searchInput = page.locator('.search_document input[type="search"]');
    
    // 1. Vérifier que le doc est là
    await expect(page.getByText('Ordonnance.pdf')).toBeVisible();
    
    // 2. Filtrer avec un nom qui n'existe pas
    await searchInput.fill('Inexistant');
    await expect(page.getByText('Ordonnance.pdf')).not.toBeVisible();

    // 3. Revenir à la normale
    await searchInput.fill('');
    await expect(page.getByText('Ordonnance.pdf')).toBeVisible();
  });

});