import { FormControl, InputLabel } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import React from 'react';


export default function CameraSelector(props) {

    const { deviceId, devices, handleChange } = props

    return (
        <FormControl fullWidth sx={{height:60}}>
            <InputLabel id="camera-select-label">カメラを選択してください</InputLabel>
            <Select
                labelId="camera-select-label"
                id="camera-select"
                value={deviceId}
                label="カメラを選択してください"
                onChange={handleChange}
                width={300}
            >
                {devices.map((device, key) => (
                    <MenuItem key={key} value={device.deviceId}>{device.label}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}
