import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 10,
  use: {
    baseURL: 'http://localhost:5173',
    // Charge automatiquement les COOKIES
    
    screenshot: 'only-on-failure',
  },
  
  projects: [
    /* --- Navigateurs de Bureau (Desktop) --- */
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit', // Moteur de Safari
      use: { ...devices['Desktop Safari'] },
    },

    /* --- Émulation Mobile --- */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
});