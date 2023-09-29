document.querySelector("body").addEventListener("click", function (e) {
  if (!e.target.classList.contains("carre")) return;
  e.target.classList.toggle("active");
});
