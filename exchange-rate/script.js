let data = {}; // for storing exchanging rate data

// document query

const currencyEl_one = document.getElementById("currency-one");
const amountEl_one = document.getElementById("amount-one");
const currencyEl_two = document.getElementById("currency-two");
const amountEl_two = document.getElementById("amount-two");
const rateEl = document.getElementById("rate");
const swap = document.getElementById("swap");

function calculate() {
  const currency_one = currencyEl_one.value;
  const currency_two = currencyEl_two.value;
  const rate = data.rates[currency_two] / data.rates[currency_one];
  rateEl.innerText = `1 ${currency_one} = ${rate} ${currency_two}`;
  amountEl_two.value = (amountEl_one.value * rate).toFixed(2);
}

async function fetchExchangeRates() {
  try {
    const response = await fetch("https://open.exchangerate-api.com/v6/latest");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
  }
}

async function initialization() {
  data = await fetchExchangeRates();
  initializeOptions();
  calculate();
}

function initializeOptions() {
  currencyEl_one.innerHTML = "";
  currencyEl_two.innerHTML = "";
  for (const currency in data.rates) {
    const option1 = document.createElement("option");
    option1.value = currency;
    option1.innerText = currency;
    currencyEl_one.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = currency;
    option2.innerText = currency;
    currencyEl_two.appendChild(option2);
  }
  currencyEl_one.firstChild.selected = "selected";
  currencyEl_two.firstChild.selected = "selected";
}

// Event Listener
currencyEl_one.addEventListener("change", calculate);
amountEl_one.addEventListener("input", calculate);
currencyEl_two.addEventListener("change", calculate);
amountEl_two.addEventListener("input", calculate);

swap.addEventListener("click", () => {
  const temp = currencyEl_one.value;
  currencyEl_one.value = currencyEl_two.value;
  currencyEl_two.value = temp;
  calculate();
});

initialization();
