import { expect, test } from '@playwright/test';

const token = 'playwright-test-token';
const initialApiKeys = [{ api_key: 'os_test_key_123', created_at: '2026-10-01T12:00:00Z' }];
const initialReports = [{
  id: 'REP-1234',
  name: 'October Security Report',
  date: 'Oct 01, 2026',
  status: 'Ready',
  size: '0.42 KB',
  content: '### OmniShield Threat Report\n\n**Total Scans Executed**: 4\n- Phishing scans: 2',
}];

async function useAuthenticatedSession(page) {
  await page.goto('/');
  await page.evaluate((savedToken) => {
    window.localStorage.setItem('omnishield_token', savedToken);
  }, token);
}

async function mockBackend(page, options = {}) {
  let apiKeys = [...initialApiKeys];
  let reports = [...initialReports];

  await page.route('**/*', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const isBackend = ['localhost:8000', '127.0.0.1:8000'].includes(url.host);
    if (!isBackend) return route.continue();

    const method = request.method();
    const path = url.pathname;
    let body = {};
    try {
      body = request.postDataJSON() || {};
    } catch {}

    if (path === '/api/auth/login' || path === '/api/auth/register') {
      const shouldFail = options.authFailure || body.password === 'bad-password';
      return route.fulfill({
        status: shouldFail ? 401 : 200,
        contentType: 'application/json',
        body: JSON.stringify(shouldFail
          ? { detail: 'Incorrect username or password' }
          : { access_token: token, token_type: 'bearer' }),
      });
    }
    if (path === '/api/auth/me') {
      return route.fulfill({ json: { username: 'analyst@example.com' } });
    }
    if (path === '/api/auth/api-keys' && method === 'GET') {
      return route.fulfill({ json: { keys: apiKeys } });
    }
    if (path === '/api/auth/api-keys' && method === 'POST') {
      const created = { api_key: 'os_generated_playwright_key', created_at: '2026-10-09T10:00:00Z' };
      apiKeys = [...apiKeys, created];
      return route.fulfill({ json: created });
    }
    if (path.startsWith('/api/auth/api-keys/') && method === 'DELETE') {
      const key = decodeURIComponent(path.split('/').pop());
      apiKeys = apiKeys.filter((item) => item.api_key !== key);
      return route.fulfill({ json: { detail: 'API Key revoked successfully' } });
    }
    if (path === '/api/threats') {
      return route.fulfill({ json: [{
        id: 'log-1', target: 'https://suspicious.example/login', tool: 'XGBOOST URL Model',
        status: 'Critical', risk: 91, time: '2026-10-09T10:00:00Z',
      }] });
    }
    if (path === '/api/stats') {
      return route.fulfill({ json: { threats_blocked: 3, pending_review: 1, ml_accuracy: '97.2%' } });
    }
    if (path === '/api/phishing' && method === 'POST') {
      return route.fulfill({ json: {
        url: body.url, is_phishing: true, risk_score: 0.91, model_used: 'XGBoost',
        risk_factors: ['Suspicious domain structure'], explanation: 'The URL has suspicious structure.',
      } });
    }
    if (path === '/api/deepfake' && method === 'POST') {
      return route.fulfill({ json: {
        filename: 'sample.mp4', is_deepfake: false, risk_score: 0.12,
        artifacts_detected: ['Natural frame texture'], explanation: 'No manipulation detected.',
      } });
    }
    if (path === '/api/metrics') {
      return route.fulfill({ json: {
        XGBoost: {
          Accuracy: 0.97, 'F1 Score': 0.96, Precision: 0.95, Recall: 0.94,
          Specificity: 0.98, 'False Positive Rate': 0.02, 'ROC-AUC': 0.99,
          'Inference Time (ms/sample)': 1.2, 'Model Size (MB)': 4.5,
          'Confusion Matrix': { TN: 48, FP: 2, FN: 3, TP: 47 },
        },
      } });
    }
    if (path === '/api/b2b-stats') {
      return route.fulfill({ json: {
        totalApiCalls: 12, threatsBlocked: 2, phishingBlocked: 1,
        recentLogs: [{ id: 'b2b-1', timestamp: '2026-10-09T10:00:00Z', target: '203.0.113.4',
          status: 'Critical', risk: 88, details: 'Suspicious automated traffic' }],
      } });
    }
    if (path === '/api/external/v1/telemetry') {
      return route.fulfill({ json: { status: 'Critical', action: 'BLOCK', threats_detected: ['API abuse'] } });
    }
    if (path === '/api/reports' && method === 'GET') {
      return route.fulfill({ json: reports });
    }
    if (path === '/api/reports/generate' && method === 'POST') {
      reports = [{ ...initialReports[0], id: 'REP-NEW1', name: 'Newly Generated Report' }, ...reports];
      return route.fulfill({ json: { message: 'Report generated successfully', id: 'report-new' } });
    }
    return route.fulfill({ status: 404, json: { detail: `Unmocked API route: ${method} ${path}` } });
  });
}

test.describe('OmniShield public pages and shared layout', () => {
  test('home page renders the product and its primary navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Enterprise Security/i })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: 'OmniShield' })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Pricing' })).toBeVisible();
    await expect(page.getByRole('contentinfo')).toContainText('All Systems Operational');
  });

  test('public route pages load with their page headings', async ({ page }) => {
    await mockBackend(page);
    const routes = [
      ['/services', 'Our Services'],
      ['/pricing', 'Transparent Pricing'],
      ['/developers', 'Developer API Integration'],
      ['/analytics', 'ML Evaluation Analytics'],
      ['/login', 'Sign in to your account'],
    ];
    for (const [path, heading] of routes) {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { name: new RegExp(heading, 'i') })).toBeVisible();
    }
  });

  test('mobile navbar opens and navigates to Profile', async ({ page }) => {
    await mockBackend(page);
    await useAuthenticatedSession(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.locator('nav button').click();
    await page.getByRole('link', { name: 'Profile', exact: true }).click();
    await expect(page).toHaveURL(/\/profile$/);
    await expect(page.getByRole('heading', { name: 'Account Settings' })).toBeVisible();
  });
});

