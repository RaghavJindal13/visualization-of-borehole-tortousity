// Javascript file which plots the front view of the Graphs

// Declairing global varables
var cal_TVD = [];
var cal_Easting = [];
var cal_Northing = [];

// Adding csv file - its static in nature right now
d3.csv("dataset_planned.csv", function (err, rows) {
  function unpack(rows, key) {
    return rows.map(function (row) {
      return row[key];
    });
  }

  // Reading data from CSV file
  var x = unpack(rows, "Depth");
  var y = unpack(rows, "Inclination");
  var z = unpack(rows, "Azimuth");
  var c = unpack(rows, "color");
  var E = [];
  var N = [];
  var V = [];
  for (var i = 0; i < 45; i++) {
    // calculating the delta MD
    var diff_MD = x[i + 1] - x[i];
    var sur_depth2 = x[i + 1];
    diff_MD = diff_MD.toFixed(7);

    //converting Inclination and Azimuth from degrees to radians
    var inc1 = y[i];
    var Inc1 = inc1 * (Math.PI / 180);
    Inc1 = Inc1.toFixed(7);

    var inc2 = y[i + 1];
    var Inc2 = inc2 * (Math.PI / 180);
    Inc2 = Inc2.toFixed(7);

    var az1 = z[i];
    var Az1 = az1 * (Math.PI / 180);
    Az1 = Az1.toFixed(7);

    var az2 = z[i + 1];
    var Az2 = az2 * (Math.PI / 180);
    Az2 = Az2.toFixed(7);

    //Calculating Dog Leg Sivearity
    var DL_radian = Math.acos(
      Math.sin(Inc1) * Math.sin(Inc2) * Math.cos(Az2 - Az1) +
        Math.cos(Inc1) * Math.cos(Inc2)
    );
    var DL_Degree = DL_radian * (180 / Math.PI);
    console.log("DL_radian is ", DL_radian);
    console.log("DL_degree is ", DL_Degree);

    // Dog leg Sivearity in degrees/100ft
    DLS_radian = 100 * (DL_radian / diff_MD).toFixed(7);
    DLS_degree = 100 * (DL_radian / diff_MD) * (180 / Math.PI).toFixed(7);

    var Rf = -1; //Adding the base condition to prevent wrong values
    if (DL_radian === 0) {
      Rf = 1;
      console.log("Rf is", Rf);
    } else {
      Rf = (2 / DLS_radian) * Math.tan(DLS_radian / 2);
      console.log("Rf is", Rf);
    }

    // calculating the Northing
    var delta_Northing =
      (diff_MD / 2) *
      [Math.sin(Inc1) * Math.cos(Az1) + Math.sin(Inc2) * Math.cos(Az2)] *
      Rf;
    N.push(delta_Northing);

    // calculating the Easting
    var delta_Easting =
      (diff_MD / 2) *
      [Math.sin(Inc1) * Math.sin(Az1) + Math.sin(Inc2) * Math.sin(Az2)] *
      Rf;
    E.push(delta_Easting);

    // calculating the TVD
    var delta_tvd = (diff_MD / 2) * (Math.cos(Inc1) + Math.cos(Inc2)) * Rf;
    V.push(delta_tvd);
  }
  console.log("nn", N);
  console.log("ee", E);
  console.log("tt", V);

  // Put the values of the first Row here in init variables
  var init_tvd = 1289.91;
  var init_easting = 11.37;
  var init_Northing = 6.98;
  V[0] = init_tvd + V[0];
  cal_TVD[0] = V[0];
  E[0] = init_easting + E[0];
  cal_Easting[0] = E[0];
  N[0] = init_Northing + N[0];
  cal_Northing[0] = N[0];

  for (var i = 1; i < 45; i++) {
    V[i] = V[i] + V[i - 1];
    cal_TVD.push(V[i]);
  }
  for (var i = 1; i < 45; i++) {
    E[i] = E[i] + E[i - 1];
    cal_Easting.push(E[i]);
  }
  for (var i = 1; i < 45; i++) {
    N[i] = N[i] + N[i - 1];
    cal_Northing.push(N[i]);
  }
  console.log("cal_TVD_abc ", JSON.stringify(cal_TVD));
  console.log("cal_Easting_abc ", JSON.stringify(cal_Easting));
  console.log("cal_Northing_abc ", JSON.stringify(cal_Northing));
  // document.getElementById("cal_TVD").innerHTML = JSON.stringify(cal_TVD);
  // document.getElementById("cal_Easting").innerHTML = cal_Easting;
  // document.getElementById("cal_Northing").innerHTML = cal_Northing;

  // Printing the table of the calculated values
  var resultArr = [];

  for (let i = 0; i < cal_TVD.length; i++) {
    resultArr.push([cal_TVD[i], cal_Easting[i], cal_Northing[i]]);
  }

  console.log("some arraay", resultArr);

  var html = "<table>";
  html += "<td>" + "TVD" + "</td>";
  html += "<td>" + "Easting" + "</td>";
  html += "<td>" + "Northing" + "</td>";
  for (var i = 0; i < resultArr.length; i++) {
    html += "<tr>";

    for (var j = 0; j < resultArr[i].length; j++) {
      html += "<td>" + resultArr[i][j] + "</td>";
    }
    html += "</tr>";
  }
  html += "</table>";
  document.getElementById("container").innerHTML = html;

  var trace0 = {
    type: "scatter3d",
    mode: "lines",
    scene: "scene1",
    x: N,
    y: V,
    z: E,

    opacity: 1,
    line: {
      width: 2,
      color: "black",
      reversescale: false,
    },
  };
  var trace1 = {
    type: "scatter3d",
    mode: "lines",
    scene: "scene2",
    x: N,
    y: V,
    z: E,

    opacity: 1,
    line: {
      width: 2,
      color: "black",
      reversescale: false,
    },
  };

  // design layout for additional features
  var layout = {
    title: "drill Visualisation",
    height: 700,
    scene1: {
      xaxis: { title: "NORTHING" },
      yaxis: { title: "TVD" },
      zaxis: { title: "EASTING" },
      camera: {
        center: {
          x: 0,
          y: 0,
          z: 0,
        },
        eye: {
          x: 2,
          y: 2,
          z: 0.1,
        },
        up: {
          x: 0,
          y: 0,
          z: 1,
        },
      },
    },
    scene2: {
      xaxis: { title: "NORTHING" },
      yaxis: { title: "TVD" },
      zaxis: { title: "EASTING" },

      camera: {
        center: {
          x: 0,
          y: 0,
          z: 0,
        },
        eye: {
          x: 0.1,
          y: 2.5,
          z: 0.1,
        },
        up: {
          x: 0,
          y: 0,
          z: 1,
        },
      },
    },
  };
  var data = [trace0, trace1];
  // Plotting the Graphs
  Plotly.newPlot("front_plot", data, layout, { displayModeBar: true });
});

// NOT-Completed _ adding functianilty to download the calulated data as csv file

var csvFileData = [[cal_TVD], [cal_Easting]];

console.log("cal_tvd_is", cal_TVD);

// var csvFileData = [
//   ["Alan ", "Singer"],
//   ["Cristiano Ronaldo", "Footballer"],
//   ["Saina Nehwal", "Badminton Player"],
//   ["Arijit Singh", "Singer"],
//   ["Terence Lewis", "Dancer"],
// ];

//create a user-defined funsction to download CSV file
function download_csv_file() {
  //define the heading for each row of the data
  var csv = "TVD,Easting\n";
  var perrow = 2;
  //merge the data with CSV
  csvFileData.forEach(function (row) {
    var next = next + 1;
    if (next % perrow == 0 && next != data.length) {
      csv += row.join(",");
      csv += "\n";
    }
  });

  //display the created CSV data on the web browser
  document.write(csv);

  var hiddenElement = document.createElement("a");
  hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
  hiddenElement.target = "_blank";

  //provide the name for the CSV file to be downloaded
  hiddenElement.download = "drilling_srvey.csv";
  hiddenElement.click();
}
