document
  .getElementById("shorten-link")
  .addEventListener("click", async function () {
    let url = document.getElementById("shorten-link-input").value.trim();

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
        alert("Error: " + (errorData.error || "Failed to shorten URL"));
        return;
      }

      const data = await response.json();

      createLinkCard(url, data.result_url, list);
      document.getElementById("shorten-link-input").value = "";
    } catch (error) {
      console.error("Error shortening URL:", error);
      alert("Something went wrong. Try again later.");
    }
  });

document.getElementById("hamburger").addEventListener("click", () => {
  const hamburger = document.getElementById("hamburger");
  const dropdown = document.getElementById("dropdown");

  hamburger.classList.toggle("active"); // animate hamburger to 'X'
  dropdown.classList.toggle("hidden"); // show/hide dropdown menu
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

  // Remove button
  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-btn";
  removeBtn.textContent = "×";
  removeBtn.title = "Remove";
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

  card.appendChild(urlRow);
  card.appendChild(hr);
  card.appendChild(shortLink);
  card.appendChild(copyBtn);

  list.appendChild(card);
}


const input = document.getElementById("shorten-link-input")
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    // Call the shorten function here or trigger click
    document.getElementById("shorten-link").click();
    // Remove focus from input to close keyboard on mobile
    input.blur();
  }
});

