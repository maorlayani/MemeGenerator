'use strict'

let gImgs = []
let gID = 101

function createImgs() {
    gImgs = [
        createImg(1, ['funny', 'politic']),
        createImg(2, ['animal']),
        createImg(3, ['animal', 'baby']),
        createImg(4, ['funny', 'animal']),
        createImg(5, ['funny', 'baby']),
        createImg(6, ['akward']),
        createImg(7, ['funny', 'baby', 'akward']),
        createImg(8, ['funny', 'akward']),
        createImg(9, ['funny', 'baby']),
        createImg(10, ['funny', 'politic']),
        createImg(11, ['akward']),
        createImg(12, ['akward']),
        createImg(13, ['movie']),
        createImg(14, ['movie']),
        createImg(15, ['movie']),
        createImg(16, ['funny', 'movie']),
        createImg(17, ['politic']),
        createImg(18, ['movie'])
    ]
}

function createImg(url, keywords = ['funny']) {
    const img = {
        id: gID,
        url: `img/${url}.jpg`,
        keywords
    }
    gID++
    return img
}

function getImgs() {
    return gImgs
}

function getImgById(imgId) {
    return gImgs.find(img => img.id === imgId)
}

function getRandImg() {
    const randImgIdx = getRandomInt(0, gImgs.length)
    return gImgs[randImgIdx].id
}






