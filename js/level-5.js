// Level 5: a program of OUT and STOP! that shows the date of birth on the screen.
const DATA_START = 13;
const date = Progress.getBirthDate();
const bytes = date ? [date.day, date.month, date.year % 100] : [];

setupProgramLevel({
  level: 5,
  allowed: ["OUT"],
  cells: Array.from({ length: RAM_SIZE }, (_, i) =>
    i < DATA_START ? { editable: true } : { text: date ? formatByte(bytes[i - DATA_START]) : "" }
  ),
  check: (lines) =>
    lines.join(",") === bytes.join(",")
      ? ""
      : "На екрана трябва да се появят " + bytes.join(", ") + " — денят, месецът и годината, в този ред.",
});

if (!date) {
  document.getElementById("run-button").disabled = true;
  setFeedback("Първо запиши рождената си дата в ниво 4.", "error");
}
