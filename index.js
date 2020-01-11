var countryArr = [];
var stateArray = [];
var cityArray = [];
var stationArray = [];
var country = '';
const parsedJSON = [];
var stationPollution = [];
var stateCityArr = {};
var cityStationArray = {};

const url = "https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69?api-key=579b464db66ec23bdd00000150ba19e8fe0e435558f13bfd0a3b0db7&format=json&offset=0&limit=1000";

function httpGet(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false);
  xmlHttp.send(null);
  return xmlHttp.responseText;
}
var result = httpGet(url);
let recordsArr = JSON.parse(result);
recordsArr = recordsArr.records;

//filter country,state,city,station arrays with duplicates
countryArr = recordsArr.map(item => item.country);
stateArray = recordsArr.map(item => item.state);
cityArray = recordsArr.map(item => item.city);
stationArray = recordsArr.map(item => item.station);

//Creating Unique country,state,city,station arrays 
countryArr = findUniqueValues(countryArr);
stateArray = findUniqueValues(stateArray);
cityArray = findUniqueValues(cityArray);
stationArray = findUniqueValues(stationArray);


if (countryArr.length === 1) {
  country = countryArr[0];
  parsedJSON[country] = [];
}
stateArray.forEach(state => parsedJSON[country].push(state));

/***Mapping State and City Array */

stateArray.forEach(state => {
  stateCityArr[state] = [];
  recordsArr.forEach(record => {
    if (record.state === state) {
      stateCityArr[state].push(record.city);
    }
    stateCityArr[state] = findUniqueValues(stateCityArr[state]);
  });
});

/***Mapping City and Station Array */

cityArray.forEach(city => {
  cityStationArray[city] = [];
  recordsArr.forEach(record => {
    if (record.city === city) {
      cityStationArray[city].push(record.station);
    }
    cityStationArray[city] = findUniqueValues(cityStationArray[city]);
  });
});




/***Mapping Station and pollution id */
stationArray.forEach(station => {
  stationPollution[station] = [];
  recordsArr.forEach(record => {
    if (record.station === station) {
      stationPollution[station].push(record);
    }
  });
});



/***Filter Duplicates */
function findUniqueValues(data) {
  let uniqueArr = [];
  data.forEach(element => {
    if (uniqueArr.indexOf(element) === -1) {
      uniqueArr.push(element);
    }
  });
  return uniqueArr;
}


/***Create UL and LI list */


var ul = document.createElement("ul");
ul.className = "myUL";
function createView() {
  Object.keys(stateCityArr).forEach(state => {
    var li = document.createElement("li");
    var text = document.createElement("span");

    text.className = "caret";

    var ulCity = '';
    var liCity = '';
    var textCity = '';
    var ulStation = '';
    var liStation = '';
    var textStation = '';

    text.innerHTML = state;
    li.appendChild(text);
    ulCity = document.createElement("ul");

    Object.keys(cityStationArray).forEach(city => {
      if (stateCityArr[state].includes(city)) {
        ulStation = document.createElement("ul");
        ulCity.className = "nested";
        liCity = document.createElement("li");
        textCity = document.createElement("span");
        textCity.className = "caret";
        textCity.innerHTML = city;
        liCity.appendChild(textCity);
        ulCity.append(liCity);
        li.appendChild(ulCity);

        cityStationArray[city].forEach(station => {
          ulStation.className = "nested";
          liStation = document.createElement("li");
          textStation = document.createElement("span");
          textStation.className = "clicker";
          textStation.innerHTML = station;
          liStation.appendChild(textStation);
          ulStation.append(liStation);
          liCity.appendChild(ulStation);
        });
      }
    });

    ul.append(li);
  });
  return ul;
}


document.getElementById("root").appendChild(createView());

var toggler = document.getElementsByClassName("caret");
for (var i = 0; i < toggler.length; i++) {
  toggler[i].addEventListener("click", function () {
    this.parentElement.querySelector(".nested").classList.toggle("active");
    this.classList.toggle("caret-down");
  });
}

function createTable(event) {
  var pollutionContent = stationPollution[event.target.innerText];
  var table = document.createElement("table");
  var th1 = document.createElement("th");
  var th2 = document.createElement("th");
  var th3 = document.createElement("th");
  var th4 = document.createElement("th");

  table.className = "table-id";
  table.setAttribute("id", event.target.innerText);
  th1.innerHTML = "Pollution MIN";
  th2.innerHTML = "Pollution MAX";
  th3.innerHTML = "Pollution AVG";
  th4.innerHTML = "Pollution Unit";

  table.appendChild(th1);
  table.appendChild(th2);
  table.appendChild(th3);
  table.appendChild(th4);
  th1.style.border = "1px solid black";
  th2.style.border = "1px solid black";
  th3.style.border = "1px solid black";
  th4.style.border = "1px solid black";

  for (var i = 0; i < pollutionContent.length; i++) {
    event.target.setAttribute("title", pollutionContent[i].id);

    var tr = document.createElement("tr");
    tr.style.border = "1px solid black";

    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    var td3 = document.createElement("td");
    var td4 = document.createElement("td");

    var text1 = document.createTextNode(pollutionContent[i].pollutant_min);
    var text2 = document.createTextNode(pollutionContent[i].pollutant_max);
    var text3 = document.createTextNode(pollutionContent[i].pollutant_avg);
    var text4 = document.createTextNode(pollutionContent[i].pollutant_unit);
    td1.appendChild(text1);
    td2.appendChild(text2);
    td3.appendChild(text3);
    td4.appendChild(text4);
    td1.style.border = "1px solid black";
    td2.style.border = "1px solid black";
    td3.style.border = "1px solid black";
    td4.style.border = "1px solid black";
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);

    table.appendChild(tr);
  }
  document.getElementById("container").appendChild(table);
  document.getElementById("container").style.display = "block";
}

var stationNames = document.getElementsByClassName("clicker");

for (var i = 0; i < stationNames.length; i++) {
  var station = stationNames[i];
  stationNames[i].addEventListener("click", function (station) {
    document.getElementById("container").innerHTML = '';
    createTable(station);
  });
}
