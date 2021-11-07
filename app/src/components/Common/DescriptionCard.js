import React from 'react'
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

export default function DescriptionCard(props) {
    const desc = props.descriptions;
    
    const genelateText = (description, tips) => {

        if(tips === null || tips.lenght === 0)
            return description;

        let list = [];


        let matchedIndex = -1;
        do{
            let first = description.length;
            matchedIndex = -1;
            for(let i = 0; i < tips.length; i++)
            {
                let index = description.indexOf(tips[i].text);
                if(index !== -1 && index < first)
                {
                    first = index;
                    matchedIndex = i;
                }
            }
            
            if(first !== 0)
            {
                list.push(description.slice(0,first -1))
            }
            if(matchedIndex !== -1)
            {
                list.push(<Tooltip title={tips.description} arrow><Button variant="text" m={0} p={0}>{tips.text}</Button></Tooltip>);
                description.substring(0,tips.text.length + first);
            }
        }while(matchedIndex !== -1);
        
        if(description.length > 0)
            list.push(description);

        return list;
    }

    return (
        <Card>
            <CardContent>
                {desc.map((data) => (
                    <React.Fragment>
                        <Typography variant="h5"
                        sx={{
                            fontFamily: 'Zen Kaku Gothic New',
                            textDecoration: 'underline'
                        }}>
                        {data.title}
                        </Typography>
                        <Typography variant="body2" sx={{ margin: 1, overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                            {genelateText(data.description,data.tips)}
                        </Typography>
                    </React.Fragment>
                ))}
            </CardContent>
        </Card>
    )
}
