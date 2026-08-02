function popupFunction() {
    const cards = document.querySelectorAll(".view");
    const popup = document.getElementById("popup");
    const popupImg = document.getElementById("popup-img");
    const popupTitle = document.getElementById("popup-title");
    const popupPrice = document.getElementById("popup-price");
    const popupDesc = document.getElementById("popup-desc");
    const closeBtn = document.querySelector(".close");
    const plusBtn = document.getElementById("plus");
    const minusBtn = document.getElementById("minus");
    const countSpan = document.getElementById("count");

    let quantity = 1;

    // Open Popup
    cards.forEach(function (card) {
        card.addEventListener("click", function () {
            const item = card.closest(".item");

            popup.style.display = "flex";
            quantity = 1;
            countSpan.textContent = quantity;

            popupTitle.textContent = item.dataset.title;
            popupPrice.textContent = item.dataset.price;
            popupDesc.textContent = item.dataset.desc;
            popupImg.src = item.dataset.img;
        });
    });

    // Close Popup via (X) button
    if (closeBtn) {
        closeBtn.addEventListener("click", function () {
            popup.style.display = "none";
        });
    }

    // Close Popup by clicking outside content
    if (popup) {
        popup.addEventListener("click", function (e) {
            if (e.target === popup) {
                popup.style.display = "none";
            }
        });
    }

    // Counter handlers
    if (plusBtn && minusBtn && countSpan) {
        plusBtn.addEventListener("click", function () {
            quantity++;
            countSpan.textContent = quantity;
        });

        minusBtn.addEventListener("click", function () {
            if (quantity > 1) {
                quantity--;
                countSpan.textContent = quantity;
            }
        });
    }
}

// Run popup listener once DOM is ready
document.addEventListener("DOMContentLoaded", popupFunction);