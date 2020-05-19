import React, {Component} from 'react';
import {connect} from 'react-redux';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';

class ContactData extends Component {
    state = {
        orderForm: {
                name: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Your Name'
                    },
                    value: '',
                    validation: {
                        required: true
                    },
                    valid: false,
                    touched: false
                },
                street: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Street'
                    },
                    value: '',
                    validation: {
                        required: true
                    },
                    valid: false,
                    touched: false
                },
                zipCode: {

                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Zip code'
                    },
                    value: '',
                    validation: {
                        required: true,
                        minLength: 5,
                        maxLength: 5
                    },
                    valid: false,
                    touched: false
                },
                country: {

                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Country'
                    },
                    value: '',
                    validation: {
                        required: true

                    },
                    valid: false,
                    touched: false
                },
                email: {

                    elementType: 'input',
                    elementConfig: {
                        type: 'email',
                        placeholder: 'Email'
                    },
                    value: '',
                    validation: {
                        required: true
                    },
                    valid: false,
                    touched: false
                },
                deliverMethod: {
                    elementType: 'select',
                    elementConfig: {
                        options: [
                            {value: 'fastest', displayValue: 'Fastest'},
                            {value: 'cheapest', displayValue: 'Cheapest'}]
                    },
                    value: 'fastest',
                    validation: {},
                    valid: true
                },
        },
        formIsValid: false
    }

    checkValidity = (value, rules) => {
        let isValid = true;

        if (rules.required ) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength ) {
            isValid = value.length >= rules.minLength && isValid
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid
        }

        return isValid
    }
    inputChangedHandler = (event, inputIdentifier) => {
        //Make a deep copy of the first object
        const updatedOrderForm = {
            ...this.state.orderForm
        }

        //Make deep copy of nested object if the value you want to add isn't in the prev copy
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        }

        //From that copy reassign the value

        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        // reassign deepest copy to parent copy
        updatedOrderForm[inputIdentifier] = updatedFormElement

        let formIsValid = true
        for (let inputIdentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid
        }
        // Set the state as the first layer copy
        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid})
    }

    orderHandler = (event) => {
        event.preventDefault();
        //You would want to calculate price from server instead to ensure, user is not manipulating price
        const formData = {};
        for(let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            oderData: formData
 
        }
        this.props.onOrderBurger(order)
        

    }
    render () {
        const formElementsArray = [];
        for (let key in this.state.orderForm){
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }
        let form = (
                <form onSubmit={this.orderHandler}>
                    {/* <Input elementType="..." elementConfig="..." value="..." /> */}
                    {formElementsArray.map(formElements => (
                        <Input
                            key={formElements.id}
                            elementType={formElements.config.elementType} 
                            elementConfig={formElements.config.elementConfig}
                            value={formElements.config.value} 
                            invalid={!formElements.config.valid}
                            shouldValidate={formElements.config.validation}
                            touched={formElements.config.touched}
                            change={(event) => this.inputChangedHandler(event,formElements.id)} />
                    ))}
                    <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
                </form>
        );
        if (this.props.loading) {
            form = <Spinner />
        }
        return(
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        )
    }
};

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData) => dispatch(actions.purchaseBurger(orderData))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData,axios));