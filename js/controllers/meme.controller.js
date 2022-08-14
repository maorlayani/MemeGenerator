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
let gTextWidthPadding = 10

function initCnvas() {
    gElCanvas = document.querySelector('.canvas-editor')
    gCtx = gElCanvas.getContext('2d')
    elContainer = document.querySelector('.editor-content')
    addListeners()
    renderEmoji()
}

function renderMeme() {

    const meme = getMeme()
    if (!meme) return

    if (elContainer.offsetWidth < 500) updateLinesPos()
    const currImg = getImgById(meme.selectedImgId)
    const lines = meme.lines
    let img = new Image()
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
        const line = getSelctedLine()
        const borderWidth = gCtx.measureText(line.txt).width
        // const borderWidth = gCtx.measureText(gMeme.lines[gMeme.selectedLineIdx].txt).width
        const borderHeight = line.size
        const borderY = line.pos.y
        const borderX = line.pos.x - (borderWidth / 2)

        const textHeightPadding = 10
        gTextWidthPadding = 10 + ((line.size - 40) * 2.5)

        if (gIsTextBorder) {
            drawRect(
                borderX - gTextWidthPadding,
                borderY - textHeightPadding,
                borderWidth + gTextWidthPadding * 2,
                borderHeight + textHeightPadding * 2
            )
        }
        document.querySelector('.editor-txt-box').value = line.txt
        gIsTextBorder = false
    }
}

function onFocusTxtInput() {
    const line = getSelctedLine()
    if (line.txt === 'Add text here') {
        setLineTxt(' ')
        gIsTextBorder = false
    } else gIsTextBorder = true
    renderMeme()
}

function drawText(txt, x, y, txtSize, txtColor, strokeColor, align, font) {
    gCtx.beginPath()
    gCtx.textBaseline = 'top'
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

function onTxtInput(val) {
    setLineTxt(val)
    renderMeme()
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
    updateFontSelectedVal()
}

function onFlexMeme() {
    getFlexMeme()
}

function onAlignTxt(direction) {
    setAlignTxt(direction)
    renderMeme()
}

function onRemoveLine() {
    removeLine()
    renderMeme()
}

function onAddLine() {
    createNewLine('Add text here', 250, 250)
    setLine('new')
    gIsTextBorder = true
    renderMeme()
}
function onAddEmojiLine(txt) {
    createNewLine(txt, 250, 250)
    setLine('new')
    gIsTextBorder = true
    renderMeme()
}

function onChangeFont(val) {
    setFont(val)
    renderMeme()
}

function updateFontSelectedVal() {
    const currLineFont = getSelctedLine().font
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
    const meme = getMeme()
    meme.isSaved = true
    const savedMeme = { img: data, meme }
    saveMeme(savedMeme)
    showSavedMemes()
}

function onRemoveMeme() {
    const meme = getMeme()
    if (meme.isSaved) {
        removeMeme()
    }
    showSavedMemes()
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

function resizeCanvas() {
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}

function showGallery() {
    document.querySelector('.editor').hidden = true
    document.querySelector('.gallery').hidden = false
    document.querySelector('.filter-container').hidden = false
    document.querySelector('.gallery-saved-imgs').hidden = true
}

function canvasClicked(ev) {
    let clickedTxt = null
    const meme = getMeme()
    const lines = meme.lines
    let currLineIdx
    const textHeightPadding = 10
    clickedTxt = lines.find((line, lineIdx) => {
        currLineIdx = lineIdx
        let borderWidth = gCtx.measureText(line.txt).width
        return ev.offsetX >= (line.pos.x - (borderWidth / 2)) - gTextWidthPadding
            && ev.offsetX <= borderWidth + gTextWidthPadding + (line.pos.x - (borderWidth / 2))
            && ev.offsetY >= line.pos.y && ev.offsetY <= line.size + textHeightPadding * 2 + line.pos.y
    })
    gIsLineClicked = false
    if (clickedTxt) {
        gIsLineClicked = true
        meme.selectedLineIdx = currLineIdx
        gIsTextBorder = true
        renderMeme()
    }
}

function onDown(ev) {
    gIsLineClicked = false
    canvasClicked(ev)
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
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft,
            y: ev.pageY - ev.target.offsetTop
        }
    }
    return pos
}

function downloadCanvas(elLink) {
    const data = gElCanvas.toDataURL()
    elLink.href = data
}

function renderEmoji() {
    const emojis = getEmojis()
    const strHTMLs = emojis.map(emoji =>
        `<span class="emoji-icon" onclick="onAddEmojiLine(this.innerText)">${emoji}</span>`
    )
    const elEmojis = document.querySelector('.emoji-container')
    elEmojis.innerHTML = strHTMLs.join('')
}

