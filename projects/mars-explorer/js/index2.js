var card1 = '<div class="rounded overflow-hidden shadow-lg">' +
           '    <img class="w-96" src="{{img_src}}" alt="Mountain">' +
           '    <div class="px-6 pt-4 pb-2">' +
           '      <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#photography</span>' +
           '      <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#winter</span>' +
           '   </div>' +
           '</div>';
var card = '<div class="col"><div class="card" style="width: 18rem; height: 100%;">'+
           '  <img alt="gallery" style="object-fit: cover; height: 100%;" class="" src="{{img_src}}">'+
           '  <div class="card-body">'+
           '  </div>'+
           '</div></div>';
var isTodayOrYesterday = (someDate) => {
  someDate = new Date(someDate)
  var today = new Date()
  return (someDate.getDate() == today.getDate() || someDate.getDate()==today.getDate()-1)&&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
}

function getGroupByCameraPhotos(data){
    console.log(data.length, data);
    var groupByCam = {};
    for(var i=0;i<data.length;i++){
        var camEntry = groupByCam[data[i]['camera']['name']];
        if(camEntry){
            var camEntryLength = groupByCam[data[i]['camera']['name']].length;
            groupByCam[data[i]['camera']['name']][camEntryLength] = data[i];``

        } else {
            groupByCam[data[i]['camera']['name']]=[];
            groupByCam[data[i]['camera']['name']][0] = data[i];
        }
    }
    console.log("groupByCam", groupByCam);
    return groupByCam;
}

function fetchPhotos(){

    var requestedDateField = document.getElementById('requestedDate');
    var requestedDate = requestedDateField.value;
    var bodyHeaderDiv = document.getElementById('bodyHeader');
    var parentDiv = document.getElementById('gallery-container');
    var accordionDiv = $('#accordionPanelsStayOpenExample')

    if(isTodayOrYesterday(requestedDate)){
        console.log("Can't retrieve for requested date: ", requestedDate);
        bodyHeaderDiv.innerHTML = "Usually, NASA api's most recent response is for two earth days in past, please select a date earlier than last two days";
        bodyHeaderDiv.classList.remove('scale-0');
        return;
    }

    var nasaApiUrl = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date="+ requestedDate +"&api_key=DEMO_KEY";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
              // Typical action to be performed when the document is ready:
              var data = JSON.parse(xhttp.responseText);

              console.log("Response received successfully");
              console.log(data);
              bodyHeaderDiv.classList.add('scale-0');
              //Todo: getStats(data);
              var noOfPhotos = data['photos'].length;
              if(noOfPhotos){


                    var groupByCameraPhotos = getGroupByCameraPhotos(data['photos']);

                    var noOfCameras = Object.keys(groupByCameraPhotos).length;
                    bodyHeaderDiv.innerHTML = "Curiosity rover took " + noOfPhotos + " photos using " + noOfCameras + " of it's cameras on "+ requestedDate;
                    bodyHeaderDiv.classList.remove('scale-0');

                    for (const property in groupByCameraPhotos) {
                        console.log('values', property, groupByCameraPhotos[property]);

                        var accordionItem = $('<div class="accordion-item">' +
                        '    <h2 class="accordion-header" id="panelsStayOpen-heading'+property+'">' +
                        '        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse'+property+'" aria-expanded="true" aria-controls="panelsStayOpen-collapse'+property+'">' +
                        '       ' + groupByCameraPhotos[property][0]['camera']['full_name'] + "( " + property + " ) captured " + groupByCameraPhotos[property].length + ' photos' +
                        '        </button>' +
                        '    </h2>' +
                        '    <div id="panelsStayOpen-collapse'+property+'" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-heading'+property+'">' +
                        '        <div class="accordion-body-'+property+'">' +
                        '        </div>' +
                        '    </div>' +
                        '</div>');
                        accordionDiv.append(accordionItem);

                        var accordionBody = $('.accordion-body-'+property);

                        var divWithCaptures = $('<div class="row m-2"></div>');
                        divWithCaptures.append("");
                        divWithCaptures.className = '';
                        for (const capture in groupByCameraPhotos[property]) {

                            var aCard = card.replace("{{img_src}}", groupByCameraPhotos[property][capture]['img_src'])
                                            .replace("{{cam_name}}", groupByCameraPhotos[property][capture]['camera']['name'])
                                            .replace("{{mars_day}}", groupByCameraPhotos[property][capture]['sol']);
                            divWithCaptures.append(aCard);
                        }
                        accordionBody.append(divWithCaptures);

                    }
              } else {
                console.log("No photos received");

                bodyHeaderDiv.innerHTML = "Sorry, No photos found for requested date: " + requestedDate;
                bodyHeaderDiv.classList.remove('scale-0');
              }
              console.log("Completed");
        } else {
            if(this.readyState === 4){
                console.log("Http issue while talking to NASA api, status is ", this.status)
                bodyHeaderDiv.innerHTML = "Apologies, Free api call limit reached, NASA api with public key only provides 500 requests a day, please try tomorrow, sorry for inconvenience";
                bodyHeaderDiv.classList.remove('scale-0');
            }
       }
    };
    xhttp.open("GET", nasaApiUrl, true);
    xhttp.send();
}