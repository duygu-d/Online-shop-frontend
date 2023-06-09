function clearPlaceholderOnFirstClick() {
    var input = document.getElementById("search");
    var firstClick = true;
  
    input.addEventListener("focus", function() {
      if (firstClick) {
        input.placeholder = "";
        firstClick = false;
      }
    });
  }
  
/******** CHANGE TO HOMEPAGE ********/
function backToPage(url){
    window.location.href = url;
}
/******** CHANGE TO HOMEPAGE ********/

/******** SIGN UP VALIDATION ********/
function containsWhitespace(str) {
    return /\s/.test(str);
  }
function formValidation(){
    var firstName = document.FormFill.FirstName.value;
    var lastName = document.FormFill.LastName.value;
    var email = document.FormFill.Email.value;
    var password = document.FormFill.Password.value;
    var confirmPass = document.FormFill.cPassword.value;
    var hasDigitsAndSymbols = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;


    if(firstName=="" || firstName.length<2 || containsWhitespace(firstName)){
        document.getElementById("result").innerHTML="Enter a valid first name!";
        return false;
    }
    else if(lastName=="" || lastName.length<2 || containsWhitespace(lastName)){
        document.getElementById("result").innerHTML="Enter a valid last name!";
        return false;
    }
    else if(containsWhitespace(email)){
        document.getElementById("result").innerHTML="Enter a valid email!";
        return false;
    }
    else if(password.length <= 6){
        document.getElementById("result").innerHTML="The password must be at least 6 digits long!";
        return false;

        if(containsWhitespace(password)){
            document.getElementById("result").innerHTML="The password should not contain any whitespaces!";
            return false;
        }

        if(!hasDigitsAndSymbols.test(password)){
            document.getElementById("result").innerHTML="The password must contain at least one digit and one special symbol!";
            return false;
        }
    }
    else if(password!==confirmPass){
        document.getElementById("result").innerHTML="The passwords does not match!";
        return false;
    }
    else{
        return true;
    }
    
}
/******** SIGN UP VALIDATION ********/

/********** PAGINATION **********/
function getPageList(totalPages, page, maxLength){
    function range(start, end){
        return Array.from(Array(end - start + 1), (_, i)=> i + start);
    }

    var sideWidth = maxLength < 9 ? 1 : 2;
    var leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
    var rightWidth = (maxLength - sideWidth * 2 - 3) >> 1;

    if(totalPages <= maxLength){
        return range(1, totalPages);
    }

    if(page <= maxLength - sideWidth - 1 - rightWidth){
        return range(1, maxLength - sideWidth - 1).concat(0, range(totalPages - sideWidth + 1, totalPages));
    }

    if(page >= totalPages - sideWidth - 1 - rightWidth){
        return range(1, sideWidth).concat(0, range(totalPage - sideWidth - 1 - rightWidth - leftWidth, totalPages));
    }

    return range(1, sideWidth).concat(0, range(page - leftWidth, page + rightWidth), 0, range(totalPages - sideWidth + 1, totalPages));
}


$(function(){
    var numberOfItems = $(".cards-container .product-card").length;
    var limitPerPage = getLimitPerPage();
    var totalPages = Math.ceil(numberOfItems / limitPerPage);
    var paginationSize = 3;
    var currentPage;

    function showPage(whichPage){
        if(whichPage < 1 || whichPage > totalPages) return false;

        currentPage = whichPage;

        $(".cards-container .product-card").hide().slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage).show();

        $(".pagination li").slice(1, -1).remove();

        getPageList(totalPages, currentPage, paginationSize).forEach(item => {
            $("<li>").addClass("page-item").addClass(item ? "current-page" : "dots").toggleClass("active", item === currentPage).append($("<a>").addClass("page-link")
                .attr({href: "javascript:void(0)"}).text(item || "...")).insertBefore(".next-page");
        });

        $(".previous-page").toggleClass("disable", currentPage === 1);
        $(".next-page").toggleClass("disable", currentPage === totalPages);

        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        return true;
    }

    $(".pagination").append(
    $("<li>").addClass("page-item").addClass("previous-page").append($("<a>").addClass("page-link").attr({href: "javascript:void(0)"}).append($("<i>").addClass("fa-solid fa-angles-left fa-xs"))),
    $("<li>").addClass("page-item").addClass("next-page").append($("<a>").addClass("page-link").attr({href: "javascript:void(0)"}).append($("<i>").addClass("fa-solid fa-angles-right fa-xs")))
        );


    $("cards-container").show();
    showPage(1);
    
    $(document).on("click", ".pagination li.current-page:not(.active)", function(){
        return showPage(+$(this).text());
    });

    $(".next-page").on("click", function(){
        return showPage(currentPage + 1);
    });

    $(".previous-page").on("click", function(){
        return showPage(currentPage - 1);
    });
});


