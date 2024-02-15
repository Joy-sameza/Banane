const helpId = document.getElementById("helpId");
const form1 = document.querySelector("#form-login");
const password = document.querySelector("#password");

// form1.addEventListener("submit", (e) => {
//   e.preventDefault();
//   let psw = password.value?.trim();
//   if (!psw) {
//     helpId.textContent = "Remplir le champs";
//     helpMsg(helpId);
//   }
//   submitPasswordUsingFetch({ password: psw }, "/login").then((r) => {
//     console.log(JSON.parse(r));
//     if ("error" in JSON.parse(r)) {
//       helpId.textContent = "Mot de passe Incorrect";
//       helpMsg(helpId);
//     }
//     if ("done" in JSON.parse(r)) {
//       window.location = "./next";

//       // TODO: Set Authorization in the header for the next request
      
//     }
//   });
// });

// /**
//  * Displays a help message with a fade-in and fade-out effect.
//  *
//  * @param {HTMLElement} helpId - The element representing the help message.
//  */
// function helpMsg(helpId) {
//   helpId.style.display = "block";
//   setTimeout(() => (helpId.style.opacity = "1"), 100);
//   setTimeout(() => {
//     helpId.style.opacity = "0";
//     helpId.style.display = "none";
//   }, 5_000);
// }

const showBtn = document.querySelector(".show-password");

showBtn.addEventListener("click", () => {
  showBtn.classList.toggle("hide");
  showBtn.classList.contains("hide")
    ? (showBtn.textContent = "Hide")
    : (showBtn.textContent = "Show");
  password.type == "password"
    ? (password.type = "text")
    : (password.type = "password");
});

// async function submitPasswordUsingFetch(data, path) {
//   const response = await fetch(path, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });
//   const result = await response.text();
//   return result;
// }
