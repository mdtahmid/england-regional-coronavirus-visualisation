/*
Function plots the mechanical ventilation beds chart
Takes in 2 variables:
(1) a beds array,
(2) a dates array
 */
function drawBedsChart(beds, dates) {
  FusionCharts.ready(function () {
	    var data = []; //data array for chart
	    var category = []; //category (date) array for chart

	    for (var i = 0; i < beds.length; i++) { //loop through the entire beds array
	        data.push({
	            "value":  '' + beds[i] + '' //add data to the data array
	        })
	        category.push({
	            "label": '' + dates[i] + '' //add dates to the category array
	        })
	    }
	    var bedChart = new FusionCharts({
	        type: 'msarea', //new area chart
	        renderAt: 'chart-beds',
	        width: '100%',
	        height: '100%',
        	captionFontSize: "18",
	        dataFormat: 'json',
	        dataSource:
	        {
	            "chart": {
        					numbersuffix: " MV beds",
        					theme: "fusion",
        					paletteColors: "#f39c12",
        					plotToolText: "$seriesName (" + "$label" + ")<br> $dataValue <br> $displayValue",
        					showLegend: "0"
	            },
              "categories": [{
                    "category": category
              }],
              "dataset": [{
                  // "seriesname": areaName,
                  "data": data
                }
              ]
	        }
	    }).render();
	});
}

/*
Function plots the deaths chart
Takes in 4 variables:
(1) number of deaths (array),
(2) the assosicated dates of those deaths (array)
(3) the area areaName
(4) how many days worth of data to plot
 */
function drawDeathsChart(deaths, dates, areaName, noofdays) {
	FusionCharts.ready(function () {
	    var data = [];
	    var category = [];

	    for (var i = 0; i < noofdays; i++) {
	        data.push({
	            "value":  '' + deaths[i] + ''
	        })
	        category.push({
	            "label": '' + dates[i] + ''
	        })
	    }
	    var deathsChart = new FusionCharts({
	        type: 'msline',
	        renderAt: 'chart-deaths',
	        width: '100%',
	        height: '100%',
        	captionFontSize: "18",
	        dataFormat: 'json',
	        dataSource:
	        {
	            "chart": {
        					caption: "Daily deaths in "+areaName+" (last " + noofdays + " days)",
        					numbersuffix: " deaths",
        					theme: "fusion",
        					paletteColors: "#ff6b6b",
        					plotToolText: "$seriesName (" + "$label" + ")<br> $dataValue <br> $displayValue",
        					showLegend: "0"
	            },
              "categories": [{
                "category": category
              }],
              "dataset": [{
                  "seriesname": areaName,
                  "data": data
                }
              ]
	        }
	    }).render();
	});
}

/*
Function plots the cases chart
Takes in 4 variables:
(1) number of cases (array),
(2) the assosicated dates of those cases (array)
(3) the area areaName
(4) how many days worth of data to plot
 */
 function drawCasesChart(cases, dates, areaName, noofdays) {
 	FusionCharts.ready(function () {
 	    var data = [];
 	    var category = [];

 	    for (var i = 0; i < noofdays; i++) {
 	        data.push({

 	            "value":  '' + cases[i] + ''
 	        })
 	        category.push({
 	            "label": '' + dates[i] + ''

 	        })
 	    }
 	    var casesChart = new FusionCharts({
 	        type: 'msline',
 	        renderAt: 'chart-cases',
 	        width: '100%',
 	        height: '100%',
 	        dataFormat: 'json',
 	        dataSource:
 	        {
 	            "chart": {
                   caption: "Daily cases in "+areaName+" (last " + noofdays + " days)",
                   numbersuffix: " cases",
                   theme: "fusion",
                   paletteColors: "#5f27cd",
         					plotToolText: "$seriesName (" + "$label" + ")<br> $dataValue <br> $displayValue",
         					showLegend: "0"
 	            },
               "categories": [{
                 "category": category
               }],
               "dataset": [{
                   "seriesname": areaName,
                   "data": data
                 }
               ]
 	        }
 	    }).render();
 	});
 }


 /*
 Function plots the age group chart
 Takes in 4 variables:
 (1) Male cases (2d array),
 (2) Female cases (2d array)
  */
function drawAgeChart(maleCases, femaleCases) {
	 FusionCharts.ready(function () {
 	    var data = []; //array stores data for males
 	    var data2 = []; //array stores data for females
 	    var category = []; //array stores age range

 	    for (var i = 0; i < maleCases.length; i++) { //loop through length of array
 	        data.push({
 	            "value":  '' + maleCases[i][1] + '' //add male cases to array
 	        })
 	        data2.push({
 	            "value":  '' + femaleCases[i][1] + '' //add female cases to array
 	        })
 	        category.push({
 	            "label": '' + maleCases[i][0].replace(/_/g, " ") + '' //add age ranges to array
 	        })
 	    }
 	    var casesChart = new FusionCharts({
 	        type: 'scrollcolumn2d', //scrollable 2d chart
 	        renderAt: 'chart-age',
 	        width: '100%',
 	        height: '100%',
 	        dataFormat: 'json',
 	        dataSource:
 	        {
 	            "chart": {
                numbersuffix: " cases",
                theme: "fusion",
                // paletteColors: "#6c5ce7, #fd79a8",
                plotToolText: "$seriesName (Age " + "$label" + ")<br> $dataValue <br> ",
                showLegend: "1",

 	            },
               "categories": [{
                 "category": category
               }],
               "dataset": [{
                   "seriesname": "Male",
                   "data": data,

                 },
                 {
                 	"seriesname": "Female",
                   "data": data2,
                 }
               ]
 	        }
 	    }).render();
 	});
}
