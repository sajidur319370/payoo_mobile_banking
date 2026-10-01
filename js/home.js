// Constants for hardcoded credentials
const VALID_PIN = "1234";
const VALID_COUPON = "PAYOO";

// ==========================================
// 1. STATE & DATA MANAGEMENT
// ==========================================

const transactionHistory = [];

function recordTransaction(title, iconPath) {
  const newTransaction = {
    title,
    iconPath,
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  transactionHistory.push(newTransaction);
}

// ==========================================
// 2. DOM UTILITIES (UI & Input Helpers)
// ==========================================
function getForm(id) {
  return document.getElementById(id);
}
function getInputValue(id) {
  const value = document.getElementById(id).value.trim();
  return value;
}

function clearInputField(id) {
  document.getElementById(id).value = "";
}

function getBalance() {
  const balance = parseFloat(document.getElementById("balance").innerText);
  return balance;
}

function deactivateAllButton() {
  const showButtons = document.getElementsByClassName("show_button");
  for (const b of showButtons) {
    b.classList.remove("border-[#0874F2]", "text-[#0874F2]", "bg-[#0874F2]/5");
    b.classList.add("border-gray-300");
  }
}

function makeButtonActive(id) {
  document.getElementById(id).classList.remove("border-gray-300");
  document
    .getElementById(id)
    .classList.add("border-[#0874F2]", "text-[#0874F2]", "bg-[#0874F2]/5");
}

function makeFormVisible(id) {
  const forms = document.getElementsByClassName("form");
  for (const f of forms) {
    f.style.display = "none";
  }
  document.getElementById(id).style.display = "block";
}

// ==========================================
// 3. VALIDATION HELPERS
// ==========================================
function validateAccount(accountNumber) {
  const phoneRegex = /^01[3-9]\d{8}$/;
  if (!phoneRegex.test(accountNumber)) {
    alert("Invalid account number format!");
    return false;
  }

  return true;
}

function validatePin(pin, validPin) {
  if (pin !== validPin) {
    alert("Invalid PIN!");
    return false;
  }
  return true;
}

function validateAmount(amount, operation) {
  const balance = getBalance();
  if (["withdraw", "transfer", "pay"].includes(operation) && amount > balance) {
    alert("Amount can not be greater than balance!!");
    return false;
  }
  return true;
}

function validateCoupon(coupon, validCoupon) {
  if (coupon !== validCoupon) {
    alert("Coupon is invalid!!");
    return false;
  }
  return true;
}

// ==========================================
// 4. BUSINESS LOGIC & DOM RENDERING
// ==========================================
function updateBalance(amount, operation) {
  const balance = getBalance();
  if (operation === "add") {
    document.getElementById("balance").innerText = balance + amount;
    recordTransaction("Add Money", "./assets/wallet1.png");
  } else if (operation === "withdraw") {
    document.getElementById("balance").innerText = balance - amount;
    recordTransaction("Withdraw Money", "./assets/send1.png");
  } else if (operation === "transfer") {
    document.getElementById("balance").innerText = balance - amount;
    recordTransaction("Transfer Money", "./assets/money1.png");
  } else if (operation === "bonus") {
    document.getElementById("balance").innerText = balance + amount;
    recordTransaction("Bonus Money", "./assets/bonus1.png");
  } else if (operation === "pay") {
    document.getElementById("balance").innerText = balance - amount;
    recordTransaction("Pay Bill", "./assets/purse1.png");
  }
}
// --- Utility for rendering data into div ---
function createNewElement(d) {
  const newDiv = document.createElement("div");
  newDiv.innerHTML = `<div
        class="flex justify-between items-center bg-[#FFFFFF] border border-black/5 p-3 rounded-lg"
      >
        <div class="flex gap-2 justify-between items-center">
          <div
            class="rounded-full p-3 bg-black/5 flex justify-center items-center"
          >
            <img src=${d.iconPath} alt="wallet" />
          </div>
          <div>
            <h3 class="font-bold text-base">${d.title}</h3>
            <p class="text-black/70 text-sm">${d.timestamp}</p>
          </div>
        </div>
        <button class="cursor-pointer rotate-90">
          <i class="fa-solid fa-ellipsis"></i>
        </button>
      </div>`;
  return newDiv;
}
function showAllTransactions() {
  const transactionsList = document.getElementById("transaction_list");
  transactionsList.innerText = "";
  for (d of transactionHistory) {
    const newChild = createNewElement(d);
    transactionsList.appendChild(newChild);
  }
}

function showAllPayment() {
  const paymentList = document.getElementById("payment_list");
  paymentList.innerText = "";
  const paymentHistory = transactionHistory.reverse();
  for (d of paymentHistory) {
    const newChild = createNewElement(d);
    paymentList.appendChild(newChild);
  }
}

// ==========================================
// 5. EVENT LISTENERS (UI Navigation)
// ==========================================

// --- Form Toggles ---
document.getElementById("show_add_form").addEventListener("click", function () {
  deactivateAllButton();
  makeButtonActive("show_add_form");
  makeFormVisible("add_form");
});

document
  .getElementById("show_withdraw_form")
  .addEventListener("click", function () {
    deactivateAllButton();
    makeButtonActive("show_withdraw_form");
    makeFormVisible("withdraw_form");
  });

document
  .getElementById("show_transfer_form")
  .addEventListener("click", function () {
    deactivateAllButton();
    makeButtonActive("show_transfer_form");
    makeFormVisible("transfer_form");
  });

document
  .getElementById("show_bonus_form")
  .addEventListener("click", function () {
    deactivateAllButton();
    makeButtonActive("show_bonus_form");
    makeFormVisible("bonus_form");
  });

document
  .getElementById("show_pay_bill_form")
  .addEventListener("click", function () {
    deactivateAllButton();
    makeButtonActive("show_pay_bill_form");
    makeFormVisible("pay_bill_form");
  });

document
  .getElementById("show_transaction_form")
  .addEventListener("click", function () {
    deactivateAllButton();
    makeButtonActive("show_transaction_form");
    makeFormVisible("transaction_form");
    showAllTransactions();
  });

document.getElementById("home_button").addEventListener("click", function () {
  deactivateAllButton();
  makeFormVisible("latest_payment");
  showAllPayment();
});

// ==========================================
// 6.Action Handlers
// ==========================================

// --- Add Money ---
document
  .getElementById("add_money_button")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const addForm = getForm("add_money_form");
    if (!addForm.reportValidity()) {
      return;
    }

    const accountNumber = getInputValue("add_account_number");
    const amount = parseFloat(getInputValue("add_amount"));
    const pin = getInputValue("add_pin");

    if (validateAccount(accountNumber) && validatePin(pin, VALID_PIN)) {
      console.log(transactionHistory);
      updateBalance(amount, "add");
      clearInputField("add_bank");
      clearInputField("add_account_number");
      clearInputField("add_amount");
      clearInputField("add_pin");
      return;
    }
  });
