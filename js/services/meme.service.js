'use strict'

let gMeme
let gSavedMemes = []

function setImg(imgId) {
    const placeholder = 'Add text here'
    gMeme = {
        selectedImgId: imgId,
        selectedLineIdx: 0,
        isSaved: false,
        lines: [
            createLine(placeholder, 200, 50),
            createLine(placeholder, 200, 410)
        ]
    }
}

function getMeme() {
    return gMeme
}

function setLineTxt(txt) {
    getSelctedLine().txt = txt
}

function setTxtColor(color) {
    getSelctedLine().textColor = color
}

function setStrokeColor(color) {
    getSelctedLine().strokeColor = color
}

function setTxtSize(txtDiffr) {
    const line = getSelctedLine()
    const fontSize = line.size
    if (fontSize >= 70 && txtDiffr > 0 || fontSize <= 30 && txtDiffr < 0) return
    else line.size += +txtDiffr
}

function setLine(val) {
    if (val === 'new') {
        gMeme.selectedLineIdx = gMeme.lines.length - 1
        return
    }
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1) gMeme.selectedLineIdx = 0
    else gMeme.selectedLineIdx++
}

function setAlignTxt(direction) {
    const line = getSelctedLine()
    if (direction === 'right') line.pos.x = 450
    else if (direction === 'left') line.pos.x = 50
    else line.pos.x = 200
    line.align = direction
}

function removeLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    if (gMeme.selectedLineIdx === 0) return
    gMeme.selectedLineIdx--
}

function createLine(txt, x, y) {
    return {
        txt,
        size: 40,
        align: 'center',
        textColor: 'white',
        strokeColor: 'black',
        font: 'impact',
        isDrag: false,
        pos: {
            x,
            y
        }
    }
}

function createNewLine(txt) {
    gMeme.lines.push(createLine(txt, 250, 250))
}

function setFont(font) {
    getSelctedLine().font = font
}

function generateRandMeme() {
    const memeTxts = [
        'Hold up', 'Keep Calm and Carry On', 'Winter is Coming', 'I\'m pooping', 'Bring it', 'I\'ts called fashion',
        'Wait a second', 'Nope', 'I want answers', 'Bring me'
    ]

    const numOfLines = getRandomInt(1, 3)

    gMeme = {
        selectedImgId: getRandImg(),
        selectedLineIdx: 0,
        isSaved: false,
        lines: [
            {
                txt: memeTxts[getRandomInt(0, memeTxts.length)],
                size: getRandomInt(30, 60),
                align: 'center',
                textColor: getRandomColor(),
                strokeColor: getRandomColor(),
                font: 'impact',
                isDrag: false,
                pos: {
                    x: 250,
                    y: 50
                }
            }
        ]
    }

    if (numOfLines === 2) {
        gMeme.lines.push({
            txt: memeTxts[getRandomInt(0, memeTxts.length)],
            size: getRandomInt(20, 60),
            align: 'center',
            textColor: getRandomColor(),
            strokeColor: getRandomColor(),
            font: 'impact',
            isDrag: false,
            pos: {
                x: 250,
                y: 450
            }
        })
    }
}

function saveMeme(savedMeme) {
    gSavedMemes = loadMemesFromStorage()
    if (!gSavedMemes) gSavedMemes = []
    gSavedMemes.push(savedMeme)
    saveMemesToStorage()
}

function updateLinesPos() {
    if (!gMeme) return
    let lines = gMeme.lines
    lines.forEach(line => {
        if (line.pos.y > 350) line.pos.y = 350
    })
}

function removeMeme() {
    gSavedMemes.splice(gSavedMemeIdx, 1)
    saveMemesToStorage()
}

function setLineDrag(isDrag) {
    getSelctedLine().isDrag = isDrag
}

function getSelctedLine() {
    return gMeme.lines[gMeme.selectedLineIdx]
}

function moveText(dx, dy) {
    const line = getSelctedLine()
    line.pos.x += dx
    line.pos.y += dy
}

function saveMemesToStorage() {
    _saveToStorage('memesDB', gSavedMemes)
}

function loadMemesFromStorage() {
    return _loadFromStorage('memesDB')
}

function getEmojis() {
    return ['😎', '😍', '😝', '💩', '🤪', '😵', '🤯', '🤣']
}

