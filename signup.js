document.getElementById("signupForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.some(u => u.email === email)) {
    alert("Email already exists!");
    return;
  }

  users.push({ name, email, password: pass });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Signup successful. Please login.");
  window.location.href = "index.html";
});
