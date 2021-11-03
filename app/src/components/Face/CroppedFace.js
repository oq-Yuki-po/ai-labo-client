import React from 'react'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export default function CroppedFace(props) {

    const download = (uri, filename) => {
        const downloadLink = document.createElement("a");

        if (typeof downloadLink.download === "string") {
            downloadLink.href = uri;
            
            // ファイル名
            downloadLink.download = filename;

            // Firefox では body の中にダウンロードリンクがないといけないので一時的に追加
            document.body.appendChild(downloadLink);

            // ダウンロードリンクが設定された a タグをクリック
            downloadLink.click();

            // Firefox 対策で追加したリンクを削除しておく
            document.body.removeChild(downloadLink);
        } else {
            window.open(uri);
        }
    }

    return (
        <Box textAlign="center" sx={{ m: 1 ,minWidth:140}}>
            <img src={props.based64} alt={props.index} />
            <Typography variant="h6">確信度:{parseInt(props.certainty * 100)}%</Typography>
            <Button variant="outlined" size='small' startIcon={<FileDownloadIcon />} onClick={() => download(props.based64, props.index)}>
                ダウンロード
            </Button>
        </Box>
    )
}
