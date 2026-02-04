console.log("bara app loaded");

const setup = document.getElementById("screen-setup");
const reveal = document.getElementById("screen-reveal");

const playersEl = document.getElementById("players");
const topicsEl = document.getElementById("topics");

const startBtn = document.getElementById("start");

const revealName = document.getElementById("reveal-name");
const showRoleBtn = document.getElementById("show-role");
const roleBox = document.getElementById("role-box");
const roleText = document.getElementById("role-text");
const topicText = document.getElementById("topic-text");
const nextBtn = document.getElementById("next-player");

function linesToList(text) {
  return text
    .split("\n")
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

function randInt(n) {
  return Math.floor(Math.random() * n);
}

// حالة اللعبة
let state = {
  players: [],
  word: "",
  outsiderIndex: -1,
  i: 0
};

function startGame() {
  const players = linesToList(playersEl.value);
  const words = linesToList(topicsEl.value);

  if (players.length < 3) {
    alert("لازم 3 لاعبين على الأقل.");
    return;
  }
  if (words.length < 1) {
    alert("حط على الأقل كلمة وحدة بالسوالف.");
    return;
  }

  state.players = players;
  state.word = words[randInt(words.length)];
  state.outsiderIndex = randInt(players.length);
  state.i = 0;

  setup.classList.add("hidden");
  reveal.classList.remove("hidden");

  roleBox.classList.add("hidden");
  roleText.textContent = "";
  topicText.textContent = "";

  updateRevealScreen();
}

function updateRevealScreen() {
  const name = state.players[state.i];
  revealName.textContent = name;

  roleBox.classList.add("hidden");
  roleText.textContent = "";
  topicText.textContent = "";
  showRoleBtn.disabled = false;
}

function showRole() {
  const isOutsider = state.i === state.outsiderIndex;

  roleBox.classList.remove("hidden");

  if (isOutsider) {
    roleText.textContent = "أنت برا السالفة 😶";
    topicText.textContent = "حاول تمشي مع الجماعة بدون ما ينكشف أمرك!";
  } else {
    roleText.textContent = "أنت داخل السالفة ✅";
    topicText.textContent = "الكلمة هي: " + state.word;
  }

  // بعد ما يشوف دوره، خليه يمرّر للجاي
  showRoleBtn.disabled = true;
}

function nextPlayer() {
  state.i += 1;

  if (state.i >= state.players.length) {
    alert("خلص كشف الأدوار ✅\nابدأوا الأسئلة والنقاش، وبعدين منضيف شاشة التصويت.");
    // حاليا نرجع لبداية (بعدين منطورها)
    location.reload();
    return;
  }

  updateRevealScreen();
}

startBtn.addEventListener("click", startGame);
showRoleBtn.addEventListener("click", showRole);
nextBtn.addEventListener("click", nextPlayer);
// Offline
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(console.error);
  });
}