test.describe('Authentication and protected routes', () => {
  test('login displays backend authentication errors', async ({ page }) => {
    await mockBackend(page, { authFailure: true });
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('analyst@example.com');
    await page.locator('input[type="password"]').fill('bad-password');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(page.getByText('Incorrect username or password')).toBeVisible();
  });

  test('registration can switch modes and successful auth redirects to dashboard', async ({ page }) => {
    await mockBackend(page);
    await page.goto('/login');
    await page.getByRole('button', { name: 'create a free account' }).click();
    await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible();
    await page.locator('input[type="email"]').fill('new-analyst@example.com');
    await page.locator('input[type="password"]').fill('strong-test-password');
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: 'URL Phishing Analyzer' })).toBeVisible();
  });

  test('dashboard redirects unauthenticated users to login', async ({ page }) => {
    await mockBackend(page);
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();
  });
});

test.describe('Authenticated tools and account functions', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackend(page);
    await useAuthenticatedSession(page);
  });

  test('dashboard runs phishing scan, switches models and displays result and logs', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByText('Threats Blocked')).toBeVisible();
    await expect(page.locator('main').getByText('3', { exact: true })).toBeVisible();
    await page.locator('input[type="url"]').fill('https://suspicious.example/login');
    await page.getByRole('combobox').selectOption('rf');
    await page.getByRole('button', { name: 'Scan URL' }).click();
    await expect(page.getByText('PHISHING THREAT')).toBeVisible();
    await expect(page.getByText('Suspicious domain structure')).toBeVisible();
    await page.getByRole('button', { name: /Live Threat Logs/ }).click();
    await expect(page.getByText('https://suspicious.example/login')).toBeVisible();
  });

  test('dashboard deepfake tool accepts a video selection and renders scan response', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('button', { name: /Deepfake Forensics/ }).click();
    await page.locator('input[type="file"]').setInputFiles({
      name: 'sample.mp4', mimeType: 'video/mp4', buffer: Buffer.from('mock video'),
    });
    await page.getByRole('button', { name: 'Analyze Media file' }).click();
    await expect(page.getByText('AUTHENTIC MEDIA')).toBeVisible();
    await expect(page.getByText('Natural frame texture')).toBeVisible();
  });

  test('profile lists, generates and revokes API keys', async ({ page }) => {
    await page.goto('/profile');
    await expect(page.getByRole('heading', { name: 'analyst@example.com' })).toBeVisible();
    await expect(page.getByText('os_test_key_123')).toBeVisible();
    await page.getByRole('button', { name: /Generate Key/ }).click();
    await expect(page.getByText('os_generated_playwright_key')).toBeVisible();
    page.on('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Revoke' }).first().click();
    await expect(page.getByText('os_test_key_123')).not.toBeVisible();
  });

  test('developer portal switches language examples and copies active snippet', async ({ page }) => {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/developers');
    await expect(page.getByRole('heading', { name: 'Developer API Integration' })).toBeVisible();
    await page.getByRole('button', { name: 'Python', exact: true }).click();
    await expect(page.locator('pre')).toContainText('verify_with_omnishield');
    await page.getByRole('button', { name: 'cURL', exact: true }).click();
    await expect(page.locator('pre')).toContainText('curl -X POST');
    await page.locator('.group button').click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('curl -X POST');
  });

  test('analytics page renders model metrics from backend data', async ({ page }) => {
    await page.goto('/analytics');
    await expect(page.getByRole('heading', { name: 'XGBoost' })).toBeVisible();
    await expect(page.getByText('97.00%', { exact: true })).toBeVisible();
    await expect(page.getByText('TN: 48')).toBeVisible();
  });

  test('B2B analytics renders activity and simulate API hit refreshes view', async ({ page }) => {
    await page.goto('/b2b-analytics');
    await expect(page.getByText('Total API Scans')).toBeVisible();
    await expect(page.getByText('203.0.113.4')).toBeVisible();
    await page.getByRole('button', { name: 'Simulate API Hit' }).click();
    await expect(page).toHaveURL(/\/b2b-analytics$/);
    await expect(page.getByText('Total API Scans')).toBeVisible();
  });

  test('reports generate, refresh, preview and close a report', async ({ page }) => {
    await page.goto('/reports');
    await expect(page.getByText('October Security Report')).toBeVisible();
    await page.getByRole('button', { name: 'Generate New' }).click();
    await expect(page.getByText('Newly Generated Report')).toBeVisible();
    await page.getByTitle('View Report').first().click();
    await expect(page.getByRole('heading', { name: 'Newly Generated Report' })).toBeVisible();
    await page.locator('button').filter({ has: page.locator('svg.lucide-x') }).click();
    await expect(page.getByRole('heading', { name: 'Newly Generated Report' })).not.toBeVisible();
  });

  test('pricing and services present current plan/service information', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByText('Developer', { exact: true })).toBeVisible();
    await expect(page.getByText('Professional', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Upgrade Now' })).toBeVisible();
    await page.goto('/services');
    await expect(page.getByRole('heading', { name: 'Phishing URL Detection' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Deepfake Forensics' })).toBeVisible();
  });
});