// -- Withdraw Money ---
document
  .getElementById("withdraw_money_button")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const withdrawForm = getForm("withdraw_money_form");
    if (!withdrawForm.reportValidity()) {
      return;
    }

    const agentNumber = getInputValue("agent_number");
    const amount = parseFloat(getInputValue("withdraw_amount"));
    const pin = getInputValue("withdraw_pin");

    if (
      validateAccount(agentNumber) &&
      validateAmount(amount, "withdraw") &&
      validatePin(pin, VALID_PIN)
    ) {
      console.log(transactionHistory);
      updateBalance(amount, "withdraw");
      clearInputField("agent_number");
      clearInputField("withdraw_amount");
      clearInputField("withdraw_pin");
      return;
    }
  });
// --- Transfer Money ---
document
  .getElementById("transfer_money_button")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const transferForm = getForm("transfer_money_form");
    if (!transferForm.reportValidity()) {
      return;
    }

    const accountNumber = getInputValue("transfer_account_number");
    const amount = parseFloat(getInputValue("transfer_amount"));
    const pin = getInputValue("transfer_pin");

    if (
      validateAccount(accountNumber) &&
      validateAmount(amount, "transfer") &&
      validatePin(pin, VALID_PIN)
    ) {
      console.log(transactionHistory);
      updateBalance(amount, "transfer");
      clearInputField("transfer_account_number");
      clearInputField("transfer_amount");
      clearInputField("transfer_pin");
      return;
    }
  });
// --- Bonus Money ---
document
  .getElementById("bonus_money_button")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const coupon = getInputValue("coupon");
    if (validateCoupon(coupon, VALID_COUPON)) {
      console.log(transactionHistory);
      updateBalance(100, "bonus");
      clearInputField("coupon");
      alert("you have received $100. Click Ok to continue.");
      return;
    }
  });
// --- Pay Bill ---
document
  .getElementById("pay_bill_button")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const billerForm = getForm("pay_bill_money_form");
    if (!billerForm.reportValidity()) {
      return;
    }

    const billerNumber = getInputValue("biller_account_number");
    const amount = parseFloat(getInputValue("biller_amount"));
    const pin = getInputValue("biller_pin");

    if (
      validateAccount(billerNumber) &&
      validateAmount(amount, "pay") &&
      validatePin(pin, VALID_PIN)
    ) {
      console.log(transactionHistory);
      updateBalance(amount, "pay");
      clearInputField("biller_type");
      clearInputField("biller_account_number");
      clearInputField("biller_amount");
      clearInputField("biller_pin");
      return;
    }
  });

// --- Authentication / System ---
document.getElementById("logout").addEventListener("click", function () {
  window.location.href = "index.html";
});
