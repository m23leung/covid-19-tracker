import React from 'react';
import { Line } from 'react-chartjs-2';
import './css/LineGraph.css';
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

function LineGraph( casesType='cases ') {

    const [data, setData] = useState({});

    const getChartData = (data, casesType='cases') => {
        const chartData = [];
        let lastDataPoint;

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
        const fetchData = async () => {
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then(response => response.json())
            .then(data => {
                console.log('Data is' , data);
                const chartData = getChartData(data);
                setData(chartData);
            })
        }
        fetchData();
    }, [casesType]);

    return (
        <div className="LineGraph">
            {data?.length > 0 && (
            <Line 
                options = {options}
                data={{
                    datasets: [{
                        backgroundColor: "rgba(204, 16, 52, 0.5)",
                        borderColor: "#CC1034",
                        data: data }]
            }} />
            )}
        </div>
    )
}

export default LineGraph
