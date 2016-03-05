'use strict';


function toggleClassName (el, className) {
    if (el.classList.contains(className)) {
        el.classList.remove(className);
    } else {
        el.classList.add(className);
    }
}


export default function (navbarButton, siteNavBarCollapse, siteHeader) {

    navbarButton.addEventListener('click', function () {
        toggleClassName(siteNavBarCollapse, 'in');
        toggleClassName(navbarButton, 'active');
        toggleClassName(siteHeader, 'navbar-open');
    });
}
