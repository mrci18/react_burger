import React from 'react';
import {withRouter}from 'react-router-dom'
import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredients/BurgerIngredients';
const burger = (props) => {
    // returns a list of keys
    // put that list of keys in map
        //For each key 
            // create an array item per value
                // for each array item return JSX of burger ingredient

    //reduce allows us to transform an array into something else
    //performed on each element
        //takes prev value and curr val 
        //Not only call back but an initial value, lets say an array
    let transformedIngredients = Object.keys(props.ingredients)
    .map(igKey => {
        return [...Array(props.ingredients[igKey])].map((_, i) => {
            return <BurgerIngredient key={igKey + i} type={igKey}/>
        });
    }).reduce((arr, el) => {
        return arr.concat(el)
    }, []);

    if ( transformedIngredients.length === 0) {
        transformedIngredients = <p>Please add ingredients</p>
    }

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom" />
        </div>
    );
}

export default withRouter(burger);