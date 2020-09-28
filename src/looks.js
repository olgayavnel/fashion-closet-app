import uuidv4 from 'uuid/v4'
import moment from 'moment'
import { getFilters } from './filters'


let looks = []

// Read existing looks from localStorage
const loadLooks = () => {
    const looksJSON = localStorage.getItem('looks')

    try {
        return looksJSON ? JSON.parse(looksJSON) : []
    } catch (e) {
        return []
    } 
}

// Save the looks to localStorage
const saveLooks = () => {
    localStorage.setItem('looks', JSON.stringify(looks))
}

// Expose looks from module
const getLooks = () => looks

// Create a look
const createLook = () => {
    const lookId = uuidv4()
    const timestamp = moment().valueOf()
    looks.push({
        id: lookId,
        title: '',
        body: '',
        createdAt: timestamp,
        updatedAt: timestamp
    })
    saveLooks()

    return lookId
}

// Remove a look from the list
const removeLook = (id) => {
    const lookIndex = looks.findIndex((look) => look.id === id)

    if (lookIndex > -1) {
        looks.splice(lookIndex, 1)
        saveLooks()
    }
}

// Sort the looks by one of three ways
const sortLooks = (sortBy) => {
    if (sortBy === 'byEdited') {
        return looks.sort((a, b) => {
            if (a.updatedAt > b.updatedAt) {
                return -1
            } else if (a.updatedAt < b.updatedAt) {
                return 1
            } else {
                return 0
            }
        })
    } else if (sortBy === 'byCreated') {
        return looks.sort((a, b) => {
            if (a.createdAt > b.createdAt) {
                return -1
            } else if (a.createdAt < b.createdAt) {
                return 1
            } else {
                return 0
            }
        })
    } else if (sortBy === 'alphabetical') {
        return looks.sort((a, b) => {
            if (a.title.toLowerCase() < b.title.toLowerCase()) {
                return -1
            } else if (a.title.toLowerCase() > b.title.toLowerCase()) {
                return 1
            } else {
                return 0
            }
        })
    } else {
        return looks
    }
}

// Update the existing looks
const updateLook = (id, updates) => {
    const look = looks.find((look) => look.id === id)

    if (!look) {
        return
    }

    if (typeof updates.title === 'string') {
        look.title = updates.title
        look.updatedAt = moment().valueOf()
    }

    if (typeof updates.body === 'string') {
        look.body = updates.body
        look.updatedAt = moment().valueOf()
    }

    saveLooks()
    return look
}

looks = loadLooks()

// Generating the DOM structure for a look
const generateLookDOM = (look) => {
    const lookEl = document.createElement('a')
    const textEl = document.createElement('p')
    const statusEl = document.createElement('p')
    
    //Setup the look title text
    if (look.title.length > 0) {
        textEl.textContent = look.title
    } else {
        textEl.textContent = 'Unnamed look'
    }
    textEl.classList.add('list-item_title')
    lookEl.appendChild(textEl)

    //Setup the link
    lookEl.setAttribute('href', `/edit.html#${look.id}`)
    lookEl.classList.add('list-item')

    // Setup the status message
    statusEl.textContent = generateLastEdited(look.updatedAt)
    statusEl.classList.add('list-item_subtitle')
    lookEl.appendChild(statusEl) 

    return lookEl
}

// Render application looks
const renderLooks = () => {
    const looksEl = document.querySelector('#looks')
    const filters = getFilters()
    const looks = sortLooks(filters.sortBy)
    const filteredLooks = looks.filter((look) => look.title.toLowerCase().includes(filters.searchText.toLowerCase()))

    looksEl.innerHTML = ''

    if (filteredLooks.length > 0) {
        filteredLooks.forEach((look) => {
            const lookEl = generateLookDOM(look)
            looksEl.appendChild(lookEl)
        })
    } else {
        const emptyMessage = document.createElement('p')
        emptyMessage.textContent = 'No looks to show'
        emptyMessage.classList.add('empty-message')
        looksEl.appendChild(emptyMessage)
    }
}

const initializeEditPage = (lookId) => {
    const titleElement = document.querySelector('#look-title')
    const bodyElement = document.querySelector('#look-body')
    const dateElement = document.querySelector('#last-edited')
    // const looks = getLooks()
    const look = looks.find((look) => look.id === lookId)

    if (!look) {
        location.assign('/index.html')
    }

    titleElement.value = look.title
    bodyElement.value = look.body
    dateElement.textContent = generateLastEdited(look.updatedAt)
}

// Generate the last edited message
const generateLastEdited = (timestamp) => {
    return `Last edited ${moment(timestamp).fromNow()}`
}

export { getLooks, createLook, removeLook, sortLooks, updateLook, generateLookDOM, renderLooks, generateLastEdited, initializeEditPage }