'use strict';

import mSpring from './lib/mspring';

export default function (stiffness = 5, mass = 1, friction = 0.6) {
    var scrollSpring = new mSpring({
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

    scrollSpring.setSpringParameters(stiffness, mass, friction);

    return scrollSpring;

}
