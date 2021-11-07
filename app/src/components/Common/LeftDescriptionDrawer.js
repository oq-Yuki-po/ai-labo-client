import React, { useState } from 'react'
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import InfoIcon from '@mui/icons-material/Info';
import DescriptionCard from './DescriptionCard';
import Box from '@mui/material/Box'


export default function LeftDescriptionDrawer(props) {

    const [state, setState] = useState({ left: false });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <Box
            sx={{ width: 400 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <DescriptionCard descriptions={props.descriptions} />
        </Box>
    );

    return (
        <React.Fragment key='left'>
            <Button onClick={toggleDrawer('left', true)} color="info" startIcon={<InfoIcon />} size='large'>このページについて</Button>
            <Drawer anchor='left' open={state['left']} onClose={toggleDrawer('left', false)}>
                {list('left')}
            </Drawer>
        </React.Fragment>
    )
}
