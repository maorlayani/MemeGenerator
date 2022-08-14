'use strict'

let gSavedMemeIdx
let gSearchFilter
let gFilteredImgs = []

function initGallery() {
    createImgs()
    renderGallery()
    renderKeywordSearch()
}

function renderGallery() {
    const imgs = getImgsForDisplay()
    const strHTMLs = imgs.map(img =>
        `<img src=${img.url} class="image gallery-img" onclick="onImgSelect('${img.id}')">`
    )
    const elGallery = document.querySelector('.gallery-content')
    elGallery.innerHTML = strHTMLs.join('')
    gFilteredImgs = []
}

function onImgSelect(imgId, savedMemeIdx) {
    showEditor()
    resizeCanvas()
    gSavedMemeIdx = savedMemeIdx
    if (!gSavedMemeIdx) setImg(+imgId)
    else gMeme = gSavedMemes[gSavedMemeIdx].meme
    renderMeme()
}

function showEditor() {
    document.querySelector('.editor').hidden = false
    document.querySelector('.filter-container').hidden = true
    document.querySelector('.gallery').hidden = true
    document.querySelector('.gallery-saved-imgs').hidden = true
}

function showSavedMemesGallery() {
    document.querySelector('.editor').hidden = true
    document.querySelector('.filter-container').hidden = true
    document.querySelector('.gallery').hidden = true
    document.querySelector('.gallery-saved-imgs').hidden = false
}

function showSavedMemes() {
    const elGallery = document.querySelector('.gallery-saved-imgs-content')
    gSavedMemes = loadMemesFromStorage()
    if (!gSavedMemes || !gSavedMemes.length) {
        elGallery.innerHTML = `<h2 calss="no-save-msg">There aren't any saved MeMe's</h2>`
        showSavedMemesGallery()
        return
    }

    let strHTMLs = ''
    for (let i = 0; i < gSavedMemes.length; i++) {
        strHTMLs +=
            `<img src=${'data:image/png;base64,' + gSavedMemes[i].img} class="image gallery-img"
        onclick="onImgSelect('${gSavedMemes[i].meme.selectedImgId}', '${i}')">`
    }
    elGallery.innerHTML = strHTMLs
    showSavedMemesGallery()
}

function onFilterBy(ev) {
    ev.preventDefault()
    const elInputFilter = document.querySelector('.filter-box')
    gSearchFilter = elInputFilter.value.toLowerCase()
    const imgs = getImgs()
    if (gSearchFilter === 'all' || gSearchFilter === '') gFilteredImgs = imgs
    else setImgsFilterBy(gSearchFilter)
    renderGallery()
}

function renderKeywordSearch() {
    const keywordsCountMap = getKeywordSearchCountMap()
    const keywordKeys = Object.keys(keywordsCountMap)
    const strHTMLs = keywordKeys.map(keyword =>
        `<span class="keyword" onclick="onClickedKeyword('${keyword}')" style="font-size: ${16 + setKeywordFontSize(keyword)}px;">${keyword}</span>`
    )
    const elKeywords = document.querySelector('.keywords-container')
    elKeywords.innerHTML = strHTMLs.join('')
}

function onClickedKeyword(keyword) {
    updateKeywordFontSize(keyword)
    gSearchFilter = keyword
    setImgsFilterBy(gSearchFilter)
    renderKeywordSearch()
    renderGallery()
}



