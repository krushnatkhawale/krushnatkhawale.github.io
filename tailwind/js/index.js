var card2 = '<div class="min-h-screen bg-gray-100 flex items-center justify-center py-50">'+
                '<div class="max-w-md bg-white rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-500">'+
                '<div class="p-4">'+
                '    <img class="rounded-xl" src="{{img_src}}" alt="Dog" />'+
                '</div>'+
                '<div class="p-6">'+
                '    <h3 class="text-lg text-gray-900">Camera: {{cam_name}}</h3>'+
                '    <h3 class="text-lg text-gray-900" title="Day since rover landed on Mars">Mars day: {{mars_day}}</h3>'+
                '</div>'+
                '</div>'+
            '</div>';

var card = '<div class="rounded overflow-hidden shadow-lg">' +
           '       <img class="w-96" src="{{img_src}}" alt="Mountain">' +
           '       <div class="px-6 py-4">' +
           '         <div class="font-bold text-xl mb-2">Mountain</div>' +
           '         <p class="text-gray-700 text-base">' +
           '             <h3 class="text-lg text-gray-900">Camera: {{cam_name}}</h3>'+
           '         </p>' +
           '       </div>' +
           '       <div class="px-6 pt-4 pb-2">' +
           '         <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#photography</span>' +
           '         <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#travel</span>' +
           '         <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#winter</span>' +
           '       </div>' +
           '     </div>';

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
            for(var i=0;i<noOfPhotos;i++){
                var aCard = card.replace("{{img_src}}", data['photos'][i]['img_src'])
                                .replace("{{cam_name}}", data['photos'][i]['camera']['name'])
                                .replace("{{mars_day}}", data['photos'][i]['sol']);
                var parentDiv = document.getElementById('gallery-container');
                var div = document.createElement('div');
                div.innerHTML = aCard;

                parentDiv.appendChild(div);
            }
          } else {
            console.log("No photos received");

            bodyHeaderDiv.innerHTML = "Sorry, No photos found for requested date: " + requestedDate;
            bodyHeaderDiv.classList.remove('scale-0');
          }
          console.log("Completed");
        } else {
            console.log("Http issue while talking to NASA api, status is ", this.status)
            bodyHeaderDiv.innerHTML = "Apologies, Free api call limit reached, NASA api with public key only provides 500 requests a day, please try tomorrow, sorry for inconvenience";
            bodyHeaderDiv.classList.remove('scale-0');
       }
    };
    xhttp.open("GET", nasaApiUrl, true);
    xhttp.send();
}