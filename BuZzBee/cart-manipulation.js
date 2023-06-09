document.addEventListener('DOMContentLoaded', () => {

    window.addEventListener('load', function() {
        updateCartUI();
      });
      

   const cartIcon = document.querySelector('.fa-shopping-basket');
    const wholeCartWindow = document.getElementById("cart");
    wholeCartWindow.inWindow = 0;
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

    

    addToCartBtns.forEach((btn)=>{
        btn.addEventListener('click', addItemFunction)
    });

    const imgEl = document.querySelectorAll('.card-img img');

    imgEl.forEach((img)=>{
        img.addEventListener('click', createItem)
    });

    function createItem(e){
        const id = e.target.parentElement.parentElement.getAttribute("data-id");
        const img = e.target.parentElement.parentElement.querySelector(".card-img img");
        const title = e.target.parentElement.parentElement.querySelector(".card-title h4").textContent;
        const priceText = e.target.parentElement.parentElement.querySelector(".card-price span").textContent;
        const description = e.target.parentElement.parentElement.querySelector(".product-paragraph p").textContent;
        const ingredients = e.target.parentElement.parentElement.querySelector(".product-paragraph span").textContent;
        const price = parseInt(priceText);

        const src = img.getAttribute("src");


        const item = new CartItem(title, src, price, description,ingredients);
        const queryString = new URLSearchParams(item).toString();
        window.location.href = "item-details.html?" + queryString;
    }

    function addItemFunction(e){
        const id = e.target.parentElement.parentElement.getAttribute("data-id");
        const img = e.target.parentElement.parentElement.querySelector(".card-img img");
        const title = e.target.parentElement.parentElement.querySelector(".card-title h4").textContent;
        const priceText = e.target.parentElement.parentElement.querySelector(".card-price span").textContent;
        const description = e.target.parentElement.parentElement.querySelector(".product-paragraph p").textContent;
        const ingredients = e.target.parentElement.parentElement.querySelector(".product-paragraph span").textContent;
        const price = parseInt(priceText);

        const src = img.getAttribute("src");

        const item = new CartItem(title, src, price, description, ingredients);
        LocalCart.addItemToLocalCart(id, item);
    }

    cartIcon.addEventListener('mouseover', () => {
      if (wholeCartWindow.classList.contains('hide')) {
        wholeCartWindow.classList.remove('hide');
        window.addEventListener('scroll', handleScroll);
      }
    });
  
    function handleScroll() {
      if (!wholeCartWindow.classList.contains('hide')) {
        if (window.pageYOffset > 0) {
          wholeCartWindow.classList.add("sticky-cart");
        } else {
          wholeCartWindow.classList.remove("sticky-cart");
        }
      }
    }
  
    cartIcon.addEventListener('mouseleave', () => {
      wholeCartWindow.inWindow = 0;
      window.removeEventListener('scroll', handleScroll);
      setTimeout(() => {
        if (wholeCartWindow.inWindow === 0) {
          wholeCartWindow.classList.add('hide');
        }
      }, 500);
    });

    const viewCartBtn = document.getElementById("shopping-cart-view-btn");

    wholeCartWindow.addEventListener('mouseover', () => {
      wholeCartWindow.inWindow = 1;
    });

    document.addEventListener('click', function(event) {
        if (viewCartBtn && event.target === viewCartBtn) {
          
            const cartItems = LocalCart.getLocalCartItems();
            const queryString = new URLSearchParams(cartItems).toString();
            window.location.href = "shopping-cart.html?" + queryString;
        }
    });
  

    wholeCartWindow.addEventListener('mouseleave', () => {
      wholeCartWindow.inWindow = 0;
      wholeCartWindow.classList.add('hide');
    });

    function updateCartUI(cartItems){
        const cartWindow = document.querySelector('.cart-items-wrapper');
        cartWindow.innerHTML="";
        items = LocalCart.getLocalCartItems();
        if(cartItems===null){
            return;
        }

        let count = 0;
        let total = 0;

        for(const[key, value] of items.entries()){
            const cartItem = document.createElement('div');
            cartItem.classList.add('product-card');
            let itemPrice = value.price*value.quantity;
            itemPrice = Math.round(itemPrice*100)/100;
            count +=value.quantity;
            total += itemPrice;
            total = Math.round(total*100)/100;

            cartItem.innerHTML = `               
            <div class="cart-container">
                <div class="card-img">
                    <img src="${value.img}">
                </div>
                    <div class="item-details">
                    <div class="card-title">
                        <h4 class="header-txt-color">${value.name}</h4>
                    </div>
                        <div class="card-price">
                            <span class="p-txt-color">${itemPrice} lv.</span>
                        </div>
                        <div class="item-quantity">
                            <span class="p-txt-color">Quantity: ${value.quantity}</span>
                        </div>
                    </div>
                    <div class="xmark-icon">
                        <i class="fa-solid fa-xmark fa-sm"></i>
                    </div>
                </div>`
            
            cartItem.lastElementChild.addEventListener('click',()=>{
                LocalCart.removeItemFromCart(key)
            });

            cartWindow.append(cartItem);
        }

        const cartBadge = document.querySelector('.badge-circle');
        const subtotal = document.querySelector('.subtotal-txt');
        if(count > 0){
            cartBadge.classList.add('non-empty');
            let root = document.querySelector(':root');
            root.style.setProperty('--after-content',`"${count}"`);
            subtotal.innerHTML= `Subtotal: ${total} lv.`;
            subtotal.classList.add('subtotal-txt');
            subtotal.classList.add('header-txt-color');

        }
        else{
            cartBadge.classList.remove('non-empty');
            subtotal.innerHTML= `Subtotal: ${total} lv.`;

        }
    }
  
  /**************** ADD ITEMS TO CART ***************/





  /**************** CART ITEM OBJECT ***************/
  class CartItem{
    constructor(name, img, price, description, ingredients){
        this.name = name;
         this.img = img; 
         this.price = price;
         this.quantity = 1;
         this.description = description;
         this.ingredients = ingredients;
    }
  }

  class LocalCart{

    static key = 'cartItems';


    static getLocalCartItems(){
        let cartMap = new Map();
        const cart = localStorage.getItem(LocalCart.key)
        if(cart===null || cart.length===0){

            return cartMap;
        }

        return new Map(Object.entries(JSON.parse(cart)));
    }


    static addItemToLocalCart(id, item){
        let cart = LocalCart.getLocalCartItems();
        if(cart.has(id)){
            let mapItem = cart.get(id);
            mapItem.quantity +=1;
            cart.set(id, mapItem);
        }
        else{
            cart.set(id, item);
        }
        localStorage.setItem(LocalCart.key, JSON.stringify(Object.fromEntries(cart)));
        updateCartUI(cart);
    }

    static removeItemFromCart(id){
        let cart = LocalCart.getLocalCartItems();
        if(cart.has(id)){
            let mapItem = cart.get(id);
            if(mapItem.quantity > 1){
                mapItem.quantity -=1;
                cart.set(id, mapItem);
            }
            else{
                cart.delete(id);
            }
        }

        if(cart.length===0){
            localStorage.clear();
        }
        else{
            localStorage.setItem(LocalCart.key, JSON.stringify(Object.fromEntries(cart)));
            updateCartUI(cart);
        }
    }
  }
});
  /**************** CART ITEM OBJECT ***************/