'use strict'


let gElCanvas
let gCtx
let gCurrElImg


function initCnvas() {
    gElCanvas = document.querySelector('.canvas-editor')
    gCtx = gElCanvas.getContext('2d')
}

function renderMeme() {
    const meme = getMeme()
    const currImg = getImgById(meme.selectedImgId)
    const lines = meme.lines
    var img = new Image()
    img.src = currImg.url
    const linePos = { x: 100, y: 50 }
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        lines.forEach(line => {
            drawText(line.txt, linePos.x, linePos.y, line.size, line.color, line.align)
            linePos.y = 450
        })
        if (meme.selectedLineIdx === 0) linePos.y = 20
        else linePos.y = 420
        console.log('meme.selectedLineIdx', meme.selectedLineIdx)
        console.log('lines[meme.selectedLineIdx]', lines[meme.selectedLineIdx])
        console.log('lines[meme.selectedLineIdx].txt', lines[meme.selectedLineIdx].txt)
        console.log('x', gCtx.measureText(lines[meme.selectedLineIdx].txt).width)
        console.log('-----------------------------------------------')

        drawRect(linePos.y, gCtx.measureText(lines[meme.selectedLineIdx].txt).width, lines[meme.selectedLineIdx].size)
        document.querySelector('input').value = lines[meme.selectedLineIdx].txt
    }
}

function drawText(txt, x, y, txtSize, color, align) {
    gCtx.beginPath()
    gCtx.textBaseline = 'middle'
    gCtx.textAlign = align
    gCtx.lineWidth = 1
    gCtx.font = `${txtSize}px david`
    gCtx.fillStyle = color
    gCtx.fillText(txt, x, y)
    gCtx.strokeStyle = 'black'
    gCtx.strokeText(txt, x, y)
    gCtx.closePath()
}

function drawRect(y = 20, width, height) {
    console.log('y in drawRect', y)
    gCtx.beginPath()
    gCtx.lineWidth = 3
    gCtx.rect(90, y, width + 20, height + 10)
    gCtx.strokeStyle = 'red'
    gCtx.stroke()
    gCtx.closePath()
}

function onTxtInput(val) {
    setLineTxt(val)
    renderMeme()
}

function showGallery() {
    document.querySelector('.editor').hidden = true
    document.querySelector('.gallery').hidden = false
    document.querySelector('.filter-container').hidden = false
}


function onColorSelector(color) {
    setTxtColor(color)
    renderMeme()
}

function onTxtSize(txtDiffr) {
    setTxtSize(txtDiffr)
    renderMeme()
}

function onLineSelector() {
    setLine()
    renderMeme()
}