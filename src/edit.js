import { initializeEditPage, generateLastEdited, updateLook, removeLook } from './looks'

const titleEl = document.querySelector('#look-title');
const bodyEl = document.querySelector('#look-body');
const removeEl = document.querySelector('#remove-look')
const dateElement = document.querySelector('#last-edited')
const lookId = location.hash.substring(1)

initializeEditPage(lookId)

titleEl.addEventListener('input', (e) => {
    const look = updateLook(lookId, {
        title: e.target.value
    })
    dateElement.textContent = generateLastEdited(look.updatedAt)
})

bodyEl.addEventListener('input', (e) => {
    const look = updateLook(lookId, {
        body: e.target.value
    })
    dateElement.textContent = generateLastEdited(look.updatedAt)
})

removeEl.addEventListener('click', (e) => {
    removeLook(lookId)
    location.assign('/index.html')
})

//Uploading a file using jQuery

$(function () {
    $(":file").change(function () {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = imageIsLoaded;
            reader.readAsDataURL(this.files[0]);
        }
    });
});

function imageIsLoaded(e) {
    $('#myImg').attr('src', e.target.result);
};

window.addEventListener('storage', (e) => {
    if (e.key === 'looks') {
        initializeEditPage(lookId)
    }
})