import { test, expect } from '@playwright/test';

test.describe('Simulador de Laboratorio: Pruebas E2E de Flujo Físico y Responsividad', () => {

  test('Flujo de inicio: Solicitud previa de materiales requerida al abrir el simulador', async ({ page }) => {
    await page.goto('/');

    // 1. Al iniciar debe aparecer el modal de solicitud de materiales
    const materialsModal = page.locator('text=Solicitud Pre-Laboratorio');
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

  test('Paso a paso físico P4: Cargar bureta, pesar en balanza analítica y purgar', async ({ page }) => {
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

  test('Práctica 7 (Potenciometría de HCl): Pipeteo con propipeta, electrodo de pH y curva de 1ra derivada', async ({ page }) => {
    await page.goto('/');

    // Cerrar modal inicial
    await page.locator('button', { hasText: 'Autocompletar recomendados' }).click();
    await page.locator('button', { hasText: 'Verificar Lista con Ayudante' }).click();
    await page.locator('button', { hasText: 'Ingresar a la Mesada Virtual' }).click();

    // Cambiar a Práctica 7 desde el selector
    await page.locator('button', { hasText: 'Prácticas (13)' }).click();
    await page.locator('text=P7').click();
    await page.locator('button', { hasText: 'Cargar Práctica 7 en la Mesada Virtual' }).click();

    // En P7 se abre de nuevo el modal de materiales específico para P7
    await expect(page.locator('text=Práctica 7 (Titulación Potenciométrica HCl)')).toBeVisible();
    await page.locator('button', { hasText: 'Autocompletar recomendados' }).click();
    await page.locator('button', { hasText: 'Verificar Lista con Ayudante' }).click();
    await page.locator('button', { hasText: 'Ingresar a la Mesada Virtual' }).click();

    // Cargar NaOH
    await page.locator('button', { hasText: '1. Cargar Bureta con NaOH 0.1 N' }).click();

    // Abrir Pipeta de 25.00 mL
    const pipetteBtn = page.locator('button', { hasText: '2. Pipetear 25.00 mL de HCl' });
    await pipetteBtn.click();

    // Pasos de la pipeta
    await page.locator('button', { hasText: '1. Aspirar solución de HCl' }).click();
    await page.locator('button', { hasText: '2. Ajustar menisco cóncavo' }).click();
    await page.locator('button', { hasText: '3. Descarga libre vertical' }).click();
    // Decisión de la gota (retirar sin soplar)
    await page.locator('button', { hasText: 'Retirar sin soplar' }).click();

    // Debe mostrar la alícuota con electrodo
    await expect(page.locator('text=✓ 25.00 mL HCl + Electrodo pH')).toBeVisible();
    await expect(page.locator('#phElectrode')).toBeVisible();

    // Si es pantalla grande, verificar pestaña de Curva Potenciométrica en la libreta
    const viewport = page.viewportSize();
    if (viewport && viewport.width >= 1024) {
      await page.locator('button', { hasText: 'Curva pH & 1ra Derivada' }).click();
      await expect(page.locator('text=Curva Potenciométrica en Tiempo Real')).toBeVisible();
    }
  });

  test('Práctica 5 (Gravimetría de BaSO4): Flujo completo de 5 estaciones y cálculo gravimétrico', async ({ page }) => {
    await page.goto('/');

    // Cerrar modal inicial
    await page.locator('button', { hasText: 'Autocompletar recomendados' }).click();
    await page.locator('button', { hasText: 'Verificar Lista con Ayudante' }).click();
    await page.locator('button', { hasText: 'Ingresar a la Mesada Virtual' }).click();

    // Cambiar a Práctica 5 desde el selector
    await page.locator('button', { hasText: 'Prácticas (13)' }).click();
    await page.locator('text=Determinación Gravimétrica de Sulfatos (BaSO4)').click();
    await page.locator('button', { hasText: 'Cargar Práctica 5 en la Mesada Virtual' }).click();

    // Aprobar materiales P5
    await expect(page.locator('text=Práctica 5 (Gravimetría de BaSO4)')).toBeVisible();
    await page.locator('button', { hasText: 'Autocompletar recomendados' }).click();
    await page.locator('button', { hasText: 'Verificar Lista con Ayudante' }).click();
    await page.locator('button', { hasText: 'Ingresar a la Mesada Virtual' }).click();

    // Estación 1: Precipitación
    await expect(page.locator('text=Estación 1: Precipitación en Caliente')).toBeVisible();
    await page.locator('button', { hasText: 'Adición Lenta Gota a Gota' }).click();
    await page.locator('button', { hasText: 'Pasar a Estación 2' }).click();

    // Estación 2: Digestión
    await expect(page.locator('text=Estación 2: Digestión Térmica')).toBeVisible();
    await page.locator('button', { hasText: 'Iniciar Digestión Térmica' }).click();
    await page.waitForTimeout(1500); // Esperar digestión
    await page.locator('button', { hasText: 'Pasar a Estación 3' }).click();

    // Estación 3: Filtración
    await expect(page.locator('text=Estación 3: Filtración por Gravedad')).toBeVisible();
    await page.locator('button', { hasText: 'Verter por varilla' }).click();
    await page.locator('button', { hasText: 'Pasar a Estación 4' }).click();

    // Estación 4: Test AgNO3
    await expect(page.locator('text=Estación 4: Ensayo de Cloruros')).toBeVisible();
    // 3 lavados con agua caliente
    await page.locator('button', { hasText: 'Lavar precipitado' }).click();
    await page.locator('button', { hasText: 'Lavar precipitado' }).click();
    await page.locator('button', { hasText: 'Lavar precipitado' }).click();
    await page.locator('button', { hasText: '+1 gota AgNO3' }).click();
    await expect(page.locator('text=Ensayo negativo de cloruros')).toBeVisible();
    await page.locator('button', { hasText: 'Pasar a Estación 5' }).click();

    // Estación 5: Calcinación y Peso Constante
    await expect(page.locator('text=Estación 5: Calcinación')).toBeVisible();
    await page.locator('button', { hasText: 'Calcinar crisol en mufla' }).click();
    await page.locator('button', { hasText: 'Enfriar 30 min en Desecador' }).click();
    await page.locator('button', { hasText: 'Realizar Pesada 1' }).click();
    await page.locator('button', { hasText: 'Calcinación adicional 15 min' }).click();

    await expect(page.locator('text=¡Peso Constante Alcanzado!')).toBeVisible();

    // Libreta: Evaluar % SO4
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 1024) {
      await page.locator('button', { hasText: 'Abrir Libreta de Laboratorio' }).click();
    }
    const percentInput = page.locator('input[placeholder="ej. 28.98"]:visible');
    await percentInput.fill('28.98');
    await page.locator('button:visible', { hasText: 'Evaluar Informe y Cálculos' }).click();
    await expect(page.locator('text=Puntaje Formativo:').first()).toBeVisible();
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
