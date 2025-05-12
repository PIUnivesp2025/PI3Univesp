document.addEventListener('DOMContentLoaded', function() {
    backToTop();
    document.querySelector('#register').style.display = 'none';
    document.querySelector('#produtos').style.display = 'none';
    document.querySelector('#areaCliente').style.display = 'none';
    document.querySelector('#slogan').style.display = 'block';

    // Add functions to the buttons
    document.querySelector('#btnRegister').addEventListener('click', () => saveNewUser());
});

document.addEventListener('click', function(event) {
    let clickedId = event.target.id
    let clickedClass = event.target.className
    if ((clickedId != 'menu') && (clickedClass != 'closableMenu')) {
        closeMenu();
    }
});

function openMenu() {
    document.getElementById("menuDiv").style.width = "200px";
    document.getElementById("menu").style.opacity = "0";
}
  
function closeMenu() {
    document.getElementById("menuDiv").style.width = "0";
    document.getElementById("menu").style.opacity = "1";
}

function register() {
    document.querySelector('#slogan').style.display = 'none';
    document.querySelector('#register').style.display = 'block';
    document.querySelector('#produtos').style.display = 'none';
    document.querySelector('#areaCliente').style.display = 'none';
}

function showProducts() {
    document.querySelector('#register').style.display = 'none';
    document.querySelector('#produtos').style.display = 'block';
    document.querySelector('#slogan').style.display = 'none';
    document.querySelector('#areaCliente').style.display = 'none';
}

function areaCliente() {
    document.querySelector('#register').style.display = 'none';
    document.querySelector('#produtos').style.display = 'none';
    document.querySelector('#slogan').style.display = 'none';
    document.querySelector('#areaCliente').style.display = 'block';
}

function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// Function to ignore non number and return only typed number on input
function onlyNumbers(content, maxLength) {
    let newContent = '';
    // Iterate with each character and store only numbers, ignoring the ones which are not number
    for (let i = 0; i < content.length; i++) {
        if ((!isNaN(parseInt(content[i]))) && newContent.length < maxLength) {
            newContent = newContent + content[i];
        }
    }
    return newContent;
}

// Function to assert the right length of a content
function assertLength(id, maxLength) {
    let content = document.querySelector(`#${id}`).value;
    let newContent = content.slice(0, maxLength);
    document.querySelector(`#${id}`).value = newContent;
    return newContent;
}

// Function to format the cpf input view preventing non numbers and adding '.' and '-' according to properly cpf pattern
function changeCpfInput(id) {
    // Get the typed value inside the passed id field
    let content = document.querySelector(`#${id}`).value;
    // Assert the typed value is only number and with max 11 of length
    content = onlyNumbers(content, 11);
    document.querySelector(`#${id}`).value = content;

    // Format the displayed content in the pattern xxx.xxx.xxx-xx
    let newContent = content;
    if (newContent.length > 3) {
        newContent = content.slice(0, 3) + '.' + content.slice(3, content.length);
    }        
    if (newContent.length > 7) {
        newContent = newContent.slice(0, 7) + '.' + newContent.slice(7, newContent.length);
    }
    if (newContent.length > 11) {
        newContent = newContent.slice(0, 11) + '-' + newContent.slice(11, newContent.length);
    }

    // The newContent variable is the value that will be displayed on template
    document.querySelector(`#${id}`).value = newContent;
}

