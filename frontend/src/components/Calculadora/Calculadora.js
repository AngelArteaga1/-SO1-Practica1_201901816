import './Calculadora.css';
import React from "react";
import { Fragment, useState } from 'react';
import api_host from "../conf/creds";
import { BrowserRouter as Router, Routes, Route, Link, Redirect, BrowserRouter } from 'react-router-dom';


const Calculadora = () => {

  const [datos, setDatos] = useState({
    consolita: ''
  })

  const handleInputChange = (event) => {
    setDatos({
      ...datos,
      [event.target.name]: event.target.value
    })
  }

  const concatenate = (event) => {
    document.getElementById("consolita").value += event.target.value
    datos.consolita = datos.consolita + event.target.value
  }

  const deleteKey = (event) => {
    let value = document.getElementById("consolita").value.slice(0, -1)
    console.log(value)
    document.getElementById("consolita").value = value
    datos.consolita = value
  }


  const calcular = async (event) => {
    var left
    var operator
    var right
    if (datos.consolita.includes("+")) {
      let arr = datos.consolita.split("+")
      left = Number(arr[0])
      operator = "+"
      right = Number(arr[1])
    } else if (datos.consolita.includes("-")) {
      let arr = datos.consolita.split("-")
      left = Number(arr[0])
      operator = "-"
      right = Number(arr[1])
    } else if (datos.consolita.includes("*")) {
      let arr = datos.consolita.split("*")
      left = Number(arr[0])
      operator = "*"
      right = Number(arr[1])
    } else if (datos.consolita.includes("/")) {
      let arr = datos.consolita.split("/")
      left = Number(arr[0])
      operator = "/"
      right = Number(arr[1])
    }
    const respuesta = await guardar(left, operator, right)
    if (respuesta === 0) {
      return 0
    }
    console.log(respuesta.result)
    document.getElementById("consolita").value = respuesta.result
    datos.consolita = respuesta.result
  }


  const guardar = async (left, operator, right) => {
    if (datos.consolita === "") {
      return 0;
    }
    const body = {
      left: left,
      operator: operator,
      right: right
    };
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    };
    const response = await fetch(`${api_host}/addOperation`, requestOptions)
    const json = await response.json()
    return json
  }

  return (
    <Fragment>
      <h1>DockerCalc</h1>
      <div className="container">
        <input type="text" className="result" name='consolita' id="consolita" onChange={handleInputChange}></input>
        <div className="second-row">
          <input type="button" name="" value="7" className="global" onClick={concatenate}></input>
          <input type="button" name="" value="8" className="global" onClick={concatenate}></input>
          <input type="button" name="" value="9" className="global" onClick={concatenate}></input>
          <input type="button" name="" value="/" className="global" onClick={concatenate}></input>
        </div>
        <div className="third-row">
          <input type="button" name="" value="4" className="global" onClick={concatenate}></input>
          <input type="button" name="" value="5" className="global" onClick={concatenate}></input>
          <input type="button" name="" value="6" className="global" onClick={concatenate}></input>
          <input type="button" name="" value="*" className="global" onClick={concatenate}></input>
        </div>
        <div className="fourth-row">
          <input type="button" name="" value="1" className="global" onClick={concatenate}></input>
          <input type="button" name="" value="2" className="global" onClick={concatenate}></input>
          <input type="button" name="" value="3" className="global" onClick={concatenate}></input>
          <input type="button" name="" value="-" className="global" onClick={concatenate}></input>
        </div>
        <div className="conflict">
          <div className="left">
            <input type="button" name="" value="0" className=" big" onClick={concatenate}></input>
            <input type="button" name="" value="." className=" small" onClick={concatenate}></input>
            <input type="button" name="" value="Del" className=" red small white-text top-margin" onClick={deleteKey}></input>
            <input type="button"
              name=""
              value="="
              className=" green white-text big top-margin"
              onClick={calcular}></input>
          </div>
          <div className="right">
            <input type="button" name="" value="+" className="global grey plus" onClick={concatenate}></input>
          </div>
        </div>
      </div>
      <Link
                className="App-link"
                to = "/Listado"
                >
                    View operations
                </Link>
    </Fragment>
  );
}

export default Calculadora;