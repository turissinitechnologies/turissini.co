'use strict';

import { createRotoscope } from 'rotoscope';

const siteHeader = document.getElementById('site-header');
const hero = document.getElementById('hero');


function parallax() {
    const scrollHeight = document.body.offsetHeight - window.innerHeight;
    const heroHeight = hero.offsetHeight;
    const headerHeight = siteHeader.offsetHeight;

    return createRotoscope(window).bounds({
        start: 0,
        duration: scrollHeight
    })
    .animate(function (timeline) {
        function animateSiteHeaderBackground (time) {
            const base = 0.5;
            const dist = 1 - base;
            const opacity = base + (time * dist);
            const background = `rgba(0, 23, 50, ${opacity})`;

            return function () {
                siteHeader.style.background = background;
            }
        }

        return timeline.appendChild(animateSiteHeaderBackground, {
            offset: heroHeight / 2,
            duration: (heroHeight / 2) - headerHeight
        });


    })
    .start();

}

let player;
function startParallax () {
    if (player && typeof player.stop === 'function') {
        player.stop();
    }

    player = parallax();
}

window.addEventListener('resize', startParallax);
startParallax();
