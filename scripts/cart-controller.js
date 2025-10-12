/*showCartData();*/
document.addEventListener("DOMContentLoaded", () => {

    const cartList = document.getElementById("cart-list");
    const cartTotalEl = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-whatsapp");
    const PHONE_NUMBER = "351916865014"; // ← tu número con código país sin el +

    function getCart() {
        const cart = localStorage.getItem("cart");
        return cart ? JSON.parse(cart) : [];
    }

    function saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function calculateItemPrice(product, isMagic, hasGiftBox) {
        let basePrice = product.isMagic ? MAGIC_MUG : NORMAL_MUG;
        basePrice += product.price || 0;
        if (hasGiftBox) basePrice += PRICE_BOX;
        if (isMagic && !product.isMagic) basePrice += PRICE_MAGIC_EXTRA;
        return basePrice.toFixed(2) + "€";
    }

    function updateCartTotal() {
        const cart = getCart();
        let total = 0;
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                const price = parseFloat(calculateItemPrice(product, item.isMagic, item.hasGiftBox));
                total += price * item.quantity;
            }
        });
        cartTotalEl.textContent = total.toFixed(2) + "€";
    }

    // 🔹 Parsear carrito desde la URL si existe
    let sharedCart = null;
    function parseCartFromURL() {
        const params = new URLSearchParams(window.location.search);
        const sharedCartParam = params.get("cart");
        if (!sharedCartParam) return null;

        const items = sharedCartParam.split("|");
        const parsed = [];

        items.forEach(str => {
            const match = str.match(/^(\d+)(M|N)(\d+)(B|N)$/i);
            if (!match) return;
            const [, id, magicFlag, qty, boxFlag] = match;
            parsed.push({
                id: parseInt(id),
                isMagic: magicFlag === "M",
                quantity: parseInt(qty),
                hasGiftBox: boxFlag === "B"
            });
        });

        if (parsed.length > 0) {
            sharedCart = parsed;

            // Ajustar el padding del contenedor central
            if (cartList) cartList.classList.add("cart-item-same-padding");

            // Ocultar contenedor principal de info del carrito
            const infoContainer = document.getElementById("cart-info-container");
            if (infoContainer) infoContainer.style.display = "none";

            // Aviso arriba del todo con precio total y link
            const notice = document.createElement("p");
            notice.className = "shared-cart-notice";
            const totalPrice = parsed.reduce((sum, item) => {
                const product = products.find(p => p.id === item.id);
                if (!product) return sum;
                return sum + parseFloat(calculateItemPrice(product, item.isMagic, item.hasGiftBox)) * item.quantity;
            }, 0);
            notice.innerHTML = `
                Estás viendo un carrito compartido (Total: ${totalPrice.toFixed(2)}€). 
                <a href="./cart.html" class="shared-cart-link">Ver carrito actual</a>.
            `;
            cartList.prepend(notice);

            return parsed;
        }
        return null;
    }

    // 🔹 Renderizar carrito
    function renderCart() {
    const sharedCart = parseCartFromURL(); // null si no hay carrito compartido
    let cart = sharedCart || getCart();
    const isShared = !!sharedCart;

    cartList.innerHTML = "";

    if (cart.length === 0) {
        const emptyMsg = document.createElement("p");
        emptyMsg.className = "empty-cart";
        emptyMsg.textContent = "O seu cesto está vazio";
        cartList.appendChild(emptyMsg);
        cartTotalEl.textContent = "0.00€";
        return;
    }

    // 🔹 Mostrar total arriba y link si es carrito compartido
    if (isShared) {
        let total = 0;
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (!product) return;
            const price = parseFloat(calculateItemPrice(product, item.isMagic, item.hasGiftBox));
            total += price * item.quantity;
        });

        const noticeDiv = document.createElement("div");
        noticeDiv.className = "shared-cart-header";
        noticeDiv.innerHTML = `
            <p class="shared-cart-text">Está a ver um cesto partilhado. <a href="./cart.html" class="shared-cart-link">Ver cesto atual</a></p>
            <p class="shared-cart-total">Total: ${total.toFixed(2)}€</p>
        `;
        cartList.appendChild(noticeDiv);
    }

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;

        const div = document.createElement("div");
        div.className = "cart-item";

        const imgName = item.hasGiftBox ? "front" : "left";

        if (isShared) {
            // Carrito compartido (solo mostrar info, no editar)
            div.innerHTML = `
                <div class="cart-img-and-info-container">
                    <a href="./item.html?id=${product.id}">
                        <img class="cart-item-img" src="./mugs/designs/${product.keyName}/${imgName}.png" alt="${product.name}">
                    </a>
                    <div class="cart-item-info-container">
                        <div class="item-fix-margin">
                            <p class="cart-item-status">Disponivel</p>
                            <p class="cart-item-name">Caneca ${product.name}</p>
                            <p class="cart-item-price">${calculateItemPrice(product, item.isMagic, item.hasGiftBox)}</p>
                            <p class="cart-item-desc">${product.description}</p>
                            ${item.isMagic ? `<p>é caneca mágica (+${PRICE_MAGIC_EXTRA}€)</p>` : ""}
                            ${item.hasGiftBox ? `<p>incluir caixa de presente (+${PRICE_BOX}€)</p>` : ""}
                            <p>Quantidade: ${item.quantity}</p>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Carrito normal (editable)
            div.innerHTML = `
                <div class="cart-img-and-info-container">
                    <a href="./item.html?id=${product.id}">
                        <img class="cart-item-img" src="./mugs/designs/${product.keyName}/${imgName}.png" alt="${product.name}">
                    </a>
                    <div class="cart-item-info-container">
                        <div class="item-fix-margin">
                            <p class="cart-item-status">Disponivel</p>
                            <p class="cart-item-name">Caneca ${product.name}</p>
                            <p class="cart-item-price">${calculateItemPrice(product, item.isMagic, item.hasGiftBox)}</p>
                            <p class="cart-item-desc">${product.description}</p>
                            <label class="checkbox-container">
                                <input class="checkbox magic-checkbox" type="checkbox" name="magic_mug" ${item.isMagic ? "checked" : ""}>
                                é caneca mágica (+${PRICE_MAGIC_EXTRA}€)
                            </label><br>
                            <label class="checkbox-container">
                                <input class="checkbox gift-checkbox" type="checkbox" name="include_box" ${item.hasGiftBox ? "checked" : ""}>
                                incluir caixa de presente (+${PRICE_BOX}€)
                            </label>
                        </div>
                    </div>
                </div>

                <div class="cart-quantity-options">
                    <div class="item-remove-container">
                        <input class="item-remove" type="button" value="Remover">
                    </div>
                    <div class="cart-item-quantity-controllers">
                        <div class="cart-item-quantity"> 
                            <input class="item-button-quantity-selector minus" type="button" value="-">
                            <input class="item-quantity" type="number" value="${item.quantity}" min="0">
                            <input class="item-button-quantity-selector plus" type="button" value="+">
                        </div>
                    </div>
                </div>
            `;
        }

        cartList.appendChild(div);

        if (!isShared) {
            // Eventos solo para carrito normal
            const magicCheckbox = div.querySelector(".magic-checkbox");
            const giftCheckbox = div.querySelector(".gift-checkbox");
            const quantityInput = div.querySelector(".item-quantity");
            const plusBtn = div.querySelector(".plus");
            const minusBtn = div.querySelector(".minus");
            const removeBtn = div.querySelector(".item-remove");
            const priceEl = div.querySelector(".cart-item-price");
            const imgEl = div.querySelector(".cart-item-img");

            magicCheckbox.addEventListener("change", () => {
                item.isMagic = magicCheckbox.checked;
                saveCart(cart);
                priceEl.textContent = calculateItemPrice(product, item.isMagic, item.hasGiftBox);
                updateCartTotal();
            });

            giftCheckbox.addEventListener("change", () => {
                item.hasGiftBox = giftCheckbox.checked;
                saveCart(cart);
                priceEl.textContent = calculateItemPrice(product, item.isMagic, item.hasGiftBox);
                imgEl.src = `./mugs/designs/${product.keyName}/${item.hasGiftBox ? "front" : "left"}.png`;
                updateCartTotal();
            });

            function updateQuantity(newQuantity) {
                if (newQuantity <= 0) {
                    const confirmDelete = window.confirm("Deseja remover este produto do cesto?");
                    if (confirmDelete) {
                        const index = cart.findIndex(ci => ci.id === item.id);
                        cart.splice(index, 1);
                        div.remove();
                        saveCart(cart);
                        updateCartTotal();
                        renderCart();
                        return;
                    } else {
                        item.quantity = 1;
                        quantityInput.value = 1;
                    }
                } else {
                    item.quantity = newQuantity;
                    quantityInput.value = item.quantity;
                }
                saveCart(cart);
                priceEl.textContent = calculateItemPrice(product, item.isMagic, item.hasGiftBox);
                updateCartTotal();
            }

            plusBtn.addEventListener("click", () => updateQuantity(item.quantity + 1));
            minusBtn.addEventListener("click", () => updateQuantity(item.quantity - 1));
            quantityInput.addEventListener("input", () => {
                const val = parseInt(quantityInput.value);
                updateQuantity(isNaN(val) ? 0 : val);
            });
            removeBtn.addEventListener("click", () => updateQuantity(0));
        }
    });

    updateCartTotal();
}


    // 🔹 Generar formato 9N2B|4M1N...
    function encodeCart(cart) {
        return cart.map(item => {
            const magic = item.isMagic ? "M" : "N";
            const box = item.hasGiftBox ? "B" : "N";
            return `${item.id}${magic}${item.quantity}${box}`;
        }).join("|");
    }

    // 🔹 Evento del botón de WhatsApp
    checkoutBtn.addEventListener("click", () => {
        const cart = getCart();
        if (cart.length === 0) {
            alert("O seu cesto está vazio!");
            return;
        }
        const encoded = encodeCart(cart);
        const url = `${window.location.origin}${window.location.pathname}?cart=${encoded}`;
        const message = `Olá! Gostaria de finalizar a minha encomenda. 🛍️\n\nVer meu carrinho: ${url}`;
        const whatsappURL = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, "_blank");
    });

    renderCart();
});
