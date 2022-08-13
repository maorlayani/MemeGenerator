'use strict'

let gMeme
let gSavedImages = []

function setImg(imgId) {
    gMeme = {
        selectedImgId: imgId,
        selectedLineIdx: 0,
        isSaved: false,
        lines: [
            createLine('Add text here', 200, 50),
            createLine('Add text also here', 200, 450)
        ]
    }
}

function getMeme() {
    return gMeme
}

function setLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function setTxtColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].textColor = color
}

function setStrokeColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].strokeColor = color
}

function setTxtSize(txtDiffr) {
    const fontSize = gMeme.lines[gMeme.selectedLineIdx].size
    if (fontSize >= 70 && txtDiffr > 0) return
    else gMeme.lines[gMeme.selectedLineIdx].size += +txtDiffr
}

function setLine(val) {
    if (val === 'new') {
        gMeme.selectedLineIdx = gMeme.lines.length - 1
        return
    }
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1) gMeme.selectedLineIdx = 0
    else gMeme.selectedLineIdx++
}

function setAlignTxt(dir) {
    if (dir === 'right') gMeme.lines[gMeme.selectedLineIdx].pos.x = 450
    else if (dir === 'left') gMeme.lines[gMeme.selectedLineIdx].pos.x = 50
    else gMeme.lines[gMeme.selectedLineIdx].pos.x = 200
    gMeme.lines[gMeme.selectedLineIdx].align = dir
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
    gMeme.lines[gMeme.selectedLineIdx].font = font
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
    gSavedImages = loadMemesFromStorage()
    if (!gSavedImages) gSavedImages = []
    gSavedImages.push(savedMeme)
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
    gSavedImages.splice(gSavedMemeIdx, 1)
    saveMemesToStorage()
}

function setLineDrag(isDrag) {
    gMeme.lines[gMeme.selectedLineIdx].isDrag = isDrag
}

function moveText(dx, dy) {
    gMeme.lines[gMeme.selectedLineIdx].pos.x += dx
    gMeme.lines[gMeme.selectedLineIdx].pos.y += dy
}

function saveMemesToStorage() {
    _saveToStorage('memesDB', gSavedImages)
}

function loadMemesFromStorage() {
    return _loadFromStorage('memesDB')
}