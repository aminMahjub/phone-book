const addNewContact = document.querySelector('.add-new-contact');
const modal = document.querySelector('.add-contact-modal');
const closeModalBtn = document.querySelector('.close-btn');

function modalHandler() {
    if (!modal.classList.contains('show-modal')) {
        modal.classList.add('show-modal');
    } else {
        modal.classList.remove('show-modal');
    }
}

addNewContact.addEventListener('click', modalHandler);
closeModalBtn.addEventListener('click', modalHandler);