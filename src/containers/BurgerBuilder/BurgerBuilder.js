import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.50,
    cheese: 0.40,
    meat: 1.30,
    bacon: 0.70
};

class BurgerBuilder extends Component {
    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0

        },
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false
    }

    updatePurchasedState (ingredients) {
        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey];
        }).reduce((curSum, curEle) => {
            return curSum + curEle
        },0);
        this.setState({purchasable: sum > 0})
    }
    
    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const newPrice = this.state.totalPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchasedState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }

        updatedIngredients[type] = updatedCount;
        const priceReduction = INGREDIENT_PRICES[type];
        const newPrice = this.state.totalPrice - priceReduction;
        
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchasedState(updatedIngredients);

    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHander = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        // alert('Continue');
        //You would want to calculate price from server instead to ensure, user is not manipulating price
        this.setState({loading: true});
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
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
            this.setState({loading: false, purchasing: false });
        })
        .catch(error => {
            this.setState({loading: false, purchasing: false });
            console.log(error);
        })
    }
    render() {
        const disabledInfo = {
            ...this.state.ingredients
        }

        for (let ingredient in disabledInfo){
            disabledInfo[ingredient] = disabledInfo[ingredient] <= 0
        }
        let orderSummary = <OrderSummary 
            price={this.state.totalPrice}
            ingredients={this.state.ingredients}
            purchaseCancelled={this.purchaseCancelHander}
            purchaseContinued={this.purchaseContinueHandler}/>;
        if (this.state.loading) {
            orderSummary = <Spinner/>
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHander}>
                    {orderSummary}
                </Modal>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls 
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    purchasable={this.state.purchasable}
                    ordered={this.purchaseHandler}
                    price={this.state.totalPrice}/>
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);