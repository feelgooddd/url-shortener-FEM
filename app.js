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
      const response = await fetch("https://cleanuri.com/api/v1/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `url=${encodeURIComponent(url)}`,
      });

      const data = await response.json();

      if (data.error) {
        alert("Error: " + data.error);
        return;
      }

      // Create a new card
      const card = document.createElement("div");
      card.className = "links-card";

      const originalLink = document.createElement("p");
      originalLink.className = "original-url";
      originalLink.textContent = url;

      const shortLink = document.createElement("p");
      shortLink.className = "shortened-url";
      shortLink.textContent = data.result_url;

      const copyBtn = document.createElement("button");
      copyBtn.textContent = "Copy";
      copyBtn.className = "copy-btn";
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(data.result_url).then(() => {
          copyBtn.textContent = "Copied!";
          copyBtn.classList.add("copied");
          setTimeout(() => {
            copyBtn.textContent = "Copy";
            copyBtn.classList.remove("copied");
          }, 2000);
        });
      });

      card.appendChild(originalLink);
      card.appendChild(shortLink);
      card.appendChild(copyBtn);

      list.appendChild(card);
    } catch (error) {
      console.error("Error shortening URL:", error);
      alert("Something went wrong. Try again later.");
    }
  });


  document.getElementById("hamburger").addEventListener("click", () => {
  const hamburger = document.getElementById("hamburger");
  const dropdown = document.getElementById("dropdown");
  
  hamburger.classList.toggle("active");        // animate hamburger to 'X'
  dropdown.classList.toggle("hidden");          // show/hide dropdown menu
});
