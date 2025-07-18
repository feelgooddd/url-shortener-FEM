const hamburger = document.getElementById("hamburger");
const dropdown = document.getElementById("dropdown");
const input = document.getElementById("shorten-link-input");
const shortenBtn = document.getElementById("shorten-link");
const copyStatus = document.getElementById("copy-status");
const linkError = document.getElementById("link-error");

shortenBtn.addEventListener("click", async function () {
  let url = input.value.trim();
  linkError.classList.add("hidden");
  if (!url) return;

  // Prepend https:// if missing
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  const list = document.getElementById("shortened-links");

  try {
    const response = await fetch("/.netlify/functions/shorten-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      linkError.classList.toggle("hidden");
      return;
    }

    const data = await response.json();

    createLinkCard(url, data.result_url, list);
    input.value = "";
  } catch (error) {
    console.error("Error shortening URL:", error);
    alert("Something went wrong. Try again later.");
  }
});

// Hamburger menu toggle and aria-expanded update
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  dropdown.classList.toggle("hidden");

  const expanded = hamburger.getAttribute("aria-expanded") === "true";
  hamburger.setAttribute("aria-expanded", !expanded);
});

// Enable keyboard toggle on hamburger for Enter and Space keys
hamburger.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    hamburger.click();
  }
});

// Trigger shorten on Enter key inside input, close mobile keyboard by blurring input
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    shortenBtn.click();
    input.blur();
  }
});

function createLinkCard(original, short, list) {
  const card = document.createElement("div");
  card.className = "links-card";

  // URL wrapper row
  const urlRow = document.createElement("div");
  urlRow.className = "url-row";

  // Original URL as clickable link
  const originalLink = document.createElement("a");
  originalLink.className = "original-url";
  originalLink.href = original;
  originalLink.target = "_blank";
  originalLink.rel = "noopener noreferrer";
  originalLink.textContent = original;

  // Remove button with aria-label
  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-btn";
  removeBtn.textContent = "×";
  removeBtn.title = "Remove link";
  removeBtn.setAttribute("aria-label", "Remove shortened link");
  removeBtn.addEventListener("click", () => {
    card.remove();
  });

  urlRow.appendChild(originalLink);
  urlRow.appendChild(removeBtn);

  // Horizontal line
  const hr = document.createElement("hr");

  // Shortened URL as clickable link
  const shortLink = document.createElement("a");
  shortLink.className = "shortened-url";
  shortLink.href = short;
  shortLink.target = "_blank";
  shortLink.rel = "noopener noreferrer";
  shortLink.textContent = short;

  // Copy button with aria-live updates
  const copyBtn = document.createElement("button");
  copyBtn.className = "copy-btn";
  copyBtn.textContent = "Copy";
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(short).then(() => {
      copyBtn.textContent = "Copied!";
      copyBtn.classList.add("copied");
      copyStatus.textContent = "Shortened URL copied to clipboard";

      setTimeout(() => {
        copyBtn.textContent = "Copy";
        copyBtn.classList.remove("copied");
        copyStatus.textContent = "";
      }, 2000);
    });
  });

  card.appendChild(urlRow);
  card.appendChild(hr);
  card.appendChild(shortLink);
  card.appendChild(copyBtn);

  list.appendChild(card);
}
