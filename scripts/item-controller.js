window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get("id"), 10);
    const product = products.find(p => p.id === productId) || products[0];

    const productTitle = document.getElementById("product-title");
    const productPrice = document.getElementById("product-price");
    const productDescription = document.getElementById("product-description");
    const carousel = document.getElementById("product-carousel");
    const thumbsContainer = document.getElementById("carousel-thumbs");

    const optionMagic = document.getElementById("option-magic");
    const optionGift = document.getElementById("option-gift");

    const state = {
        magic: product.isMagic || false,
        gift: product.hasGiftBox || false
    };

    function updatePrice() {
        // Tomamos base según si es mágico o no
        let basePrice = state.magic ? MAGIC_MUG : NORMAL_MUG;

        // Sumamos el precio extra que ya tenga el producto
        basePrice += product.price || 0;

        // Extras por caja regalo o personalización
        if(state.gift) basePrice += PRICE_BOX;
        //if(state.magic) basePrice += PRICE_MAGIC_EXTRA;

        productPrice.textContent = `${basePrice.toFixed(2)}€`;
    }

    function syncOptionsVisualState() {
        [
            { el: optionMagic, active: state.magic },
            { el: optionGift, active: state.gift }
        ].forEach(opt => {
            const icon = opt.el.querySelector(".state-icon");
            if(opt.active){
                opt.el.classList.add("item-section-option-checked");
                icon.src = "./media/check.svg";
            } else {
                opt.el.classList.remove("item-section-option-checked");
                icon.src = "./media/uncheck.svg";
            }
        });
    }

    function toggleOption(optionName) {
        state[optionName] = !state[optionName];
        syncOptionsVisualState();
        updatePrice();
    }

    optionGift.addEventListener("click", ()=>toggleOption("gift"));
    optionMagic.addEventListener("click", ()=>toggleOption("magic")); // Igual que la caja

    function buildCarousel() {
        const imgKeys = ["front","back","left","center","right","sticker","extra1","extra2"];
        carousel.innerHTML = "";
        thumbsContainer.innerHTML = "";

        const promises = imgKeys.map(pos => {
            const imgPath = `./mugs/designs/${product.keyName}/${pos}.png`;
            return new Promise(resolve => {
                const img = new Image();
                img.onload = () => resolve({ src: imgPath, pos });
                img.onerror = () => resolve(null);
                img.src = imgPath;
            });
        });

        Promise.all(promises).then(results => {
            const loadedImages = results.filter(Boolean);
            updateCarousel(loadedImages);
        });
    }

    function updateCarousel(images) {
        carousel.innerHTML = "";
        thumbsContainer.innerHTML = "";

        images.forEach((item,i)=>{
            const img = document.createElement("img");
            img.src = item.src;
            img.alt = `${product.name} ${item.pos}`;
            img.draggable = false;
            if(i===0) img.classList.add("active");
            carousel.appendChild(img);

            const thumb = document.createElement("img");
            thumb.src = item.src;
            thumb.dataset.type = item.pos;
            if(i===0) thumb.classList.add("active");
            thumbsContainer.appendChild(thumb);

            thumb.addEventListener("click", ()=>goTo(i));
        });

        initCarousel();
    }

    let goTo;
    function initCarousel() {
        const wrapper = document.querySelector('.carousel-wrapper');
        const images = Array.from(carousel.querySelectorAll('img'));
        const thumbs = Array.from(thumbsContainer.children);
        let index=0, wrapperWidth=wrapper.clientWidth, pointerId=null, startX=0;
        let prevTranslate=0, currentTranslate=0, dragging=false, moved=false;

        function setPos(transition=true) {
            carousel.style.transition = transition ? 'transform 0.28s cubic-bezier(.22,.9,.31,1)' : 'none';
            carousel.style.transform = `translate3d(${currentTranslate}px,0,0)`;
        }

        function clamp(x) {
            const min = -(images.length-1)*wrapperWidth, max=0;
            if(x>max) return max+(x-max)*0.3;
            if(x<min) return min+(x-min)*0.3;
            return x;
        }

        function snapToImage() {
            wrapperWidth = wrapper.clientWidth;
            index = Math.round(-currentTranslate / wrapperWidth);
            index = Math.max(0, Math.min(index, images.length-1));
            currentTranslate = -index*wrapperWidth;
            prevTranslate = currentTranslate;
            setPos(true);
            thumbs.forEach((t,i)=>t.classList.toggle('active', i===index));
        }

        wrapper.addEventListener('pointerdown', e=>{
            if(e.pointerType==='mouse' && e.button!==0) return;
            pointerId = e.pointerId;
            wrapper.setPointerCapture(pointerId);
            startX = e.clientX;
            prevTranslate = currentTranslate;
            dragging = true;
            moved = false;
            wrapper.classList.add('dragging');
            setPos(false);
        });

        wrapper.addEventListener('pointermove', e=>{
            if(!dragging || e.pointerId!==pointerId) return;
            const dx = e.clientX - startX;
            if(Math.abs(dx)>3) moved=true;
            currentTranslate = clamp(prevTranslate+dx);
            setPos(false);
        });

        function endPointer(e){
            if(!dragging||e.pointerId!==pointerId) return;
            dragging=false;
            try{wrapper.releasePointerCapture(pointerId);}catch{}
            prevTranslate=currentTranslate;
            wrapper.classList.remove('dragging');
            if(moved) snapToImage(); else setPos(true);
            setTimeout(()=>moved=false,0);
        }

        wrapper.addEventListener('pointerup', endPointer);
        wrapper.addEventListener('pointercancel', endPointer);
        wrapper.addEventListener('lostpointercapture', endPointer);

        images.forEach(img=>{
            img.draggable=false;
            img.addEventListener('dragstart', e=>e.preventDefault());
            img.addEventListener('click', e=>{ if(moved) e.preventDefault(); });
        });

        goTo = function(i){
            wrapperWidth = wrapper.clientWidth;
            index = Math.max(0, Math.min(i, images.length-1));
            currentTranslate = -index*wrapperWidth;
            prevTranslate = currentTranslate;
            setPos(true);
            thumbs.forEach((t,j)=>t.classList.toggle('active', j===index));
        };

        window.addEventListener('resize', ()=>{
            wrapperWidth = wrapper.clientWidth;
            currentTranslate=-index*wrapperWidth;
            prevTranslate=currentTranslate;
            setPos(true);
        });
    }

    // --- INICIO ---
    productTitle.textContent = `CANECA - ${product.name}`;
    productDescription.textContent = product.description;
    syncOptionsVisualState();
    updatePrice();
    buildCarousel();

    function addToCart(id, magic, gift) {
        const cart = JSON.parse(localStorage.getItem("cart")||"[]");

        const existingIndex = cart.findIndex(item =>
            item.id===id && item.isMagic===!!magic && item.hasGiftBox===!!gift
        );

        if(existingIndex!==-1){
            cart[existingIndex].quantity+=1;
        } else {
            cart.push({ id:id, isMagic:!!magic, hasGiftBox:!!gift, quantity:1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
    }

    const addToCartBtn = document.getElementById("add-to-cart");
    addToCartBtn.addEventListener("click", ()=>{
        addToCart(product.id, state.magic, state.gift);
        /*alert("Producto añadido al carrito");*/
    });

    /* ADD-BITTOM-ANIM */
    addToCartBtn.addEventListener("click", () => {
        // Añadir clase temporal
        addToCartBtn.classList.add("added");
        addToCartBtn.textContent = "ADICIONADO";

        // Quitarla después de 500ms
        setTimeout(() => {
            addToCartBtn.classList.remove("added");
            addToCartBtn.textContent = "ADICIONAR AO CESTO";
        }, 650);
    });
        

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
    

};
