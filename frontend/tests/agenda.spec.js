import { test, expect } from '@playwright/test';

test.describe('Page Agenda - Mode Mock Complet', () => {

  // Date fixe pour garantir la cohérence entre le test, le mock et l'affichage
  const MOCK_DATE = '2026-01-21'; 

  const mockMembres = {
    success: true,
    membres: [
      { id: 1, nom: "Dupont", prenom: "Jean" },
      { id: 2, nom: "Dupont", prenom: "Marie" }
    ]
  };

  const mockEvents = {
    success: true,
    evenements: [
      {
        id_event: 100,
        id_recurrence: null,
        nom: "Rendez-vous Docteur",
        lieu: "Cabinet Médical",
        description: "Apporter carte vitale",
        // L'événement est calé sur la date mockée, de 08h à 18h pour être bien visible
        date_deb: `${MOCK_DATE} 08:00:00`,
        date_fin: `${MOCK_DATE} 18:00:00`,
        accompagnant: { id_personne: 1, nom: "Dupont", prenom: "Jean" },
        trajets: []
      }
    ]
  };

  test.beforeEach(async ({ page }) => {
    // 1. IMPORTANT : On fige l'horloge du navigateur à la date du mock (08:00 matin)
    // Cela force l'Agenda à s'ouvrir sur le bon jour et affiche l'événement immédiatement
    await page.clock.install({ time: new Date(`${MOCK_DATE}T08:00:00`) });

    await page.goto('/');
    await page.evaluate(() => {
      sessionStorage.clear();
      sessionStorage.setItem('isConnected', 'true');
      sessionStorage.setItem('id_famille', '123');
      sessionStorage.setItem('role', 'Createur');
      sessionStorage.setItem('user', JSON.stringify({ id: 999, nom: 'Robot', prenom: 'Test' }));
    });

    await page.route('**/*route=getfamillepersonne*', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify(mockMembres) });
    });

    await page.route('**/*route=getevents*', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify(mockEvents) });
    });

    await page.goto('/agenda');
  });

  test('Affichage initial et navigation jour/semaine', async ({ page }) => {
    // On cherche le texte exact pour éviter de trouver les options cachées des selects
    // Le regex ^...$ assure qu'on ne matche que "Rendez-vous Docteur" et pas "Rendez-vous Docteur (21/01...)"
    const event = page.getByText(/^Rendez-vous Docteur$/).first();
    await expect(event).toBeVisible();

    const btnJour = page.getByRole('button', { name: 'Jour' });
    const btnSemaine = page.getByRole('button', { name: 'Semaine' });

    await expect(btnJour).toHaveClass(/active/);
    
    await btnSemaine.click();
    await expect(btnSemaine).toHaveClass(/active/);
    await expect(btnJour).not.toHaveClass(/active/);
  });

  test('Création d un nouvel événement', async ({ page }) => {
    await page.route('**/*route=evenement/add*', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    await page.locator('.btn_add_agenda').first().click();

    const slide = page.locator('form.add_event');
    await expect(slide).toBeVisible();

    await slide.locator('input[name="titre"]').fill('Kiné');
    await slide.locator('input[name="lieu"]').fill('Centre Ville');
    
    // On utilise la date mockée
    await slide.locator('input[name="debut"]').fill(`${MOCK_DATE}T10:00`);
    await slide.locator('input[name="fin"]').fill(`${MOCK_DATE}T11:00`);
    
    await slide.locator('select[name="accompagnants"]').selectOption({ index: 1 });

    await slide.getByRole('button', { name: 'Valider' }).click();

    await expect(page.getByText(/L'événement Kiné a bien été ajouter/)).toBeVisible();
  });

  test('Consultation et modification d un événement', async ({ page }) => {
    await page.route('**/*route=evenement/update*', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    // Clic précis sur l'événement dans le calendrier
    await page.getByText(/^Rendez-vous Docteur$/).first().click();
    
    const details = page.locator('.event_details');
    await expect(details).toBeVisible();
    await expect(details).toContainText('Cabinet Médical');

    await details.getByRole('button', { name: 'Modifier' }).click();

    const editForm = page.locator('form.edit_event');
    await expect(editForm).toBeVisible();

    await editForm.locator('input[name="lieu"]').fill('Hôpital');
    await editForm.getByRole('button', { name: 'Valider' }).click();

    await expect(page.getByText('Événement modifié avec succès !')).toBeVisible();
  });


  test('Ajout d un trajet', async ({ page }) => {
    await page.route('**/*route=trajet/add*', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    await page.locator('.btn_add_trajet').click();

    const formTrajet = page.locator('form.add_trajet');
    await expect(formTrajet).toBeVisible();

    // Sélection de l'événement mocké via l'index (car le texte contient la date dynamique)
    await formTrajet.locator('select[name="id_event"]').selectOption({ index: 1 });

    await formTrajet.locator('input[name="lieuDepart"]').fill('Maison');
    await formTrajet.locator('input[name="lieuArrivee"]').fill('Cabinet');
    
    await formTrajet.locator('input[name="debut"]').fill(`${MOCK_DATE}T13:30`);

    await formTrajet.getByRole('button', { name: 'Valider' }).click();

    await expect(page.getByText('Trajet ajouté avec succès !')).toBeVisible();
  });

});