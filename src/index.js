import { createLook, renderLooks } from './looks'
import { setFilters } from './filters'


renderLooks()

document.querySelector('#create-look').addEventListener('click', (e) => {
    const id = createLook()
    location.assign(`/edit.html#${id}`)
})

document.querySelector('#search-text').addEventListener('input', (e) => {
    setFilters({
        searchText: e.target.value
    })
    renderLooks()
})

document.querySelector('#filter-by').addEventListener('change', (e) => {
    setFilters({
        sortBy: e.target.value
    })
    renderLooks()
})

window.addEventListener('storage', (e) => {
    if (e.key === 'notes') {
        renderLooks()
    }
})