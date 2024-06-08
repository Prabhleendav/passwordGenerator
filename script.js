document.addEventListener('DOMContentLoaded', () => {
    const inputSlider = document.querySelector("[data-lengthSlider]");
    const lengthDisplay = document.querySelector("[data-lengthNumber]");
    const passwordDisplay = document.querySelector("[data-passwordDisplay]");
    const copyBtn = document.querySelector("[data-copy]");
    const copyMsg = document.querySelector("[data-copiedMsg]");
    const uppercaseCheck = document.querySelector("#uppercase");
    const lowercaseCheck = document.querySelector("#lowercase");
    const numbersCheck = document.querySelector("#numbers");
    const symbolsCheck = document.querySelector("#symbols");
    const indicator = document.querySelector("[data-indicator]");
    const generateBtn = document.querySelector(".generate-button");
    const allCheckBox = document.querySelectorAll("input[type=checkbox]");
    const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

    let password = "";
    let passwordLength = 10;
    let checkCount = 0;

    // Hide copy message initially
    copyMsg.style.display = 'none';

    // To set password length via slider
    function handleSlider() {
        inputSlider.value = passwordLength;
        lengthDisplay.innerText = passwordLength;
    }
    handleSlider();

    function setIndicator(color) {
        indicator.style.backgroundColor = color;
    }

    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    function generateRandomInteger() {
        return getRndInteger(0, 10).toString();
    }

    function generateUppercase() {
        return String.fromCharCode(getRndInteger(65, 91));
    }

    function generateLowercase() {
        return String.fromCharCode(getRndInteger(97, 123));
    }

    function generateSymbol() {
        const randNum = getRndInteger(0, symbols.length);
        return symbols.charAt(randNum);
    }

    function calcStrength() {
        let hasUpper = uppercaseCheck.checked;
        let hasLower = lowercaseCheck.checked;
        let hasNum = numbersCheck.checked;
        let hasSym = symbolsCheck.checked;

        if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
            setIndicator("#0f0");
        } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
            setIndicator("#ff0");
        } else {
            setIndicator("#f00");
        }
    }

    async function copyContent() {
        try {
            await navigator.clipboard.writeText(passwordDisplay.value);
            copyMsg.innerText = "Copied";
        } catch (e) {
            copyMsg.innerText = "Failed";
        }
        copyMsg.style.display = 'block';
        setTimeout(() => {
            copyMsg.style.display = 'none';
        }, 2000);
    }

    inputSlider.addEventListener('input', (e) => {
        passwordLength = e.target.value;
        handleSlider();
    });

    copyBtn.addEventListener('click', () => {
        if (passwordDisplay.value) {
            copyContent();
        }
    });

    allCheckBox.forEach((checkbox) => {
        checkbox.addEventListener('change', handleCheckBoxChange);
    });

    function handleCheckBoxChange() {
        checkCount = 0;
        allCheckBox.forEach((checkbox) => {
            if (checkbox.checked) checkCount++;
        });

        if (passwordLength < checkCount) {
            passwordLength = checkCount;
            handleSlider();
        }
    }

    generateBtn.addEventListener('click', () => {
        if (checkCount === 0) return;

        if (passwordLength < checkCount) {
            passwordLength = checkCount;
            handleSlider();
        }

        password = "";
        let funcArr = [];

        if (uppercaseCheck.checked) {
            funcArr.push(generateUppercase);
        }
        if (lowercaseCheck.checked) {
            funcArr.push(generateLowercase);
        }
        if (numbersCheck.checked) {
            funcArr.push(generateRandomInteger);
        }
        if (symbolsCheck.checked) {
            funcArr.push(generateSymbol);
        }

        for (let i = 0; i < funcArr.length; i++) {
            password += funcArr[i]();
        }

        for (let i = 0; i < passwordLength - funcArr.length; i++) {
            let randIndex = getRndInteger(0, funcArr.length);
            password += funcArr[randIndex]();
        }

        password = shufflePassword(Array.from(password));
        passwordDisplay.value = password;
        calcStrength();
    });

    function shufflePassword(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }
});
