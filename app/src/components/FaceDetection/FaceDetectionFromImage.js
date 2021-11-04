import React, { useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import DescriptionCard from '../Common/DescriptionCard';
import CroppedFace from './CroppedFace'
import HiddenInput from '../Common/HiddenInput'
import axios from 'axios'
import { adjustImage } from '../../utils';


export default function FaceDetectionFromImage() {
    const faceRecognitionSideLength = 112;
    let ctx = null;
    const canvas = useRef();

    const [progress, setProgress] = useState(false);
    const [itemData, SetItemData] = useState(null);
    const [detectedCount, SetDetectedCount] = useState(0);
    const [inferenceTime, SetInferenceTime] = useState(2);
    const [showResultDetail, setShowResultDetail] = useState(false)
    const inputRef = useRef(null);

    const description = '顔検出機能をお試しできるページです。\nリリースノート'

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
                        console.log( item['certainty'])
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
                    axios.post('/api/face_detection/', json_body)
                        .then(res => {
                            console.log(res['data']['bboxes'])
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
                            console.log(error)
                        }).finally(() => {
                            setProgress(false);
                        });
                });
            };
        };

    };

    return (
        <Box sx={{ display: 'flex', m: 2, boxSizing: 'border-box', minHeight: '90%' }}>
            <Box sx={{ minWidth: '18%', mr: 2 }}>
                <DescriptionCard description={description} />
            </Box>
            <Box sx={{ minWidth: '80%', display: 'flex', p: 1 }}>
                <Box sx={{ minWidth: '100%' }}>
                    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} className={'drop'} open={progress}>
                        <CircularProgress color="primary" size={100} />
                    </Backdrop>
                    <Box sx={{ display: 'flex' }} >
                        <Box sx={{ width: '75%', display: 'flex' }}>
                            <Box sx={{ width: 900 }}>
                                <canvas ref={canvas} className='canvas' />
                            </Box>
                            <Box sx={{ position: 'relative', width: '100%' }}>
                                <Button
                                    sx={{ position: 'absolute', bottom: 0, left: 10 }}
                                    type="submit"
                                    color="primary"
                                    variant="contained"
                                    endIcon={<SendIcon />}
                                    onClick={() => { inputRef.current.click(); }}>
                                    画像を送信
                                </Button>
                            </Box>
                            <HiddenInput onFileInputChange={onFileInputChange} ref={inputRef} />
                        </Box>
                        <Box sx={{ p: 2, border: '1px solid black', borderRadius: 2, minWidth: '35%' }}>
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
                    <Box sx={{ border: '1px solid black', borderRadius: 2, p: 1, mt: 1, minHeight: 10 }} >
                        <Typography variant="h6" sx={{ fontFamily: 'Zen Kaku Gothic New', textDecoration: 'underline' }}>
                            検出画像
                        </Typography>
                        {showResultDetail &&
                            <Box sx={{ display: 'flex', flexDirection: 'row', p: 1, m: 1, justifyContent: 'flex-start', overflowX: 'scroll' }}>
                                {itemData?.map((item, index) => (
                                    <CroppedFace key={index} based64={item.img} index={item.title} certainty={item.certainty} />
                                ))}
                            </Box>
                        }
                    </Box>
                </Box>

            </Box>
        </Box>
    )
}
