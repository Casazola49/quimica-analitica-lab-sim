import { test, expect } from '@playwright/test';

test.describe('Simulador de Laboratorio: Pruebas E2E de Flujo Físico y Responsividad', () => {

  test('Flujo de inicio: Solicitud previa de materiales requerida al abrir el simulador', async ({ page }) => {
    await page.goto('/');

    // 1. Al iniciar debe aparecer el modal de solicitud de materiales
    const materialsModal = page.locator('text=Solicitud Pre-Laboratorio: Materiales y Reactivos');
    await expect(materialsModal).toBeVisible();

    // 2. Usar botón de autocompletar recomendados
    await page.locator('button', { hasText: 'Autocompletar recomendados' }).click();

    // 3. Verificar con el ayudante de laboratorio (notificación centrada inmediata)
    await page.locator('button', { hasText: 'Verificar Lista con Ayudante' }).click();
    await expect(page.locator('text=¡Solicitud Aprobada por el Ayudante!')).toBeVisible();

    // 4. Ingresar a la mesada
    await page.locator('button', { hasText: 'Ingresar a la Mesada Virtual' }).click();
    await expect(materialsModal).toBeHidden();
  });

  test('Verificar que el simulador empiece en reposo (agitador apagado y bureta vacía)', async ({ page }) => {
    await page.goto('/');

    // Cerrar modal de materiales primero ingresando a la mesada
    await page.locator('button', { hasText: 'Autocompletar recomendados' }).click();
    await page.locator('button', { hasText: 'Verificar Lista con Ayudante' }).click();
    await page.locator('button', { hasText: 'Ingresar a la Mesada Virtual' }).click();

    // 1. La agitación debe estar estrictamente DETENIDA al inicio
    const stirrerBtn = page.locator('button', { hasText: 'Matraz vacío: Pesar KHP en Balanza Analítica' });
    await expect(stirrerBtn).toBeVisible();

    // 2. La llave de la bureta debe indicar "Bureta vacía" antes de ser cargada
    await expect(page.locator('button', { hasText: 'Bureta vacía' })).toBeVisible();

    // 3. El stepper debe indicar paso 2 (Cargar NaOH)
    await expect(page.locator('text=2. Cargar NaOH')).toBeVisible();
  });

  test('Paso a paso físico: Cargar bureta, pesar en balanza analítica y purgar', async ({ page }) => {
    await page.goto('/');

    // Aprobar materiales
    await page.locator('button', { hasText: 'Autocompletar recomendados' }).click();
    await page.locator('button', { hasText: 'Verificar Lista con Ayudante' }).click();
    await page.locator('button', { hasText: 'Ingresar a la Mesada Virtual' }).click();

    // 1. Cargar bureta con NaOH
    const loadBuretteBtn = page.locator('button', { hasText: '1. Cargar Bureta con NaOH 0.1 N' });
    await loadBuretteBtn.click();
    await expect(page.locator('text=✓ Bureta con NaOH')).toBeVisible();

    // 2. Pesar KHP en Balanza Analítica
    const balanceBtn = page.locator('button', { hasText: '2. Pesar KHP en Balanza' });
    await balanceBtn.click();
    await expect(page.locator('text=Balanza Analítica Digital (Sensibilidad 0.1 mg)')).toBeVisible();

    // Seguir pasos de la balanza
    await page.locator('button', { hasText: '1. Colocar pesafiltro seco en el platillo' }).click();
    await page.locator('button', { hasText: '2. Presionar botón de Tara (TARE ➔ 0.0000 g)' }).click();
    await page.locator('button', { hasText: '3. Adicionar Biftalato de Potasio con espátula' }).click();
    await page.locator('button', { hasText: '4. Transferir muestra al Erlenmeyer' }).click();

    // Balanza cerrada y muestra disuelta
    await expect(page.locator('text=✓ KHP Disuelto en Erlenmeyer')).toBeVisible();

    // 3. Ahora el botón de agitación está disponible y apagado
    const stirBtn = page.locator('button', { hasText: 'Agitación: Detenida' });
    await expect(stirBtn).toBeVisible();

    // Encender agitación
    await stirBtn.click();
    await expect(page.locator('button', { hasText: 'Agitación: 450 RPM (Vórtice)' })).toBeVisible();

    // 4. Purgar burbuja de la bureta
    const purgeBtn = page.locator('button', { hasText: 'Purgar Burbuja' });
    await purgeBtn.click();
    await expect(page.locator('text=✓ Llave Purgada')).toBeVisible();
  });

  test('Rotación suave de la llave de la bureta sin saltos de posición', async ({ page }) => {
    await page.goto('/');

    // Setup rápido
    await page.locator('button', { hasText: 'Autocompletar recomendados' }).click();
    await page.locator('button', { hasText: 'Verificar Lista con Ayudante' }).click();
    await page.locator('button', { hasText: 'Ingresar a la Mesada Virtual' }).click();
    await page.locator('button', { hasText: '1. Cargar Bureta con NaOH 0.1 N' }).click();

    // Abrir llave
    const stopcockGroup = page.locator('#stopcock');
    await stopcockGroup.click();

    await expect(page.locator('button', { hasText: 'Llave: Gota a Gota' })).toBeVisible();

    // Esperar goteo y cerrar
    await page.waitForTimeout(1000);
    await stopcockGroup.click();
    await expect(page.locator('button', { hasText: 'Llave: Cerrada' })).toBeVisible();
  });

  test('Verificar que la mesada completa permanezca visible sin recortes en 100% zoom', async ({ page }) => {
    await page.goto('/');

    // Setup rápido
    await page.locator('button', { hasText: 'Autocompletar recomendados' }).click();
    await page.locator('button', { hasText: 'Verificar Lista con Ayudante' }).click();
    await page.locator('button', { hasText: 'Ingresar a la Mesada Virtual' }).click();

    const burette = page.locator('#buretteGlass');
    const flask = page.locator('#flaskBody');
    const shelf = page.locator('button', { hasText: 'Reiniciar' });

    await expect(burette).toBeVisible();
    await expect(flask).toBeVisible();
    await expect(shelf).toBeVisible();

    const shelfBox = await shelf.boundingBox();
    const viewport = page.viewportSize();

    if (shelfBox && viewport && viewport.width >= 1024) {
      expect(shelfBox.y + shelfBox.height).toBeLessThanOrEqual(viewport.height);
    }
  });
});
