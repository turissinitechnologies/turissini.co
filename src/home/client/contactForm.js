'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import Form from './../../shared/client/react/Form';
import Input from './../../shared/client/react/Input';

const formContainer = document.getElementById('form-contact-container');


const contact = new Map();

function onContactChange (prop, val, evt) {
    contact.set(prop, val);
    renderForm(contact);
}

function renderForm (c) {
    ReactDom.render((
        <Form className="form form-contact">
            <Input placeholder="Name" value={c.get('name')} name="name" onChange={onContactChange} />
            <Input type="email" placeholder="E-Mail Address" value={c.get('e-mail')} name="e-mail" onChange={onContactChange} />
            <Input placeholder="Company" value={c.get('company')} name="company" onChange={onContactChange} />
        </Form>
    ), formContainer);
}

renderForm(contact);
