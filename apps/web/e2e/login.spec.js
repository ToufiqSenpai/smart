import { test, expect } from '@playwright/test'

test.describe('Halaman Login', () => {
  test('menampilkan form login dengan benar', async ({ page }) => {
    await page.goto('/login')

    await expect(page.locator('h2, h1').first()).toBeVisible()
    await expect(page.getByLabel(/email/i).first()).toBeVisible()
    await expect(page.getByLabel(/password/i).first()).toBeVisible()
    await expect(page.getByRole('button', { name: /masuk|login|sign/i })).toBeVisible()
  })

  test('menampilkan error saat form kosong dikirim', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /masuk|login|sign/i }).click()

    await expect(page.getByText(/required|harus|wajib|diisi/i).first()).toBeVisible()
  })

  test('menavigasi ke halaman register', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('link', { name: /daftar|register/i }).click()

    await expect(page).toHaveURL(/register/)
    await expect(page.getByRole('heading', { name: /daftar|register/i }).first()).toBeVisible()
  })
})
