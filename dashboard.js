const user = JSON.parse(localStorage.getItem("currentUser"));
if (!user) {
  window.location.href = "index.html";
}

let transactions = JSON.parse(localStorage.getItem("transactions_" + user.email)) || [];
let budget = JSON.parse(localStorage.getItem("budget_" + user.email)) || 0;

const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const balanceEl = document.getElementById("balance");
const listEl = document.getElementById("transactionList");
const chartCanvas = document.getElementById("categoryChart").getContext("2d");
let chart;

function updateSummary() {
  const income = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  incomeEl.textContent = income;
  expenseEl.textContent = expense;
  balanceEl.textContent = balance;

  if (budget && expense > budget) {
    document.getElementById("budgetStatus").innerHTML = `<li style="color: red;">🚨 Budget exceeded!</li>`;
  } else {
    document.getElementById("budgetStatus").innerHTML = `<li style="color: green;">✅ Within Budget</li>`;
  }

  if (balance > 50000) {
    document.getElementById("ads").innerHTML = `
      <div class="ad">💰 Invest in Gold!</div>
      <div class="ad">📈 Check out top stock apps!</div>
    `;
  } else {
    document.getElementById("ads").innerHTML = "";
  }
}

function updateList() {
  listEl.innerHTML = "";
  const search = document.getElementById("search").value.toLowerCase();
  const filterType = document.getElementById("filterType").value;
  const filterMonth = document.getElementById("filterMonth").value;

  const filtered = transactions.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search) || t.category.toLowerCase().includes(search);
    const matchesType = !filterType || t.type === filterType;
    const matchesMonth = !filterMonth || t.date.startsWith(filterMonth);
    return matchesSearch && matchesType && matchesMonth;
  });

  filtered.forEach(t => {
    const li = document.createElement("li");
    li.textContent = `${t.title} - ₹${t.amount} (${t.category}, ${t.date}, ${t.mode})`;
    listEl.appendChild(li);
  });
}

function updateChart() {
  const categories = {};
  transactions
    .filter(t => t.type === "expense")
    .forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });

  if (chart) chart.destroy();
  chart = new Chart(chartCanvas, {
    type: "pie",
    data: {
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories),
        backgroundColor: ["#f94144", "#f3722c", "#f8961e", "#90be6d", "#43aa8b", "#577590"]
      }]
    }
  });
}

document.getElementById("transactionForm").addEventListener("submit", e => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const amount = +document.getElementById("amount").value;
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;
  const mode = document.getElementById("mode").value;

  const transaction = { title, amount, type, category, date, mode };
  transactions.push(transaction);
  localStorage.setItem("transactions_" + user.email, JSON.stringify(transactions));
  updateSummary();
  updateList();
  updateChart();
  e.target.reset();
});

document.getElementById("budgetForm").addEventListener("submit", e => {
  e.preventDefault();
  budget = +document.getElementById("monthlyBudget").value;
  localStorage.setItem("budget_" + user.email, JSON.stringify(budget));
  updateSummary();
  e.target.reset();
});

document.getElementById("search").addEventListener("input", updateList);
document.getElementById("filterType").addEventListener("change", updateList);
document.getElementById("filterMonth").addEventListener("change", updateList);

document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
});

document.getElementById("toggleDark").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

updateSummary();
updateList();
updateChart();
