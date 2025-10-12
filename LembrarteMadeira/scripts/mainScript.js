

document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add("active"); // activa la animación
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.02 });

  // Todos los elementos que empiecen con 'anim-'
  document.querySelectorAll('[class*="anim-"]').forEach(el => observer.observe(el));
});


window.onload = function(){

  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileLinks = document.getElementById('mobile-menu-links');

  // Abrir/cerrar menú al pulsar hamburguesa
  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    mobileLinks.classList.toggle('show');
  });

  // Cerrar menú al pulsar cualquier enlace
  const mobileLinkItems = document.querySelectorAll('.mobile-link');
  mobileLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      mobileLinks.classList.remove('show');
      mobileToggle.classList.remove('active');
    });
  });
  
    const input = document.getElementById("imgInput");
    
    //Change IMG
    input.addEventListener("change", function() {
      const file = this.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        const url = `url('${e.target.result}')`;
        document.querySelectorAll(".strip").forEach(el => {
          el.style.backgroundImage = url;
        });
      }
      reader.readAsDataURL(file);
    });

    //INCLUDES
    document.querySelectorAll("[include-html]").forEach(async (el) => {
        const file = el.getAttribute("include-html");
        el.innerHTML = await (await fetch(file)).text();
    });

    const slider = document.getElementById("escala");
    const elemento = document.getElementById("miElemento");

    slider.addEventListener("input", () => {
      const valor = slider.value;
      elemento.style.transform = `scale(${valor})`;
    });


    //FADE ELEMENT
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Si quieres que solo lo haga una vez
        }
        });
    });

    document.querySelectorAll('.fade-on-scroll').forEach(el => {
        observer.observe(el);
    });



    //SCALER
    const container = document.querySelector('.test-mug');

    function scaleContainer() {
    const vw = window.innerWidth / 100;
    const scaleFactor = 5 * vw; // 4vw como número en px
    // Como transform: scale() espera un número sin unidad, debes convertir px a factor relativo (ejemplo)
    const baseSize = 100; // tamaño base en px que asumes
    container.style.transform = `scale(${scaleFactor / baseSize})`;
    container.style.height = `${scaleFactor}`;
    }

    window.addEventListener('resize', scaleContainer);
    scaleContainer();   

    
}

function abrirWhatsapp(texto = "") {
  // Número en formato internacional sin el "+"
  let numero = "351916865014"; // ejemplo: Portugal
  if(texto == "")
    texto = "Olá! Estou interessado num produto.";
  
  // Armar la URL
  let url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
  
  // Abrir WhatsApp (móvil o web)
  window.open(url, "_blank");
}

