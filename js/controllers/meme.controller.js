'use strict'

const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

let gElCanvas
let gCtx
let gCurrElImg
let gIstxtBox
let gCurrFont = 'impact'
let elContainer
let gIsTextBorder
let gIsLineClicked = false
let gStartPos
// let gIsEmojiLine = false


function initCnvas() {
    gElCanvas = document.querySelector('.canvas-editor')
    gCtx = gElCanvas.getContext('2d')
    elContainer = document.querySelector('.editor-content')
    addListeners()
}

function renderMeme() {
    const meme = getMeme()
    if (!meme) return
    if (elContainer.offsetWidth < 500) updateLinesPos()
    const currImg = getImgById(meme.selectedImgId)
    let lines = meme.lines
    var img = new Image()
    img.src = currImg.url
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        lines.forEach(line => {
            drawText(line.txt, line.pos.x, line.pos.y, line.size, line.textColor, line.strokeColor, line.align, line.font)
        })
        if (!lines.length) {
            document.querySelector('.editor-txt-box').value = ''
            return
        }
        // let rectWidth = gCtx.measureText(gMeme.lines[gMeme.selectedLineIdx].txt).width
        let rectHeight = lines[meme.selectedLineIdx].size
        if (gIsTextBorder) {
            drawRect(20, lines[meme.selectedLineIdx].pos.y - 30, gElCanvas.width - 40, rectHeight + 20)
        }

        // if (gIsTextBorder) drawRect(lines[meme.selectedLineIdx].pos.y, rectWidth + 100, rectHeight)
        document.querySelector('.editor-txt-box').value = lines[meme.selectedLineIdx].txt
        gIsTextBorder = false
    }
}

function onFocusTxtInput() {
    gIsTextBorder = true
    renderMeme()
}

function drawText(txt, x, y, txtSize, txtColor, strokeColor, align, font) {
    gCtx.beginPath()
    gCtx.textBaseline = 'middle'
    gCtx.textAlign = align
    gCtx.lineWidth = 1
    gCtx.font = `${txtSize}px ${font}`
    gCtx.fillStyle = txtColor
    gCtx.fillText(txt, x, y)
    gCtx.strokeStyle = strokeColor
    gCtx.strokeText(txt, x, y)
    gCtx.closePath()
}

function drawRect(x, y, width, height) {
    gCtx.beginPath()
    gCtx.lineWidth = 2
    gCtx.rect(x, y, width, height)
    gCtx.strokeStyle = 'black'
    gCtx.stroke()
    gCtx.closePath()
}

function canvasClicked(ev) {
    let clickedTxt = null
    const lines = gMeme.lines
    let currLineIdx
    clickedTxt = lines.find((line, lineIdx) => {
        currLineIdx = lineIdx
        return ev.offsetX >= 20 && ev.offsetX <= gElCanvas.width - 20
            && ev.offsetY >= line.pos.y - 30 && ev.offsetY <= line.size + 20 + line.pos.y - 30
    })
    gIsLineClicked = false
    if (clickedTxt) {
        gIsLineClicked = true
        gMeme.selectedLineIdx = currLineIdx
        gIsTextBorder = true
        renderMeme()
    }
}

function onDown(ev) {
    const pos = getEvPos(ev)
    if (!gIsLineClicked) return
    setLineDrag(true)
    gStartPos = pos
    document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
    const meme = getMeme()
    const line = meme.lines[meme.selectedLineIdx]
    if (!line.isDrag) {
        document.body.style.cursor = 'default'
        return
    }
    const pos = getEvPos(ev)
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y
    moveText(dx, dy)
    gStartPos = pos
    renderMeme()
}

function onUp() {
    setLineDrag(false)
    document.body.style.cursor = 'grab'
}

function getEvPos(ev) {
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        console.log(ev.type)
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft,
            y: ev.pageY - ev.target.offsetTop
        }
    }
    return pos
}

function onTxtInput(val) {
    setLineTxt(val)
    renderMeme()
}

function showGallery() {
    document.querySelector('.editor').hidden = true
    document.querySelector('.gallery').hidden = false
    document.querySelector('.filter-container').hidden = false
    document.querySelector('.gallery-saved-imgs').hidden = true
}

function onColorText(color) {
    setTxtColor(color)
    renderMeme()
}

function onColorStroke(color) {
    setStrokeColor(color)
    renderMeme()
}

function onTxtSize(txtDiffr) {
    setTxtSize(txtDiffr)
    renderMeme()
}

function onLineSelector() {
    setLine()
    gIsTextBorder = true
    renderMeme()
    updateFontSelectVa()
}

function onFlexMeme() {
    getFlexMeme()
}
function resizeCanvas() {
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
    window.addEventListener('resize', () => {
        resizeCanvas()
        renderMeme()
    })
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}

function onAlignTxt(dir) {
    setAlignTxt(dir)
    renderMeme()
}

function onRemoveLine() {
    removeLine()
    renderMeme()
}

function onAddLine() {
    createNewLine('New Line', 250, 250)
    setLine('new')
    gIsTextBorder = true
    renderMeme()
}
function onAddEmojiLine(txt) {
    // gIsEmojiLine = true
    createNewLine(txt, 250, 250)
    setLine('new')
    gIsTextBorder = true
    renderMeme()
}

function onChangeFont(val) {
    setFont(val)
    renderMeme()
}

function updateFontSelectVa() {
    const meme = getMeme()
    const currLineFont = meme.lines[meme.selectedLineIdx].font
    document.querySelector('.font-selector').value = currLineFont
}

function onFlexMeme() {
    generateRandMeme()
    renderMeme()
    showEditor()
}

function onSaveMeme() {
    let data = gElCanvas.toDataURL('image/png')
    data = data.replace(/^data:image\/(png|jpg);base64,/, "")
    gMeme.isSaved = true
    const savedMeme = { img: data, meme: gMeme }
    saveMeme(savedMeme)
    showSavedMemes()
}

// function onSaveMeme() {
//     let data = gElCanvas.toDataURL('image/png')
//     data = data.replace(/^data:image\/(png|jpg);base64,/, "")
//     saveMeme(data)
// }

function onRemoveMeme() {
    if (gMeme.isSaved) {
        removeMeme()
    }
    showSavedMemes()
}

