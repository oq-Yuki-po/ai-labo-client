import React, { useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Webcam from "react-webcam";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import CroppedFace from './CroppedFace'
import axios from 'axios'

import LeftDescriptionDrawer from '../Common/LeftDescriptionDrawer';

export default function FaceDetectionFromWebCam() {
    const description = 'WEBカメラを使用して顔検出機能を利用できるページです。'
    const faceRecognitionSideLength = 112;
    let ctx = null;
    const webcamRef = useRef([]);
    const [itemData, SetItemData] = useState([]);
    const videoConstraints = {
        width: 640,
        height: 480,
        facingMode: "user"
    };
    const [progress, setProgress] = useState(false);

    const canvas = useRef();
    const drawImage = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        const canvasEle = canvas.current;
        canvasEle.width = canvasEle.clientWidth;
        canvasEle.height = canvasEle.clientHeight;
        ctx = canvasEle.getContext("2d");
        var img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            new Promise(function (resolve) {
                ctx.drawImage(img, 0, 0, 640, 480);
                resolve();
            }).then(function (value) {
                const json_body = { image: canvasEle.toDataURL("image/png") };
                axios.post('http://localhost:8000/api/face_detection/', json_body)
                    .then(res => {
                        let bboxes = res['data']['bboxes']

                        new Promise(function (resolve) {
                            createImageList(imageSrc, bboxes)
                            resolve();
                        }).then(function (value) {
                            for (let key in bboxes) {
                                let item = bboxes[key]
                                ctx.rect(item['upper_left_x'], item['upper_left_y'], item['width'], item['height']);
                            }
                            ctx.strokeStyle = "red";
                            ctx.lineWidth = 2;
                            ctx.stroke();
                            setProgress(false);
                        })
                    }).catch(error => {
                        console.log(error)
                    })
            })
        }
    }
    const capture = () => {
        setProgress(true);
        drawImage()
    }
    const createImageList = (fileName, bboxes) => {
        let promises = [];

        for (let key in bboxes) {

            let item = bboxes[key]

            let height = item['height']
            let width = item['width']

            let clip = new Image();

            clip.src = fileName;

            promises.push(new Promise((resolve) => {
                clip.onload = function () {
                    new Promise((resolveSub) => {
                        let tmpCanvas = document.createElement('canvas');
                        tmpCanvas.width = faceRecognitionSideLength;
                        tmpCanvas.height = faceRecognitionSideLength;
                        let ctx = tmpCanvas.getContext("2d");
                        ctx.drawImage(clip, parseInt(item['upper_left_x']), parseInt(item['upper_left_y']), parseInt(width), parseInt(height),
                            0, 0, faceRecognitionSideLength, faceRecognitionSideLength);
                        resolveSub(tmpCanvas.toDataURL("image/png"));
                    }).then((val) => {
                        var obj = { title: `${itemData.length}`, img: val, certainty: item['certainty'] };
                        SetItemData([...itemData, obj])
                        resolve();
                    });
                }
            }));
        }
    }

    return (
        <Box sx={{ boxSizing: 'border-box', minHeight: '90%' }}>
            <Box>
                <LeftDescriptionDrawer description={description} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} className={'drop'} open={progress}>
                    <CircularProgress color="primary" size={100} />
                </Backdrop>
                <Webcam
                    audio={false}
                    height={480}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={640}
                    videoConstraints={videoConstraints}
                    className='web-cam'
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }} height={500} pt={1} m={1}>
                    <canvas ref={canvas} className='canvas-web' />
                    <Box sx={{ position: 'absolute', bottom: 75, right: 10 }}>
                        <Button
                            variant="contained"
                            onClick={capture}
                            startIcon={<CameraAltIcon />}
                            
                        >
                            顔検出
                        </Button>
                    </Box>
                </Box>
                <Box sx={{ border: '1px solid black', borderRadius: 2, width: '50%', overflowY: 'scroll', height: 600 }} pt={1} pl={2} m={1}>
                    <Typography variant="h5" sx={{ fontFamily: 'Zen Kaku Gothic New', textDecoration: 'underline' }}>
                        検出画像
                    </Typography>
                    <Box sx={{ display: 'flex', p: 1, m: 1, flexWrap: 'wrap' }}>
                        {itemData?.map((item, index) => (
                            <CroppedFace key={index} based64={item.img} index={item.title} certainty={item.certainty} />
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
