import React, { useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import CroppedFace from './CroppedFace'
import HiddenInput from '../Common/HiddenInput'
import { useAlert } from "react-alert";
import axios from 'axios'
import { adjustImage } from '../../utils';
import LeftDescriptionDrawer from '../Common/LeftDescriptionDrawer';


export default function FaceDetectionFromImage() {
    const faceRecognitionSideLength = 128;
    let ctx = null;
    const canvas = useRef();

    const [progress, setProgress] = useState(false);
    const [itemData, SetItemData] = useState(null);
    const [detectedCount, SetDetectedCount] = useState(0);
    const [inferenceTime, SetInferenceTime] = useState(2);
    const [showResultDetail, setShowResultDetail] = useState(false);
    const inputRef = useRef(null);
    const reactAlert = useAlert();

    const description = '画像を使用して顔検出を行います。\n' +
        '検出された顔画像はダウンロードが可能です。\n画像は顔認証に使用できます。\n' +
        'このサービスで使用されているモデルは~から実際に搭載されているものです。'
    const caution = '画像はサーバに保存していません。\n気軽にお試しください。'
    const createImageList = (fileName, bboxes) => {
        var array = [];
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
                        var obj = { title: `${array.length}`, img: val, certainty: item['certainty'] };
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

    const onFileInputChange = (event) => {
        if (typeof (event.target.files[0]) === "undefined") {
            return 0
        }
        setProgress(true);
        setShowResultDetail(false)

        // canvasの取得
        const canvasEle = canvas.current;
        canvasEle.width = canvasEle.clientWidth;
        canvasEle.height = canvasEle.clientHeight;
        ctx = canvasEle.getContext("2d");

        let reader = new FileReader();

        //Read the contents of Image File.
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = function (e) {

            let image = new Image();

            image.src = e.target.result;

            image.onload = function () {
                // 画像の調整
                let compressed = adjustImage(this.height, this.width, canvasEle.height, canvasEle.width)
                new Promise(function (resolve) {
                    canvasEle.width = compressed['width'];
                    canvasEle.height = compressed['height'];
                    ctx.drawImage(image, 0, 0, compressed['width'], compressed['height']);
                    resolve();
                }).then(function (value) {
                    const canvasEle = canvas.current;
                    const json_body = { image: canvasEle.toDataURL("image/png") };
                    axios.post(`${process.env.REACT_APP_SERVER_URL}/api/face_detection/`, json_body)
                        .then(res => {
                            let bboxes = res['data']['bboxes']
                            SetDetectedCount(res['data']['detected_count'])
                            SetInferenceTime(res['data']['predict_time'])
                            new Promise(function (resolve) {
                                createImageList(canvasEle.toDataURL("image/png"), bboxes);
                                resolve();
                            }).then(() => {
                                // 四角形の描画
                                for (let key in bboxes) {
                                    let item = bboxes[key]
                                    ctx.rect(item['upper_left_x'], item['upper_left_y'], item['width'], item['height']);
                                }
                                ctx.strokeStyle = "red";
                                ctx.lineWidth = 2;
                                ctx.stroke();
                                setShowResultDetail(true)
                            }
                            )
                        }).catch(error => {
                            reactAlert.error('顔検出に失敗しました。');
                        }).finally(() => {
                            setProgress(false);
                        });
                });
            };
        };

    };

    return (
        <Box sx={{ boxSizing: 'border-box', minHeight: '90%' }}>
            <Box>
                <LeftDescriptionDrawer description={description} caution={caution}/>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} className={'drop'} open={progress}>
                    <CircularProgress color="primary" size={100} />
                </Backdrop>
                <Box sx={{ display: 'flex', flexDirection: 'column' }} height={600} pt={1} m={1}>
                    <Box sx={{ position: 'relative', display: 'inline-block' }} mb={1}>
                        <canvas ref={canvas} className='canvas' />
                        <Button
                            sx={{ position: 'absolute', bottom: 10, right: 10 }}
                            type="submit"
                            variant="contained"
                            endIcon={<SendIcon />}
                            onClick={() => { inputRef.current.click(); }}>
                            画像を送信
                        </Button>
                        <HiddenInput onFileInputChange={onFileInputChange} ref={inputRef} />
                    </Box>
                    <Box sx={{ border: '1px solid black', borderRadius: 2, height: 150 }} p={2}>
                        <Typography variant="h5" sx={{ fontFamily: 'Zen Kaku Gothic New', textDecoration: 'underline' }}>
                            検出結果詳細
                        </Typography>
                        {showResultDetail && <React.Fragment>
                            <Typography variant="h6" sx={{ margin: 1, overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                                検出数：{detectedCount}
                            </Typography>
                            <Typography variant="h6" sx={{ margin: 1, overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                                処理時間：{inferenceTime}（秒）
                            </Typography>
                        </React.Fragment>
                        }
                    </Box>
                </Box>
                <Box sx={{ border: '1px solid black', borderRadius: 2, width: '50%', overflowY: 'scroll', height: 600 }} pt={1} pl={2} m={1}>
                    <Typography variant="h5" sx={{ fontFamily: 'Zen Kaku Gothic New', textDecoration: 'underline' }}>
                        検出画像
                    </Typography>
                    {showResultDetail &&
                        <Box sx={{ display: 'flex', p: 1, m: 1, flexWrap: 'wrap' }}>
                            {itemData?.map((item, index) => (
                                <CroppedFace key={index} based64={item.img} index={item.title} certainty={item.certainty} />
                            ))}
                        </Box>
                    }
                </Box>
            </Box>
        </Box>
    )
}
