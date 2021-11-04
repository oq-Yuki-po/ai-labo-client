import React from 'react'
import Box from '@mui/material/Box'
import DescriptionCard from '../Common/DescriptionCard';

import axios from 'axios'

export default function FaceDetectionFromWebCam() {
    const description = 'WEBカメラを使用して顔検出機能をお試しできるページです。\nリリースノート'
    return (
        <Box sx={{ display: 'flex', m: 2, boxSizing: 'border-box', minHeight: '90%' }}>
            <Box sx={{ minWidth: '18%', mr: 2 }}>
                <DescriptionCard description={description} />
            </Box>
        </Box>
    )
}
