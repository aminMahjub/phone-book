let contacts = [];

const phoneBookForm = document.forms[0];
const addContactBtn = document.querySelector('.add-btn');
const trashBtn = document.querySelector('.delete-btn');
const searchInput = document.querySelector('#searchBox'); 
const checkBoxSet = new Set(); 
let contacstClone = [];

phoneBookForm.addEventListener('submit', formValidation);
searchInput.addEventListener('input', (e) => {
    if (contacts.length !== 0) {
        searchContact();    
    }
});

function formValidation(event) {
    event.preventDefault();

    function showErrorMsg(input, message = '') {
        const messageBox = input.parentElement.children[2];
        messageBox.textContent = message;
    }

    function hasValue(input, message) {
        if (input.value.trim() === '') {
            showErrorMsg(input, message);
            return false;
        } else {
            const resetInputs = showErrorMsg(input, '');
            return true;
        }
    } 

    function numberValidation() {
        const phoneNumberInput = phoneBookForm.elements['contact-number'];
        const NUMBER_INVALID_MESSAGE = 'Enter number please and less than 10';
        const EMPTY_NUMBER_INPUT = 'Your number input is empty';

        if (!hasValue(phoneNumberInput, EMPTY_NUMBER_INPUT) ||
            typeof +phoneNumberInput.value !== 'number' ||
            phoneNumberInput.value.length >= 12) 
        {
            showErrorMsg(phoneNumberInput, NUMBER_INVALID_MESSAGE);
            return false;
        }

        return true;
    }

    function emailValiadtion() {
        const phoneEmailInput = phoneBookForm.elements['contact-email'];
        const EMAIL_INVALID_MESSAGE = 'Please enter valid email';

        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(phoneEmailInput.value) && hasValue(phoneEmailInput)) {
            showErrorMsg(phoneEmailInput, EMAIL_INVALID_MESSAGE);
            return false;
        }

        return true;
    }

    debugger;
    const numberInput = numberValidation();
    const emailInput = emailValiadtion();
    const name = hasValue(phoneBookForm.elements['contact-name'], 'Your name input is empty');

    if (numberInput && emailInput && name) {
        getContactData();
    }

}

function getContactData() {
    const [, name, number, email, ] = phoneBookForm.elements;
    contacts.push({ 
        hasOutputProps: {
            name: name.value,
            number: number.value,
            email: email.value || 'empty'
        },

        id: contacts.length,
        selected: false, 
        editInfo: {}
    });

    const CONTACTS_LAST_ITEM = contacts[contacts.length - 1];
    for (const key in CONTACTS_LAST_ITEM.hasOutputProps) {
        CONTACTS_LAST_ITEM.editInfo[key] = false;
    }

    createContactUI(contacts);
}

function createContactUI(renderContact) {
    const tBodyRoot = document.querySelector('.phone-book tbody');
    tBodyRoot.innerHTML !== '' ? tBodyRoot.innerHTML = '' : null;

    renderContact.forEach((contact, index) => {
        const { hasOutputProps, id, editInfo } = contact;
        const row = index + 1;
        const contactOutputPropsArr = Object.entries(contact.hasOutputProps);

        const tr = createElement( 
            {
                element: 'tr',
                childOf: tBodyRoot
            }, 
            {
                id: id
            }
        );

        const rowTd = createElement(
            {
                element: 'td',
                childOf: tr,
                text: `${row}.`
            },
        );
        const checkbox = createElement(
            {
                element: 'input',
                childOf: rowTd
            },
            {
                type: 'checkbox',
                name: `${id}-id-checkbox`,
            }
        )
        checkbox.addEventListener('click', selectContact); 

        contactOutputPropsArr.forEach(outputProp => {
            let [key, value] = outputProp;

            const td = createElement(
                {
                    element: 'td', 
                    childOf: tr,
                }, 
                {
                    title: value,
                    'arial-value': key 
                }
            );

            const editBtn = createElement(
                {
                    element: 'button',
                    childOf: td, 
                    text: 'Edit'
                }, 
                {
                    class: 'edit-btn',
                    type: 'button'
                }
            );

            const p = createElement(
                {   
                    element: 'p',
                    childOf: td,
                    text: value
                }
            )

            editBtn.addEventListener('click', editContact);
            
            if (contact.editInfo[key]) {
                p.contentEditable = true;
                editBtn.textContent = 'Done';
            }
        });

        if (contact.selected) {
            checkbox.checked = true;
        }
    })
}

function createElement(elementsProps, attrs) {
    const { element, childOf, text } = elementsProps;
    const elementTag = document.createElement(element);

    if (childOf) {
        childOf.append(elementTag);
    }

    if (text) {
        elementTag.innerHTML = text;
    }

    if (attrs) {
        Object.entries(attrs).forEach(attr => elementTag.setAttribute(attr[0], attr[1]));
    }

    return elementTag;
}

function trashBtnClassHandler(isRemoved) {
    if (isRemoved) {
        trashBtn.classList.remove('show-delete-btn');
    } else {
        if (!trashBtn.classList.contains('show-delete-btn')) {
            trashBtn.classList.add('show-delete-btn');
        }
    }
}

function selectContact(event) {
    const checkbox = event.currentTarget;
    const tdRoot = checkbox.parentElement.parentElement;
    
    contacts.forEach(contact => {

        function setCheckboxProps(isSelected) {
            isSelected ? checkBoxSet.add(checkbox) : checkBoxSet.delete(checkbox);
            contact.selected = isSelected;            
        }

        if (+tdRoot.id === contact.id) {
            if (checkbox.checked) {
                setCheckboxProps(true);
                trashBtnClassHandler(false);

            } else {
                setCheckboxProps(false);

                if (checkBoxSet.size === 0) {
                    trashBtnClassHandler(true);
                }  
            }
    
        }
    })
}

function editContact(event) {
    const tdRoot = event.target.parentElement;
    const trRoot = tdRoot.parentElement;

    contacts.forEach(contact => {

        if (+trRoot.id === contact.id) {
            for (const key in contact.editInfo ) {
                if (tdRoot.getAttribute('arial-value') === key) {
                    contact.editInfo[key] = !contact.editInfo[key];
                    contact.hasOutputProps[key] = tdRoot.childNodes[1].textContent; 
                }
            }
        }
    }); 

    createContactUI(contacts);
}

trashBtn.addEventListener('click', deleteContact);
function deleteContact() {
    contacts = contacts.filter(contact => {
        return contact.selected ? false : true;
    });
    
    trashBtnClassHandler(true);
    createContactUI(contacts);
}

function searchContact() {
    const searchContactValue = searchInput.value || false;
    
    if (searchContactValue) {
        const contactOutputProps = contacts.map(contact => Object.values(contact.hasOutputProps));

        const seachedArr = contactOutputProps.map((contactOutputProp, index) => {
            const contactoutputStr = contactOutputProp.join('');
            
            for (let character of searchContactValue) {
                if (contactoutputStr.includes(character) && contactoutputStr.includes(searchContactValue)) {
                    return contacts[index];
                }
            }
        }).filter(contact => contact !== undefined).flat();
        createContactUI(seachedArr);  
    }

}