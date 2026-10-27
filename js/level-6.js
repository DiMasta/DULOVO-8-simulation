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
  document.getElementById("goal").innerHTML = "Покажи <strong></strong> на екрана. Кодовете на буквите:";
  document.querySelector("#goal strong").textContent = "„" + target + "“";

  const codes = document.getElementById("codes");
  [...new Set(target)].forEach((char) => {
    const item = document.createElement("li");
    const code = charToByte(char);
    item.textContent = char + " = " + (code === null ? "?" : code);
    codes.appendChild(item);
  });
} else {
  document.getElementById("goal").textContent = "Първо напиши името си на началната страница.";
  document.getElementById("run-button").disabled = true;
}