document.addEventListener("DOMContentLoaded", function() {
    /* Replace background Image */
    const items = document.querySelectorAll(".item");
    const container = document.querySelector(".items-container");

    items.forEach(item => {
        item.addEventListener("mouseenter", () => {
            const img = item.querySelector(".item-info-container .item-banner .img-banner");
            if (img && img.src) {
                // Obtener la ruta original
                let ruta = img.getAttribute("src");

                // Agregar un "../" más al inicio
                if (!ruta.startsWith("../")) {
                    ruta = "" + ruta;
                } else {
                    ruta = "" + ruta;
                }

                // Cambiar el background-image del contenedor
                container.style.backgroundImage = `url('${ruta}')`;
            }
        });
    });

/* PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS PRODUTS  */

// ======================
// FUNCIÓN PARA CALCULAR PRECIO
// ======================
function calculatePrice(product) {
    let basePrice = product.isMagic ? MAGIC_MUG : NORMAL_MUG;
    basePrice += product.price;

    if (product.hasGiftBox) basePrice += 2;
    /*if (product.isCustom) basePrice += 4;*/

    return basePrice.toFixed(2) + "€";
}

// ======================
// FUNCIÓN PARA RENDERIZAR PRODUCTOS
// ======================
function renderProducts() {
    const container = document.getElementById('products');
    if(container == null)
        return;
    container.innerHTML = "";

    for (let i = 0; i < products.length; i += 4) {
        const group = products.slice(i, i + 4);

        const flexMobile = document.createElement('div');
        flexMobile.className = 'flex-mobile';

        const topContainer = document.createElement('div');
        topContainer.className = 'flex-items-container brightness-106';
        const bottomContainer = document.createElement('div');
        bottomContainer.className = 'flex-items-container brightness-106 border-top';

        group.forEach((product, index) => {
            const containerDiv = index < 2 ? topContainer : bottomContainer;
            const itemDiv = document.createElement('div');
            itemDiv.className = 'flex-items';

            const link = document.createElement('a');
            link.className = 'no-deco-link3';
            link.href = `item.html?id=${product.id}`;

            const imgFront = document.createElement('img');
            imgFront.className = 'flex-item-img clip-border';
            imgFront.src = `./mugs/designs/${product.keyName}/front.png`;

            const imgBack = document.createElement('img');
            imgBack.className = 'flex-item-img-back clip-border';
            imgBack.src = `./mugs/designs/${product.keyName}/back.png`;

            link.appendChild(imgFront);
            link.appendChild(imgBack);

            // TAGS
            if (product.isCustom) addTag(link, 'custom', 'Custom');
            if (product.isMagic) addTag(link, 'magic', 'Magic');
            if (product.isBlack) addTag(link, 'black', 'Black');
            if (product.isLimited) addTag(link, 'limited-edition', 'Limited Edition');

            const namePriceDiv = document.createElement('div');
            namePriceDiv.className = 'flex-name-and-price';

            const nameP = document.createElement('p');
            nameP.className = 'flet-item-name';
            nameP.innerHTML = `<span><span class="hide-mobile">Caneca - </span>${product.name}</span>`;

            const priceP = document.createElement('p');
            priceP.className = 'flet-item-price';
            priceP.textContent = calculatePrice(product);

            namePriceDiv.appendChild(nameP);
            namePriceDiv.appendChild(priceP);

            link.appendChild(namePriceDiv);
            itemDiv.appendChild(link);
            containerDiv.appendChild(itemDiv);
        });

        flexMobile.appendChild(topContainer);
        flexMobile.appendChild(bottomContainer);

        const spacingDiv = document.createElement('div');
        spacingDiv.className = 'flex-items-container brightness-106';
        const spacingInner = document.createElement('div');
        spacingInner.className = 'flex-items';
        spacingInner.innerHTML = `<div class="item-spacing"></div>`;
        spacingDiv.appendChild(spacingInner);

        container.appendChild(flexMobile);
        container.appendChild(spacingDiv);
    }
}

// ======================
// FUNCIÓN AUXILIAR PARA TAGS
// ======================
function addTag(link, tagName, altText) {
    const img = document.createElement('img');
    img.className = 'flex-item-img-custom';
    img.src = `./mugs/tags/${tagName}.png`;
    img.alt = altText;
    link.appendChild(img);
}

// Renderizar todo
renderProducts();

});

const PRICE_BOX = 2;
const PRICE_MAGIC_EXTRA = 2;
const IS_CUSTOM = 4;
const NORMAL_MUG = 8.99;
const MAGIC_MUG = 10.99;

const BASE_PRICE = 10.99;

