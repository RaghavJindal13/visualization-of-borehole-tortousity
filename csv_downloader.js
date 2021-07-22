//user-defined function to download CSV file
function downloadCSV(csv, filename) {
  var csvFile;
  var downloadLink;

  //define the file type to text/csv
  csvFile = new Blob([csv], { type: "text/csv" });
  downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = "none";

  document.body.appendChild(downloadLink);
  downloadLink.click();
}

//user-defined function to export the data to CSV file format
function exportTableToCSV(filename) {
  //declare a JavaScript variable of array type
  var csv = [];
  var rows = document.querySelectorAll("table tr");

  //merge the whole data in tabular form
  for (var i = 0; i < rows.length; i++) {
    var row = [],
      cols = rows[i].querySelectorAll("td, th");
    for (var j = 0; j < cols.length; j++) row.push(cols[j].innerText);
    csv.push(row.join(","));
  }
  //call the function to download the CSV file
  downloadCSV(csv.join("\n"), filename);
}
