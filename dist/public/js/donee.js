window.onload = function () {
  window.scrollTo(0, document.body.scrollHeight);
};

console.log({ Document });
/**
 * A function that starts a view transition and calls a callback if the document has the startViewTranstion property.
 *
 * @param {Function} callback - The callback function to be called if the condition is met.
 */
function viewTranstion(callback) {
  if (!document.defaultView.viewTranstion) {
    console.log("View transition not supported");
    callback();
    return;
  }

  // document.defaultView.startViewTranstion(callback);
  window.s;
}

const monthLinks = document.querySelectorAll("a");
const mainPageContent = document.body.innerHTML;

window.addEventListener("popstate", () => {
  console.log("Popping this page");
  setTimeout(() => {}, 3000);
  viewTranstion(() => {
    document.body.innerHTML = mainPageContent;
  });
});

for (const monthLink of monthLinks) {
  monthLink.addEventListener("click", (event) => {
    event.preventDefault();
    const href = monthLink.getAttribute("href");
    console.log({ href });
    history.pushState({}, "", href);
    onLinkNavigate(href);
  });
}

async function onLinkNavigate(href) {
  const content = await getPageContent(href);
  viewTranstion(() => {
    document.querySelector("main").innerHTML = content;
  });
}
async function getPageContent(href) {
  const headers = {
    Cookie: document.cookie,
  };
  const response = await fetch(href, { headers: headers });
  const content = await response.text();
  return content;
}