// Lista de productos
const products = [
    { 
        id: 1, 
        name: "Gato vintage", 
        price: 0, 
        keyName: "1-gato-vintage",
        description: "Uma caneca elegante com design vintage de gato. Perfeita para os amantes de felinos.",
        isMagic: false,
        isCustom: false,
        isBlack: false,
        hasGiftBox: true,
        isLimited: false
    },
    { 
        id: 2, 
        name: "Gato Loop", 
        price: 0, 
        keyName: "2-gato-loop",
        description: "Design moderno de gato em loop. Uma peça única e divertida.",
        isMagic: false,
        isCustom: false,
        isBlack: false,
        hasGiftBox: true,
        isLimited: true
    },
    { 
        id: 3, 
        name: "Rapariga Anime", 
        price: 0, 
        keyName: "3-rapariga-anime",
        description: "Caneca inspirada no estilo anime, perfeita para fãs de ilustrações vibrantes.",
        isMagic: false,
        isCustom: false,
        isBlack: false,
        hasGiftBox: true,
        isLimited: true
    },
    { 
        id: 4, 
        name: "Sakura Loop", 
        price: 0, 
        keyName: "4-sakura-loop",
        description: "Design floral inspirado em flores de cerejeira, trazendo calma e elegância.",
        isMagic: false,
        isCustom: false,
        isBlack: false,
        hasGiftBox: true,
        isLimited: true
    },
    { 
        id: 5, 
        name: "Ouriço Loop", 
        price: 0, 
        keyName: "5-ourico-loop",
        description: "Um ouriço adorável em design criativo de loop. Ótimo para presentes divertidos.",
        isMagic: false,
        isCustom: false,
        isBlack: false,
        hasGiftBox: true,
        isLimited: false
    },
    { 
        id: 6, 
        name: "Aniversário", 
        price: 2, 
        keyName: "6-aniversario",
        description: "Celebra o teu dia especial com esta caneca festiva de aniversário.",
        isMagic: false,
        isCustom: true,
        isBlack: false,
        hasGiftBox: true,
        isLimited: false
    },
    { 
        id: 7, 
        name: "Feliz Natal", 
        price: 2, 
        keyName: "7-feliz-natal",
        description: "Espalha o espírito natalício com esta caneca temática de Natal.",
        isMagic: false,
        isCustom: true,
        isBlack: false,
        hasGiftBox: true,
        isLimited: false
    },
    { 
        id: 8, 
        name: "Segue os teus sonhos", 
        price: 0, 
        keyName: "8-segue-os-teus-sonhos",
        description: "Uma mensagem inspiradora para acompanhar o teu café ou chá todos os dias.",
        isMagic: false,
        isCustom: false,
        isBlack: false,
        hasGiftBox: true,
        isLimited: false
    },
    { 
        id: 9, 
        name: "HellCat", 
        price: 2, 
        keyName: "9-hellcat",
        description: "Caneca ousada e estilosa com design de gato infernal para os mais destemidos.",
        isMagic: false,
        isCustom: false,
        isBlack: false,
        hasGiftBox: true,
        isLimited: false
    },
    { 
        id: 10, 
        name: "FENIX", 
        price: 0, 
        keyName: "10-fenix",
        description: "Caneca de cerâmica de alta qualidade com design elegante de fénix azul. Inclui apresentação sofisticada e um sticker exclusivo do fénix.",
        isMagic: false,
        isCustom: false,
        isBlack: false,
        hasGiftBox: true,
        isLimited: false
    },
    { 
        id: 11, 
        name: "Equipe Café", 
        price: 0, 
        keyName: "11-cafe-team",
        description: "Design divertido para quem é fã assumido de café. Ideal para todos os dias.",
        isMagic: false,
        isCustom: false,
        isBlack: false,
        hasGiftBox: true,
        isLimited: false
    },
    { 
        id: 12, 
        name: "Equipe Chá", 
        price: 0, 
        keyName: "12-cha-team",
        description: "Perfeita para os apreciadores de chá, com design criativo e moderno.",
        isMagic: false,
        isCustom: false,
        isBlack: false,
        hasGiftBox: true,
        isLimited: false
    }
];


// Obtener carrito del localStorage
function getCart() {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
}

// Guardar carrito en localStorage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Añadir producto al carrito
function addToCart(productId, isMagic, hasGiftBox) {
    const cart = getCart();

    const existingIndex = cart.findIndex(item =>
        item.id === productId && item.isMagic === isMagic && item.hasGiftBox === hasGiftBox
    );

    if (existingIndex !== -1) {
        cart[existingIndex].quantity += 1; // sumar cantidad si ya existe
    } else {
        cart.push({
            id: productId,
            isMagic: isMagic,        // true = M, false = N
            quantity: 1,
            hasGiftBox: hasGiftBox   // true = B, false = N
        });
    }

    saveCart(cart);
    console.log("Carrito actualizado:", cart);
}

// Formatear carrito para mostrarlo como "9N2B"
function getCartFormatted() {
    const cart = getCart();
    return cart.map(item => {
        const magicChar = item.isMagic ? "M" : "N";
        const boxChar = item.hasGiftBox ? "B" : "N";
        return `${item.id}${magicChar}${item.quantity}${boxChar}`;
    });
}

// Editar un item del carrito (cantidad)
function updateCartItem(productId, isMagic, hasGiftBox, newQuantity) {
    const cart = getCart();
    const index = cart.findIndex(item =>
        item.id === productId && item.isMagic === isMagic && item.hasGiftBox === hasGiftBox
    );

    if (index !== -1) {
        if (newQuantity <= 0) cart.splice(index, 1); // eliminar si cantidad 0
        else cart[index].quantity = newQuantity;
        saveCart(cart);
    }
}

function showCartData() {
  try {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      console.log("🛒 El carrito está vacío.");
    } else {
      console.log("🛒 Datos del carrito:", cart);
      console.table(cart);
    }
  } catch (e) {
    console.error("❌ Error leyendo el carrito:", e);
  }
}

