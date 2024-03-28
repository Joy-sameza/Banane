import { config } from 'dotenv';
config()

const { PORT: port} = process.env;

/**
 * Generates a list of days from 2023 to 2024 in the format of UNIX timestamps.
 *
 * @return {number[]} The list of days in UNIX timestamp format
 */
function generateDay() {
  const daysList = [];
  for (let year = 2023; year <= 2024; year++) {
    for (let month = 0; month < 12; month++) {
      const days = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= days; day++) {
        const thisDay = new Date(year, month, day).getTime() / 1000;
        daysList.push(Math.floor(thisDay));
      }
    }
  }
  return daysList;
}

/**
 * Generate a random sales number within a specified range.
 *
 * @param {number} maximum - the maximum value for the sales number (default is 12,000)
 * @param {number} minimum - the minimum value for the sales number (default is 1,000)
 * @return {number} the generated sales number
 */
function generateSales(maximum = 12_000, minimum = 1_000) {
  let num;
  do {
    const rand = Math.random() * minimum + (maximum - minimum);
    num = Math.ceil(rand);
  } while (num % 100 !== 0);
  return num;
}

/**
 * Asynchronous function to authenticate the user.
 *
 * @return {Promise<string | null>} The authentication token.
 */
async function authenticate() {
  const response = await fetch(`http://localhost:${port}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password: "123" }),
  });

  if (!response.ok)
    throw new Error(
      "Authentication failed with a status code " + response.status
    );
  const cookies = response.headers.get("set-cookie");
  return cookies;
}

/**
 * Asynchronously sends data with a cookie to the specified URL.
 *
 * @param {Object} data - the data to be sent
 * @param {string} cookie - the cookie to be included in the request
 * @return {Promise<string>} a Promise that resolves with the JSON response from the server
 * @throws Http status error code
 */
async function sendDataWithCookie(data, cookie) {
  const response = await fetch(`http://localhost:${port}/next`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.text();
}

async function main() {
  const days = generateDay();

  let restes = 0;
  let stocks = 0;
  for (const day of days) {
    const thisDay = new Date(day);
    if (
      thisDay.toLocaleDateString("en-UK", { weekday: "short" }) === "Tue" ||
      thisDay.toLocaleDateString("en-UK", {
        day: "numeric",
        month: "short",
      }) === "1 Jan" ||
      thisDay.toLocaleDateString("en-UK", {
        day: "numeric",
        month: "short",
      }) === "25 Dec"
    )
      continue;
    const achats = generateSales();
    const produits = generateSales();
    stocks = produits + restes;
    const ventes = generateSales(stocks);
    restes = stocks - ventes;
    const _dette = [generateSales(5_000), 0];
    const dette = _dette[Math.ceil(Math.random())];
    const authCookie = await authenticate();
    await sendDataWithCookie(
      { date: day, achats, produits, ventes, dette },
      authCookie
    );
  }
  console.log("Done");
}

console.log("Creating fake data...");
console.time("Execution time");
await main();
console.timeEnd("Execution time");
