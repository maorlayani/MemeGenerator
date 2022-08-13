'use strict'

let gSavedMemeIdx
let gSearchFilter
let gFilteredImgs = []

function initGallery() {
    createImgs()
    renderGallery()
}

function renderGallery() {
    let images = getImgs()
    if (gSearchFilter) images = gFilteredImgs
    const strHTMLs = images.map(img =>
        `<img src=${img.url} class="image gallery-img" onclick="onImgSelect('${img.id}')">`
    )
    var elGallery = document.querySelector('.gallery-content')
    elGallery.innerHTML = strHTMLs.join('')
    gFilteredImgs = []
}

function onImgSelect(imgId, savedMemeIdx) {
    showEditor()
    resizeCanvas()
    gSavedMemeIdx = savedMemeIdx
    if (!gSavedMemeIdx) setImg(+imgId)
    else gMeme = gSavedImages[gSavedMemeIdx].meme
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
    var elGallery = document.querySelector('.gallery-saved-imgs-content')

    gSavedImages = loadMemesFromStorage()
    if (!gSavedImages || !gSavedImages.length) {
        elGallery.innerHTML = `<h2 calss="no-save-msg">There aren't any saved MeMe's</h2>`
        showSavedMemesGallery()
        return
    }

    let strHTMLs = ''
    for (let i = 0; i < gSavedImages.length; i++) {
        strHTMLs +=
            `<img src=${'data:image/png;base64,' + gSavedImages[i].img} class="image gallery-img"
        onclick="onImgSelect('${gSavedImages[i].meme.selectedImgId}', '${i}')">`
    }
    elGallery.innerHTML = strHTMLs
    showSavedMemesGallery()
}

function onDataFilter(ev) {
    ev.preventDefault()
    const elInputFilter = document.querySelector('.filter-box')
    gSearchFilter = elInputFilter.value
    let images = getImgs()
    if (gSearchFilter === 'all' || gSearchFilter === '') {
        gFilteredImgs = images
        renderGallery()
        return
    }
    for (let i = 0; i < images.length; i++) {
        let currImg = images[i]
        let keywords = currImg.keywords
        for (let j = 0; j < keywords.length; j++) {
            if (keywords[j] === elInputFilter.value) {
                console.log(keywords[j])
                gFilteredImgs.push(currImg)
            }
        }
    }
    console.log(gFilteredImgs)
    renderGallery()
}



