// scripts/convert-to-webp.mjs
//
// Convertit toutes les images .png / .jpg / .jpeg de public/assets/ en .webp
// (même nom de fichier, juste l'extension qui change), avec la même logique
// de redimensionnement que optimize-images.mjs. Les fichiers .png/.jpg
// d'origine sont ensuite supprimés puisque le code référence maintenant
// uniquement du .webp.
//
// Usage : npm run convert-webp

import sharp from 'sharp'
import { readdir, stat, unlink } from 'node:fs/promises'
import path from 'node:path'

const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets')

function maxWidthFor(filename) {
  if (filename.startsWith('hero-')) return 1600
  if (filename.startsWith('detail-')) return 1200
  if (filename.startsWith('card-')) return 900
  if (filename.startsWith('usage-')) return 700
  return 1200
}

async function convertFile(filename) {
  const ext = path.extname(filename).toLowerCase()
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return

  const filePath = path.join(ASSETS_DIR, filename)
  const webpName = filename.slice(0, -ext.length) + '.webp'
  const webpPath = path.join(ASSETS_DIR, webpName)

  const before = (await stat(filePath)).size
  const maxWidth = maxWidthFor(filename)

  let pipeline = sharp(filePath)
  const meta = await pipeline.metadata()
  if (meta.width && meta.width > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth })
  }

  await pipeline.webp({ quality: 82 }).toFile(webpPath)

  const after = (await stat(webpPath)).size
  const savedPct = Math.round((1 - after / before) * 100)
  console.log(`✓ ${filename} → ${webpName} : ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB (-${savedPct}%)`)

  // Supprime l'original .png/.jpg maintenant que le .webp existe
  await unlink(filePath)
}

async function run() {
  const files = await readdir(ASSETS_DIR)
  const toConvert = files.filter((f) => /\.(png|jpe?g)$/i.test(f))
  console.log(`Conversion de ${toConvert.length} images en WebP...\n`)

  for (const file of toConvert) {
    try {
      await convertFile(file)
    } catch (err) {
      console.error(`✗ ${file}: échec —`, err.message)
    }
  }
  console.log('\nTerminé. Tous les fichiers .png/.jpg ont été remplacés par des .webp.')
}

run()