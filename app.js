console.log("bara app loaded");

const setup = document.getElementById("screen-setup");
const reveal = document.getElementById("screen-reveal");
const voteScreen = document.getElementById("screen-vote");

const playersEl = document.getElementById("players");
const topicsEl = document.getElementById("topics");

const startBtn = document.getElementById("start");

const revealName = document.getElementById("reveal-name");
const showRoleBtn = document.getElementById("show-role");
const roleBox = document.getElementById("role-box");
const roleText = document.getElementById("role-text");
const topicText = document.getElementById("topic-text");
const nextBtn = document.getElementById("next-player");

const voteNames = document.getElementById("vote-names");
const submitVoteBtn = document.getElementById("submit-vote");

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
  voteScreen.classList.add("hidden");

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

  showRoleBtn.disabled = true;
}

function nextPlayer() {
  state.i += 1;

  // ✅ هون كان عندك رجوع/Reload بالنسخة القديمة
  // ✅ هلأ بدل ما يرجع للبداية، بنروح للتصويت
  if (state.i >= state.players.length) {
    reveal.classList.add("hidden");
    showVoteScreen();
    return;
  }

  updateRevealScreen();
}

// ===== التصويت =====
let voteRound = 0;        // اللاعب اللي عم يصوّت هلأ
let votes = [];           // كل عنصر هو index للشخص المختار
let selectedVote = null;  // اختيار الحالي

function showVoteScreen() {
  voteScreen.classList.remove("hidden");
  voteRound = 0;
  votes = [];
  selectedVote = null;
  submitVoteBtn.disabled = true;

  renderVoteRound();
}

function renderVoteRound() {
  const voterName = state.players[voteRound];

  voteNames.innerHTML = "";

  const title = document.createElement("div");
  title.className = "muted";
  title.style.marginBottom = "10px";
  title.textContent = `دور التصويت: ${voterName} — اختار مين برا السالفة 🎯`;
  voteNames.appendChild(title);

  state.players.forEach((p, idx) => {
    const b = document.createElement("button");
    b.textContent = p;
    b.style.marginTop = "8px";
    b.onclick = () => {
      selectedVote = idx;
      submitVoteBtn.disabled = false;

      // تمييز بسيط
      [...voteNames.querySelectorAll("button")].forEach(x => x.style.opacity = "0.6");
      b.style.opacity = "1";
    };
    voteNames.appendChild(b);
  });
}

submitVoteBtn.addEventListener("click", () => {
  if (selectedVote === null) {
    alert("اختار اسم قبل ما تقدم.");
    return;
  }

  votes.push(selectedVote);

  selectedVote = null;
  submitVoteBtn.disabled = true;

  voteRound += 1;

  if (voteRound >= state.players.length) {
    showResults();
  } else {
    renderVoteRound();
  }
});

function showResults() {
  const counts = new Array(state.players.length).fill(0);
  votes.forEach(v => counts[v]++);

  // أكثر واحد انصوّت عليه (مع معالجة التعادل)
  const maxCount = Math.max(...counts);
  const maxCandidates = [];
  counts.forEach((c, idx) => {
    if (c === maxCount) maxCandidates.push(idx);
  });
  const votedOutsider = maxCandidates[randInt(maxCandidates.length)];

  const realOutsider = state.outsiderIndex;

  const realName = state.players[realOutsider];
  const votedName = state.players[votedOutsider];

  const ok = votedOutsider === realOutsider;

  voteNames.innerHTML = `
    <div class="big">النتيجة ✅</div>
    <div style="text-align:center; margin-top:8px;">
      برا السالفة الحقيقي: <b>${realName}</b><br/>
      أكثر واحد انصوّت عليه: <b>${votedName}</b><br/><br/>
      ${ok ? "مبروك! مسكتوه 😄" : "لااا! هرب منكم 😅"}
    </div>
    <button id="restart" style="margin-top:12px;">إعادة لعبة 🔁</button>
  `;

  const r = document.getElementById("restart");
  r.onclick = () => location.reload();
}

// Offline
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(console.error);
  });
}

// ربط الأزرار
startBtn.addEventListener("click", startGame);
showRoleBtn.addEventListener("click", showRole);
nextBtn.addEventListener("click", nextPlayer);
