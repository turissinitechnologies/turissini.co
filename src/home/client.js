'use strict';

import './client/parallax';
import './client/contactForm';
import delegateEvents from 'delegate-events';
import createScrollToSpring from './client/scrollToSpring';
import initMobileNavbar from './client/mobileNavbar';


const siteHeader = document.getElementById('site-header');
const siteNavBarCollapse = document.getElementById('site-navbar-collapse');
const navbarButton = document.getElementById('site-navbar-button');

initMobileNavbar(navbarButton, siteNavBarCollapse, siteHeader);
const scrollToSpring = createScrollToSpring();

delegateEvents.bind(siteHeader, '.navbar-nav a', 'click', function (e) {
    const target = e.target;
    const href = target.getAttribute('href');
    const el = document.querySelector(href);
    const offsetTop = el.offsetTop;

    scrollToSpring.start(undefined, window.scrollY, undefined, offsetTop);
});