// Function to format the celular input view preventing non numbers and adding '(', ')' and '-' according to properly celular pattern
function changeCelInput(id) {
    // Get the typed value inside the passed id field
    let content = document.querySelector(`#${id}`).value;
    // Assert the typed value is only number and with max 11 of length
    content = onlyNumbers(content, 11);
    document.querySelector(`#${id}`).value = content;

    // Format the displayed content in the pattern (xx)9xxxx-xxxx
    let newContent = content;

    // After the first typed value add the '(' as the very first value, removing '0', to compose (xx)9xxxx-xxxx format
    if (newContent.length > 0) {
        if (newContent[0] == '0') {
            newContent = newContent.slice(1, newContent.length);
        }
        newContent = '(' + newContent;
    }    
    // Close the parentesis after third character / value in the newContent string
    if (newContent.length > 3) {
        newContent = newContent.slice(0, 3) + ')' + newContent.slice(3, newContent.length);
    }    
    // Add the number 9 after fourth character
    if ((newContent.length > 4) && newContent[4] != '9') {
        newContent = newContent.slice(0, 4) + '9' + newContent.slice(4, newContent.length);
    }    
    // Add the '-' character after nineth value
    if (newContent.length > 9) {
        newContent = newContent.slice(0, 9) + '-' + newContent.slice(9, newContent.length);
    }    
    // Add the length is the right size
    if (newContent.length > 14) {
        newContent = newContent.slice(0, 14);
    }

    // The newContent variable is the value that will be displayed on template
    document.querySelector(`#${id}`).value = newContent;
}