function getLimitPerPage(){
    if (window.innerWidth >= 1413 || window.innerWidth >= 1142 && window.innerWidth <= 1156) {
        return 12;
    }
    else if (window.innerWidth >= 1157 && window.innerWidth <= 1412 || window.innerWidth >= 863 && window.innerWidth <= 1141) {
        return 9;
    }
    else if (window.innerWidth >= 564 && window.innerWidth <= 863){
        return 8;
    }
    else{
        return 6;
    }
}
/**********PAGINATION ***********/

/******** SEARCH SUBMIT - HIDE ********/

function showSearchInput(){
    var searchInput = document.querySelector(".nav-search");
    var headerIcons = document.getElementById("header-icons");
  
    searchInput.style.display = "block";
    headerIcons.style.display = "none";
}

function showIcons(){
        var searchInput = document.querySelector(".nav-search");
        var headerIcons = document.getElementById("header-icons");

        searchInput.style.display = "none";
        headerIcons.style.display = "flex";
        location.reload(true);
}

function searchProducts(input) {
    var searchValue = input.value;
    var productCards = document.getElementsByClassName("product-card");

        for (var i = 0; i < productCards.length; i++) {
            var title = productCards[i].querySelector(".card-title").innerText.toLowerCase();

            if (title.includes(searchValue)) {
                productCards[i].style.display = "block";
            } else {
                productCards[i].style.display = "none";
            }
        }
}

/******** SEARCH SUBMIT- HIDE ********/



/**********SHOW SUBLIST **********/
function toggleSublist(){
    var sublist = document.getElementById("productsSublist");
    var icon = document.getElementById("up-down");

    icon.classList.toggle("fa-angle-up");
    sublist.classList.toggle("sublist-visible");
}
/**********SHOW SUBLIST **********/


/**********SHOW & HIDE SIDE NAV **********/
function showSideNav(){
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    var sidenav = document.getElementById("sidenav");

    sidenav.style.display="block";
}

function hideSideNav(){
    var sidenav = document.getElementById("sidenav");

    sidenav.style.display="none";
}
/**********SHOW & HIDE SIDE NAV **********/


/**************** ANONYMOUS FUNC ***************/
(function() {
    var currentLocation = window.location.href;
    var menuItems = document.querySelectorAll('.menu-item');
  
    for (var i = 0; i < menuItems.length; i++) {
      var menuItem = menuItems[i];
      var menuItemHref = menuItem.getAttribute('href');
  
      if (menuItemHref === currentLocation) {
        menuItem.classList.add('is-active');
        break;
      }
    }
  })();
  /**************** ANONYMOUS FUNC ***************/




  document.addEventListener('DOMContentLoaded', () => {
    var imgs = document.querySelectorAll('.card-img img');
  
    imgs.forEach((img) => {
      img.addEventListener('mouseover', () => {
        var button = img.closest('.card-img').querySelector('button');
        button.style.display = 'block';
      });
    });

    imgs.forEach((img) => {
        img.addEventListener('mouseleave', () => {
          var button = img.closest('.card-img').querySelector('button');
          button.style.display = 'none';
        });
      });
  });
  
