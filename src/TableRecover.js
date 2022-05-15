import React from 'react'
import "./Table.css";
import numeral from "numeral";

function TableRecover({ countries }) {
    return (
    <div className="table">
    {countries.map((country) => (
        <tr>
            <td>{country.country}</td>
            <td>
                <strong>{numeral(country.recovered).format("0,0")}</strong>
            </td>
        </tr>
        ))}
    </div>
    )
}

export default TableRecover
