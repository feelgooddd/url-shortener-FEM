document.getElementById("shorten-link").addEventListener("click", async () => {
  let url = document.getElementById("shorten-link-input").value.trim();
  const errorMsg = document.querySelector(".link-error");
  errorMsg.classList.add("hidden");

  if (!url) {
    errorMsg.classList.remove("hidden");
    return;
  }

  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  try {
    const response = await fetch("/.netlify/functions/shorten-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();

    if (data.error) {
      alert("Error: " + data.error);
      return;
    }

    createLinkCard(url, data.result_url);
  } catch (err) {
    console.error("Failed to shorten:", err);
    alert("Something went wrong.");
  }
});

function createLinkCard(original, short) {
  const card = document.createElement("div");
  card.className = "links-card";

  card.innerHTML = `
    <p class="original-url">${original}</p>
    <p class="shortened-url">${short}</p>
    <button class="copy-btn">Copy</button>
  `;

  const btn = card.querySelector(".copy-btn");
  btn.addEventListener("click", () => {
    navigator.clipboard.writeText(short).then(() => {
      btn.textContent = "Copied!";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = "Copy";
        btn.classList.remove("copied");
      }, 2000);
    });
  });

  document.getElementById("shortened-links").appendChild(card);
}
