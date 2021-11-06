import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import LeftDescriptionDrawer from '../Common/LeftDescriptionDrawer';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import UploadFace from './UploadFace'
import SendIcon from '@mui/icons-material/Send';
import { useAlert } from "react-alert";
import axios from 'axios'

export default function FaceRecognition() {

    const description = '顔認証機能をお試しできるページです。\nリリースノート'
    const faceRecognitionSideLength = 112;
    const [similarity, SetSimilarity] = useState(0);
    const [inferenceTime, SetInferenceTime] = useState(0);
    const [showResultDetail, setShowResultDetail] = useState(false);
    const reactAlert = useAlert();

    const onFileInputChangeCore = (event, setter) => {
        if (typeof (event.target.files[0]) === "undefined") {
            return 0
        }

        setShowResultDetail(false)

        let reader = new FileReader();

        //Read the contents of Image File.
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = function (e) {
            let image = new Image();

            image.src = e.target.result;

            image.onload = function () {
                new Promise(function (resolve) {
                    let tmpCanvas = document.createElement('canvas');
                    tmpCanvas.width = faceRecognitionSideLength;
                    tmpCanvas.height = faceRecognitionSideLength;
                    let ctx = tmpCanvas.getContext("2d");
                    ctx.drawImage(image, 0, 0, faceRecognitionSideLength, faceRecognitionSideLength);
                    resolve(tmpCanvas.toDataURL("image/png"));
                }).then(function (value) {
                    setter(value);
                })
            }
        }
    }
    const onFileInputChangeLeft = (event) => {
        onFileInputChangeCore(event, SetLeftFace);

    }
    const onFileInputChangeRight = (event) => {
        onFileInputChangeCore(event, SetRightFace);
    }
    const [progress, setProgress] = useState(false);
    const [leftFace, SetLeftFace] = useState("");
    const [rightFace, SetRightFace] = useState("");

    const onSubmit = () => {
        if (leftFace === "" || rightFace === "") {
            reactAlert.error('画像が選択されていません。');
            return;
        }

        setProgress(true);
        const json_body = {
            image_01: leftFace,
            image_02: rightFace
        };
        axios.post('http://localhost:8000/api/face_similarity/', json_body)
            .then(res => {
                SetSimilarity(res['data']['similarity'])
                SetInferenceTime(res['data']['predict_time'])
                setShowResultDetail(true)
            }).catch(error => {
                reactAlert.error('解析に失敗しました。' + error.response);
            }).finally(() => {
                setProgress(false);
            });
    }

    return (
        <Box sx={{ boxSizing: 'border-box', minHeight: '90%' }}>
            <Box>
                <LeftDescriptionDrawer description={description} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center'}} height={500}>
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} className={'drop'} open={progress}>
                    <CircularProgress color="primary" size={100} />
                </Backdrop>
                <Box  m={1}>
                    <Box sx={{ display: 'flex', p: 1, borderRadius: 2, flexDirection: 'column' }} justify="center" height={400}>
                        <Box sx={{ display: 'flex', border: '1px solid black', p: 1, borderRadius: 2, position: 'relative' }} justify="center" >
                            <UploadFace based64={leftFace} title="Left" onFileInputChange={onFileInputChangeLeft} size={faceRecognitionSideLength} boxSize={150} />
                            <UploadFace based64={rightFace} title="Right" onFileInputChange={onFileInputChangeRight} size={faceRecognitionSideLength} boxSize={150} />
                            <Button
                                variant="contained"
                                size="large"
                                sx={{ position: 'absolute', bottom: 10, right: 10 }}
                                endIcon={<SendIcon />}
                                onClick={() => { onSubmit(); }}>
                                送信
                            </Button>
                        </Box>

                    </Box>

                </Box>
                <Box sx={{ border: '1px solid black', borderRadius: 2, height: 300, width:250 }} p={2} m={2}>
                    <Typography variant="h5" sx={{ fontFamily: 'Zen Kaku Gothic New', textDecoration: 'underline' }}>
                        解析結果詳細
                    </Typography>
                    {showResultDetail && <React.Fragment>
                        <Typography variant="h6" sx={{ margin: 1, overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                            類似度：{similarity} %
                        </Typography>
                        <Typography variant="h6" sx={{ margin: 1, overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                            処理時間：{inferenceTime}（秒）
                        </Typography>
                    </React.Fragment>
                    }
                </Box>

            </Box>

        </Box>
    )
}
