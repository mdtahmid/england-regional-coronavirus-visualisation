/*
Function takes care of updating the webpage after a section of the map is clicked
Function takes in 2 arguments:
- areaCode (the area code clicked on)
- the number of days of historical data to fetch (for the charts)
*/
function updateDOM(areaCode, days) {
	console.log(days);
	// document.getElementsByClassName("regionSelected")[0].innerHTML = areaCode;
	// console.log(mapColour);
	$.ajax({
			type: "GET",
			url: 'https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=region;areaCode='+areaCode+'&structure={"areaCode":"areaCode","cumCasesByPublishDateRate":"cumCasesByPublishDateRate","areaName":"areaName","areaType":"areaType","newCasesByPublishDate":"newCasesByPublishDate","cumCasesByPublishDate":"cumCasesByPublishDate","cumCasesBySpecimenDateRate":"cumCasesBySpecimenDateRate","newCasesBySpecimenDate":"newCasesBySpecimenDate","hospitalCases":"hospitalCases","covidOccupiedMVBeds":"covidOccupiedMVBeds", "newTestsByPublishDate":"newTestsByPublishDate", "maleCases":"maleCases", "femaleCases":"femaleCases", "newAdmissions":"newAdmissions", "cumAdmissions":"cumAdmissions", "newTestsByPublishDate":"newTestsByPublishDate", "newDeaths28DaysByPublishDate":"newDeaths28DaysByPublishDate", "cumDeaths28DaysByPublishDate":"cumDeaths28DaysByPublishDate", "cumDeaths28DaysByPublishDateRate":"cumDeaths28DaysByPublishDateRate"}',
			dataType: "json",
			success: function(data) {
					console.log(data);

					areaName = data.data[0].areaName; //gets the area name

					var deaths = []; //array to store no of deaths
					var cases = []; //array to store no of cases
					var dates = []; //array to store dates for the above arrays
					var maleCases = [];
					var femaleCases = [];
          var howmanydaysdata = days; //variable to store how many days worth of data to get (for chart)

					for (var i = 0; i < howmanydaysdata; i++) { //loops through x days worth of data
						deaths.push(data.data[i].newDeaths28DaysByPublishDate); //adds all deaths to array
						cases.push(data.data[i].newCasesByPublishDate); //adds all cases to array
						dates.push((moment().subtract(i+1, 'days')).format('DD-MM')); //adds dates to array, use moment.js for correct formatting
					}

					for (var j = 0; j <= 18; j++) { //loop 18 times because that's how many instances there are in the api call return for age breakdown

						var maleCasesPaired = []; //
						var femaleCasesPaired = []; //

 						maleCasesPaired.push(data.data[1].maleCases[j].age); //get male age range
 						maleCasesPaired.push(data.data[1].maleCases[j].value); //get male cases assosicated with age range

 						femaleCasesPaired.push(data.data[1].femaleCases[j].age); //get female age range
 						femaleCasesPaired.push(data.data[1].femaleCases[j].value); //get female cases assosicated with age range

 						maleCases.push(maleCasesPaired); //push set of values to array
 						femaleCases.push(femaleCasesPaired); //push set of values to array
 					}

          //dynamically add the html
          document.getElementsByClassName("regionSelectedPrompt")[0].style.display = "none"; //hide the prompt text
					document.getElementsByClassName("regionSelected")[0].innerHTML = areaName; //display the area name
          document.getElementsByClassName("historicalData")[0].innerHTML = "Historical data for <span class=\"areaNameHighlight marker-animation\">" + areaName + "</span>"; //display the area name
          document.getElementsByClassName("casesByAge")[0].innerHTML = "Active cases in <span class=\"areaNameHighlight marker-animation\">" + areaName + "</span> by age group"; //add to dom
          document.getElementsByClassName("graphToggle")[0].style.display = "block"; //make graph toggle button visible
          document.getElementsByClassName("casesByAgeContainer")[0].style.display = "block"; //show graph containers
          document.getElementsByClassName("casesByAgeContainer")[1].style.display = "block"; //show graph containers
          document.getElementsByClassName("graphToggle")[0].value = howmanydaysdata; //set value of toggle button

          if (howmanydaysdata == 21) { //if 21
            document.getElementsByClassName("graphToggle")[0].innerHTML = "Show last 100 days"; //then change toggle button text to 100 days
          } else {
            document.getElementsByClassName("graphToggle")[0].innerHTML = "Show last 21 days"; //else set to 21 days
          }

					document.getElementsByClassName("areaCode")[0].innerHTML = "(" + data.data[0].areaCode + ")"; //update areacode in DOM
					//update DOM with new cases
					document.getElementsByClassName("placeholder0")[0].innerHTML = "<span class=\"detailNumbers\">+" + numberWithCommas(data.data[0].newCasesByPublishDate) + "</span> <span class=\"restOfText\">new cases in this area today</span>";
					//update DOM with new cases per 100k
          document.getElementsByClassName("placeholder1")[0].innerHTML = "<span class=\"detailNumbers\">" + numberWithCommas(data.data[0].cumCasesByPublishDateRate) + "</span> <i class=\"fas fa-info-circle newCasesByPublishDateInfo tooltipA\" title=\"test\"></i> <span class=\"restOfText\">cases per 100k population</span>";
					//update DOM all time cases
          document.getElementsByClassName("placeholder2")[0].innerHTML = "<span class=\"detailNumbers\">" + numberWithCommas(data.data[0].cumCasesByPublishDate) + "</span> <span class=\"restOfText\">tested positive in this area (all-time)</span>";
					//update DOM with new deaths
	        document.getElementsByClassName("placeholder3")[0].innerHTML = "<span class=\"detailNumbers\">+" + numberWithCommas(data.data[0].newDeaths28DaysByPublishDate) + "</span> <span class=\"restOfText\">new deaths in this area today</span>";
					//update DOM with cumulative deaths
          document.getElementsByClassName("placeholder4")[0].innerHTML = "<span class=\"detailNumbers\">" + numberWithCommas(data.data[0].cumDeaths28DaysByPublishDate) + "</span> <i class=\"fas fa-info-circle newCasesByPublishDateInfo tooltipB\"></i> <span class=\"restOfText\">cumulative deaths within 28 days of positive test</span>";
					//update DOM with cumulative deaths per 100k
          document.getElementsByClassName("placeholder5")[0].innerHTML = "<span class=\"detailNumbers\">" + numberWithCommas(data.data[0].cumDeaths28DaysByPublishDateRate) + "</span> <i class=\"fas fa-info-circle newCasesByPublishDateInfo tooltipC\"></i> <span class=\"restOfText\">cumulative deaths within 28 days of positive test per 100k population</span>";

					//render the charts
					drawDeathsChart(deaths.reverse(), dates.reverse(), areaName, howmanydaysdata);//add death chart to DOM
					drawCasesChart(cases.reverse(), dates, areaName, howmanydaysdata);//add cases chart to DOM
					drawAgeChart(maleCases.sort(), femaleCases.sort()); //add the age chart to DOM

          highlightText(); //run jquery marker highlight

	}
	});



}

