import "./Listado.css"
import React, { useEffect, useState } from "react";
import api_host from "../conf/creds";
import { BrowserRouter as Router, Routes, Route, Link, Redirect, BrowserRouter } from 'react-router-dom';

const Listado = (props) => {
    const { classes } = props;

    const [records, setRecords] = useState([])

    useEffect(() => {
        const timer = setInterval(() => {
            getRecords();
        }, 3000);

        getRecords();

        return () => {
            clearInterval(timer);
        }
    }, []);

    const getRecords = async() => {
        let recordsList = await request()
        setRecords(recordsList)
        console.log(recordsList)
    }

    const request = async () => {
        const requestOptions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        };
        const response = await fetch(`${api_host}/showOperations`, requestOptions)
        const json = await response.json()
        return json
      }
    
    return (
        <div>
            <h1>Operaciones Realizadas</h1>
            <div className="limiter">
                <div className="container-table100">
                    <div className="wrap-table100">
                        <div className="table100">
                            <table>
                                <thead>
                                    <tr className="table100-head">
                                        <th className="column1">Fecha</th>
                                        <th className="column2">Numero 1</th>
                                        <th className="column3">Operacion</th>
                                        <th className="column4">Numero 2</th>
                                        <th className="column5">Resultado</th>
                                        <th className="column6">No</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map((row,index) => (
                                        <tr>
                                            <td className="column1">{row.date}</td>
                                            <td className="column2">{row.left}</td>
                                            <td className="column3">{row.operator}</td>
                                            <td className="column4">{row.right}</td>
                                            <td className="column5">{row.result}</td>
                                            <td className="column6">{index}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
                <Link
                className="App-link"
                to = "/"
                >
                    View DockerCalc
                </Link>
        </div>
    );
}
export default Listado;