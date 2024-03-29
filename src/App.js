import React, { useState, useEffect } from "react";
import "./App.css";
import {MenuItem,FormControl,Select,Card,CardContent,} from "@material-ui/core";
import InfoBox from "./InfoBox";
import LineGraphCase from "./LineGraphCase";
import LineGraphDeath from './LineGraphDeath';
import Table from "./Table";
import { sortData, prettyPrintStat,sortData_De,sortData_Re } from "./util";
import numeral from "numeral";
import Map from "./Map";
import "leaflet/dist/leaflet.css";

import TableDeaths from "./TableDeaths";
import TableRecover from "./TableRecover";

const App = () => {
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [casesNew, setCasesNew] = useState("cases");
  const [casesDeath, setCasesDeath] = useState("deaths");
  const [casesRecovered, setcasesRecovered] = useState("recovered");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [tableDeathData, setDeathData] = useState([]);
  const [tableRecoveredData, setTableRecoveredData] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);
  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          let sortedData_D=sortData_De(data);
          let sortedData_R=sortData_Re(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
          setDeathData(sortedData_D);
          setTableRecoveredData(sortedData_R);
          console.log(sortedData_R);
        });
    };
    getCountriesData();
  }, []);



  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div>
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
    <div className="app__detail">
      <Card className="app__information">
        <CardContent >
          <div>
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3>Worldwide new {casesNew}</h3>
            <LineGraphCase casesType={casesNew} />
          </div>
        </CardContent>
      </Card>
      <Card className="app__information">
        <CardContent>
          <div>
            <h3>Live Death Cases</h3>
            <TableDeaths countries={tableDeathData} />
            <h3>Worldwide new {casesRecovered}</h3>
            <LineGraphDeath casesType={casesRecovered } />
          </div>
        </CardContent>
      </Card>
      <Card className="app__information">
        <CardContent>
          <div>
            <h3>Live Recovered Cases</h3>
            <TableRecover countries={tableRecoveredData} />
            <h3>Worldwide new {casesDeath }</h3>
            <LineGraphCase casesType={casesDeath} isRed />
          </div>
        </CardContent>
      </Card>
      </div>
      </div>
    </div>
  );
};

export default App;
