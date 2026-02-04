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

  // عرض التصويت بعد كشف الأدوار
  setTimeout(() => {
    showVoteScreen();
  }, 1500); // بعد 1.5 ثانية
}

function showVoteScreen() {
  // تظهر شاشة التصويت
  document.getElementById("screen-vote").classList.remove("hidden");

  const namesHtml = state.players
    .map((player, index) => `<button class="vote-btn" data-index="${index}">${player}</button>`)
    .join("");

  document.getElementById("vote-names").innerHTML = namesHtml;

  const voteBtns = document.querySelectorAll(".vote-btn");
  voteBtns.forEach(btn => {
    btn.addEventListener("click", () => voteForOutsider(btn.dataset.index));
  });
}

let vote = null;

function voteForOutsider(index) {
  vote = index;
  alert(`تم التصويت!`);
  document.getElementById("submit-vote").disabled = false;
}

document.getElementById("submit-vote").addEventListener("click", () => {
  if (vote === null) {
    alert("من فضلك، اختار مين برا السالفة");
    return;
  }

  const result = vote === state.outsiderIndex ? "الاختيار صحيح!" : "الاختيار خاطئ!";
  alert(result);
  document.getElementById("screen-vote").classList.add("hidden");

  // إعادة تشغيل اللعبة أو إغلاقها
  setTimeout(() => {
    alert("اللعبة انتهت! 🎉");
    location.reload(); // نعيد تحميل الصفحة من جديد
  }, 1500);
}

