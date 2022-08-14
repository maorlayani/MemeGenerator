'use strict'

let gImgs = []
let gID = 101

let gKeywordSearchCountMap = { funny: 12, animal: 0, baby: 20, politic: 5, akward: 0, movie: 7 }

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

function setImgsFilterBy(filterBy) {
    const images = getImgs()
    for (let i = 0; i < images.length; i++) {
        const currImg = images[i]
        const keywords = currImg.keywords
        for (let j = 0; j < keywords.length; j++) {
            if (keywords[j] === filterBy) {
                gFilteredImgs.push(currImg)
            }
        }
    }
}

function getImgsForDisplay() {
    const imgs = (gSearchFilter) ? gFilteredImgs : getImgs()
    return imgs
}


function getKeywordSearchCountMap() {
    return gKeywordSearchCountMap
}

function updateKeywordFontSize(keyword) {
    gKeywordSearchCountMap[keyword] += 2
}

function setKeywordFontSize(keyword) {
    const keywordsCountMap = getKeywordSearchCountMap()
    const keywordSize = (keywordsCountMap[keyword] < 30) ? keywordsCountMap[keyword] : 30
    return keywordSize
}