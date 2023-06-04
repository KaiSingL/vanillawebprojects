// function setState(input, value) {
//   input.dataset.isValid = value;
// }

const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");

// [username, email, password, password2].forEach((input) => {
//   setState(input, false);
// });

// Show input error message
function showError(input, message) {
  const formControl = input.parentElement;
  formControl.className = "form-control error";
  const small = formControl.querySelector("small");
  small.innerText = message;
}

// Show success outline
function showSuccess(input) {
  const formControl = input.parentElement;
  formControl.className = "form-control success";
}

// Check email is valid
function checkEmail(input) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(input.value.trim())) {
    showSuccess(input);
    // setState(input, false);
  } else {
    showError(input, "Email is not valid");
    // setState(input, true);
  }
}

// Check required fields
function checkAllFieldsCompleted(inputArr) {
  let isFilled = true;
  inputArr.forEach(function (input) {
    if (input.value.trim() === "") {
      showError(input, `${getFieldName(input)} is required`);
      isFilled = false;
    } else {
      showSuccess(input);
    }
  });

  return isFilled;
}

// Check input length
function checkLength(input, min, max) {
  let isValid = true;
  if (input.value.length < min) {
    showError(
      input,
      `${getFieldName(input)} must be at least ${min} characters`
    );
    // setState(input, false);
    isValid = false;
  } else if (input.value.length > max) {
    showError(
      input,
      `${getFieldName(input)} must be less than ${max} characters`
    );
    // setState(input, false);
    isValid = false;
  } else {
    showSuccess(input);
    // setState(input, true);
  }
  return isValid;
}

// Check passwords match
function checkPasswordsMatch(input1, input2) {
  let isMatch = true;
  if (input1.value !== input2.value) {
    showError(input2, "Passwords do not match");
    isMatch = false;
  }
  return isMatch;
}

// Check passwords all criteriae
function checkPasswords() {
  let isValid = true;
  isValid &&= checkLength(password, 3, 8);
  isValid &&= checkLength(password2, 3, 8);
  if (isValid) isValid &&= checkPasswordsMatch(password, password2);

  return isValid;
}

// Get fieldname
function getFieldName(input) {
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

// Event listeners
form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (checkAllFieldsCompleted([username, email, password, password2])) {
    checkLength(username, 3, 15);
    checkLength(password, 3, 8);
    checkEmail(email);
    checkPasswordsMatch(password, password2);
  }
});

username.addEventListener("blur", () => {
  checkLength(username, 3, 15);
});

email.addEventListener("blur", () => {
  checkEmail(email);
});

password.addEventListener("blur", () => {
  if (checkLength(password, 3, 8)) checkPasswordsMatch(password, password2);
});

password2.addEventListener("blur", () => {
  if (checkLength(password2, 3, 8)) checkPasswordsMatch(password, password2);
});
