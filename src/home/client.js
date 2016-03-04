'use strict';

import './client/parallax';
import './client/contactForm';
import mSpring from './client/lib/mspring';
import delegateEvents from 'delegate-events';

function toggleClassName (el, className) {
    if (el.classList.contains(className)) {
        el.classList.remove(className);
    } else {
        el.classList.add(className);
    }
}


const siteHeader = document.getElementById('site-header');
const siteNavBarCollapse = document.getElementById('site-navbar-collapse');
const navbarButton = document.getElementById('site-navbar-button');
navbarButton.addEventListener('click', function () {
    toggleClassName(siteNavBarCollapse, 'in');
    toggleClassName(navbarButton, 'active');
    toggleClassName(siteHeader, 'navbar-open');
});

var demoSpring = new mSpring({
	onSpringStart: function() {

	},
	onSpringChange: function(massPos, springData) {
        window.requestAnimationFrame(function () {
            window.scrollTo(0, massPos);
        });
	},
	onSpringRest: function() {
        
	}
});

demoSpring.setSpringParameters(5, 1, 0.6);

delegateEvents.bind(siteHeader, '.navbar-nav a', 'click', function (e) {
    e.preventDefault();
    const target = e.target;
    const href = target.getAttribute('href');
    const el = document.querySelector(href);
    const offsetTop = el.offsetTop;

    demoSpring.start(undefined, window.scrollY, undefined, offsetTop);
});
