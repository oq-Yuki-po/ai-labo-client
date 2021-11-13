import React, { useRef, useState, useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import Webcam from "react-webcam";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { useAlert } from "react-alert";
import CroppedFace from './CroppedFace'
import axios from 'axios'

import LeftDescriptionDrawer from '../Common/LeftDescriptionDrawer';
import CameraSelector from '../Common/CameraSelector';

export default function FaceDetectionFromWebCam() {
    const description = 'Webカメラを使用して顔検出を行います。\n' +
        '検出された顔画像はダウンロード可能です。\nその画像を顔認証に使用できます。\n' +
        'このサービスで使用されるモデルは~から実際に搭載されているものです。'
    const caution = '画像はサーバに保存していません。\n気軽にお試しください。'
    const faceRecognitionSideLength = 128;
    let ctx = null;
    const webcamRef = useRef([]);
    const [itemData, SetItemData] = useState([]);
    const [progress, setProgress] = useState(false);
    const [deviceId, setDeviceId] = useState('');
    const [devices, setDevices] = useState([]);

    const videoConstraints = {
        width: 640,
        height: 480,
        facingMode: "user",
        deviceId: deviceId
    };
    const reactAlert = useAlert();


    const handleDevices = useCallback(
        mediaDevices =>
            setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
        [setDevices]
    );

    useEffect(
        () => {
            navigator.mediaDevices.enumerateDevices().then(handleDevices);
        },
        [handleDevices]
    );

    const handleChange = (event) => {
        setDeviceId(event.target.value);
    };

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
                axios.post(`${process.env.REACT_APP_SERVER_URL}/api/face_detection/`, json_body)
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
                        reactAlert.error('顔検出に失敗しました。');
                    }).finally(() => {
                        setProgress(false);
                    });
            })
        }
    }
    const capture = () => {
        if (deviceId==='') {
            reactAlert.error('カメラを選択してください。');
            return 0;
        }
        setProgress(true);
        drawImage()
    }
    const createImageList = (fileName, bboxes) => {
        let promises = [];
        var array = [];

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
                        array.push(obj);
                        resolve();
                    });
                }
            }));
        }
        Promise.all(promises).then(() => {
            SetItemData(array);
        });
    }

    return (
        <Box sx={{ boxSizing: 'border-box', minHeight: '90%' }}>
            <Box>
                <LeftDescriptionDrawer description={description} caution={caution} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} className={'drop'} open={progress}>
                    <CircularProgress color="primary" size={100} />
                </Backdrop>
                <Box pt={1} m={1} height={700} width={650}>
                    <CameraSelector deviceId={deviceId} handleChange={handleChange} devices={devices} />
                    {(deviceId !== '') &&
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                        />}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }} height={700} width={650} pt={1} m={1}>
                    <Box height={60}></Box>
                    <canvas ref={canvas} className='canvas-web' />
                    <Box sx={{ position: 'absolute', bottom: 170, right: 10 }}>
                        <Button
                            variant="contained"
                            onClick={capture}
                            startIcon={<CameraAltIcon />}
                        >
                            顔検出
                        </Button>
                    </Box>
                </Box>
                <Box sx={{ border: '1px solid black', borderRadius: 2, width: '30%', overflowY: 'scroll', height: 600 }} pt={1} pl={2} m={1}>
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
