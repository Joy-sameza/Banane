const helpId = document.getElementById("helpId");
const form1 = document.querySelector("#form-login");
const password = document.querySelector("#password");


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
