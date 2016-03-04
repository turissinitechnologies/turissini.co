'use strict';

import React from 'react';
import _ from 'lodash';


export default function (props) {


    function onInputChange (evt) {
        if (typeof props.onChange === 'function') {
            props.onChange(props.name, evt.target.value, evt);
        }
    }

    return (
        <select {...props} onChange={onInputChange}>
            {props.children}
        </select>
    )

}
