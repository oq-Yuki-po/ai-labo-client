import React, { useRef, forwardRef, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import DescriptionCard from '../Common/DescriptionCard';

const HiddenInput = forwardRef(
    ({ onFileInputChange }, inputRef) => {
        return (
            <input
                hidden
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={onFileInputChange}
            />
        );
    });
//left-lower,right-lower,right-upper,left-upper
const resultData = [
    [[0, 100], [100, 100], [100, 0], [0, 0]],
    [[60, 250], [110, 250], [110, 200], [60, 200]],
    [[250, 250], [350, 250], [250, 150], [350, 150]],
];

export default function Face() {
    const faceRecognitionSideLength = 112;
    const LOWER_LEFT = 0, LOWER_RIGHT = 1, UPPER_RIGHT = 2, UPPER_LEFT = 3;
    const X = 0, Y = 1;
    let ctx = null;
    const canvas = useRef();

    const [progress, setProgress] = useState(false);
    const [itemData, SetItemData] = useState(null);
    const [detectedCount, SetdetectedCount] = useState(0);
    const [inferenceTime, SetInferenceTime] = useState(2);
    const [showResultDetail, setShowResultDetail] = useState(false)
    const inputRef = useRef(null);

    const description = '顔認証機能をお試しできるページです。\nリリースノート'

    const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const createImageList = (fileName) => {
        SetdetectedCount(resultData.length);
        var array = [];
        let promises = [];

        for (let key in resultData) {

            let item = resultData[key];
            let max_x = Math.max(item[LOWER_LEFT][X], item[LOWER_RIGHT][X], item[UPPER_RIGHT][X], item[UPPER_LEFT][X])
            let min_x = Math.min(item[LOWER_LEFT][X], item[LOWER_RIGHT][X], item[UPPER_RIGHT][X], item[UPPER_LEFT][X])

            let max_y = Math.max(item[LOWER_LEFT][Y], item[LOWER_RIGHT][Y], item[UPPER_RIGHT][Y], item[UPPER_LEFT][Y])
            let min_y = Math.min(item[LOWER_LEFT][Y], item[LOWER_RIGHT][Y], item[UPPER_RIGHT][Y], item[UPPER_LEFT][Y])

            let height = max_y - min_y
            let width = max_x - min_x

            let clip = new Image();

            clip.src = fileName;
            console.log(clip)
            promises.push(new Promise((resolve) => {
                clip.onload = function () {
                    console.log(this.height, this.width)

                    let promiseSub = new Promise((resolveSub) => {
                        let tmpCanvas = document.createElement('canvas');
                        tmpCanvas.width = width;
                        tmpCanvas.height = height;
                        let ctx = tmpCanvas.getContext("2d");
                        ctx.drawImage(clip, parseInt(min_x), parseInt(min_y), parseInt(width), parseInt(height),
                            0, 0, parseInt(width), parseInt(height));
                        resolveSub(tmpCanvas.toDataURL("image/png"));
                    }).then((val) => {
                        var obj = { title: `${array.length}`, img: val };
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

            //Initiate the JavaScript Image object.
            let image = new Image();

            //Set the Base64 string return from FileReader as source.
            image.src = e.target.result;

            //Validate the File Height and Width.
            image.onload = function () {
                // 画像のサイズ
                const image_height = this.height;
                const image_width = this.width;
                const image_ratio = image_height / image_width;

                // canvasのサイズ
                const canvas_width = canvasEle.width;
                const canvas_height = canvasEle.height;
                const canvas_ratio = canvasEle.height / canvasEle.width;

                // 圧縮後のサイズ
                let compressed_height
                let compressed_width
                let compressed_ration

                if (image_ratio <= canvas_ratio) {
                    compressed_width = canvas_width;
                    compressed_ration = canvas_width / image_width;
                    compressed_height = compressed_ration * image_height;
                }
                else {
                    compressed_height = canvas_height;
                    compressed_ration = canvas_height / image_height;
                    compressed_width = compressed_ration * image_width;
                }

                compressed_height = parseInt(compressed_height)
                compressed_width = parseInt(compressed_width)

                ctx.drawImage(image, 0, 0, compressed_width, compressed_height);
            };
        };

        asyncCall();
    };

    async function asyncCall() {
        await _sleep(2000);
        setProgress(false);

        const canvasEle = canvas.current;
        createImageList(canvasEle.toDataURL("image/png"));
        
        // 四角形の描画
        for (let key in resultData) {
            let item = resultData[key]

            let max_x = Math.max(item[LOWER_LEFT][X], item[LOWER_RIGHT][X], item[UPPER_RIGHT][X], item[UPPER_LEFT][X])
            let min_x = Math.min(item[LOWER_LEFT][X], item[LOWER_RIGHT][X], item[UPPER_RIGHT][X], item[UPPER_LEFT][X])

            let max_y = Math.max(item[LOWER_LEFT][Y], item[LOWER_RIGHT][Y], item[UPPER_RIGHT][Y], item[UPPER_LEFT][Y])
            let min_y = Math.min(item[LOWER_LEFT][Y], item[LOWER_RIGHT][Y], item[UPPER_RIGHT][Y], item[UPPER_LEFT][Y])

            let height = max_y - min_y
            let width = max_x - min_x
            ctx.rect(min_x, min_y, width, height);
        }

        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.stroke();
        setShowResultDetail(true)
    };
    const fileUpload = () => {
        inputRef.current.click();
    };
    return (
        <Box sx={{ display: 'flex', m: 2, boxSizing: 'border-box', minHeight: '90%' }}>
            <Box sx={{ minWidth: '18%', mr: 2 }}>
                <DescriptionCard description={description} />
            </Box>
            <Box sx={{ minWidth: '80%', display: 'flex', border: '1px solid black', p: 1, borderRadius: 2 }}>
                <Box sx={{ minWidth: '100%' }}>
                    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} className={'drop'} open={progress}>
                        <CircularProgress color="primary" size={100} />
                    </Backdrop>
                    <Box sx={{ display: 'flex' }} >
                        <Box sx={{ position: 'relative', width: 1000 }}>
                            <canvas ref={canvas} className='canvas'>
                            </canvas>
                            <Button
                                sx={{ position: 'absolute', bottom: 0, right: 0 }}
                                type="submit"
                                color="primary"
                                variant="contained"
                                endIcon={<SendIcon />}
                                onClick={fileUpload}>
                                画像を送信
                            </Button>
                            <HiddenInput onFileInputChange={onFileInputChange} ref={inputRef} />
                        </Box>
                        <Box sx={{ ml: 2 }}>
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
                    <Box sx={{ border: '1px solid black', borderRadius: 2, p: 1, mt: 1, minHeight: 330 }} >
                        <Typography variant="h6" sx={{ fontFamily: 'Zen Kaku Gothic New', textDecoration: 'underline' }}>
                            検出画像
                        </Typography>
                        <ImageList variant="standard" rows={1} cols={detectedCount} sx={{ width: detectedCount * 150, height: 200 }} >
                            {itemData?.map((item) => (
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    loading="lazy"
                                    width={faceRecognitionSideLength}
                                    height={faceRecognitionSideLength}
                                />
                                // <ImageListItem key={item.img} rows={1} cols={1} >
                                //     {<img
                                //         src={item.img}
                                //         alt={item.title}
                                //         loading="lazy"
                                //         width={faceRecognitionSideLength}
                                //         height={faceRecognitionSideLength}
                                //     />}
                                // </ImageListItem>
                            ))}
                        </ImageList>
                    </Box>
                </Box>

            </Box>
        </Box>
    )
}
