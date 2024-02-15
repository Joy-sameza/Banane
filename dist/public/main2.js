const helpId1 = document.getElementById("helpId1");
const helpId2 = document.getElementById("helpId2");
const password1 = document.querySelector("#password1");
const password2 = document.querySelector("#password2");
const form2 = document.querySelector("#form-reset");

form2.addEventListener("submit", (e) => {
  e.preventDefault();
  let psw1 = password1.value;
  let psw2 = password2.value;
  if (psw1 != psw2) {
    helpId1.textContent = "les mots de passe ne corespond pas!";
    helpId2.textContent = "les mots de passe ne corespond pas!";
    helpMsg(helpId1);
    helpMsg(helpId2);
  }
  if (!psw1?.trim()) {
    helpId1.textContent = "Remplir le champs";
    helpMsg(helpId1);
  }
  if (!psw2?.trim()) {
    helpId2.textContent = "Remplir le champs";
    helpMsg(helpId2);
  }
  if (psw1 === psw2 && psw1 && psw2) {
    submitPasswordUsingFetch({ password: psw1 }, "/reset").then((r) => {
      if (JSON.parse(r).done === false) {
        helpId1.textContent = helpId2.textContent =
          "Une erreur est survenue. Re-essayer";
        helpMsg(helpId1);
        helpMsg(helpId2);
      } else {
        window.location = "/";
      }
    });
  }
});

function helpMsg(helpId) {
  helpId.style.display = "block";
  setTimeout(() => (helpId.style.opacity = "1"), 100);
  setTimeout(() => {
    helpId.style.opacity = "0";
    helpId.style.display = "none";
  }, 5000);
}

const showBtn1 = document.querySelector("#show1");
const showBtn2 = document.querySelector("#show2");

showBtn1.addEventListener("click", () => {
  showBtn1.classList.toggle("hide");
  showBtn1.classList.contains("hide")
    ? (showBtn1.textContent = "Hide")
    : (showBtn1.textContent = "Show");
  password1.type == "password"
    ? (password1.type = "text")
    : (password1.type = "password");
});

showBtn2.addEventListener("click", () => {
  showBtn2.classList.toggle("hide");
  showBtn2.classList.contains("hide")
    ? (showBtn2.textContent = "Hide")
    : (showBtn2.textContent = "Show");
  password2.type == "password"
    ? (password2.type = "text")
    : (password2.type = "password");
});
