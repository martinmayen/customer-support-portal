document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".progress-bar").forEach(bar => {
    let skill = bar.getAttribute("data-skill");
    bar.style.width = "0%";
    setTimeout(() => {
      bar.style.width = skill + "%";
    }, 200);
  });
});
