// Level 4: write the student's date of birth as three bytes in cells 1101..1111.
const DATA_START = 13;

const inputs = buildRam(
  document.getElementById("ram-body"),
  Array.from({ length: RAM_SIZE }, (_, i) => ({ editable: i >= DATA_START })),
  /[^01 ]/g
);
const dataInputs = inputs.slice(DATA_START);
const dateInput = document.getElementById("birth-date");
const checkButton = document.getElementById("check-button");

const pad = (n) => String(n).padStart(2, "0");

// Day, month and the last two digits of the year: a byte only holds 0..255.
function expectedBytes() {
  const date = Progress.getBirthDate();
  return date && [date.day, date.month, date.year % 100];
}

function showBirthDate() {
  const date = Progress.getBirthDate();
  dataInputs.forEach((input) => (input.disabled = !date));
  checkButton.disabled = !date;
  if (!date) return;

  dateInput.value = date.year + "-" + pad(date.month) + "-" + pad(date.day);
  document.getElementById("birth-values").textContent =
    "→ " + date.day + ", " + date.month + ", " + (date.year % 100);
}

dateInput.addEventListener("change", () => {
  const [year, month, day] = dateInput.value.split("-").map(Number);
  if (!year || !month || !day) return;
  Progress.setBirthDate({ day, month, year });
  dataInputs.forEach((input) => input.parentElement.classList.remove("correct", "wrong"));
  setFeedback("", "");
  showBirthDate();
  dataInputs[0].focus();
});

checkButton.addEventListener("click", () => {
  const expected = expectedBytes();
  let empty = 0;
  let wrong = 0;
  let notEightBits = false;

  dataInputs.forEach((input, i) => {
    const cell = input.parentElement;
    cell.classList.remove("correct", "wrong");
    if (input.value.trim() === "") {
      empty++;
      return;
    }
    const value = parseByte(input.value);
    if (value === expected[i]) {
      cell.classList.add("correct");
    } else {
      cell.classList.add("wrong");
      wrong++;
      if (value === null) notEightBits = true;
    }
  });

  if (empty === 0 && wrong === 0) {
    showSuccess(4, "Рождената ти дата е в паметта. Ниво 4 е завършено!");
  } else if (wrong > 0) {
    let text = wrong === 1 ? "Има 1 грешен байт" : "Има " + wrong + " грешни байта";
    text += " (в червено). Опитай пак!";
    if (notEightBits) text += " Байтът има точно 8 бита: 5 е 0000 0101.";
    setFeedback(text, "error");
  } else {
    setFeedback(empty === 1 ? "Остава 1 празна клетка." : "Остават " + empty + " празни клетки.", "error");
  }
});

document.getElementById("clear-button").addEventListener("click", () => {
  dataInputs.forEach((input) => {
    input.value = "";
    input.parentElement.classList.remove("correct", "wrong");
  });
  setFeedback("", "");
});

showBirthDate();
