//Intial function
"Use strict";

var auth;
var file = document.getElementById("file");
var filepath = document.getElementById("filepath");
var Container = "apps/joe";

//Finds and adds EventListener on buttons
window.document.getElementById("authorise").addEventListener("click", function() {
  authorise();
});
window.document.getElementById("istokenvalid").addEventListener("click", function() {
  istokenvalid();
});
window.document.getElementById("freetoken").addEventListener("click", function() {
  freetoken();
});
window.document.getElementById("showfiles").addEventListener("click", function() {
  showfiles();
});
window.document.getElementById("uploadfile").addEventListener("click", function() {
  uploadfile();
});
window.document.getElementById("updatefile").addEventListener("click", function() {
  updatefile();
});
window.document.getElementById("getfile").addEventListener("click", function() {
  getfile();
});
window.document.getElementById("deletefile").addEventListener("click", function() {
  deletefile();
});

//initialises and authorises with the network
function authorise() {
  var app = {
    name: "Safe Manager",
    id: "joe",
    version: "1",
    vendor: "joe",
  };

  var permissions = {
    '_public': [
      'Read',
      'Insert',
      'Update',
      'Delete',
      'ManagePermissions'
    ],
    '_publicNames': [
      'Read',
      'Insert',
      'Update',
      'Delete',
      'ManagePermissions'
    ]
  };

  var owncontainer = {
    own_container: true
  };

  window.safeApp.initialise(app)
    .then((appToken) => {
      console.log("Initialise Token: " + appToken);


      window.safeApp.authorise(appToken, permissions, owncontainer)
        .then((auth) => {
          // console.log(auth);

          window.safeApp.connectAuthorised(appToken, auth)
            .then((authorisedAppToken) => {
              //returns authorised app token
              window.auth = authorisedAppToken;
              Materialize.toast("Authorised App Token: " + authorisedAppToken, 3000, 'rounded');
              // console.log(authorisedAppToken);
            });
        });
    }, (err) => {
      console.error(err);
      // Materialize.toast(err, 3000, 'rounded');
    });
}

//checks network and token status
function istokenvalid() {
  window.safeApp.isRegistered(auth)
    .then((registered) =>
      // console.log('Is app registered?: ', registered));
      Materialize.toast('Is app registered?: ' + registered, 3000, 'rounded'));
  window.safeApp.networkState(auth)
    .then((state) =>
      // console.log('Current network state: ', state));
      Materialize.toast('Current network state: ' + state, 3000, 'rounded'));
}

function showfiles() {
  window.safeApp.getContainer(auth, Container)
    .then((mdHandle) => {
      // console.log(mdHandle);
      fileshow.innerHTML = "";

      //can be used for identifing the Container but is not needed here
      // window.safeMutableData.getNameAndTag(mdHandle)
      //   .then((data) =>
          // console.log(data));

          window.safeMutableData.getEntries(mdHandle)
          .then((entriesHandle) => {
            window.safeMutableDataEntries.forEach(entriesHandle,
              (key, value) => {
                // console.log('Entry Handle: ', entriesHandle);
                console.log('File found: ', uintToString(key));
                // console.log('Value: ', uintToString(value.buf));
                // console.log(key, value);

                $("#fileshow").append("<div class='icons'><i class='material-icons md-48'>description</i><p class='filedirnames'>" + uintToString(key) + "</p></div>");
              });

            // window.safeMutableDataEntries.free(entriesHandle);
            // window.safeMutableData.free(mdHandle);
          });
    }, (err) => {
      console.error(err);
      // Materialize.toast(err, 3000, 'rounded');
    });
}

function uintToString(uintArray) {
  return new TextDecoder("utf-8").decode(uintArray);
}

function uploadfile() {
  blobtobuffer();
  window.safeApp.getContainer(auth, Container)
    .then((mdHandle) => {
      window.safeMutableData.newMutation(auth)
        .then((mutationHandle) =>
          window.safeMutableDataMutation.insert(mutationHandle, file.files[0].name, content)
          .then(() =>
            window.safeMutableData.applyEntriesMutation(mdHandle, mutationHandle))
          .then(() =>
            Materialize.toast('New entry was inserted in the MutableData and committed to the network', 3000, 'rounded')));
      // console.log('New entry was inserted in the MutableData and committed to the network')));
      // window.safeMutableDataMutation.free(mutationHandle);
      // window.safeMutableData.free(mdHandle);
    }, (err) => {
      console.error(err);
      Materialize.toast(err, 3000, 'rounded');
    });
}

function updatefile() {
  blobtobuffer();
  window.safeApp.getContainer(auth, Container)
    .then((mdHandle) => {
      window.safeMutableData.newMutation(auth)
        .then((mutationHandle) => {
              window.safeMutableDataMutation.update(mutationHandle, filepath.value, content, value.version + 1);
              window.safeMutableData.applyEntriesMutation(mdHandle, mutationHandle);
            }, (err) => {
              console.error(err);
              // Materialize.toast(err, 3000, 'rounded');
        })
        .then(() =>
          Materialize.toast('Entry was inserted in the MutableData and committed to the network', 3000, 'rounded'));
      // console.log('New entry was inserted in the MutableData and committed to the network'));
      // window.safeMutableDataMutation.free(mutationHandle);
      // window.safeMutableData.free(mdHandle);
    }, (err) => {
      console.error(err);
      Materialize.toast(err, 3000, 'rounded');
    });
}

function blobtobuffer() {
  var reader = new FileReader();
  reader.readAsArrayBuffer(file.files[0]);
  reader.onload = function(event) {
    content = new Buffer(event.target.result.byteLength);
    var view = new Uint8Array(event.target.result);
    for (var i = 0; i < content.length; ++i) {
      content[i] = view[i];
    }
    return content;
  };
}

