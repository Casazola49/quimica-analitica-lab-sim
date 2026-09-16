import { test, expect } from '@playwright/test';

test.describe('Simulador de Laboratorio: Pruebas E2E del Portal de Inicio y Flujo de Prácticas', () => {

  test('Portal de Inicio (Landing Hub): Debe recibir al alumno con el menú curricular y metodología en 3 pasos', async ({ page }) => {
    await page.goto('/');

    // 1. Debe mostrar el Hero institucional
    await expect(page.locator('text=Laboratorio Virtual de Química Analítica Cuantitativa')).toBeVisible();
    await expect(page.locator('text=Simulador de Química Analítica Cuantitativa').first()).toBeVisible();

    // 2. Metodología en 3 pasos visible
    await expect(page.locator('text=Control de Entrada: Requisición de Materiales')).toBeVisible();
    await expect(page.locator('text=Mesada 2D y Cuidado de Técnica Analítica (TDA)')).toBeVisible();
    await expect(page.locator('text=Libreta de Laboratorio & Tríada Digital')).toBeVisible();

    // 3. Grid con las 13 prácticas del plan de estudios
    await expect(page.locator('text=Selecciona la Práctica de Laboratorio a Realizar')).toBeVisible();
    await expect(page.locator('button', { hasText: 'Iniciar Laboratorio P4' })).toBeVisible();
  });

  test('Iniciar Práctica P4 desde el Portal: Despliega mesada y requisición de materiales de P4', async ({ page }) => {
    await page.goto('/');

    // Iniciar P4 desde el hub
    await page.locator('button', { hasText: 'Iniciar Laboratorio P4' }).click();

    // Debe abrir la mesada de P4 y desplegar la solicitud de materiales de P4
    await expect(page.locator('text=Solicitud Pre-Laboratorio: Práctica 4')).toBeVisible();

    // Completar requisición
    await page.locator('button', { hasText: 'Autocompletar recomendados' }).click();
    await page.locator('button', { hasText: 'Verificar Lista con Ayudante' }).click();
    await page.locator('button', { hasText: 'Ingresar a la Mesada Virtual' }).click();

    // La mesada debe estar visible
    await expect(page.locator('#buretteGlass')).toBeVisible();
    await expect(page.locator('#flaskBody')).toBeVisible();

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
