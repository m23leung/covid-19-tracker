import React from 'react';
import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import numeral from "numeral";

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    mainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function(tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    unit: "month",
                    format: "MM/DD/YY",
                    tooltipFormat: 'll',
                }
            }
        ],
        yAxes: [
            {
                gridLines: {
                    display: false
                },
                ticks: {
                    // Include a dollar sign inside ticks
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    }
                }
            }
        ]
    }
}

function LineGraph( {casesType, country}) {

    const [data, setData] = useState({});
    const [lineColor, setLineColor] = useState("red");

    const getChartData = (data, casesType, country) => {
        const chartData = [];
        let lastDataPoint;
        if (!country) return;
        console.log("COUNTRY: ", country)
        //debugger;
        for (let date in data.cases) {
            if (lastDataPoint) {
                const newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                }
                chartData.push(newDataPoint);
            }
            // Save previous day's cases
            lastDataPoint = data[casesType][date];
        }
        return chartData;
    }

    useEffect(() => {
        
        let url = 'https://disease.sh/v3/covid-19/historical/all?lastdays=120';

        const fetchData = async () => (
            
            await fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log("TIME DATA: ", data);
    
                const chartData = getChartData(data, casesType, country);

                console.log("CHART DATA", chartData);
                setData(chartData);
                if (casesType === 'recovered') {
                    setLineColor("lightgreen");
                } else if (casesType === 'deaths') {
                    setLineColor("purple");
                } else {
                    setLineColor("rgba(204, 16, 52, 0.5)");
                }
            })
        )
        fetchData();
    }, [casesType]);

    useEffect(() => {   
        
        if (country === 'Worldwide') return;

        let url = `https://disease.sh/v3/covid-19/historical/${country}?lastdays=120`;
 
        const fetchData = async () => (
            
            await fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log("TIME DATA: ", data);
                
                debugger;
                data = data.timeline;

                const chartData = getChartData(data, casesType, country);

                console.log("CHART DATA", chartData);
                setData(chartData);
                if (casesType === 'recovered') {
                    setLineColor("lightgreen");
                } else {
                    setLineColor("rgba(204, 16, 52, 0.5)");
                }
            })
        )
        fetchData();
    }, [country]);


    return (
        <div>
            {data?.length > 0 && (
            <Line 
                options = {options}
                data={{
                    datasets: [{
                        backgroundColor: lineColor,
                        borderColor: "#CC1034",
                        data: data }]
            }} />
            )}
        </div>
    )
}

export default LineGraph
