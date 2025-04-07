document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(u => u.email === email && u.password === pass);
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid credentials");
  }
});
