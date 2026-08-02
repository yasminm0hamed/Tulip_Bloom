document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const queryParam = params.get("q");
    const resultsContainer = document.getElementById("results");

    if (!resultsContainer) return;

    // Clear previous content
    resultsContainer.innerHTML = "";

    // Check if query parameter exists and is not empty
    if (!queryParam || queryParam.trim() === "") {
        resultsContainer.innerHTML = `<p class="no-results">Please enter a search term.</p>`;
        return;
    }

    const word = queryParam.trim().toLowerCase();

    // Filter products matching search term
    const matchedProducts = products.filter(product =>
        product.title.toLowerCase().includes(word)
    );

    if (matchedProducts.length === 0) {
        resultsContainer.innerHTML = `<p class="no-results">No flowers found matching "${queryParam}".</p>`;
        return;
    }

    // Render matched products
    matchedProducts.forEach(product => {
        resultsContainer.innerHTML += `
            <div class="item"
                 data-title="${product.title}"
                 data-price="$${product.price}"
                 data-img="${product.image}"
                 data-desc="${product.desc}">

                <i class="fa-solid fa-heart heart"></i>

                <img src="${product.image}" alt="${product.title}">

                <p>${product.title}</p>

                <div>
                    <p class="view">View More</p>
                    <p>$${product.price}</p>
                </div>
            </div>
        `;
    });

    // Toggle favorite hearts for newly generated items
    const hearts = resultsContainer.querySelectorAll(".heart");
    hearts.forEach(heart => {
        heart.addEventListener("click", function () {
            heart.classList.toggle("like");
        });
    });

    // Re-initialize popup functionality for dynamic items
    if (typeof popupFunction === "function") {
        popupFunction();
    }
});