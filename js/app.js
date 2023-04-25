const contacts = [];

const formInputs = document.querySelectorAll('.add-contact-modal form input');
const [name, number, email] = formInputs;

const addContactBtn = document.querySelector('.add-btn');
addContactBtn.addEventListener('click', getContactData);

function getContactData() {
    formInputs.forEach(input => {
        let inputValue = input.value || false;

        if (!inputValue && input !== email) {
            const err = `${input.getAttribute('value')} is empty`;

            alert(err);
            throw new Error(err);
        }
    });

    contacts.push({ 
        row: contacts.length + 1,
        name: name.value,
        number: number.value,
        email: email.value 
    });

    createContactUI();
}

function createContactUI() {
    const tBodyRoot = document.querySelector('.phone-book tbody'); 
    tBodyRoot.innerHTML !== '' ? tBodyRoot.innerHTML = '' : null;
     
    contacts.forEach(contact => {
        const tr = createElement({element: 'tr', childOf: tBodyRoot});
        Object.entries(contact).forEach(contactData => createElement({element: 'td', childOf: tr, value: contactData[1]}, { dataInfo: contactData[0]}));
    })

    formInputs.forEach(input => input.value = '')
}

function createElement(elementsProps, attrs) {
    const { element, childOf, value } = elementsProps;
    const elementTag = document.createElement(element);

    if (childOf) {
        childOf.append(elementTag);
    }

    if (value) {
        elementTag.textContent = value;
    }

    if (attrs) {
        Object.entries(attrs).forEach(attr => elementTag.setAttribute(attr[0], attr[1]));
    }

    return elementTag;
}