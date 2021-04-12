import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import moment from "moment";
import data from "./data.json";
import dataModule from "highcharts/modules/data";
import exportingModule from "highcharts/modules/exporting";
import indicators from "highcharts/indicators/indicators";
import ema from "highcharts/indicators/ema";
import apo from "highcharts/indicators/apo";
import stochastic from "highcharts/indicators/stochastic";
import "bootstrap/dist/css/bootstrap.min.css";

// binding with highcharts
dataModule(Highcharts);
exportingModule(Highcharts);
indicators(Highcharts);
ema(Highcharts);
apo(Highcharts);
stochastic(Highcharts);

const Today = moment("2020-6-15");
const initJSON = {
  rangeSelector: {
    enabled: true,
    selector: 5,
  },

  title: {
    text: "AAPL Stock Price",
  },

  legend: {
    enabled: true,
  },

  yAxis: [
    {
      height: "55%",
    },
    {
      height: "40%",
      top: "60%",
    },
  ],

  plotOptions: {
    series: {
      showInLegend: false,
      marker: {
        enabled: false,
      },
      colors: ["#E13531", "#60DAC4", "yellow", "orange", "grey"],
    },
  },

  chart: {
    backgroundColor: "#021220",
  },
  exporting: {
    enabled: false,
  },
  credits: {
    enabled: false,
  },
  // colors: ["#E13531", "#60DAC4", "yellow", "orange", "grey"],
  series: [
    {
      type: "candlestick",
      id: "aapl",
      name: "Apple Stock Price",
      data: data.filter((x, i) => i < 50),
      color: "#60DAC4",
    },
    {
      type: "sma",
      linkedTo: "aapl",
      radius: 0.1,
    },
  ],
};
export default () => {
  const [chartData, setchartData] = useState(null);
  const [stoShow, setstoShow] = useState("hide"); //
  const [daterange, setdaterange] = useState("2year"); //
  const [selectedMAvg, setselectedMAvg] = useState(25); //

  const [resSupport, setresSupport] = useState([]);

  useEffect(() => {
    console.log("stoShow, daterange, selectedMAvg: ", stoShow, daterange, selectedMAvg);
    let _result = { ...initJSON };

    //stoShow
    console.log("_result.series bef: ", _result.series);
    _result.series =
      stoShow === "show"
        ? [
            ...initJSON.series,
            {
              type: "stochastic",
              linkedTo: "aapl",
              yAxis: 1,
              color: "red",
              lineWidth: 1,
            },
          ]
        : initJSON.series;

    // daterange : filter daterange

    // selectedMAvg
    _result.series[1]["cropThreshold"] = selectedMAvg;

    console.log("_result: ", _result);
    setchartData(null);
    setTimeout(() => {
      setchartData(_result);
    }, 10);
  }, [stoShow, daterange, selectedMAvg]);

  return (
    <div className="bg-021220 p-2">
      <div className="row">
        <div className="col-md-2">
          <select className="mx-2 p-2 w-100" onChange={(e) => setdaterange(e.target.value)} value={daterange}>
            <option value="month">Month</option>
            <option value="quarter">Quarter</option>
            <option value="6months">6 Months</option>
            <option value="1year">1 Year</option>
            <option value="2year">2 Year</option>
          </select>
        </div>
        <div className="col-md-2">
          <select className="mx-2 p-2 w-100" onChange={(e) => setstoShow(e.target.value)} value={stoShow}>
            <option value="hide">STO Hide</option>
            <option value="show">STO Show</option>
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="mx-2 p-2 w-100"
            multiple
            onChange={(e) => {
              console.log("e.target.value: ", e.target.value);
              setresSupport([...resSupport, e.target.value]);
            }}
            value={resSupport}
          >
            <option value="r1">R1</option>
            <option value="r2">R2</option>
            <option value="s1">S1</option>
            <option value="s2">S2</option>
          </select>
        </div>
        <div className="col-md-2">
          <select className="mx-2 p-2 w-100" onChange={(e) => setselectedMAvg(e.target.value)} value={selectedMAvg}>
            <option value="25">25 days MA</option>
            <option value="50">50 days MA</option>
            <option value="100">100 days MA</option>
            <option value="200">200 days MA</option>
          </select>
        </div>
      </div>
      <div className="row">
        {resSupport.find((x) => x === "r1") && (
          <div className="col-md-2 mx-2 text-light">
            <strong>R1:</strong> $20,000
          </div>
        )}
        {resSupport.find((x) => x === "r2") && (
          <div className="col-md-2 mx-2 text-light">
            <strong>R2:</strong> $15,000
          </div>
        )}
        {resSupport.find((x) => x === "s1") && (
          <div className="col-md-2 mx-2 text-light">
            <strong>S1:</strong> $22,000
          </div>
        )}
        {resSupport.find((x) => x === "s2") && (
          <div className="col-md-2 mx-2 text-light">
            <strong>S2:</strong> $12,000
          </div>
        )}
      </div>
      <div className="row">
        {chartData ? (
          <div className="col-md-12">
            <HighchartsReact highcharts={Highcharts} options={{ ...chartData }} constructorType={"stockChart"} />
          </div>
        ) : (
          <div className="bg-021220 loader"></div>
        )}
      </div>
    </div>
  );
};

// render(<LineChart />, document.getElementById("root"));
