import sharp from 'sharp'

for (const name of ['hero', 'caterpillar', 'chrysalis', 'butterfly', 'garden']) {
  await sharp(`source-assets/${name}.png`)
    .webp({ quality: 85 })
    .toFile(`public/assets/${name}.webp`)
}

await sharp('Gina.PNG')
  .resize({ width: 1536, withoutEnlargement: true })
  .webp({ quality: 85 })
  .toFile('public/assets/garden-photo.webp')