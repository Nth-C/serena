import { test as setup } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const authFile = 'playwright/.auth/user.json';
const sessionFile = 'playwright/.auth/session.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  
  await page.locator('input[name="username"]').fill('c');
  await page.locator('input[name="mdp"]').fill('c');
  
  await Promise.all([
    page.waitForURL(/.*acce_suivi/),
    page.click('button[type="submit"]')
  ]);

  // On attend que React ait bien rempli le sessionStorage
  await page.waitForLoadState('networkidle');
  await page.waitForFunction(() => sessionStorage.getItem('isConnected') === 'true');

  // 1. Sauvegarde native (Cookies + LocalStorage)
  await page.context().storageState({ path: authFile });

  // 2. Sauvegarde manuelle du SessionStorage
  const sessionStorageData = await page.evaluate(() => JSON.stringify(sessionStorage));
  
  const dir = path.dirname(sessionFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(sessionFile, sessionStorageData);

  console.log("✅ Authentification et SessionStorage sauvegardés.");
});