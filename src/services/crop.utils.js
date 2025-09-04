export async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  // canvas size = crop box size
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  // move canvas origin to center for rotation
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.translate(-canvas.width / 2, -canvas.height / 2)

  // draw the image portion to canvas
  ctx.drawImage(
    image,
    pixelCrop.x,             // sx
    pixelCrop.y,             // sy
    pixelCrop.width,         // sWidth
    pixelCrop.height,        // sHeight
    0,                       // dx
    0,                       // dy
    pixelCrop.width,         // dWidth
    pixelCrop.height         // dHeight
  )

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const blobUrl = URL.createObjectURL(blob)
      resolve({ blob, blobUrl })
    }, 'image/jpeg', 0.95)
  })
}

function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', (e) => reject(e))
    img.crossOrigin = 'anonymous'
    img.src = url
  })
}
