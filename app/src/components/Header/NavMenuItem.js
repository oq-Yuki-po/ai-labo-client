import React from 'react'
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

export default function NavMenuItem(props) {
    return (
        <MenuItem onClick={()=>props.handleClose(props.to)}>
            <ListItemIcon>
                {props.icon}
            </ListItemIcon>
            <ListItemText>{props.title}</ListItemText>
        </MenuItem>
    )
}
