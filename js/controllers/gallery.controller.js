'use strict'


function initGallery() {
    renderGallery()
}

function renderGallery() {
    const images = getImgs()
    const strHTMLs = images.map(img =>
        `<img src=${img.url} class="image gallery-img" onclick="onImgSelect( '${img.id}')">`
    )
    var elGallery = document.querySelector('.gallery-content')
    elGallery.innerHTML = strHTMLs.join('')
}

function onImgSelect(imgId) {
    showEditor()
    setImg(imgId)
    renderMeme()
}

function showEditor() {
    document.querySelector('.editor').hidden = false
    document.querySelector('.filter-container').hidden = true
    document.querySelector('.gallery').hidden = true
}