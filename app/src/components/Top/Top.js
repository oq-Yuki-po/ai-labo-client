import React from 'react'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';


export default function Top() {
    const public_url = process.env.PUBLIC_URL
    function srcset(image, width, height, rows = 1, cols = 1) {
        return {
            src: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
            srcSet: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format&dpr=2 2x`,
        };
    }

    function imageLine(imageData, countOfCol, width, height) {
        return (
            <ImageList
                variant="quilted"
                cols={countOfCol}
                sx={{ margin: 0.5 }}
                rowHeight={height}
            >
                {imageData.map((item) => (
                    <ImageListItem key={public_url + item.img} cols={item.cols || 1} rows={item.rows || 1}>
                        <img
                            {...srcset(item.img, width, height, item.rows, item.cols)}
                            alt={item.title}
                            loading="lazy"
                            className='top-image'
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        );
    }

    const imageListWidth = '100%'

    return (
        <Box
            sx={{ width: imageListWidth}}
        >
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
            {imageLine(itemData.slice(0, 5), 5, imageListWidth / 5, 850 / 3)}
            {imageLine(itemData.slice(5, 9), 4, imageListWidth / 4, 850 / 3)}
            {imageLine(itemData.slice(9, 15), 6, imageListWidth / 6, 850 / 3)}
        </Box>
    )
}
const itemData = [
    {
        img: '/images/sample_01.jpg',
        title: 'pepper'
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
        img: '/images/sample_04.jpg',
        title: 'desk'
    },
    {
        img: '/images/sample_15.jpg',
        title: 'dog'
    },
    {
        img: '/images/sample_08.jpg',
        title: 'VR'
    },
    {
        img: '/images/sample_11.jpg',
        title: 'machine_learning'
    },
    {
        img: '/images/sample_05.jpg',
        title: 'face'
    },
    {
        img: '/images/sample_06.jpg',
        title: 'robot'
    },
    {
        img: '/images/sample_09.jpg',
        title: 'art'
    },
    {
        img: '/images/sample_10.jpg',
        title: 'robot'
    },
    {
        img: '/images/sample_07.jpg',
        title: 'drone'
    },
    {
        img: '/images/sample_12.jpg',
        title: 'brain'
    },
    {
        img: '/images/sample_13.jpg',
        title: 'earth'
    },
    {
        img: '/images/sample_14.jpg',
        title: 'robot_hand'
    },
    
]
