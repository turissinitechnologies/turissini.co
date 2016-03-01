'use strict';

import React from 'react';


export default function ({ placeholder, value, onChange = function () {}, name, type = 'text' }) {

    function onInputChange (evt) {
        onChange(name, evt.target.value, evt);
    }

    return (
        <input placeholder={placeholder} value={value} type={type} onChange={onInputChange} />
    )

}
