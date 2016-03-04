'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import cx from 'classnames';
import Form from './../../shared/client/react/Form';
import Input from './../../shared/client/react/Input';
import Select from './../../shared/client/react/Select';
import numeral from 'numeral';

const formContainer = document.getElementById('form-contact-container');


const contact = new Map();
contact.set('budget', {
    value: '$50,000 to $100,000'
});

contact.set('timeframe', {
    value:'3-6 months'
});

contact.set('e-mail', {
    value: '',
    validate: function (value) {
        const regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return regexp.test(value);
    }
});

contact.set('company', {
    value: '',
    validate: function (value) {
        return value;
    }
});

contact.set('name', {
    value: '',
    validate: function (value) {
        return value;
    }
});

contact.set('budget', {
    value: '$50,000 to $100,000'
});

contact.set('need', {
    value: 'web app'
});

contact.set('timeframe', {
    value: '3-6 months'
});

function onSubmit (e) {
    e.preventDefault();
    let hasError = false;

    contact.forEach(function (obj, key) {
        obj.error = false;
        if (typeof obj.validate === 'function' && !obj.validate(obj.value)) {
            hasError = true;
            obj.error = true;
        }
    });

    renderForm(contact);

    if (!hasError) {
        const contactJSON = {};

        contact.forEach(function (obj, key) {
            contactJSON[key] = obj.value;
        });

        fetch('/contacts', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            body: JSON.stringify(contactJSON)
        })
        .then(() => {
            renderSuccess();
        });
    }
}

function onContactChange (prop, val, evt) {
    const existing = contact.get(prop);

    const obj = Object.assign(existing, {
        value: val
    });

    contact.set(prop, obj);
    renderForm(contact);
}

function renderSuccess () {
    ReactDom.render((
        <div>Thanks! We will be in contact with you shortly.</div>
    ), formContainer);
}

function renderForm (c) {
    const emailClassNames = cx('input-container', {
        'text-danger': c.get('e-mail').error
    });

    const nameClassNames = cx('input-container', {
        'text-danger': c.get('name').error
    });

    const companyClassNames = cx('input-container', {
        'text-danger': c.get('company').error
    });

    ReactDom.render((
        <Form onSubmit={onSubmit} className="form form-contact">
            <div className={nameClassNames}>
                <label htmlFor="contact-input-name">Hi, my name is</label>
                <div className="input">
                    <Input id="contact-input-name" value={c.get('name').value} name="name" onChange={onContactChange} />
                </div>
            </div>
            <div className={emailClassNames}>
                <label htmlFor="contact-input-email">My e-mail is</label>
                <div className="input">
                    <Input id="contact-input-email" type="text" value={c.get('e-mail').value} name="e-mail" onChange={onContactChange} />
                </div>
            </div>
            <div className={companyClassNames}>
                <label htmlFor="contact-input-company">I work for</label>
                <div className="input">
                    <Input id="contact-input-company" value={c.get('company').value} name="company" onChange={onContactChange} />
                </div>
            </div>
            <div className="input-container">
                <label htmlFor="contact-input-company">I need a</label>
                <div className="input">
                    <Select value={c.get('need')} name="need" onChange={onContactChange}>
                        <option value="web site">Web site</option>
                        <option value="web app">Web App</option>
                        <option value="ios app">iOS App</option>
                        <option value="qa">Prototype / Proof of concept</option>
                        <option value="other">Other</option>
                    </Select>
                </div>
            </div>
            <div className="input-container">
                <label htmlFor="contact-input-company">My timeframe is</label>
                <div className="input">
                    <Select value={c.get('timeframe').value} name="timeframe" onChange={onContactChange}>
                        <option value="less than 3 months">Less than 3 months</option>
                        <option value="3-6 months">3 months - 6 months</option>
                        <option value="6 months to a year">6 months to a year</option>
                        <option value="more than a year">More than a year</option>
                    </Select>
                </div>
            </div>
            <div className="input-container">
                <label htmlFor="contact-input-company">My budget is</label>
                <div className="input">
                    <Select value={c.get('budget').value} name="budget" onChange={onContactChange}>
                        <option value="Less than $10,000">Less than $10,000</option>
                        <option value="$10,000 to $50,000">$10,000 - $50,000</option>
                        <option value="$50,000 to $100,000">$50,000 - $100,000</option>
                        <option value="More than $100,000">More than $100,000</option>
                    </Select>
                </div>
            </div>
            <div className="input-container">
                <input className="btn btn-primary" type="submit" value="Send" />
            </div>
        </Form>
    ), formContainer);
}

renderForm(contact);
