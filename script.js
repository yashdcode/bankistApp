"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
let currentAccount = {};
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300, 670],
  interestRate: 0.012, // %
  pin: 1111,
  movementsDates: [
    "2011-10-07T14:48:00.000Z",
    "2011-09-05T14:48:00.000Z",
    "2011-07-05T14:48:00.000Z",
    "2011-01-04T14:48:00.000Z",
    "2011-01-04T14:48:00.000Z",
    "2011-09-05T14:48:00.000Z",
    "2011-05-03T14:48:00.000Z",
    "2011-05-02T14:48:00.000Z",
    "2024-05-31T14:48:00.000Z",
  ],
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 0.015,
  pin: 2222,
  movementsDates: [
    "2011-06-05T14:48:00.000Z",
    "2011-11-01T14:48:00.000Z",
    "2011-10-04T14:48:00.000Z",
    "2011-01-09T14:48:00.000Z",
    "2011-05-04T14:48:00.000Z",
    "2011-07-03T14:48:00.000Z",
    "2011-05-01T14:48:00.000Z",
    "2011-03-02T14:48:00.000Z",
  ],
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.007,
  pin: 3333,
  movementsDates: [
    "2011-11-05T14:48:00.000Z",
    "2011-09-05T14:48:00.000Z",
    "2011-07-05T14:48:00.000Z",
    "2011-01-04T14:48:00.000Z",
    "2011-05-04T14:48:00.000Z",
    "2011-07-03T14:48:00.000Z",
    "2011-06-03T14:48:00.000Z",
    "2011-10-03T14:48:00.000Z",
  ],
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 0.001,
  pin: 4444,
  movementsDates: [
    "2011-09-05T14:48:00.000Z",
    "2011-10-05T14:48:00.000Z",
    "2011-09-05T14:48:00.000Z",
    "2011-09-04T14:48:00.000Z",
    "2011-08-04T14:48:00.000Z",
  ],
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const maxValue = (movements) => {
  const max = movements.reduce((acc, curr) => {
    if (acc < curr) return curr;
    else return acc;
  }, movements[0]);
  console.log(max);
};
maxValue(movements);

// formating the movements date to print like TODAY, YESTERDAY & more than one two days
const formateMovementDate = (date) => {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (60 * 60 * 1000 * 24));
  // Date calculation
  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();
  const daysPassed = calcDaysPassed(new Date(), date);

  //Logic to print the Days Passed
  if (daysPassed === 0) return "TODAY";
  else if (daysPassed === 1) return "YESTERDAY";
  else if (daysPassed <= 7) return `${daysPassed} DAYS AGO`;
  else return `${day}/${month}/${year}`;
};
const displayMovements = (account, flag = false) => {
  //sorting if flag is true
  let movs = flag
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;
  console.log("account dates", account.movementsDates);
  containerMovements.innerHTML = "";
  movs.forEach((move, i) => {
    const trans = move < 0 ? "withdrawal" : "deposit";
    const transcDate = new Date(account.movementsDates[i]);
    // Showing transaction Date for specific movement in current account
    const daysPassed = formateMovementDate(transcDate);
    const html = `
    <div class="movements__row">
       <div class="movements__type movements__type--${trans}">${
      i + 1
    } ${trans}</div>
      <div class="movements__Date">${daysPassed}</div>
       <div class="movements__value">${move}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const countDisplayBalance = (acc) => {
  acc.balance = acc.movements.reduce((mov, curr) => mov + curr, 0);
  labelBalance.innerHTML = `${acc.balance}€`;
};

const calcDisplaySummary = (account) => {
  const summaryIn = account.movements
    .filter((ele) => ele > 0)
    .reduce((acc, ele) => acc + ele, 0);
  labelSumIn.textContent = `${summaryIn}€`;

  const summaryOut = account.movements
    .filter((ele) => ele < 0)
    .reduce((acc, ele) => acc + ele, 0);
  labelSumOut.textContent = `${summaryOut}€`;

  const interest = account.movements
    .filter((ele) => ele > 0)
    .map((ele) => ele * account.interestRate)
    .filter((ele) => ele >= 1)
    .reduce((acc, ele) => ele + acc, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsername = (accounts) => {
  accounts.forEach((acc) => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((ele) => ele[0])
      .join("");
  });
};

const findAccount = (accounts, uname) => {
  let flag = 0;
  for (let acc of accounts) {
    if (uname === acc.owner) {
      flag = 1;
      return acc;
    }
  }
  if (flag === 1) return "account doesn't exist";
};
createUsername(accounts);

const updateUI = (account) => {
  // display movements
  displayMovements(account);
  // display summary
  calcDisplaySummary(account);
  //display balance
  countDisplayBalance(account);
  //clearing input fields
};

//User login implementation
btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  const uname = inputLoginUsername.value;
  const pin = Number(inputLoginPin.value);
  console.log(uname, pin);
  if (pin && uname) {
    for (let account of accounts) {
      if (account.userName === uname && account.pin === pin) {
        console.log("login successfully");
        updateUI(account);
        // Logging sign in Date to the UI
        const now = new Date();
        const day = `${now.getDate()}`.padStart(2, 0);
        const year = now.getFullYear();
        const month = `${now.getMonth()}`.padStart(2, 0);
        labelDate.textContent = `${day}/${month}/${year}`;
        currentAccount = account;
        labelWelcome.textContent = `Welcome back, ${
          account.owner.split(" ")[0]
        }`;
        containerApp.style.opacity = 100;
        inputLoginUsername.value = "";
        inputLoginPin.value = "";
        break;
      }
    }
  } else {
    console.log("login failed....please login again");
  }
});

//Money transfer implementation
btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  const uname = inputTransferTo.value;
  const transferAmount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find((acc) => acc.userName === uname);
  if (
    transferAmount > 0 &&
    receiverAcc &&
    currentAccount.balance >= transferAmount &&
    receiverAcc?.useName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-transferAmount);
    receiverAcc.movements.push(transferAmount);
    //Creating transaction Dates
    const tranferDatesnd = new Date().toISOString();
    const tranferDaterec = new Date().toISOString();
    //Adding transaction Dates to the respective Account
    currentAccount.movementsDates.push(tranferDatesnd);
    receiverAcc.movementsDates.push(tranferDaterec);
    updateUI(currentAccount);
  }
  //clearing input fields
  inputTransferAmount.vaue = "";
  inputTransferTo.value = "";
});

//account close or delete
btnClose.addEventListener("click", (e) => {
  e.preventDefault();
  const pin = Number(inputClosePin.value);
  const uname = inputCloseUsername.value;
  if (
    uname &&
    pin &&
    uname === currentAccount.userName &&
    pin === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.userName === currentAccount.userName
    );
    accounts.splice(index, 1);
  }
  inputClosePin.value = "";
  inputCloseUsername.value = "";
  containerApp.style.opacity = 0;
});

//applying for loan

btnLoan.addEventListener("click", (e) => {
  e.preventDefault();
  const loanAmt = Number(inputLoanAmount.value);
  const loanDate = new Date().toISOString();
  currentAccount.movementsDates.push(loanDate);
  //checking for loan criterion
  if (
    loanAmt > 0 &&
    currentAccount.movements.some((move) => move >= 0.1 * loanAmt)
  ) {
    // adding loan amount to the account
    currentAccount.movements.push(loanAmt);
    updateUI(currentAccount);
  }
  //clearing resources
  inputLoanAmount.value = "";
});

// SORT account movements
let flag = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  // displaying soted movements
  displayMovements(currentAccount, !flag);
  flag = !flag;
});
