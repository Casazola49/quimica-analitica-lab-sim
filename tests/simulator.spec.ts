import { test, expect } from '@playwright/test';

test.describe('Simulador de Laboratorio: Pruebas E2E de Responsividad e Interacción', () => {

  test('Verificar visibilidad completa de mesada, matraz y reactivos sin desborde', async ({ page }) => {
    await page.goto('/');

    // 1. Verificar presencia de elementos clave de la mesada
    const burette = page.locator('#buretteGlass');
    const flask = page.locator('#flaskBody');
    const reagentShelf = page.locator('button', { hasText: 'Fenolftaleína' });

    await expect(burette).toBeVisible();
    await expect(flask).toBeVisible();
    await expect(reagentShelf).toBeVisible();

    // 2. Verificar que la repisa de reactivos esté dentro del viewport visible (sin recorte)
    const shelfBox = await reagentShelf.boundingBox();
    const viewport = page.viewportSize();

    expect(shelfBox).not.toBeNull();
    expect(viewport).not.toBeNull();
    if (shelfBox && viewport) {
      // Si estamos en desktop, la repisa debe estar dentro del viewport vertical
      if (viewport.width >= 1024) {
        expect(shelfBox.y + shelfBox.height).toBeLessThanOrEqual(viewport.height);
      }
    }
  });

  test('Operar purga de burbuja y adición de indicador', async ({ page }) => {
    await page.goto('/');

    // Al inicio debe haber alerta de burbuja
    const bubbleAlert = page.locator('text=Burbuja en el pico');
    await expect(bubbleAlert).toBeVisible();

    // Purgar burbuja
    const purgeBtn = page.locator('button', { hasText: 'Purgar Burbuja de Bureta' });
    await purgeBtn.click();

    // Debe cambiar a purgada y desaparecer la alerta
    await expect(page.locator('text=Llave Purgada (Sin aire)')).toBeVisible();
    await expect(bubbleAlert).toBeHidden();

    // Añadir fenolftaleína
    const indicatorBtn = page.locator('button[title*="fenolftaleína"]');
    await expect(indicatorBtn).toContainText('Fenolftaleína (0 gotas)');
    await indicatorBtn.click();
    await expect(indicatorBtn).toContainText('Fenolftaleína (1 gota)');

    await indicatorBtn.click();
    await expect(indicatorBtn).toContainText('Fenolftaleína (2 gotas)');
  });

  test('Abrir y cerrar llave de bureta con goteo', async ({ page }) => {
    await page.goto('/');

    const stopcockBtn = page.locator('button', { hasText: 'Llave: Cerrada' });
    await expect(stopcockBtn).toBeVisible();

    // Abrir llave
    await stopcockBtn.click();
    await expect(page.locator('button', { hasText: 'Llave: Gota a Gota' })).toBeVisible();

    // Dejar gotear 1 segundo
    await page.waitForTimeout(1200);

    // Cerrar llave
    await page.locator('button', { hasText: 'Llave: Gota a Gota' }).click();
    await expect(page.locator('button', { hasText: 'Llave: Cerrada' })).toBeVisible();
  });

  test('Interacción con Lupa de Menisco (4x) y transferencia de cota', async ({ page }) => {
    await page.goto('/');

    // Abrir lupa
    const loupeBtn = page.locator('button', { hasText: 'Lupa Menisco' });
    await loupeBtn.click();

    // Verificar modal de lupa visible
    await expect(page.locator('text=Lupa Óptica de Menisco (4x)')).toBeVisible();

    // Mover control de ángulo de paralaje
    const slider = page.locator('input[type="range"]');
    await slider.fill('0');

    // Transferir lectura a libreta
    const transferBtn = page.locator('button', { hasText: 'Anotar en Libreta' });
    await transferBtn.click();

    // Modal cerrado
    await expect(page.locator('text=Lupa Óptica de Menisco (4x)')).toBeHidden();
  });

  test('Completar Solicitud de Materiales y Reactivos del Ayudante', async ({ page }) => {
    await page.goto('/');

    // Abrir modal de materiales
    const materialsBtn = page.locator('button', { hasText: 'Solicitar Materiales' }).first();
    await materialsBtn.click();

    await expect(page.locator('text=Solicitud Pre-Laboratorio: Materiales y Reactivos')).toBeVisible();

    // Usar autocompletar recomendados
    await page.locator('button', { hasText: 'Autocompletar recomendados' }).click();

    // Verificar con el ayudante
    await page.locator('button', { hasText: 'Verificar Lista con Ayudante' }).click();

    // Debe mostrar banner de aprobación
    await expect(page.locator('text=¡Lista de Solicitud Aprobada por el Ayudante!')).toBeVisible();

    // Cerrar modal
    await page.locator('button', { hasText: 'Cerrar' }).click();
    const approvedBadge = page.locator('button[title*="Materiales y Reactivos requeridos"]');
    await expect(approvedBadge).toBeVisible();
  });

  test('Consultar Guía Oficial de Práctica con ambas pestañas', async ({ page }) => {
    await page.goto('/');

    const guideBtn = page.locator('button', { hasText: 'Guía de Práctica' });
    await guideBtn.click();

    await expect(page.locator('text=Guía de Procedimiento de Laboratorio y Mesada')).toBeVisible();

    // Pestaña 1 (Laboratorio Real)
    await expect(page.locator('text=KHC₈H₄O₄ + NaOH ➔ KNaC₈H₄O₄ + H₂O')).toBeVisible();

    // Cambiar a Pestaña 2 (Mesada Virtual)
    await page.locator('button', { hasText: '2. Cómo Operar la Mesada Virtual' }).click();
    await expect(page.locator('text=Paso 1: Purgar la Burbuja en el Pico de la Bureta')).toBeVisible();

    // Cerrar
    await page.locator('button', { hasText: 'Entendido, volver a la mesada' }).click();
  });

  test('Navegador de las 13 prácticas curriculares y filtros', async ({ page }) => {
    await page.goto('/');

    const practicesBtn = page.locator('button', { hasText: 'Prácticas (13)' });
    await practicesBtn.click();

    await expect(page.locator('text=Plan de Estudios: 13 Prácticas de Laboratorio (UMSS)')).toBeVisible();

    // Probar filtro Gravimetría
    await page.locator('button', { hasText: 'Gravimetría (P5)' }).click();
    await expect(page.locator('text=Determinación Gravimétrica de Sulfatos (BaSO4)')).toBeVisible();

    // Probar filtro Instrumental
    await page.locator('button', { hasText: 'Instrumental (P11-P13)' }).click();
    await expect(page.locator('text=Colorimetría y Espectrofotometría UV-Vis')).toBeVisible();

    // Cerrar
    await page.locator('button', { hasText: 'Cerrar Selector' }).click();
  });

  test('Cálculo y evaluación estequiométrica en la Libreta de Laboratorio', async ({ page }) => {
    await page.goto('/');

    // Si es pantalla grande, la libreta está visible directamente
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 1024) {
      await page.locator('button', { hasText: 'Abrir Libreta de Laboratorio' }).click();
    }

    // Ingresar datos en la libreta visible
    const netVInput = page.locator('input[placeholder="0.00"]:visible');
    await netVInput.fill('10.50');

    const concInput = page.locator('input[placeholder="ej. 0.1024"]:visible');
    await concInput.fill('0.1012');

    // Evaluar
    const evalBtn = page.locator('button:visible', { hasText: 'Evaluar Informe y Cálculos' });
    await evalBtn.click();

    // Verificar resultado
    await expect(page.locator('text=Puntaje Formativo Obtenido:')).toBeVisible();
    await expect(page.locator('text=Error Relativo (% Er):')).toBeVisible();
  });
});
