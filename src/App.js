import React, { useState, useEffect } from 'react';
import { MenuItem, FormControl, Select } from "@material-ui/core";
import { Card, CardContent, Typography } from '@material-ui/core'
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';
import { sortData, prettyPrintStat } from './util';
import "leaflet/dist/leaflet.css";
import './css/App.css';

function App() {

  const allCountries = 'Worldwide';
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(allCountries);
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  const [mapCenter, setMapCenter] = useState([ 34.80746, -40.4796 ]);
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  
  const lookup = require('country-code-lookup')


  // Initial load
  /*
  useEffect(() => {
    const url = "https://disease.sh/v3/covid-19/all" 

    fetch(url)
    .then(response => response.json())
    .then(data => {

    // Set the selected country data from the API
    setCountryInfo(data);
    })
  }, []);
  */

  // Initialize the country dropdown
  useEffect(() => {
    // async -> send a request, then wait for it. Do something with
    // the returned info
  
    const getCountryData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, // Ex: United States
            value: country.countryInfo.iso2 // Ex: USA
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);

        })
    }

    const setDefaultLocation = () => {

       fetch('https://extreme-ip-lookup.com/json/')
       .then( res => res.json())
       .then(response => {
           console.log("Country: ", response.country);
           setCountry(response.country);

           const countryCode = lookup.byCountry(response.country).iso2;
           setCountry(countryCode);
           updateData(countryCode);
        })
        .catch((data, status) => {
           console.log('Request failed');
        })
    }

    // Get Global Country Data
    getCountryData();

    // Set the current location
    setDefaultLocation();

  }, []);

  const updateData = async (countryCode) => {
    console.log("SELECTED", countryCode);
    const url = countryCode === allCountries 
            ? "https://disease.sh/v3/covid-19/all" 
            : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    
    await fetch(url)
    .then(response => response.json())
    .then(data => {

      // Set the selected country data from the API

      setCountry(countryCode);
      console.log(data);
      setCountryInfo(data);
      setMapZoom(3);
      
      if ( countryCode === allCountries ) {
       setMapCenter([34.80746, -40.4796])
       return;
      }
      else { 
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      }    
  }
    )}

  const onCountrySelect = async (event) => {
    
    const countryCode = event.target.value;
  
    //alert($("Select:MenuItem").text());
    updateData(countryCode);

  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">

          <h1>COVID-19 TRACKER</h1>

          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}    
              onChange={onCountrySelect}    
              id="appDropdown"    
            >
            <MenuItem value={allCountries}>{allCountries}</MenuItem>
          
              {
                countries.map(country => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
          </div> 
          <div className="app__stats">
            <InfoBox 
            isRed
            active={casesType === "cases"} onClick={ e => setCasesType('cases')} title="Daily Cases" total={prettyPrintStat(countryInfo.cases)} cases={prettyPrintStat(countryInfo.todayCases)} />
            <InfoBox 
            active={casesType === "recovered"} onClick={ e => setCasesType('recovered')}  title="Daily Recovered" total={prettyPrintStat(countryInfo.recovered)} cases={prettyPrintStat(countryInfo.todayRecovered)} />
            <InfoBox 
            isPurple
            active={casesType === "deaths"}
             onClick={ e => setCasesType('deaths')}  title="Daily Deaths" total={prettyPrintStat(countryInfo.deaths)} cases={prettyPrintStat(countryInfo.todayDeaths)} />
          </div>  
          
          <Map casesType={casesType} 
               countries={mapCountries} 
               country={country}
               center={mapCenter} 
               zoom={mapZoom}/>

            <Card className="app__bottom">
              <CardContent>
                <h3 className="app__graphTitle"><strong> {country} - Daily {casesType}</strong></h3>
                <LineGraph className="app_graph" casesType={casesType} country={country}/>
              </CardContent>
            </Card>

      </div>
   
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3><strong>Live Cases by Country</strong></h3>
            <Table countries={tableData} />
            <h3 className="app__graphTitle"><strong>Worldwide new {casesType}</strong></h3>
            <LineGraph className="app_graph" casesType={casesType}/>
          </div>
        </CardContent>            
      </Card>
    </div>
  );
}

export default App;
