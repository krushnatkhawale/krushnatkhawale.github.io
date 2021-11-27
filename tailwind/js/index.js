var card = '<div class="min-h-screen bg-gray-100 flex items-center justify-center py-50">'+
                '<div class="max-w-md bg-white rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-500">'+
                '<div class="p-4">'+
                '    <img class="rounded-xl" src="{{img_src}}" alt="Dog" />'+
                '</div>'+
                '<div class="flex justify-between p-6">'+
                '    <div class="flex items-center space-x-4">'+
                '    <img class="h-10 rounded-full" src="https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" alt="" />'+
                '    <h1 class="text-lg text-gray-900 font-bold">Felipe Sacudon</h1>'+
                '    </div>'+
                '    <div class="flex space-x-6 items-center">'+
                '    <div class="flex space-x-2 items-center">'+
                '        <span>'+
                '        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">'+
                '            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />'+
                '        </svg>'+
                '        </span>'+
                '        <span class="text-gray-700 font-semibold">20</span>'+
                '    </div>'+
                '    <div class="flex space-x-2 items-center pr-4">'+
                '        <span>'+
                '        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600 hover:text-red-500" viewBox="0 0 20 20" fill="currentColor">'+
                '            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />'+
                '        </svg>'+
                '        </span>'+
                '        <span class="text-gray-700 font-semibold">22</span>'+
                '    </div>'+
                '    </div>'+
                '</div>'+
                '</div>'+
            '</div>';

var isToday = (someDate) => {
  someDate = new Date(someDate)
  var today = new Date()
  return someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
}

function fetchPhotos(){

    var requestedDateField = document.getElementById('requestedDate');
    var requestedDate = requestedDateField.value;

    console.log(requestedDate);

    var bodyHeaderDiv = document.getElementById('bodyHeader');

    if(isToday(requestedDate)){
        bodyHeaderDiv.innerHTML = "Usually, NASA api's most recent response is for two earth days in past, please select a date earlier than last two days";
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
          var noOfPhotos = data['photos'].length;
          if(noOfPhotos){
            for(var i=0;i<noOfPhotos;i++){
                var aCard = card.replace("{{img_src}}", data['photos'][i]['img_src']);
                var parentDiv = document.getElementById('gallery-container');
                var div = document.createElement('div');
                div.innerHTML = aCard;

                parentDiv.appendChild(div);
            }
          } else {
            console.log("No photos received");
            bodyHeaderDiv.innerHTML = "Sorry, No photos found for requested date: " + requestedDate;
          }
          console.log("Completed");
        } else {
            console.log("Http issue while talking to NASA api, status is ", this.status)
            bodyHeaderDiv.innerHTML = "Apologies, Free api call limit reached, NASA api with public key only provides 500 requests a day, please try tomorrow, sorry for inconvenience";
       }
    };
    xhttp.open("GET", nasaApiUrl, true);
    xhttp.send();
}