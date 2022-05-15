import React from "react";
import "./Table.css";
import numeral from "numeral";

function TableDeaths({ countries }) {
    return (
        <div className="table">
            {countries.map((country) => (
                <tr>
                    <td>{country.country}</td>
                    <td>
                    <strong>{numeral(country.deaths).format("0,0")}</strong>
                    </td>
                </tr>
        ))}
    </div>
);
}

export default TableDeaths;
