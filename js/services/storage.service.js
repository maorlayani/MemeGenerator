'use strict'

function _saveToStorage(key, val) {
    const str = JSON.stringify(val)
    localStorage.setItem(key, str)
}
function _loadFromStorage(key) {
    const str = localStorage.getItem(key)
    const val = JSON.parse(str)
    return val
}