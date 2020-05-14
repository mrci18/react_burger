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
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }
    //good place to fetch data is in componentDidMount lifecycle
    componentDidMount() {
        axios.get('https://reactburger-f287b.firebaseio.com/ingredients.json')
        .then(response => {
            this.setState({ingredients: response.data})
        })
        .catch(error => {
            this.setState({error: true})
        });
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
        // // alert('Continue');

        const queryParams = [];
        for (let i in this.state.ingredients){
            //salad=1
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
        };
        queryParams.push('price=' + this.state.totalPrice)
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        })
    }
    render() {
        const disabledInfo = {
            ...this.state.ingredients
        }

        for (let ingredient in disabledInfo){
            disabledInfo[ingredient] = disabledInfo[ingredient] <= 0
        }
        let orderSummary = null

        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner/>
        if (this.state.ingredients) {
            orderSummary = <OrderSummary 
                            price={this.state.totalPrice}
                            ingredients={this.state.ingredients}
                            purchaseCancelled={this.purchaseCancelHander}
                            purchaseContinued={this.purchaseContinueHandler}/>;
            burger = (
                <Aux>
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
        if (this.state.loading) {
            orderSummary = <Spinner/>
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHander}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);