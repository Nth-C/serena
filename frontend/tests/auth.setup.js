import { test as setup } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const authFile = 'playwright/.auth/user.json';
const sessionFile = 'playwright/.auth/session.json';

setup('authenticate', async ({ page, context }) => {
  // On écoute les cookies qui arrivent via le réseau
  page.on('response', async response => {
    const headers = response.headers();
    if (headers['set-cookie']) {
      console.log(`📡 Set-Cookie détecté de l'API: ${headers['set-cookie']}`);
    }
  });

  await page.goto('/login');
  
  await page.locator('input[name="username"]').fill('c');
  await page.locator('input[name="mdp"]').fill('c');
  
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForURL(/.*acce_suivi/, { waitUntil: 'networkidle' })
  ]);

  // RÉCUPÉRATION MANUELLE DU STORAGE
  const sessionData = await page.evaluate(() => JSON.stringify(sessionStorage));
  
  // SAUVEGARDE DU CONTEXTE (Cookies)
  // On force une petite attente pour que le navigateur finisse d'écrire les cookies sur le disque
  await page.waitForTimeout(1000);
  await page.context().storageState({ path: authFile });

  // ÉCRITURE DES FICHIERS
  const dir = path.dirname(sessionFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(sessionFile, sessionData);

  // LOG DE DÉBOGAGE FINAL
  const cookies = await context.cookies();
  console.log("🍪 Liste des cookies capturés :");
  if (cookies.length === 0) {
    console.error("❌ TOUJOURS AUCUN COOKIE. Vérifie si ton PHP n'envoie pas 'Secure; SameSite=None' sur du HTTP.");
  } else {
    cookies.forEach(c => console.log(`   - ${c.name} (Secure: ${c.secure}, Domain: ${c.domain})`));
  }
});