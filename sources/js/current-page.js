function setCurrentPage() {
    let currentPage = document.location.pathname
    let navbar = document.getElementsByClassName("navbar-nav")[0]
    let item, itemChild
    for (item = navbar.firstElementChild; item; item = item.nextElementSibling) {
        itemChild = item.firstElementChild
        if (itemChild.getAttribute('href') === currentPage) {
            item.setAttribute('class', 'current-active')
            break
        }
    }
}

window.addEventListener("load", setCurrentPage);