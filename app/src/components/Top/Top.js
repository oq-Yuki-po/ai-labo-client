import React from 'react'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';


export default function Top() {
    const public_url = process.env.PUBLIC_URL
    function srcset(image, size, rows = 1, cols = 1) {
        return {
            src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
            srcSet: `${image}?w=${size * cols}&h=${size * rows
                }&fit=crop&auto=format&dpr=2 2x`,
        };
    }

    return (
        <div>
            <Typography
                variant="h1"
                sx={{
                    position: 'absolute',
                    top: '25%',
                    left: '50%',
                    transform: 'translateY(-50%) translateX(-50%)',
                    zIndex: 1,
                    fontFamily: 'Playfair Display, serif;'
                }}>AI Labo</Typography>
            <Typography
                variant="h5"
                sx={{
                    position: 'absolute',
                    top: '40%',
                    left: '50%',
                    transform: 'translateY(-50%) translateX(-50%)',
                    zIndex: 1,
                    fontFamily: 'Zen Kaku Gothic New, serif;'
                }}>
                ここでは研究成果を実際に動かしてみることができます。<br />
                ご意見やご感想お待ちしております！！
            </Typography>
            <Box
                component="div"
                sx={{ display: 'flex', flexDirection: 'column', width: 800, mr: 'auto', ml: 'auto' }}
            >

                <ImageList
                    variant="quilted"
                    cols={4}

                >
                    {itemData.map((item) => (
                        <ImageListItem key={public_url + item.img} cols={item.cols || 1} rows={item.rows || 1}>
                            <img
                                {...srcset(item.img, 121, item.rows, item.cols)}
                                alt={item.title}
                                loading="lazy"
                                className='top-image'
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </Box>
        </div>
    )
}
const itemData = [
    {
        img: '/images/sample_01.jpg',
        title: 'pepper',
        rows: 2,
        cols: 2,
    },
    {
        img: '/images/sample_02.jpg',
        title: 'matrix'
    },
    {
        img: '/images/sample_03.jpg',
        title: 'code'
    },
    {
        img: '/images/sample_08.jpg',
        title: 'VR',
        cols: 2
    },
    {
        img: '/images/sample_07.jpg',
        title: 'drone',
        rows: 2,
        cols: 2
    },
    {
        img: '/images/sample_05.jpg',
        title: 'face',
        rows: 2,
        cols: 2,
    },
]
