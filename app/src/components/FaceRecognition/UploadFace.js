import React, {useRef} from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import HiddenInput from '../Common/HiddenInput'

export default function UploadFace(props) {
    const inputRef = useRef(null);
    
    const fileUpload = () => {
        inputRef.current.click();
    };

    const drawImage = (props) => {
        if (props.based64 !== "") {
            return <img src={props.based64} alt={props.title} width={props.size} height={props.size}/>
        }
    }

    return (
        <Box sx={{ m: 10,  display:'inline-block'}}>
            <Box sx={{ m: 2, border: '1px solid black', borderRadius: 2 }} width={props.size} height={props.size}>
            {
                drawImage(props)
            }
            </Box>
            <Button
                sx={{ m: 1}}
                variant="contained"
                endIcon={<FileUploadIcon />}
                onClick={fileUpload}>
                画像を選択
            </Button>
            <HiddenInput onFileInputChange={props.onFileInputChange} ref={inputRef} />
        </Box>
    )
}