function saveedit() {
  window.safeApp.getContainer(auth, Container)
    .then((mdHandle) => {
      window.safeMutableData.newMutation(auth)
        .then((mutationHandle) => {
              window.safeMutableDataMutation.update(mutationHandle, filepath.value, textarea.value, value.version + 1);
              window.safeMutableData.applyEntriesMutation(mdHandle, mutationHandle);
            }, (err) => {
              console.error(err);
              // Materialize.toast(err, 3000, 'rounded');
        })
        .then(() =>
          Materialize.toast('Text was updated in the MutableData and committed to the network', 3000, 'rounded'));
      // console.log('New entry was inserted in the MutableData and committed to the network'));
      // window.safeMutableDataMutation.free(mutationHandle);
      // window.safeMutableData.free(mdHandle);
    }, (err) => {
      console.error(err);
      Materialize.toast(err, 3000, 'rounded');
    });
}

function deletefile() {
  window.safeApp.getContainer(auth, Container)
    .then((mdHandle) => {
      window.safeMutableData.newMutation(auth)
        .then((mutationHandle) => {
              window.safeMutableDataMutation.remove(mutationHandle, filepath.value, value.version + 1);
              window.safeMutableData.applyEntriesMutation(mdHandle, mutationHandle);
            }, (err) => {
              console.error(err);
              // Materialize.toast(err, 3000, 'rounded');
        })
        .then(() => {
          Materialize.toast('Entry was removed from the MutableData and committed to the network', 3000, 'rounded');
          console.log('Entry was removed from the MutableData and committed to the network');
        });
      // window.safeMutableDataMutation.free(mutationHandle);
      // window.safeMutableData.free(mdHandle);
    }, (err) => {
      console.error(err);
      // Materialize.toast(err, 3000, 'rounded');
    });
}

function getfile() {
  window.safeApp.getContainer(auth, Container)
    .then((mdHandle) => {

      //change key
      window.safeMutableData.get(mdHandle, filepath.value)
        .then((value) => {
          readfile(filepath.value, value.buf);

          // console.log(value);
          // console.log('Value: ', uintToString(value.buf));
          // console.log('Version: ', value.version);

          // window.safeMutableData.free(mdHandle);
        });
    }, (err) => {
      console.error(err);
      // Materialize.toast(err, 3000, 'rounded');

    });
}

function readfile(name, filecontent) {
  fileshow.innerHTML = "";
  var file = new File([filecontent], name);
  console.log("Your file is a " + name.split('.').pop() + " file.");
  Materialize.toast("Your file is a " + name.split('.').pop() + " file.", 3000, 'rounded');

  switch (name.split('.').pop()) {
    //text
    case "txt":
    case "html":
    case "htm":
    case "css":
    case "js":
    case "json":
    case "md":
    case "odt":
    case "rtf":
    case "csv":
      readAsText();
      break;
      //images
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "tiff":
    case "tif":
    case "ico":
    case "webp":
    case "svg":
    case "bmp":
      readAsImage();
      break;
      //audio
    case "mp3":
    case "oga":
    case "wav":
      readAsAudio();
      break;
      //video
    case "mp4":
    case "ogv":
    case "ogg":
    case "webm":
      readAsVideo();
      break;
    default:
      //default
      download();
  }

  //reads file as text
  function readAsText() {
    var reader = new FileReader();
    reader.onload = function() {
      var url = window.URL.createObjectURL(file);
      fileshow.innerHTML = '<textarea id="textarea" class="materialize-textarea">' + this.result + '</textarea><button id="saveedit" class="waves-effect waves-yellow btn blue">Save Edit</button><a id="downloadfile" class="waves-effect waves-light btn blue" href="' + url + '" download="' + file.name + '">Download file</a>';
      $('textarea').each(function() {
        $(this).height($(this).prop('scrollHeight'));
      });
      window.document.getElementById("saveedit").addEventListener("click", function() {
        saveedit();
      });
    };
    reader.readAsText(file);
  }

  //reads file as image
  function readAsImage() {
    var url = window.URL.createObjectURL(file);
    var fileReader = new FileReader();
    fileReader.onload = function(event) {
      fileshow.innerHTML = '<img class="responsive-img" src="' + this.result + '"></img><a id="downloadfile" class="waves-effect waves-light btn blue" href="' + url + '" download="' + file.name + '">Download file</a>';
    };
    fileReader.readAsDataURL(file);
  }

  //reads file as audio
  function readAsAudio() {
    var url = window.URL.createObjectURL(file);
    fileshow.innerHTML = '<audio id="sound" controls></audio><a id="downloadfile" class="waves-effect waves-light btn blue" href="' + url + '" download="' + file.name + '">Download file</a>';
    var sound = document.getElementById('sound');
    sound.src = URL.createObjectURL(file);
  }

  //reads file as video
  function readAsVideo() {
    var url = window.URL.createObjectURL(file);
    var fileReader = new FileReader();
    fileReader.onload = function(event) {
      fileshow.innerHTML = '<video controls><source src="' + url + '" type="' + file.type + '"></video>';
    };
    fileReader.readAsDataURL(file);
  }

  //default
  function download() {
    console.log(file.name);
    var url = window.URL.createObjectURL(file);
    fileshow.innerHTML = '<a id="downloadfile" class="waves-effect waves-light btn blue" href="' + url + '" download="' + file.name + '">Download file</a>';
  }
}

//frees safe instance from memory
function freetoken() {
  window.safeApp.free(auth);
  Materialize.toast("Token freed", 3000, 'rounded');
}
