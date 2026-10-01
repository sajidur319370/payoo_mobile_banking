// ==========================================
//  Login Button Functionality
// ==========================================

// Constants for hardcoded credentials
const VALID_MOBILE = "01521319370";
const VALID_PIN = "1234";

// --- Validation Functions ---
function validateAccount(mobileNumber) {
  const phoneRegex = /^01[3-9]\d{8}$/;

  if (!phoneRegex.test(mobileNumber)) {
    alert("Invalid mobile number format!");
    return false;
  }
  if (mobileNumber !== VALID_MOBILE) {
    alert("Mobile number not registered!");
    return false;
  }
  return true;
}

function validatePin(pin) {
  if (pin !== VALID_PIN) {
    alert("Invalid PIN!");
    return false;
  }
  return true;
}

// --- Get Input Utility ---
function getInputValue(id) {
  return document.getElementById(id).value.trim();
}

// --- Event Listener ---
const loginButton = document.getElementById("login_button");
const loginForm = document.getElementById("login_form");

loginButton.addEventListener("click", function (event) {
  event.preventDefault();
  if (!loginForm.reportValidity()) {
    return;
  }

  const mobileNumber = getInputValue("mobile_number");
  const pin = getInputValue("login_pin");

  if (validateAccount(mobileNumber) && validatePin(pin)) {
    document.getElementById("mobile_number").value = "";
    document.getElementById("login_pin").value = "";
    window.location.href = "home.html";
  }
});
