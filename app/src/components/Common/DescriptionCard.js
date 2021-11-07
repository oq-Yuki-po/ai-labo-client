import React from 'react'
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export default function DescriptionCard(props) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h5"
                    sx={{
                        fontFamily: 'Zen Kaku Gothic New',
                        textDecoration: 'underline'
                    }}>
                    説明
                </Typography>
                <Typography variant="body1"  sx={{ margin: 1, overflowWrap: 'break-word', whiteSpace: 'pre-wrap'}}>
                    {props.description}
                </Typography>
                <Typography variant="body2" color='red' sx={{ margin: 1, overflowWrap: 'break-word', whiteSpace: 'pre-wrap'}}>
                    {props.caution}
                </Typography>
            </CardContent>
        </Card>
    )
}
