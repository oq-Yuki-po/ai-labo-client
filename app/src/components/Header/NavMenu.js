import React from 'react'
import Button from '@mui/material/Button'
import { useHistory } from "react-router-dom";

export default function NavMenu(props) {

    let history = useHistory();

    function handleOnClick() {
        history.push(props.to)
    }

    return (
        <Button color="inherit" size="large" sx={{ fontSize: 16 }} startIcon={props.icon} onClick={handleOnClick}>
            {props.title}
        </Button>
    )
}