async function checkFields(id) {

    // Get the html element label responsible for the passed id field
    let label = document.querySelector(`#${id}Label`);
    // Hide and clean up all possible previous message
    label.hidden = true;
    label.innerHTML = '';
    // Get the typed value inside the passed id field
    let content = document.querySelector(`#${id}`).value;

    // function to check the length of a field editing its label if the result is not ok
    function checkLength(word, label, lMin, lMax, phrase, changePhrase) {
        if (word.length < lMin || word.length > lMax) {
            label.hidden = false;
            if (!changePhrase) {
                label.innerHTML = `Escolha ${phrase} entre ${lMin} e ${lMax} caracteres`;
            } else {
                label.innerHTML = `${changePhrase}`;
            }        
            return false;
        }
        label.hidden = true;
        label.innerHTML = '';
        return true;
    }

    // Function to Fetch data
    async function fetcherApiRoute(route, field, content, label, message) {
            const response = await fetch(`/${route}/${field}/${content}`);
            const data = await response.json();
            if (!data) {
                label.hidden = false;
                label.innerHTML = `${message}`;
            } else {
                label.hidden = true;
                label.innerHTML = '';
            }
            return data;        
    }

    // Create a function to apply the cpf algorithm
    function checkCpf(cpf, digit) {
        // Create a variable to store the sum of all digits multiplied by their index position
        let cpfSum = 0;
        for (let i = 0; i < (digit - 1); i++) {
            cpfSum = cpfSum + (parseInt(cpf[i]) * (digit - i));
        }

        // Get the remainder from the division by 11
        let rem = cpfSum % 11;

        // If remainder is less than 2, then the number on digith position must be zero
        if (rem < 2) {
            if (cpf[digit - 1] == 0) {
                return true;
            }
        // If remainder is greater than 2, then the number on digith position must be 11 - remainder
        } else {
            if (cpf[digit - 1] == (11 - rem)) {
                return true;
            }
        }
        return false;
    }

    if (id == 'username') {
        // Check the length of the typed value
        let usernameCheck = checkLength(content, label, 2, 15, 'um nome de usuário', false);
        // If its length is ok, check if the chosen username already exists
        if (usernameCheck) {           
            usernameCheck = await fetcherApiRoute('checkUser', id, content, label, 'Esse nome de usuário já existe');
        }

        // return content if checker is true, otherwise return false
        if (usernameCheck) {
            return content;
        }
        return false;

    } else if (id == 'name') {
        // Check the length of the typed value and update the checker if it is ok or not
        let nameCheck = checkLength(content, label, 2, 30, 'um nome', false);

        // return content if checker is true, otherwise return false
        if (nameCheck) {
            return content;
        }
        return false;

    } else if (id == 'lastname') {
        // Check the length of the typed value and update the checker if it is ok or not
        let lastnameCheck = checkLength(content, label, 2, 60, 'um sobrenome', false);

        // return content if checker is true, otherwise return false
        if (lastnameCheck) {
            return content;
        }
        return false;

    } else if (id == 'cpf') {
        // Create a variable to store the current content inside the cpf input
        let currentContent = document.querySelector(`#${id}`).value;
        // Remove '.' and '-' characters from catched value
        currentContent = onlyNumbers(currentContent, 11);
        // Create a boolean variable to store if the content is right according to the cpf rules or not
        let cpfCheck = checkLength(content, label, 11, 11, null, 'O CPF deve conter 11 dígitos');

        if (currentContent.length == 11) {
            if (!checkCpf(currentContent, 10) || !checkCpf(currentContent, 11)) {
                label.hidden = false;
                label.innerHTML = 'Digite um CPF válido';
                cpfCheck = false;
            } else {
                // If the new typed value is equal any cpf that is already registered, change the label and show a message
                    cpfCheck = await fetcherApiRoute('checkUser', id, currentContent, label, 'Esse CPF já está cadastrado');
            }
        }

        if (cpfCheck) {
            return currentContent;
        }
        return cpfCheck;
        
    } else if (id == 'cel') {
        // Create a variable to store the current content inside the celular input
        let currentContent = document.querySelector(`#${id}`).value;
        // Remove '()' and '-' characters from catched value
        currentContent = onlyNumbers(currentContent, 11);
        // Create a boolean variable to store if the content is right according to the celular rules or not
        let celCheck = checkLength(content, label, 11, 11, null, 'O número de celular deve ter 11 dígitos');

        if (currentContent.length == 11) {
            // If the new typed value is equal any cel that is already registered, change the label and show a message
            celCheck = await fetcherApiRoute('checkUser', 'celular', currentContent, label, 'Esse número de celular já está cadastrado');
        }

        // return content if checker is true, otherwise return false, without parameters '()' and '-'
        if (celCheck) {
            return currentContent;
        }
        return false;

    } else if (id == 'email') {
        // Create a checker to email field
        let emailCheck = false;
        // Count how many @ are there inside the typed content
        var countAt = 0;
        for (let i = 0; i < content.length; i++) {
            if (content[i] == '@') {
                countAt++;
            }
        }

        // Check if there are at least 2 characters before the @ signal ou if there are more than one @ signal
        var position = content.indexOf('@');
        var afterAt = content.slice(position, content.length);
        
        if ((position < 2) || countAt != 1) {
            label.innerHTML = 'Digite um email válido';
            label.hidden = false;
            emailCheck = false;
        } else if (afterAt.length < 5) {
            label.innerHTML = 'Digite um email válido';
            label.hidden = false;
            emailCheck = false;
        } else {
            label.innerHTML = '';
            label.hidden = true;
            emailCheck = true;
        }

        // Check if the chosen email already exists
        if (emailCheck) {
            // If the new typed value is equal any email that is already registered, change the label and show a message
            emailCheck = await fetcherApiRoute('checkUser', id, content, label, 'Email já está cadastrado');
        }

        // return content if checker is true, otherwise return false
        if (emailCheck) {
            return content;
        }
        return false;

    } else if (id == 'condos') {
        // Verify if there is already something typed on token input to avoid cheating
        let token = document.querySelector('#token').value;
        if (token.length > 0) {
            checkFields('token');
        }

        // If id is different of 'n', the checker is ok
        if (!isNaN(parseInt(content))) {
            return content;
        }
        return false;

    } else if (id == 'token') {
        // Get the data concerning to condos input
        let selectedCondoId = document.querySelector('#condos').value;
        let condosLabel = document.querySelector('#condosLabel');
        // Create a check variable to token input
        let tokenCheck = false;

        // Only check the token if there is something typed in the token input
        if (content.length > 0) {
            // Fetch the API route only if the id is not 'n', that means id must be an int in order to fetch properly a condo
            if (!isNaN(parseInt(selectedCondoId))) {
                let m = document.querySelector(`#condo${selectedCondoId}`).innerHTML;
                condosLabel.hidden = true;
                condosLabel.innerHTML = '';

                tokenCheck = await fetcherApiRoute('cToken', selectedCondoId, content, label, `O token digitado para o Condomínio ${m} não é válido`);

            } else {
                condosLabel.hidden = false;
                condosLabel.innerHTML = 'Escolha um Condomínio';
            }
        }

        // return true if checker is true, otherwise return false
        return tokenCheck;

    } else if (id == 'password') {
        // Check the length of the typed value
        let passwordCheck = checkLength(content, label, 8, 80, null, 'A senha deve conter pelo menos 8 dígitos');

        // return content if checker is true, otherwise return false
        if (passwordCheck) {
            return content;
        }
        return false;

    } else if (id == 'repassword') {
        // Create a checker to repassword field
        let repasswordCheck = false;
        // Check if the value passed in repassword input is equal to value passed in password field
        let password = document.querySelector('#password').value;
        if (content != password) {
            label.hidden = false;
            label.innerHTML = 'A senha digitada não é a mesma da anterior';
            repasswordCheck = false;
        } else {
            label.hidden = true;
            label.innerHTML = '';
            repasswordCheck = true;
        }

        // return content if checker is true, otherwise return false
        if (repasswordCheck) {
            return content;
        }
        return false;
    }
}

