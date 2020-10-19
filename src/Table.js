import React from 'react';
import numeral from "numeral";
import './css/Table.css';

function Table( { countries, setCountry }) {
    return (
        
        <div className="table">
        
            {countries.map(({country, cases}) => (
                <tr>
                    <td><div className="table__countryBox" onClick={e => setCountry(country)}>{country}</div></td>
                    <td><strong>{numeral(cases).format("0,0")}</strong></td>
                </tr>
            ))}
        </div>
    )
}

export default Table