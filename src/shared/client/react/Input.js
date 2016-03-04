'use strict';

import React from 'react';
import _ from 'lodash';


export default function (props) {

    const clone = _.clone(props);
    const originalOnChange = clone.onChange;

    clone.onChange = function onInputChange (evt) {
        if (typeof originalOnChange === 'function') {
            originalOnChange(props.name, evt.target.value, evt);
        }
    }

    return (
        <input {...clone} />
    )

}
