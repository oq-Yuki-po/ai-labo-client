import React, {useState} from 'react'
import Box from '@mui/material/Box'
import DescriptionCard from '../Common/DescriptionCard'
import UploadFace from './UploadFace'

export default function Recognition() {

    const description = '顔認証機能をお試しできるページです。\nリリースノート'

    const onFileInputChange = (event) => {
    
    }
    
    const [leftFace, SetLeftFace] = useState("");
    const [rightFace, SetRightFace] = useState("");

    return (
        <Box sx={{ display: 'flex', m: 2, boxSizing: 'border-box', minHeight: '90%' }}>
            <Box sx={{ minWidth: '18%', mr: 2 }}>
                <DescriptionCard description={description} />
            </Box>
            <Box sx={{ minWidth: '80%', display: 'flex', border: '1px solid black', p: 1, borderRadius: 2 }}>
                <Box
                    sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    p: 1,
                    m: 1,
                    justifyContent: 'flex-start'
                    }}
                >
                    <UploadFace based64={leftFace} title="Left" onFileInputChange={onFileInputChange}/>
                    <UploadFace based64={rightFace} title="Right" onFileInputChange={onFileInputChange}/>
                </Box>
            </Box>
        </Box>
    )
}
