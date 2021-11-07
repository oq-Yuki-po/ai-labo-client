import React, { useState } from 'react'
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import EmailIcon from '@mui/icons-material/Email';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios'
import { useAlert } from "react-alert";


export default function Contact() {
    const [isMessageError, setIsMessageError] = useState(false)
    const [helperMessage, setHelperMessage] = useState('')
    const [mailAddress, setMailAddress] = useState('')
    const [Message, setMessage] = useState('')

    const reactAlert = useAlert();

    function validateMessageLength(length) {
        setIsMessageError(length < 1)
        setHelperMessage(length < 1 ? '1文字以上お書きください' : '')
    }

    function onClick() {
        if (isMessageError){
            reactAlert.info('お問合せ内容が空白です');
            return 0
        }
        const json_body = { mail_address: mailAddress, message: Message };
        axios.post('http://localhost:8000/api/contact/', json_body)
            .then(res => {
                
                reactAlert.info(res['data']['message']);

            }).catch(error => {
                reactAlert.error('問合せの送信に失敗しました');
            })
    }

    return (
        <Box
            component="div"
            sx={{ display: 'flex', flexDirection: 'column', width: 780, mr: 'auto', ml: 'auto' }}
        >
            <Typography
                variant="h4"
                sx={{ margin: 2 }}>お問い合わせ</Typography>
            <Typography
                variant="body1"
                sx={{ margin: 2 }}>
                開発中のAIを実際に使ってみた感想や機能要望をお寄せください。<br />
                また、研究内容に関してのご質問も受け付けております。<br />
                メールアドレスを入力していただくと、お問い合わせの回答をお送りできます。
            </Typography>
            <TextField label="メールアドレス"
                id="outlined-multiline-static"
                sx={{ margin: 1 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <EmailIcon color='info' />
                        </InputAdornment>
                    ),
                }}
                value={mailAddress}
                onChange={(evt) => { setMailAddress(evt.target.value) }}
            />
            <TextField
                error={isMessageError}
                id="outlined-multiline-static"
                label="お問い合わせ内容 *"
                multiline
                rows={6}
                value={Message}
                sx={{ margin: 1, minHeight: 200 }}
                helperText={helperMessage}
                onChange={(evt) => {
                    validateMessageLength(evt.target.value.length)
                    setMessage(evt.target.value)
                }}
                onBlur={(evt) => {
                    validateMessageLength(evt.target.value.length)
                }}

            />{ }
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    endIcon={<SendIcon />}
                    sx={{ width: 100, mr: 1 }}
                    onClick={() => onClick()}
                >
                    送信
                </Button>
            </Box>
        </Box>

    )
}
