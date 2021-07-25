var config = {
  apiKey: "AIzaSyBu-YZuWIOh6KOPQfb8rY6PacRgS4fQ8v4",
  authDomain: "borehole-3511c.firebaseapp.com",
  projectId: "borehole-3511c",
  storageBucket: "borehole-3511c.appspot.com",
  messagingSenderId: "61534313202",
  appId: "1:61534313202:web:888e56885e5653056b0e6b",
  measurementId: "G-4PQTECTY26",
};
firebase.initializeApp(config);

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
