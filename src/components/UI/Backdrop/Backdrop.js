import React from 'react';
import classes from './Backdrop.module.css';

const backdrop = (props) => (
    //If props.show is  true
        // Show div
    //Else show null
    props.show ? <div className={classes.Backdrop} onClick={props.clicked}></div> : null
);

export default backdrop;