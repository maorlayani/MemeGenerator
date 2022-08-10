'use strict'

let gMeme


function setImg(imgId) {
    gMeme = {
        selectedImgId: imgId,
        selectedLineIdx: 0,
        lines: [
            {
                txt: 'Add text here',
                size: 40,
                align: 'left',
                color: 'white'
            },
            {
                txt: 'second line',
                size: 40,
                align: 'left',
                color: 'white'
            }
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
    gMeme.lines[gMeme.selectedLineIdx].color = color
}

function setTxtSize(txtDiffr) {
    gMeme.lines[gMeme.selectedLineIdx].size += +txtDiffr
    console.log(gMeme.lines[gMeme.selectedLineIdx].size)
}

function setLine() {
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1) gMeme.selectedLineIdx = 0
    else gMeme.selectedLineIdx++
}