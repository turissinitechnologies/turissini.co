'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import Form from './../../shared/client/react/Form';
import Input from './../../shared/client/react/Input';
import Select from './../../shared/client/react/Select';
import numeral from 'numeral';

const formContainer = document.getElementById('form-contact-container');


const contact = new Map();
contact.set('budget', '$50,000 to $100,000');
contact.set('timeframe', '3-6 months');

function onSubmit () {
    console.log('submit!');
}

function onContactChange (prop, val, evt) {
    contact.set(prop, val);
    renderForm(contact);
    console.log(contact.get('budget'));
}

function renderForm (c) {
    ReactDom.render((
        <Form onSubmit={onSubmit} className="form form-contact">
            <div className="input-container">
                <label htmlFor="contact-input-name">Hi, my name is</label>
                <div className="input">
                    <Input id="contact-input-name" value={c.get('name')} name="name" onChange={onContactChange} />
                </div>
            </div>
            <div className="input-container">
                <label htmlFor="contact-input-email">My e-mail is</label>
                <div className="input">
                    <Input id="contact-input-email" type="email" value={c.get('e-mail')} name="e-mail" onChange={onContactChange} />
                </div>
            </div>
            <div className="input-container">
                <label htmlFor="contact-input-company">I work for</label>
                <div className="input">
                    <Input id="contact-input-company" value={c.get('company')} name="company" onChange={onContactChange} />
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
                    <Select value={c.get('timeframe')} name="timeframe" onChange={onContactChange}>
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
                    <Select value={c.get('budget')} name="budget" onChange={onContactChange}>
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
