import React, { useState } from 'react'
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import EmailIcon from '@mui/icons-material/Email';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

export default function Contact() {
    const [isMessageError, setIsMessageError] = useState(false)
    const [helperMessage, setHelperMessage] = useState('')

    function validateMessageLength(length) {
        setIsMessageError(length < 1)
        setHelperMessage(length < 1 ? '1文字以上お書きください' : '')
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
            />
            <TextField
                error={isMessageError}
                id="outlined-multiline-static"
                label="お問い合わせ内容 *"
                multiline
                rows={6}
                sx={{ margin: 1, minHeight: 200 }}
                helperText={helperMessage}
                onChange={(evt) => {
                    validateMessageLength(evt.target.value.length)
                }}
                onBlur={(evt) => {
                    validateMessageLength(evt.target.value.length)
                }}

            />{ }
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    endIcon={<SendIcon />}
                    sx={{ width: 100, mr: 1 }}
                >
                    送信
                </Button>
            </Box>
        </Box>

    )
}
