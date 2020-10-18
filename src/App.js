import React, { useState, useEffect } from 'react';
import { MenuItem, FormControl, Select } from "@material-ui/core";
import { Card, CardContent, Typography } from '@material-ui/core'
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';
import { sortData } from './util';
import "leaflet/dist/leaflet.css";
import './css/App.css';

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('Worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);

  // Initial load
  useEffect(() => {
    const url = "https://disease.sh/v3/covid-19/all" 

    fetch(url)
    .then(response => response.json())
    .then(data => {

    // Set the selected country data from the API
    setCountryInfo(data);
    })
  }, []);

  // Initialize the country dropdown
  useEffect(() => {
    // async -> send a request, then wait for it. Do something with
    // the returned info

    const getCountriesData = async () => {
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

    getCountriesData();

  }, []);

  const onCountrySelect = async (event) => {
    const countryCode = event.target.value;

    const url = countryCode === 'worldwide' 
            ? "https://disease.sh/v3/covid-19/all" 
            : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    
    await fetch(url)
    .then(response => response.json())
    .then(data => {

      // Set the selected country data from the API
      setCountry(countryCode);
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat,
                    data.countryInfo.long]);
      setMapZoom(4);
                    
    })
  }
  console.log("COUNTRY INFO >>>", countryInfo)

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
            >
            <MenuItem value="Worldwide">Worldwide</MenuItem>
          
              {
                countries.map(country => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
          </div>
          <div className="app__stats">
            <InfoBox title="Coronavirus Cases" total={countryInfo.cases} cases={countryInfo.todayCases} />
            <InfoBox title="Recovered" total={countryInfo.recovered} cases={countryInfo.todayRecovered} />
            <InfoBox title="Deaths" total={countryInfo.deaths} cases={countryInfo.todayDeaths} />
          </div>  
          
          <Map countries={mapCountries} center={mapCenter} zoom={mapZoom}/>

      </div>
   
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide new cases</h3>
          <LineGraph />
        </CardContent>            
      </Card>
    </div>
  );
}

export default App;
