'use strict'

let gImgs = []


function createImgs() {
    for (let i = 0; i < 17; i++) {
        gImgs[i] = createImg(i + 1)
    }
}

function createImg(url, keywords = ['funny']) {
    const img = {
        id: makeId(),
        url: `img/${url}.jpg`,
        keywords
    }
    return img
}

function getImgs() {
    createImgs()
    return gImgs
}

function getImgById(imgId) {
    return gImgs.find(img => img.id === imgId)
}

