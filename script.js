document.addEventListener("DOMContentLoaded", () => {
  let userPin = localStorage.getItem("pin");

  function checkPin() {
    if (!userPin) {
      let newPin = prompt("Set a 4-digit PIN:");
      if (!/^\d{4}$/.test(newPin)) {
        alert("PIN must be exactly 4 digits.");
        return checkPin();
      }
      localStorage.setItem("pin", newPin);
      userPin = newPin;
    } else {
      let input = prompt("Enter your 4-digit PIN:");
      if (input !== userPin) {
        document.body.innerHTML = "<h2>Access Denied</h2>";
        throw new Error("Wrong PIN");
      }
    }
  }
  checkPin();

  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  let settings = JSON.parse(localStorage.getItem("settings")) || {
    currency: "RWF",
    budget: 0
  };

  const currencyEl = document.getElementById("currency");
  const budgetEl = document.getElementById("budget");
  const amountEl = document.getElementById("amount");
  const categoryEl = document.getElementById("category");
  const dateEl = document.getElementById("date");
  const list = document.getElementById("list");
  const totalEl = document.getElementById("total");
  const currencyLabel = document.getElementById("currencyLabel");
  const warning = document.getElementById("warning");

  currencyEl.value = settings.currency;
  budgetEl.value = settings.budget;

  window.saveSettings = function () {
    settings.currency = currencyEl.value;
    settings.budget = Number(budgetEl.value) || 0;
    localStorage.setItem("settings", JSON.stringify(settings));
    render();
  };

  window.addExpense = function () {
    const amount = Number(amountEl.value);
    const category = categoryEl.value || "Other";
    const date = dateEl.value;

    if (amount <= 0 || !date) {
      alert("Enter a valid amount and date");
      return;
    }

    expenses.push({ amount, category, date });
    localStorage.setItem("expenses", JSON.stringify(expenses));
    amountEl.value = "";
    render();
  };

  window.deleteExpense = function (i) {
    expenses.splice(i, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    render();
  };

  function render() {
    list.innerHTML = "";
    let total = 0;
    const month = new Date().toISOString().slice(0, 7);

    expenses.forEach((e, i) => {
      if (e.date.startsWith(month)) {
        total += e.amount;
        list.innerHTML += `
          <div>
            ${e.category} — ${e.amount} ${settings.currency}
            <span onclick="deleteExpense(${i})"> ✖</span>
          </div>`;
      }
    });

    totalEl.innerText = total;
    currencyLabel.innerText = settings.currency;

    warning.innerText =
      settings.budget > 0 && total > settings.budget
        ? "⚠️ Budget exceeded"
        : "";
  }

  render();
});