async function saveNewUser() {
    // Get all data and save each of them inside a variable
    let username = await checkFields('username');
    let name = await checkFields('name');
    let lastname = await checkFields('lastname');
    let cpf = await checkFields('cpf');
    let cel = await checkFields('cel');
    let email = await checkFields('email');
    let condo = await checkFields('condos');
    let token = await checkFields('token');
    let password = await checkFields('password');
    let repassword = await checkFields('repassword');

    // Create a dictionary to collect all data
    let dictData = {
        'Nome de usuário': username, 'Nome': name, 'Sobrenome': lastname, 'CPF': cpf, 'celular': cel, 'e-mail': email,
        'Condomínio': condo, 'token': token, 'Senha': password, 'Confirmação de senha': repassword,
    };

    // Create a dictionary to collect all data with corret names for keys and to pass to python function
    let userData = {
        'username': username, 'name': name, 'lastname': lastname, 'cpf': cpf, 'cel': cel, 'email': email,
        'condo': condo, 'token': token, 'password': password, 'repassord': repassword,
    };

    // Create a pre phrase to alert user if one or more blank field
    let phrase = 'Para registrar-se, todos os campos precisam ser preenchidos corretamente. ';
    // Create a counter to know how many fields are blank
    var count = 0;
    // Create a list to store only blank inputs
    let blankInputs = [];

    for (const [key, value] of Object.entries(dictData)) {
        console.log(`key: ${key}, value: ${value}`);
        if (!value) {
            count++;
            blankInputs.push(key);
        }
    }

    if (count == 1) {
        phrase = phrase + `Ainda falta o campo ${blankInputs[0]}!`;
    } else if (count == 2) {
        phrase = phrase + `Ainda faltam os campos ${blankInputs[0]} e ${blankInputs[1]}!`;
    } else if (count == 3) {
        phrase = phrase + `Ainda faltam os campos ${blankInputs[0]}, ${blankInputs[1]} e ${blankInputs[2]}!`;
    } else if (count > 3) {
        phrase = phrase + `Ainda há campos incorretos!`;
    }

    if (count > 0) {
        alert(phrase);
    } else {
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        // Send new user data
        fetch('/addUser', {
            method: 'POST',
            headers: {
            'Content-Type':'application/json',
            'X-CSRFToken':csrftoken
            },
            body: JSON.stringify({
                'userData': userData,
            })
        });

        // Refresh the page by replacing the URL with itself
        //location.replace(location.href)
        location.reload()
    }
}