import React from 'react'
import './css/InfoBox.css';
import { Card, CardContent, Typography } from '@material-ui/core'

function InfoBox({ title, cases, active, isRed, isPurple, total, ...props }) {
  
    return (
        <Card onClick={props.onClick} className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'}
        ${isPurple && active && 'infoBox--purple'}
        `}>
            <CardContent>
                <Typography color="textSecondary" className="infoBox__title">
                    {title}
                </Typography>
                <h2 className={`infoBox__cases ${ !isRed && "infoBox__cases--green"} ${ isPurple && "infoBox__cases--purple"}`}>{cases}</h2>
                <Typography color="textSecondary" className="infoBox__cases">
                    {total} Total
                </Typography>                
            </CardContent>
        </Card>
    )
}

export default InfoBox
