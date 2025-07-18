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

  // Clickable original URL link
  const originalLink = document.createElement("a");
  originalLink.className = "original-url";
  originalLink.href = original;
  originalLink.target = "_blank";
  originalLink.rel = "noopener noreferrer";
  originalLink.textContent = original;

  // Clickable shortened URL link
  const shortLink = document.createElement("a");
  shortLink.className = "shortened-url";
  shortLink.href = short;
  shortLink.target = "_blank";
  shortLink.rel = "noopener noreferrer";
  shortLink.textContent = short;

  // Copy button
  const copyBtn = document.createElement("button");
  copyBtn.className = "copy-btn";
  copyBtn.textContent = "Copy";
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(short).then(() => {
      copyBtn.textContent = "Copied!";
      copyBtn.classList.add("copied");
      setTimeout(() => {
        copyBtn.textContent = "Copy";
        copyBtn.classList.remove("copied");
      }, 2000);
    });
  });

  // Remove button
const removeBtn = document.createElement("button");
removeBtn.className = "remove-btn";
removeBtn.textContent = "×";  // simple X
removeBtn.title = "Remove";
removeBtn.addEventListener("click", () => {
  card.remove();
});

  // Append all elements to card
  card.appendChild(originalLink);
  card.appendChild(shortLink);
  card.appendChild(copyBtn);
  card.appendChild(removeBtn);

  // Add card to the list
  document.getElementById("shortened-links").appendChild(card);
}
