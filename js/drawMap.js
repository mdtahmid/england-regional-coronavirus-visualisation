//array stores area codes for the 9 regions in England
var regionCodes = ["E12000001", "E12000002","E12000003", "E12000004", "E12000005", "E12000006", "E12000007", "E12000008", "E12000009"];

var dict = []; //create new array

//ajax call that gets data for each region to plot on the map
async function ajaxCall() {
		var counter = 1; //start counter, this will be used for loading animation purposes
		for(var i=0;i<regionCodes.length;i++){ //loop through regions array
	      await $.ajax({ //get data for each region
	          type: "GET",
						url: 'https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=region;areaCode='+regionCodes[i]+'&structure={"areaCode":"areaCode","cumCasesByPublishDateRate":"cumCasesByPublishDateRate","areaName":"areaName"}',
	          dataType: "json",
	          success: function(data) {
								console.log(data.data[0]);
								if ($.trim(data)){ //check if data hasn't returned back empty
									dict[data.data[0].areaCode] = data.data[0].cumCasesByPublishDateRate; //add area code and cumulative cases to array
									//console.log("not empty");
								} else {
									console.log("Area code not valid in API. Data returned empty."); //else something went wrong and area code wasn't found
								}
								counter++; //increase counter by 1
								document.getElementById('counter').innerHTML = "Loading map.. <br>" + counter + "/" + (regionCodes.length) + " regions loaded.."; //update the DOM loading animation
	      }
	      });

		} $('#loader').hide(); $('#counter').hide(); return dict; //hide the map loading animation
}

//function renders the map to the DOM
async function drawLeafletMap(dict) {
	await ajaxCall(); //wait for ajax call to complete before executing anything else inside this function
	console.log(statesData);
	count = 0;
	for(var key in dict) {
		var value = dict[key];
		// console.log(key);
		// console.log(key + ": " + value);
		// console.log(statesData.features[count].properties.LAD13CD);
		if (statesData.features[count].properties.LAD13CD = key) {
					var cases = "cases";
					var caseValue = value;
					statesData.features[count].properties[cases] = caseValue;
		}
		count++;
	}

	var map = L.map('map').setView([53, -2], 6);
	var d = new Date();

	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 10,
		attribution: 'Live data fetched from ' +
			'<a href="https://coronavirus.data.gov.uk/details/developers-guide">coronavirus.data.gov.uk</a>' + ' | Updated: '+d.getHours()+':'+d.getMinutes(),
		id: 'mapbox/light-v9',
		tileSize: 512,
		zoomOffset: -1
	}).addTo(map);

	var geojson = L.geoJson(statesData).addTo(map);

	// control that shows state info on hover
		var info = L.control();

		info.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'info');
			this.update();
			return this._div;
		};

		// randomNo = Math.floor((Math.random() * 10000) + 5000);;

		info.update = function (props) {
			this._div.innerHTML =
				'<h4>Coronavirus Cases By Region</h4>' +  (props ?
				'<b>' + '(' + props.LAD13CD + ') ' + props.EER13NM + '</b><br />' + props.cases + ' cases per 100k population'
				: 'Hover over a region to see cumulative cases per 100k<br />Or click on a region for more in-depth info');
		};

		info.addTo(map);


		// get color depending on cases per 100k population
		function getColor(d) {
			return d > 7000 ? '#300026' :
					d > 6000  ? '#5C004A' :
					d > 5000  ? '#003681' :
					d > 4000  ? '#005FAD' :
					d > 3000   ? '#009985' :
					d > 2000   ? '#58C666' :
					d > 1000   ? '#DDF031' :
								'#fff';
		}

		function style(feature) {
			return {
				weight: 2,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.7,
				fillColor: getColor(feature.properties.cases)
			};
		}

		function highlightFeature(e) {
			var layer = e.target;

			layer.setStyle({
				weight: 5,
				color: '#666',
				dashArray: '',
				fillOpacity: 0.7
			});

			if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
				layer.bringToFront();
			}

			info.update(layer.feature.properties);
		}

		var geojson;

		function resetHighlight(e) {
			geojson.resetStyle(e.target);
			info.update();
		}

		//function runs when region on the map is clicked
		function zoomToFeature(e) {
			map.fitBounds(e.target.getBounds()); //zoom in on the map
      // $('#loader2').show();
			// updateDOM(e.target.feature.properties.LAD13CD, getColor(e.target.feature.properties.cases), 21);
			document.getElementsByClassName("right-panel-container")[0].scrollTop = 0; //scroll to top
			updateDOM(e.target.feature.properties.LAD13CD, 21); //call the updateDOM method
			getMVBedsInfo();
		}

		function onEachFeature(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: zoomToFeature
			});
		}

		geojson = L.geoJson(statesData, {
			style: style,
			onEachFeature: onEachFeature
		}).addTo(map);

		var legend = L.control({position: 'bottomright'});

		legend.onAdd = function (map) {

			var div = L.DomUtil.create('div', 'info legend'),
				grades = [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000],
				labels = [],
				from, to;

			for (var i = 0; i < grades.length; i++) {
				from = grades[i];
				to = grades[i + 1];

				labels.push(
					'<i style="background:' + getColor(from + 1) + '"></i> ' +
					from + (to ? '&ndash;' + to : '+'));
			}

			div.innerHTML = labels.join('<br>');
			return div;
		};

		legend.addTo(map);
}
