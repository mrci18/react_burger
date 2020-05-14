import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';

class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        loading: false
    }

    orderHander = (event) => {
        event.preventDefault();
        //You would want to calculate price from server instead to ensure, user is not manipulating price
        this.setState({loading: true});
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            custumer: {
                name: 'Charles',
                addresss: '888 Brannan',
                zipCode: '94103',
                country: 'US',
                email: 'test@test.com'

            },
            deliverMethod: 'fastest'
        }
        axios.post('/orders.json', order)
        .then(response => {
            this.setState({loading: false});
            this.props.history.push('/')
        })
        .catch(error => {
            this.setState({loading: false});
            console.log(error);
        })
    }
    render () {
        let form = (
                <form>
                    <input className={classes.Input} type="text" name="name" placeholder="Your Name" />
                    <input className={classes.Input} type="email" name="email" placeholder="Your Email" />
                    <input className={classes.Input} type="text" name="street" placeholder="Street" />
                    <input className={classes.Input} type="text" name="postal" placeholder="Postal" />
                    <Button btnType="Success" clicked={this.orderHander}>ORDER</Button>
                </form>
        );
        if (this.state.loading) {
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

export default ContactData;