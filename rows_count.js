//*****************/ Count total number of rows *******************************

var myFileUri = "tobecalculated.csv";
alertCsvCount(myFileUri);

function alertCsvCount(myFile) {
  //use jquery get
  $.get(myFile, function (data) {
    var lineCount = data.split("\n").length;
    //do what you want to do in lineCount

    document.getElementById("count").innerHTML = lineCount;
  });
}
