//Get Elements
var uploader = document.getElementById("uploader");
var csvFileInput = document.getElementById("csvFileInput");

//Listen for file selection
csvFileInput.addEventListener("change", function (e) {
  // Get file
  var file = e.target.files[0];

  // Create storage ref
  var storageRef = firebase.storage().ref("mydata/" + file.name);

  // upload file
  var task = storageRef.put(file);

  // update progress bar
  task.on(
    "state_changed",

    function progress(snapshot) {
      var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      uploader.value = percentage;
    },

    function error(err) {},

    function complete() {}
  );
});
