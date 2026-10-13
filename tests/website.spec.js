import { test, expect } from '@playwright/test'

async function waitForSlide(page, index) {
  await expect(page.locator('.presentation')).toHaveAttribute('data-slide-index', String(index))
  await expect(page.locator('.presentation')).toHaveAttribute('data-transitioning', 'false')
}

async function contentOutsideSlide(page) {
  return page.locator('.slide').evaluate(slide => {
    const stage = slide.getBoundingClientRect()
    return [...slide.querySelectorAll('h1,h2:not(.sr-only),p,blockquote,figcaption,.plant-names>span')]
      .filter(element => getComputedStyle(element).display !== 'none')
      .filter(element => { const box = element.getBoundingClientRect(); return box.top < stage.top - 1 || box.bottom > stage.bottom + 1 || box.left < stage.left - 1 || box.right > stage.right + 1 })
      .map(element => element.textContent)
  })
}

for (const viewport of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844 }]) {
  test(`${viewport.name}: complete presentation navigation`, async ({ page }, testInfo) => {
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
    await page.setViewportSize(viewport)
    await page.goto('/#story')
    await page.evaluate(() => document.fonts.ready)
    await waitForSlide(page, 0)
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
    await expect(page.locator('.slide button,.slide a,input')).toHaveCount(0)
    for (let index = 0; index < 14; index++) {
      await waitForSlide(page, index)
      await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(index + 1))
      const images = page.locator('.slide img')
      for (let imageIndex = 0; imageIndex < await images.count(); imageIndex++) await images.nth(imageIndex).evaluate(image => image.decode())
      if (index === 9) {
        await expect(page.locator('.garden-photo img')).toHaveAttribute('src', '/assets/garden-photo.webp')
        await expect(page.locator('.garden-photo img')).toHaveCSS('object-fit', 'contain')
        await expect(page.locator('.garden-photo img')).toHaveCSS('mix-blend-mode', 'normal')
        await expect(page.locator('.garden-photo figcaption')).toHaveText('תמונת השראה לגינה · לא תוכנית אדריכלית')
      }
      await page.screenshot({ path: testInfo.outputPath(`${viewport.name}-slide-${String(index + 1).padStart(2, '0')}.png`), animations: 'disabled' })
      expect(await contentOutsideSlide(page), `slide ${index + 1} should fit without scrolling`).toEqual([])
      if (index < 13) {
        if (index % 3 === 0) await page.locator('.presentation-stage').click({ position: { x: 20, y: 20 } })
        else if (index % 3 === 1) await page.getByRole('button', { name: 'השקף הבא', exact: true }).click()
        else await page.keyboard.press('ArrowLeft')
      }
    }
    await expect(page.getByRole('button', { name: 'סיום המצגת' })).toBeDisabled()
    await page.locator('.presentation-stage').click()
    await page.keyboard.press('ArrowLeft')
    await waitForSlide(page, 13)
    await page.keyboard.press('ArrowRight')
    await waitForSlide(page, 12)
    await page.getByRole('button', { name: 'השקף הבא', exact: true }).click()
    await waitForSlide(page, 13)
    await page.getByRole('button', { name: 'השקף הקודם', exact: true }).click()
    await waitForSlide(page, 12)
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '13')
    await page.getByRole('button', { name: 'השקף הבא', exact: true }).click()
    await waitForSlide(page, 13)
    expect(errors).toEqual([])
  })
}

test('hatching reveal runs automatically, stays readable and respects reduced motion', async ({ page }, testInfo) => {
  test.setTimeout(45000)
  await page.addInitScript(() => { document.startViewTransition = undefined })
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport)
    await page.goto('/')
    for (let index = 1; index <= 7; index++) {
      await page.locator('.presentation-stage').click({ position: { x: 20, y: 20 } })
      await waitForSlide(page, index)
    }
    await expect(page.locator('.hatching-scene')).toHaveCount(0)
    await page.getByRole('button', { name: 'השקף הבא', exact: true }).click()
    await waitForSlide(page, 8)
    await expect(page.locator('.hatching-butterfly')).toHaveCount(7)
    await page.locator('.hatching-photo').evaluate(image => image.decode())
    for (const [phase, time] of [['opening', 400], ['emerging', 1550], ['flight', 2500], ['settled', 5500]]) {
      await page.locator('.hatching-scene').evaluate(async (scene, time) => {
        scene.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time })
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      }, time)
      const photo = await page.locator('.hatching-photo').evaluate(image => ({ opacity: Number(getComputedStyle(image).opacity), clip: getComputedStyle(image).clipPath }))
      if (phase === 'opening') {
        expect(photo.opacity).toBeLessThan(1)
        expect(photo.clip).not.toMatch(/^ellipse\(48% 48%(?: at 50% 50%)?\)$/)
        await expect(page.locator('.hatching-chrysalis')).toHaveCSS('opacity', '1')
      }
      if (phase === 'settled') {
        expect(photo.opacity).toBe(1)
        expect(photo.clip).toMatch(/^ellipse\(48% 48%(?: at 50% 50%)?\)$/)
        await expect(page.locator('.hatching-chrysalis')).toHaveCSS('opacity', '0')
      }
      if (phase === 'flight') {
        const visible = await page.locator('.hatching-butterfly').evaluateAll(butterflies => butterflies.filter(butterfly => Number(getComputedStyle(butterfly).opacity) > 0.2).length)
        expect(visible).toBeGreaterThan(0)
      }
      expect(await contentOutsideSlide(page)).toEqual([])
      await page.screenshot({ path: testInfo.outputPath(`hatching-${viewport.width}-${phase}.png`) })
    }
    await page.getByRole('button', { name: 'השקף הקודם', exact: true }).click()
    await waitForSlide(page, 7)
    await page.getByRole('button', { name: 'השקף הבא', exact: true }).click()
    await waitForSlide(page, 8)
    expect(await page.locator('.hatching-photo').evaluate(image => image.getAnimations().some(animation => animation.playState === 'running'))).toBe(true)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(page.locator('.hatching-flight')).toBeHidden()
    await expect(page.locator('.hatching-chrysalis')).toBeHidden()
    await expect(page.locator('.hatching-photo')).toHaveCSS('opacity', '1')
    await page.emulateMedia({ reducedMotion: 'no-preference' })
  }
})

