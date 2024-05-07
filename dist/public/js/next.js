const modal = document.querySelector(".modal");
const closeModal = modal.querySelector(".close-modal");
const openModal = document.querySelector(".open-modal");
const form = modal.querySelector("form");
const monthYear = document.querySelector("[data-month-year]");
const rowInfoTemplate = document.querySelector("#template-row-info");
const tableBody = document.querySelector(".table-body");

const depencesModal = document.querySelector(".depences.modal");
const closeDepencesModal = depencesModal.querySelector(".close-modal");
// const openDepencesModal = depencesModal.querySelector(".open-modal");
const depences = document.querySelector(".depences");

let response = await fetch("./data");
const data = await response.json();
depencesModal.setAttribute("aria-hidden", true);
let isDepencesModalOpen = false;
// Save response to localStorage for later use
localStorage.setItem("bananes_data", JSON.stringify(data));

const Day = new Map();
const dayOfWeek = "Lundi Mardi Mercredi Jeudi Vendredi Samedi Dimanche".split(
  " "
);
for (let i = 0; i <= 6; i++) {
  Day.set(i + 1, dayOfWeek[i]);
}
const monthOfTheYear =
  "Janvier Février Mars Avril Mai Juin Juillet Août Septembre Octobre Novembre Decembre".split(
    " "
  );
const Month = new Map();
for (let i = 0; i <= 11; i++) {
  Month.set(i + 1, monthOfTheYear[i]);
}
closeModal.addEventListener("click", () => {
  modal.setAttribute("aria-hidden", true);
  modal.style.opacity = "0";
  setTimeout(() => (modal.style.display = "none"), 510);
});
openModal.addEventListener("click", () => {
  modal.setAttribute("aria-hidden", false);
  modal.style.display = "grid";
  modal.scrollIntoView();
  setTimeout(() => (modal.style.opacity = "1"), 200);
});
window.addEventListener("keydown", (e) => {
  if (isDepencesModalOpen) {
    if (e.key === "a" && depencesModal.style.display === "none")
      openDepencesModal.click();
    if (e.key === "Escape" && depencesModal.style.display === "grid")
      closeDepencesModal.click();
    return;
  }
  if (e.key === "a" && modal.style.display === "none") openModal.click();
  if (e.key === "Escape" && modal.style.display === "grid") closeModal.click();
});
/**
 * Retrieves the value of an element from the modal.
 *
 * @param {string} element - The ID of the element to retrieve the value from.
 * @return {any} The value of the element.
 */
function getValueWithinModal(element) {
  return modal.querySelector("#" + element).value;
}
const date = new Date();
let today = {
  day: Day.get(date.getDay()),
  date: date.getDate(),
  month: Month.get(date.getMonth() + 1),
  year: date.getFullYear(),
};
let mm, dd;
date.getMonth() + 1 < 10
  ? (mm = `0${date.getMonth() + 1}`)
  : (mm = `${date.getMonth() + 1}`);
date.getDate() < 10 ? (dd = `0${date.getDate()}`) : (dd = `${date.getDate()}`);
modal.querySelector("#date").value = `${today.year}-${mm}-${dd}`;

const thisMonth = new Date().getMonth() + 1;
const output = data.filter(
  (row) =>
    row.date.split("/")[2] == today.year && row.date.split("/")[1] == thisMonth
);

updateTableData(output);

/**
 * Updates the table data with the given data.
 *
 * @param {Array<Object>} data - The data to update the table with.
 */
function updateTableData(data) {
  tableBody.innerHTML = "";
  if (!data) {
    monthYear.textContent = "Aucune donnée pour ce mois";
    return;
  }
  monthYear.textContent = `${today.month} ${today.year}`;
  const fragment = document.createDocumentFragment();
  let counter = 0;
  for (const dt of data) {
    dt.day = new Date(
      dt.date.split("/").reverse().join("-")
    ).toLocaleDateString("fr", {
      weekday: "long",
      day: "numeric",
    });
    const element = rowInfoTemplate.content.cloneNode(true);
    const donee = {
      baught: dt.achats || 0,
      produced: dt.produits || 0,
      stock: dt.stocks || 0,
      sold: dt.ventes || 0,
      leftOver: dt.restes || 0,
    };
    setValue("dates", dt.day, { parent: element });
    setValue("achats", donee.baught, { parent: element });
    setValue("produits", donee.produced, { parent: element });
    setValue("stocks", donee.stock, { parent: element });
    setValue("ventes", donee.sold, { parent: element });
    setValue("restes", donee.leftOver, { parent: element });
    fragment.appendChild(element);
  }
  tableBody.appendChild(fragment);
}
function setValue(input, value, { parent = document } = {}) {
  parent.querySelector(`[data-${input}]`).textContent = value;
}

// openDepencesModal.addEventListener("click", () => {
//   depencesModal.setAttribute("aria-hidden", false);
//   depencesModal.style.display = "grid";
//   setTimeout(() => (depencesModal.style.opacity = "1"), 200);
// });
closeDepencesModal.addEventListener("click", () => {
  depencesModal.setAttribute("aria-hidden", true);
  depencesModal.style.opacity = "0";
  setTimeout(() => (depencesModal.style.display = "none"), 510);
});

/**
 * @param {Event} event
 */
function btnClicked(event) {
  const target = event.target;
  const parentRow = target.closest("tr");

  /**
   *
   * @param {string} input variable name for the required value
   * @returns {string}
   */
  function getValue(input) {
    return parentRow.querySelector(`[data-${input}]`).textContent;
  }

  const thisDates = getValue("dates").split(" ").at(-1).padStart(2, "0");
  const thisAchats = getValue("achats");
  const thisProduits = getValue("produits");
  const thisVentes = getValue("ventes");

  const formatedDate = `${today.year}-${thisMonth
    .toString()
    .padStart(2, "0")}-${thisDates}`;

  form.querySelector("#date").value = formatedDate;
  form.querySelector("#achats").value = thisAchats;
  form.querySelector("#produits").value = thisProduits;
  form.querySelector("#ventes").value = thisVentes;

  const openModal = document.querySelector(".open-modal");
  openModal.click();
}

const modifBtns = document.querySelectorAll("#modify");

for (const btn of modifBtns) {
  btn.addEventListener("click", btnClicked);
}
