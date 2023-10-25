import { useRef } from "react";
import { Chart } from "react-chartjs-2";
import { Chart as ChartJS, LinearScale, CategoryScale, PointElement, LineElement, Tooltip, LineController, Legend, Filler } from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  zoomPlugin,
  Filler
);

function App() {
  const chartRef = useRef(null);

  const graphData = {
      "time": ["17:26:20","17:26:26","17:26:32","17:26:38","17:26:44","17:26:50","17:26:56","17:27:2","17:27:8","17:27:14","17:27:20"],
      "data": {
      "smoke": [
        "0.00",
        "0.00",
        "0.00",
        "0.10",
        "0.00",
        "0.00",
        "0.00",
        "0.10",
        "0.00",
        "0.00",
        "0.00"
      ],
      "temp": [
        "-10.3",
        "-10.3",
        "-10.5",
        "-10.5",
        "-10.3",
        "-10.4",
        "-10.3",
        "-10.4",
        "-10.3",
        "-10.5",
        "-10.3"
      ],
      "co": [
        "14.0",
        "15.0",
        "14.0",
        "14.0",
        "15.0",
        "14.0",
        "14.0",
        "13.0",
        "14.0",
        "14.0",
        "14.0"
      ],
      "event":[
        "",
        "",
        "error",
        "error",
        "",
        "",
        "",
        "warning",
        "warning",
        "warning",
        "14.0"
      ]
    }  
  }

  const handleResetZoom = () => {
    const chart = chartRef.current;
    if (chart) {
      chart.resetZoom();
    }
  };

  const zoomIn = () => {
    const chart = chartRef.current;
    if (chart) {
      chart.zoom(1.2);
    }
  };

  const zoomOut = () => {
    const chart = chartRef.current;
    if (chart) {
      chart.zoom(0.9);
    }
  };

  let dataset = [];
  dataset.push({
    type: "line",
    label: "Carbon Monoxide",
    data: graphData.data.co,
    backgroundColor: "#2aff00",
    fill: false,
    borderColor: "#2aff00",
    yAxisID: "y",
    label: "Carbon Monoxide [ppm]",
    unit: "ppm",
  });

  dataset.push({
    type: "line",
    label: "Smoke",
    data: graphData.data.smoke,
    backgroundColor: "#00e7ff",
    fill: false,
    borderColor: "#00e7ff",
    yAxisID: "y",
    label: "Smoke [%/m]",
    unit: "%/m",
  });

  dataset.push({
    type: "line",
    label: "Temperature",
    data: graphData.data.temp,
    backgroundColor: "red",
    fill: false,
    borderColor: "red",
    yAxisID: "y1",
    label: "Temperature [°C]",
    unit: "°C",
  });

  let graphOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
          font: {
            size: 13,
            weight: "bold",
            lineHeight: 1.2,
          },
        },
        min: 0,
        max: 10
      },
    },
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
            speed: 0.05,
          },
          pinch: {
            enabled: true,
            speed: 0.05,
          },
          mode: 'xy',
        },
        pan: {
          enabled: true,
          mode: 'xy',
        },
      },
      legend: {
        position: "top",
        align: 'start',
      },
      filler: {
        propagate: false, 
      },
      beforeDatasetsDraw: (chart, args, pluginOptions) => {
        console.log("🚀 ~ file: App.js:208 ~ App ~ chart:", chart);
        const { ctx } = chart;
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.fillRect(0, 100, 100, 100);
        ctx.save();
      }
    },
  }; 

  
  for (let i = 0; i < dataset.length; i++) {
    if (i == 0) {
      graphOptions.scales["y"] = {
        title: {
          display: true,
          text: dataset[i].label,
          font: {
            size: 13,
            weight: "bold",
            lineHeight: 1.2,
          },
        },
        ticks: {
          callback: function (val, index) {
            return val.toFixed(1) + " " + dataset[i].unit;
          },
          count: 16
        },
      };
    } else {
      graphOptions.scales["y" + i] = {
        title: {
          display: true,
          text: dataset[i].label,
          font: {
            size: 13,
            weight: "bold",
            lineHeight: 1.2,
          },
        },
        ticks: {
          callback: function (val, index) {
            return val.toFixed(1) + " " + dataset[i].unit;
          },
          count: 5
        },
      };
    }
  }

  const data = {
    labels: graphData.time,
    datasets: dataset,
  };

  return (
    <div style={{ width: 800 }}>
      <button onClick={zoomIn}>Zoom In</button>
      <button onClick={zoomOut}>Zoom Out</button>
      <button onClick={handleResetZoom}>Reset Zoom</button>
      <Chart
        type="line"
        data={data}
        options={graphOptions}
        ref={chartRef}
      />
    </div>
  );
}

export default App;