/*
Function takes care of adding the mechanical ventilation beds chart
*/
function getMVBedsInfo() {
  $.ajax({
      type: "GET",
      url: 'https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=nation;areaCode=E92000001&structure={"areaCode":"areaCode","cumCasesByPublishDateRate":"cumCasesByPublishDateRate","areaName":"areaName","areaType":"areaType","newCasesByPublishDate":"newCasesByPublishDate","cumCasesByPublishDate":"cumCasesByPublishDate","cumCasesBySpecimenDateRate":"cumCasesBySpecimenDateRate","newCasesBySpecimenDate":"newCasesBySpecimenDate","hospitalCases":"hospitalCases","covidOccupiedMVBeds":"covidOccupiedMVBeds", "newTestsByPublishDate":"newTestsByPublishDate", "newAdmissions":"newAdmissions", "newTestsByPublishDate":"newTestsByPublishDate", "newDeaths28DaysByPublishDate":"newDeaths28DaysByPublishDate", "cumDeaths28DaysByPublishDate":"cumDeaths28DaysByPublishDate", "cumDeaths28DaysByPublishDateRate":"cumDeaths28DaysByPublishDateRate","date":"date"}',
      dataType: "json",
      success: function(data) {
          console.log(data);

          var covidOccupiedMVBeds = []; //store MV beds occupied value
          var dates = []; //store the dates

          areaName = data.data[0].areaName; //gets the area name
          document.getElementsByClassName("bedsOccupied")[0].innerHTML = "COVID ventilator beds occupied in <span class=\"areaNameHighlight marker-animation\">" + areaName + "</span> over time"; //update DOM

          for (var j = 1; j <= 200; j++) { //get data for last 200 days
            covidOccupiedMVBeds.push(data.data[j].covidOccupiedMVBeds); //push bed occupied value to array
            dates.push(data.data[j].date); //push assosicated date to array
          }

					//render the chart
          drawBedsChart(covidOccupiedMVBeds.reverse(), dates.reverse()); //add mechanical ventilation beds chart to DOM
          document.getElementsByClassName("capacity")[0].innerHTML = "NHS maximum care bed capacity: ~5,900"; //update DOM with text
      }
  });
}

/*
Function toggles the graph view from 21 days to 100 days and vice-versa
 */
function updateDOMHelper() {
  days = document.getElementsByClassName("graphToggle")[0].value; //get value from graph button element
  areaCode = document.getElementsByClassName("areaCode")[0].innerHTML; //get area code of currently selected area

  if (days == 21) { //check if value equals to 21
    updateDOM(areaCode.replace(/[\(\)']+/g,''), 100); //update DOM with 100 day graph
    document.getElementsByClassName("graphToggle")[0].value = 100; //change button value 100
  } else {
    updateDOM(areaCode.replace(/[\(\)']+/g,''), 21); //update DOM with 21 day graph
    document.getElementsByClassName("graphToggle")[0].value = 21; //change button value to 21
  }
}
