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
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import NavMenu from './NavMenu';
import NavMenuItem from './NavMenuItem';
import ImageIcon from '@mui/icons-material/Image';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

export default function Header() {

    let history = useHistory()
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (to) => {
        setAnchorEl(null);
        history.push(to)
    };

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
                        <Button
                            id="basic-button"
                            color="inherit"
                            size="large"
                            startIcon={<CropFreeIcon children={<FaceIcon />} />}
                            aria-controls="basic-menu"
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                            sx={{ fontSize: 16 }} >
                            顔検出
                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{ 'aria-labelledby': 'basic-button' }}>
                            <NavMenuItem title="画像" icon={<ImageIcon />} to='/face-detection-image' handleClose={handleClose} />
                            <NavMenuItem title="WEBカメラ" icon={<CameraAltIcon />} to='/face-detection-webcam' handleClose={handleClose} />
                        </Menu>
                        <NavMenu to='/face-recognition' title='顔認証' icon={<FaceIcon />} />
                        <NavMenu to='/ocr' title='OCR' icon={<FindInPageIcon />} />
                        <NavMenu to='/contact' title='お問い合わせ' icon={<EmailIcon />} />
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    )
}
