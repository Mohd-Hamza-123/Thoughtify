

import React from 'react'

const getCanvasPreview = (image, canvas, crop) => {


    const ctx = canvas.getContext('2d')
    // console.log(ctx)
    if (!ctx) {
        throw new Error("No 2d Context")
    }
    const pixelRatio = window.devicePixelRatio

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    canvas.width = Math.floor(crop.width * pixelRatio * scaleX)
    canvas.height = Math.floor(crop.height * pixelRatio * scaleY)



    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = 'high'
    ctx.save()

    const cropX = crop.x * scaleX
    const cropY = crop.y * scaleY


    ctx.translate(-cropX, -cropY)

    ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight
    )
    ctx.restore()
}
const getCroppedFile = (canvas) => {
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        });
    });
};
export { getCanvasPreview, getCroppedFile } 