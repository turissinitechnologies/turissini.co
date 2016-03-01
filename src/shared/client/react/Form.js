'use strict';


import React from 'react';


class Form extends React.Component {

    constructor () {
        super(...arguments);

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit (e) {
        e.preventDefault();
        this.props.onSubmit(e);
    }

    render () {

        return (
            <form {...this.props} onSubmit={this.onSubmit}>
                {this.props.children}
            </form>
        );

    }

}

Form.defaultProps = {
    onSubmit: function () {}
};

export default Form;
