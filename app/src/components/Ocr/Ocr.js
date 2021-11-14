import React, { useRef, useState } from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';
import HiddenInput from '../Common/HiddenInput'
import { useAlert } from "react-alert";
import Backdrop from '@mui/material/Backdrop';
import axios from 'axios'
import LeftDescriptionDrawer from '../Common/LeftDescriptionDrawer';
import { adjustImage } from '../../utils';
import ResultTableItem from './ResultTableItem'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function Ocr() {
    const canvas = useRef();
    let ctx = null;
    const description = '画像を使用して文字認識を行います。\n' +
        'このサービスで使用されているモデルは~から実際に搭載されているものです。'
    const caution = '画像はサーバに保存していません。\n気軽にお試しください。'

    const [progress, setProgress] = useState(false);
    const [itemData, SetItemData] = useState(null);
    const [detectionPredictTime, SetDetectionPredictTime] = useState('');
    const [recognitionPredictTime, SetRecognitionPredictTime] = useState('');
    const [showResultDetail, setShowResultDetail] = useState(false);
    const inputRef = useRef(null);
    const reactAlert = useAlert();

    const createResultList = (fileName, bboxes) => {
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
                        tmpCanvas.width = width;
                        tmpCanvas.height = height;
                        let ctx = tmpCanvas.getContext("2d");
                        ctx.drawImage(clip, parseInt(item['upper_left_x']), parseInt(item['upper_left_y']), parseInt(width), parseInt(height), 0, 0, width, height);
                        resolveSub(tmpCanvas.toDataURL("image/png"));
                    }).then((val) => {
                        var obj = { img: val, text: item['recognition_text'] };
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
        let tmpcanvas = document.createElement('canvas');
        document.body.appendChild(tmpcanvas);

        let tmpctx = tmpcanvas.getContext("2d");

        let reader = new FileReader();
        //Read the contents of Image File.
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = function (e) {

            let image = new Image();

            image.src = e.target.result;
            image.onload = function () {
                let image_width = this.width;
                let image_height = this.height;
                new Promise(function (resolve) {
                    tmpcanvas.width = image_width;
                    tmpcanvas.height = image_height;
                    tmpctx.drawImage(image, 0, 0);
                    resolve();
                }).then(function (value) {
                    const json_body = { is_recognition: true, image: tmpcanvas.toDataURL("image/png") };
                    // axios.post(`${process.env.REACT_APP_SERVER_URL}/api/ocr/`, json_body)
                    axios.post(`${process.env.REACT_APP_SERVER_URL}/api/ocr/`, json_body)
                        .then(res => {
                            const canvasEle = canvas.current;
                            canvasEle.width = canvasEle.clientWidth;
                            canvasEle.height = canvasEle.clientHeight;
                            ctx = canvasEle.getContext("2d");
                            let compressed = adjustImage(image_width, image_height, canvasEle.height, canvasEle.width)
                            canvasEle.width = compressed['width'];
                            canvasEle.height = compressed['height'];

                            ctx.drawImage(image, 0, 0, compressed['width'], compressed['height']);

                            let bboxes = res['data']['bboxes']
                            SetRecognitionPredictTime(res['data']['recognition_predict_time'])
                            SetDetectionPredictTime(res['data']['detection_predict_time'])
                            new Promise(function (resolve) {
                                createResultList(tmpcanvas.toDataURL("image/png"), bboxes);
                                resolve();
                            })
                            setShowResultDetail(true)
                        }).catch(error => {
                            reactAlert.error('検出に失敗しました。');
                        }).finally(() => {
                            setProgress(false);
                        });
                });
            };
        };

        document.body.removeChild(tmpcanvas);

    };

    return (
        <Box sx={{ boxSizing: 'border-box', minHeight: '90%' }}>
            <Box>
                <LeftDescriptionDrawer description={description} caution={caution} />
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
                                検出処理時間：{detectionPredictTime}（秒）
                            </Typography>
                            <Typography variant="h6" sx={{ margin: 1, overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                                認識処理時間：{recognitionPredictTime}（秒）
                            </Typography>
                        </React.Fragment>
                        }
                    </Box>
                </Box>
                <Box sx={{ border: '1px solid black', borderRadius: 2, width: '50%', overflowY: 'scroll', height: 600 }} pt={1} pl={2} m={1}>
                    <Typography variant="h5" sx={{ fontFamily: 'Zen Kaku Gothic New', textDecoration: 'underline' }}>
                        認識結果
                    </Typography>
                    <Box sx={{ display: 'flex', p: 1, m: 1, flexWrap: 'wrap' }}>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>検出領域</TableCell>
                                        <TableCell>認識結果</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {itemData?.map((item, index) => (
                                        <ResultTableItem key={index} index={index} based64={item.img} text={item.text} />
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
