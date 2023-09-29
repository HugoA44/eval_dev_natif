document.addEventListener("DOMContentLoaded", function () {
  const fabButton = document.querySelector(".fab");
  const body = document.querySelector("body");
  const articlesContainer = document.querySelector(".articles-container");
  const savedArticles = JSON.parse(localStorage.getItem("articles")) || [];

  savedArticles.forEach((article) => {
    const newArticle = createArticleElement(article.title, article.content);
    articlesContainer.appendChild(newArticle);
  });

  fabButton.addEventListener("click", function () {
    const newArticle = createArticleElement(
      "Nouveau Titre de l'Article",
      "Ceci est un nouveau paragraphe."
    );
    articlesContainer.appendChild(newArticle);

    savedArticles.push({
      title: newArticle.querySelector("h1").textContent,
      content: newArticle.querySelector("p").textContent,
    });

    localStorage.setItem("articles", JSON.stringify(savedArticles));
  });

  function createArticleElement(title, content) {
    const newArticle = document.createElement("div");
    newArticle.classList.add("article");
    newArticle.innerHTML = `
            <h1 contenteditable="">${title}</h1>
            <p contenteditable="">${content}</p>
        `;

    newArticle.querySelectorAll("[contenteditable]").forEach((element) => {
      element.addEventListener("input", function () {
        updateLocalStorage();
      });
    });

    return newArticle;
  }

  function updateLocalStorage() {
    savedArticles.length = 0;
    articlesContainer.querySelectorAll(".article").forEach((article) => {
      savedArticles.push({
        title: article.querySelector("h1").textContent,
        content: article.querySelector("p").textContent,
      });
    });

    localStorage.setItem("articles", JSON.stringify(savedArticles));
  }

  const deleteAllButton = document.getElementById("deleteAll");
  const editCodeButton = document.getElementById("editCode");
  const codePopup = document.getElementById("codePopup");
  const htmlCodeInput = document.getElementById("htmlCode");
  const cssCodeInput = document.getElementById("cssCode");
  const saveCodeButton = document.getElementById("saveCode");

  deleteAllButton.addEventListener("click", function () {
    articlesContainer.innerHTML = "";
    savedArticles.length = 0;
    localStorage.removeItem("articles");
  });

  editCodeButton.addEventListener("click", function () {
    htmlCodeInput.value = body.innerHTML;

    fetch("styles.css")
      .then((response) => response.text())
      .then((cssText) => {
        cssCodeInput.value = cssText;
      })
      .catch((error) => {
        console.error("Erreur lors du chargement du CSS :", error);
      });

    codePopup.style.display = "block";
  });

  saveCodeButton.addEventListener("click", function () {
    body.innerHTML = htmlCodeInput.value;

    const updatedCss = cssCodeInput.value;
    const blob = new Blob([updatedCss], { type: "text/css" });
    const cssUrl = URL.createObjectURL(blob);
    const styleLink = document.createElement("link");
    styleLink.href = cssUrl;
    styleLink.rel = "stylesheet";
    document.head.appendChild(styleLink);

    savedArticles.length = 0;
    articlesContainer.querySelectorAll(".article").forEach((article) => {
      savedArticles.push({
        title: article.querySelector("h1").textContent,
        content: article.querySelector("p").textContent,
      });
    });
    localStorage.setItem("articles", JSON.stringify(savedArticles));

    codePopup.style.display = "none";
  });
});
