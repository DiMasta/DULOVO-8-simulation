// Level 6: print the student's name on the screen with OUTC.

// A name of n letters needs n OUTC cells, STOP! and n data cells: 2n + 1 <= 16.
const MAX_LETTERS = 7;
const firstName = Progress.getName().split(/\s+/)[0];
const target = [...firstName].slice(0, MAX_LETTERS).join("");

setupProgramLevel({
  level: 6,
  allowed: ["OUT", "OUTC"],
  cells: Array.from({ length: RAM_SIZE }, () => ({ editable: true })),
  check: (lines) => (lines.join("") === target ? "" : "На екрана трябва да пише „" + target + "“."),
});

if (target) {
  document.getElementById("goal").textContent =
    "Напиши програма, която показва на екрана „" + target + "“" +
    (target.length < firstName.length ? " (първите " + MAX_LETTERS + " букви от името ти)" : "") +
    ". Ето кодовете на буквите, които ще ти трябват:";

  const codes = document.getElementById("codes");
  codes.innerHTML = "<tr><th>Буква</th><th>Код</th></tr>";
  [...new Set(target)].forEach((char) => {
    const row = codes.insertRow();
    row.insertCell().textContent = char;
    const code = charToByte(char);
    row.insertCell().textContent = code === null ? "—" : code;
  });
} else {
  document.getElementById("run-button").disabled = true;
  setFeedback("Първо напиши името си на началната страница.", "error");
}
