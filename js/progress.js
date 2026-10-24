// Player name and completed levels, kept in the browser's localStorage.
const Progress = (() => {
  const KEY = "dulovo8";

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      // Storage may be unavailable (private mode); progress just won't persist.
    }
  }

  return {
    getName() {
      return load().name || "";
    },
    setName(name) {
      const data = load();
      data.name = name;
      save(data);
    },
    isCompleted(level) {
      return (load().completed || []).includes(level);
    },
    complete(level) {
      const data = load();
      data.completed = data.completed || [];
      if (!data.completed.includes(level)) {
        data.completed.push(level);
      }
      save(data);
    },
  };
})();

function showPlayerName() {
  const el = document.getElementById("player-name");
  const name = Progress.getName();
  if (el && name) {
    el.textContent = "Играч: " + name;
  }
}
