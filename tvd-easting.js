    // Adding csv file - its static in nature right now
    
    d3.csv("tobecalculated.csv", function (err, rows) {
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

      // Declaring global varables
      var E = [];
      var N = [];
      var V = [];

      //Calculating Dog Leg Severity
      for (var i = 0; i < 44; i++) {
        var diff_MD = (x[i + 1] - x[i]).toFixed(8);
        var Inc1 = (y[i] * (Math.PI / 180)).toFixed(8);   //converting into radians and fixing the decimal places
        var Inc2 = (y[i+1] * (Math.PI / 180)).toFixed(8);
        var Az1 = (z[i] * (Math.PI / 180)).toFixed(8);
        var Az2 = z[i+1] * (Math.PI / 180);

        // Dog leg Severity in degrees/100ft
        var DL_radian = Math.acos(Math.sin(Inc1) * Math.sin(Inc2) * Math.cos(Az2 - Az1) + Math.cos(Inc1) * Math.cos(Inc2));
        var DL_Degree = DL_radian * (180 / Math.PI);
        DLS_radian = 100 * (DL_radian / diff_MD).toFixed(8);
        DLS_degree = 100 * (DL_radian / diff_MD) * (180 / Math.PI).toFixed(8);

       // calculating the Northing
        var Rf = (2 / DLS_radian) * Math.tan(DLS_radian / 2);
        var dNorthing = (diff_MD / 2) * [Math.sin(Inc1) * Math.cos(Az1) + Math.sin(Inc2) * Math.cos(Az2)] * Rf;
        N.push(dNorthing);

        // calculating the Easting
        var dEasting = (diff_MD / 2) * [Math.sin(Inc1) * Math.sin(Az1) + Math.sin(Inc2) * Math.sin(Az2)] * Rf;
        E.push(dEasting);

        // calculating the TVD
        var dtvd = (diff_MD / 2) * (Math.cos(Inc1) + Math.cos(Inc2)) * Rf;
        V.push(dtvd);
      }

      var init_tvd = 290.7;
      var init_easting = 2.315326;
      var init_Northing = -6.71399;

        N[0] = init_Northing + N[0];
        E[0] = init_easting + E[0];
        V[0] = init_tvd + V[0];

        for (var i = 1; i < 44; i++)
         {
        N[i] = N[i] + N[i - 1];
        E[i] = E[i] + E[i - 1];
        V[i] = V[i] + V[i - 1];
         }


       Plotly.newPlot(
        "plot2d_easting",
        [
          {
            type: "scatter2d",
            mode: "lines+markers",
            x: E,
            y: V,
        

            opacity: 1,
            line: {
              width: 2,
              color: c,
              reversescale: false,
            },
          },
        ],
        {

     title: 'TVD vs Easting Plot',
     height: 700,
    },
      );
    });
