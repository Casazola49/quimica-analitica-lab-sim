import { test, expect } from '@playwright/test';

test.describe('Simulador de Laboratorio: Pruebas E2E del Portal de Inicio y Flujo de Prácticas', () => {

  test('Portal de Inicio (Landing Hub): Debe recibir al alumno con estética Alquímica-33 y metodología en 3 pasos', async ({ page }) => {
    await page.goto('/');

    // 1. Debe mostrar el Hero institucional con sello Alquímica-33
    await expect(page.locator('text=Laboratorio Virtual de Química Analítica Cuantitativa')).toBeVisible();
    await expect(page.locator('text=Alquímica-33').first()).toBeVisible();

    // 2. Metodología en 3 pasos visible
    await expect(page.locator('text=Control de Entrada: Requisición de Materiales')).toBeVisible();
    await expect(page.locator('text=Mesada 2D y Cuidado de Técnica Analítica (TDA)')).toBeVisible();
    await expect(page.locator('text=Libreta de Laboratorio & Tríada Digital')).toBeVisible();

    // 3. Grid con las 13 prácticas del plan de estudios
    await expect(page.locator('text=Selecciona la Práctica de Laboratorio a Realizar')).toBeVisible();
    await expect(page.locator('button', { hasText: 'Iniciar Laboratorio P4' })).toBeVisible();
  });

  test('Iniciar Práctica P4 desde el Portal y probar Balanza Interactiva "Per Se", Gotero y Purga Zoom', async ({ page }) => {
    await page.goto('/');

    // Iniciar P4 desde el hub
    await page.locator('button', { hasText: 'Iniciar Laboratorio P4' }).click();

    // Debe abrir la mesada de P4 y desplegar la solicitud de materiales de P4
    await expect(page.locator('text=Solicitud Pre-Laboratorio: Práctica 4')).toBeVisible();

    // Completar requisición
    await page.locator('button', { hasText: 'Autocompletar recomendados' }).click();
    await page.locator('button', { hasText: 'Verificar Lista con Ayudante' }).click();
    await page.locator('button', { hasText: 'Ingresar a la Mesada Virtual' }).click();

    // 1. Probar Modal de Cálculos Previos
    await page.locator('button', { hasText: 'Cálculos Previos' }).click();
    await expect(page.locator('text=Cálculos Previos de Preparación')).toBeVisible();
    await page.locator('button', { hasText: 'Autocompletar estequiometría teórica' }).click();
    await page.locator('button', { hasText: 'Comprobar' }).click();
    await expect(page.locator('text=¡Cálculos Verificados Conformes!')).toBeVisible();
    await page.locator('button', { hasText: 'Ir a la Mesada' }).click();

    // 2. Cargar bureta
    await page.locator('button', { hasText: '1. Cargar Bureta con NaOH 0.1 N' }).click();

    // 3. Probar Balanza Analítica Digital "Per Se"
    await page.locator('button', { hasText: '2. Pesar KHP en Balanza' }).click();
    await expect(page.locator('text=Balanza Analítica Digital Mettler Toledo')).toBeVisible();

    // Abrir y cerrar vitrina
    await page.locator('button', { hasText: 'Abrir Puertas Corredizas' }).click();
    await expect(page.locator('text=PUERTA ABIERTA')).toBeVisible();
    await page.locator('button', { hasText: 'Cerrar Puertas Corredizas' }).click();
    await expect(page.locator('text=PUERTAS CERRADAS (ESTABLE)')).toBeVisible();

    // Colocar pesafiltro y tarar
    await page.locator('button', { hasText: 'Colocar Pesafiltro en Platillo' }).click();
    await page.locator('button', { hasText: 'TARE / ZERO' }).click();

    // Dosificar con espátula (macro y micro) o autopesar
    await page.locator('button', { hasText: 'Porción Macro' }).click();
    await page.locator('button', { hasText: 'Autopesar óptimo' }).click();

    // Transferir al erlenmeyer
    await page.locator('button', { hasText: 'Transferir' }).click();
    await expect(page.locator('text=✓ KHP Disuelto en Erlenmeyer')).toBeVisible();

    // 4. Probar Purga de Burbuja con Zoom (TipPurgeModal)
    await page.locator('button', { hasText: 'Purgar Pico (Zoom)' }).or(page.locator('button', { hasText: 'Purgar Burbuja' })).first().click();
    await expect(page.locator('text=Inspección y Purga del Pico de la Bureta')).toBeVisible();
    await page.locator('button', { hasText: 'Girar llave con golpe enérgico' }).click();
    await expect(page.locator('text=¡Pico de bureta purgado exitosamente!')).toBeVisible();
    await page.locator('button', { hasText: 'Volver a la Mesada' }).click();
    await expect(page.locator('text=Inspección y Purga del Pico de la Bureta')).toBeHidden();

    // 5. Probar Gotero de Fenolftaleína Interactivo (IndicatorDropperModal)
    await page.locator('button', { hasText: 'Gotero Fenolftaleína' }).scrollIntoViewIfNeeded();
    await page.locator('button', { hasText: 'Gotero Fenolftaleína' }).click();
    await expect(page.locator('text=Adición Táctil de Fenolftaleína con Gotero')).toBeVisible();
    await page.locator('button', { hasText: 'Apretar Perilla del Gotero' }).click();
    await page.locator('button', { hasText: 'Apretar Perilla del Gotero' }).click();
    await expect(page.locator('text=✓ Dosis analítica correcta alcanzada')).toBeVisible();
    await page.locator('button', { hasText: 'Volver a la Mesada' }).click();
    await expect(page.locator('text=Adición Táctil de Fenolftaleína con Gotero')).toBeHidden();

    // Abrir libreta si es pantalla móvil
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 1024) {
      await page.locator('button', { hasText: 'Abrir Libreta de Laboratorio' }).click();
    }

    // Evaluar reporte en la libreta
    const netVInput = page.locator('input[placeholder="0.00"]:visible');
    await netVInput.fill('10.50');
    const concInput = page.locator('input[placeholder="ej. 0.1012"]:visible');
    await concInput.fill('0.1015');
    await page.locator('button:visible', { hasText: 'Evaluar Informe y Cálculos' }).click();

    // Abrir Modal de Informe Formal
    await page.locator('button:visible', { hasText: 'Descargar Informe (PDF)' }).click();
    await expect(page.locator('text=Informe Oficial de Laboratorio')).toBeVisible();
    await expect(page.locator('#printable-lab-report').locator('text=Alquímica-33').first()).toBeVisible();
    await expect(page.locator('text=Firma del Estudiante Evaluado')).toBeVisible();
    await page.locator('button', { hasText: 'Imprimir Informe' }).click();
    await page.locator('button:has(svg.lucide-x)').first().click();

    if (viewport && viewport.width < 1024) {
      await page.locator('button', { hasText: 'Volver a Mesada' }).click();
    }

    // Volver al Menú Principal
    await page.locator('button', { hasText: 'Menú Principal' }).click();
    await expect(page.locator('text=Laboratorio Virtual de Química Analítica Cuantitativa')).toBeVisible();
  });

  test('Iniciar Práctica P7 (Potenciometría) desde el Portal y verificar flujo', async ({ page }) => {
    await page.goto('/');

    // Iniciar P7 desde el hub
    await page.locator('button', { hasText: 'Iniciar Laboratorio P7' }).click();

    // Requisición específica P7
    await expect(page.locator('text=Solicitud Pre-Laboratorio: Práctica 7')).toBeVisible();
    await page.locator('button', { hasText: 'Autocompletar recomendados' }).click();
    await page.locator('button', { hasText: 'Verificar Lista con Ayudante' }).click();
    await page.locator('button', { hasText: 'Ingresar a la Mesada Virtual' }).click();

    // Cargar bureta
    await page.locator('button', { hasText: '1. Cargar Bureta con NaOH 0.1 N' }).click();

    // Pipetear HCl
    await page.locator('button', { hasText: '2. Pipetear 25.00 mL de HCl' }).click();
    await page.locator('button', { hasText: '1. Aspirar solución de HCl' }).click();
    await page.locator('button', { hasText: '2. Ajustar menisco cóncavo' }).click();
    await page.locator('button', { hasText: '3. Descarga libre vertical' }).click();
    await page.locator('button', { hasText: 'Retirar sin soplar' }).click();

    // Electrodo visible
    await expect(page.locator('#phElectrode')).toBeVisible();

    // Volver al Menú Principal
    await page.locator('button', { hasText: 'Menú Principal' }).click();
    await expect(page.locator('text=Laboratorio Virtual de Química Analítica Cuantitativa')).toBeVisible();
  });

  test('Iniciar Práctica P5 (Gravimetría) desde el Portal', async ({ page }) => {
    await page.goto('/');

    // Iniciar P5 desde el hub
    await page.locator('button', { hasText: 'Iniciar Laboratorio P5' }).click();

    // Requisición específica P5
    await expect(page.locator('text=Solicitud Pre-Laboratorio: Práctica 5')).toBeVisible();
    await page.locator('button', { hasText: 'Autocompletar recomendados' }).click();
    await page.locator('button', { hasText: 'Verificar Lista con Ayudante' }).click();
    await page.locator('button', { hasText: 'Ingresar a la Mesada Virtual' }).click();

    // Estación 1 visible
    await expect(page.locator('text=Estación 1: Precipitación en Caliente')).toBeVisible();

    // Volver al Menú Principal
    await page.locator('button', { hasText: 'Menú Principal' }).click();
    await expect(page.locator('text=Laboratorio Virtual de Química Analítica Cuantitativa')).toBeVisible();
  });

  test('Iniciar Práctica P12 (Espectrofotometría UV-Vis) desde el Portal', async ({ page }) => {
    await page.goto('/');

    // Iniciar P12 desde el hub
    await page.locator('button', { hasText: 'Iniciar Laboratorio P12' }).click();

    // Requisición específica P12
    await expect(page.locator('text=Solicitud Pre-Laboratorio: Práctica 12')).toBeVisible();
    await page.locator('button', { hasText: 'Autocompletar recomendados' }).click();
    await page.locator('button', { hasText: 'Verificar Lista con Ayudante' }).click();
    await page.locator('button', { hasText: 'Ingresar a la Mesada Virtual' }).click();

    // Consola visible
    await expect(page.locator('text=Espectrofotómetro UV-Visible Digital')).toBeVisible();

    // Volver al Menú Principal
    await page.locator('button', { hasText: 'Menú Principal' }).click();
    await expect(page.locator('text=Laboratorio Virtual de Química Analítica Cuantitativa')).toBeVisible();
  });
});
