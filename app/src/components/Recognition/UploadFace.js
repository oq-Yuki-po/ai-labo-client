import React, {useRef} from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import HiddenInput from '../Common/HiddenInput'

export default function UploadFace(props) {
    const size = 112 * 2;
    const inputRef = useRef(null);
    
    const fileUpload = () => {
        inputRef.current.click();
    };

    return (
        <Box textAlign="center" sx={{ m: 1 }}>
            <img src={props.based64} alt={props.title} width={size} height={size}/>
            <Button
                sx={{ position: 'absolute', bottom: 0, right: 0 }}
                type="submit"
                color="primary"
                variant="contained"
                endIcon={<FileUploadIcon />}
                onClick={fileUpload}>
                画像を選択
            </Button>
            <HiddenInput onFileInputChange={props.onFileInputChange} ref={inputRef} />
        </Box>
    )
}
