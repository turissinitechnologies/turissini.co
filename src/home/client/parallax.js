'use strict';

import { createRotoscope } from 'rotoscope';

const siteHeader = document.getElementById('site-header');
const hero = document.getElementById('hero');
const aboutNavLink = document.getElementById('nav-link-about');
const aboutSection = document.getElementById('about');

function parallax() {
    const scrollHeight = document.body.offsetHeight - window.innerHeight;
    const heroHeight = hero.offsetHeight;
    const headerHeight = siteHeader.offsetHeight;
    const aboutOffsetHeight = aboutSection.offsetHeight;
    const aboutOffsetTop = aboutSection.offsetTop;

    function createNavbarHighlight (sectionId) {
        const section = document.getElementById(sectionId);
        const anchor = document.querySelector(`a[href="#${sectionId}"]`);

        const clip = function (time) {
            if (time > 0 && time < 1) {
                return function () {
                    anchor.classList.add('highlight');
                }
            }

            return function () {
                anchor.classList.remove('highlight');
            }
        }

        const offsets = {
            offset: section.offsetTop - headerHeight,
            duration: section.offsetHeight
        };

        return {
            clip,
            offsets
        };
    }


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



        const highlightAboutNavButton = createNavbarHighlight('about');
        const highlightServicesNavButton = createNavbarHighlight('services');
        const highlightContactNavButton = createNavbarHighlight('contact');

        return timeline.appendChild(animateSiteHeaderBackground, {
            offset: heroHeight / 2,
            duration: (heroHeight / 2) - headerHeight
        })
        .appendChild(
            highlightAboutNavButton.clip,
            highlightAboutNavButton.offsets
        )
        .appendChild(
            highlightServicesNavButton.clip,
            highlightServicesNavButton.offsets
        )
        .appendChild(
            highlightContactNavButton.clip,
            highlightContactNavButton.offsets
        );


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