test('RTL progress and previous button work on desktop and small phones', async ({ page }, testInfo) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 844 })
    await page.goto('/')
    const previous = page.getByRole('button', { name: 'השקף הקודם', exact: true })
    await expect(previous).toBeDisabled()
    const positions = await page.locator('.progress-track>span').evaluateAll(segments => segments.map(segment => segment.getBoundingClientRect().x))
    expect(positions[0]).toBeGreaterThan(positions[13])
    await page.locator('.presentation-stage').click({ position: { x: 20, y: 20 } })
    await waitForSlide(page, 1)
    await expect(page.locator('.progress-track>.complete')).toHaveCount(2)
    await previous.click()
    await waitForSlide(page, 0)
    await expect(previous).toBeDisabled()
    await expect(page.locator('.progress-track>.complete')).toHaveCount(1)
    await page.getByRole('button', { name: 'השקף הבא', exact: true }).click()
    await waitForSlide(page, 1)
    await previous.focus()
    await page.keyboard.press('Enter')
    await waitForSlide(page, 0)
    const footer = await page.locator('.presentation-footer').evaluate(element => ({ width: element.clientWidth, scrollWidth: element.scrollWidth }))
    expect(footer.scrollWidth).toBeLessThanOrEqual(footer.width)
    await page.screenshot({ path: testInfo.outputPath(`navigation-${width}.png`), animations: 'disabled' })
  }
})

test('RTL keyboard directions respect boundaries and rapid input never skips slides', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('ArrowRight')
  await waitForSlide(page, 0)
  await page.locator('.presentation-stage').dblclick({ position: { x: 20, y: 20 } })
  await waitForSlide(page, 1)
  await page.keyboard.press('ArrowRight')
  await waitForSlide(page, 0)
  await page.keyboard.press('ArrowLeft')
  await waitForSlide(page, 1)
  for (const [index, key] of ['ArrowLeft', 'ArrowUp', 'PageUp', ' ', 'Enter', 'ArrowDown', 'PageDown'].entries()) {
    await page.keyboard.press(key)
    await waitForSlide(page, index + 2)
  }
  await page.keyboard.down('ArrowLeft')
  await waitForSlide(page, 9)
  await page.keyboard.down('ArrowLeft')
  await waitForSlide(page, 9)
  await page.keyboard.up('ArrowLeft')
  await page.keyboard.down('ArrowRight')
  await waitForSlide(page, 8)
  await page.keyboard.down('ArrowRight')
  await waitForSlide(page, 8)
  await page.keyboard.up('ArrowRight')
  await page.locator('.next-button').focus()
  await page.keyboard.press('ArrowRight')
  await waitForSlide(page, 7)
  await page.keyboard.press('ArrowLeft')
  await waitForSlide(page, 8)
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '9')
  await page.mouse.wheel(0, 900)
  await expect(page.locator('.presentation')).toHaveAttribute('data-slide-index', '8')
  expect(await page.evaluate(() => scrollY)).toBe(0)
})

test.describe('touch and fullscreen', () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 844 } })

  test('fullscreen remains independent and tapping content advances', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'מסך מלא', exact: true }).click()
    await expect.poll(() => page.evaluate(() => Boolean(document.fullscreenElement))).toBe(true)
    await expect(page.locator('.presentation')).toHaveAttribute('data-slide-index', '0')
    await page.getByRole('button', { name: 'יציאה ממסך מלא', exact: true }).click()
    await expect.poll(() => page.evaluate(() => Boolean(document.fullscreenElement))).toBe(false)
    await page.locator('.slide h1').tap()
    await waitForSlide(page, 1)
    await page.locator('.brand').tap()
    await waitForSlide(page, 2)
    await page.locator('.next-button').focus()
    await page.keyboard.press('Enter')
    await waitForSlide(page, 3)
    await page.getByRole('progressbar').tap()
    await waitForSlide(page, 4)
  })
})

test('rejected optional scene transitions preserve navigation without runtime errors', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(() => {
    document.startViewTransition = update => {
      const finished = Promise.resolve().then(update)
      return { finished, ready: finished.then(() => { throw new DOMException('Transition unavailable', 'InvalidStateError') }) }
    }
  })
  await page.goto('/')
  await page.locator('.slide h1').click()
  await waitForSlide(page, 1)
  await page.keyboard.press('ArrowLeft')
  await waitForSlide(page, 2)
  expect(errors).toEqual([])
})

test('all slides fit small phones, tablets, laptops and reduced motion', async ({ page }) => {
  test.setTimeout(120000)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const viewport of [{ width: 320, height: 568 }, { width: 375, height: 667 }, { width: 768, height: 1024 }, { width: 1024, height: 700 }, { width: 1920, height: 1080 }]) {
    await page.setViewportSize(viewport)
    await page.goto('/')
    for (let index = 0; index < 14; index++) {
      await waitForSlide(page, index)
      expect(await contentOutsideSlide(page), `${viewport.width}x${viewport.height}, slide ${index + 1}`).toEqual([])
      expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(viewport.height)
      if (index < 13) await page.locator('.presentation-stage').click({ position: { x: 20, y: 20 } })
    }
  }
})