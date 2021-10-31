import React from 'react'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'
import CropFreeIcon from '@mui/icons-material/CropFree';
import FaceIcon from '@mui/icons-material/Face';
import EmailIcon from '@mui/icons-material/Email';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import { useHistory } from "react-router-dom";

import NavMenu from './NavMenu';

export default function Header() {

    let history = useHistory()

    return (
        <Box sx={{ flexGrow: 1, minHeight: '7%' }}>
            <AppBar position='static'>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h5"
                        color="inherit"
                        component="div"
                        sx={{ flexGrow: 1, maxWidth: 120 }}
                        onClick={() => history.push('/')}
                        className='title'>
                        AI Labo
                    </Typography>
                    <Box>
                        <NavMenu to='/face-detection' title='顔検出' icon={<CropFreeIcon children={<FaceIcon />} />} />
                        <NavMenu to='/face-recognition' title='顔認証' icon={<FaceIcon />} />
                        <NavMenu to='/ocr' title='OCR' icon={<FindInPageIcon />} />
                        <NavMenu to='/contact' title='お問い合わせ' icon={<EmailIcon />} />
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    )
}
