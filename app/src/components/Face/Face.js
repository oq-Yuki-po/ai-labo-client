import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { borderRadius } from '@mui/system';

export default function Face() {
    return (
        <Box sx={{ display: 'flex', m: 2, boxSizing: 'border-box' }}>
            <Box sx={{ minWidth: '18%', mr: 2 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h5"
                            sx={{
                                fontFamily: 'Zen Kaku Gothic New',
                                textDecoration: 'underline'
                            }}>
                            説明
                        </Typography>
                        <Typography variant="body2" sx={{ margin: 1, overflowWrap: 'break-word' }}>
                            顔認証機能をお試しできるページです。<br />
                            リリースノート
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
            <Box sx={{ minWidth: '80%', display: 'flex', position: 'relative', border: '1px solid black', p: 1, borderRadius: 2 }}>
                <Box sx={{ minWidth: '99%', minHeight: 700, m: 1 }}>
                    <img src={`${process.env.PUBLIC_URL}/images/sample_04.jpg`} className='upload-img'></img>
                    <Box sx={{ border: '1px solid black', borderRadius: 2, p: 1, mt: 1 }} >
                        検出結果
                    </Box>
                </Box>
                <Box sx={{ position: 'absolute', bottom: 0, right: 0, p: 2 }}>
                    <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        endIcon={<SendIcon />}>
                        画像を送信
                    </Button>
                </Box>

            </Box>
        </Box>
    )
}
