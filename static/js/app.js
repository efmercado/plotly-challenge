// Establishing global variables
var value = "";
var data;
var metaData;
var samples;

// Initial function for when the page is first loaded
function init() {

    // Using the D3 library to read in samples.json
    d3.json("../data/samples.json").then((data) => {

        data = data

        metaData = data.metadata;
        names = data.names;
        samples = data.samples;

        var filteredDataSet = samples.filter(sample => sample.id === "940")
        var filteredMeta = metaData.filter(meta => meta.id === 940)

        // Calling functions to display initial charts
        displayHBar(filteredDataSet);
        displayBubble(filteredDataSet)
        displayMeta(filteredMeta)
        displayGauge(filteredMeta)
        
        // Setting the different options
        var options = d3.select("#selDataset");
        names.forEach(name => options.append("option").text(name))
        
    });
};

// Function for when a change occurs
function handleChange(value) {

    var filteredDataSet = samples.filter(sample => sample.id === value)
    var filteredMeta = metaData.filter(meta => meta.id === parseInt(value))

    displayHBar(filteredDataSet);
    displayBubble(filteredDataSet)
    displayMeta(filteredMeta)
    displayGauge(filteredMeta)
};

// Function for deploying metadata
function displayMeta(filteredDataSet){
    var meta = filteredDataSet.map(data => data)[0];

    function displayObject(obj){
        var str = ""
        Object.entries(obj).forEach(([key, value]) =>
            str += `${key}: ${value}<br>`
        )
        return str
    };
        
    d3.select("#meta").html(displayObject(meta));
};

// Function for horizontal bar chart
function displayHBar(dataSet){

    var xData = dataSet.map(sample_value => sample_value.sample_values)[0];
    var yData = dataSet.map(sample_value => sample_value.otu_ids)[0];
    var textData = dataSet.map(sample_value => sample_value.otu_labels)[0];

    var yRenamed = [];

    for(var i=0; i<yData.length; i++){
        yRenamed.push(`OTU ${yData[i]}`)
    };

    var trace = {
        x: xData.slice(0,10),
        y: yRenamed.slice(0,10),
        text: textData.slice(0,10),
        type: 'bar',
        orientation: 'h'
    };

    var data = [trace];

    var layout = {
        title: "Top 10 OTUs",
        yaxis: {
            autorange: "reversed"
        }
    };

    Plotly.newPlot('bar-plot', data, layout);
};

// Function for bubble chart
function displayBubble(dataSet){

    var xData = dataSet.map(sample_value => sample_value.otu_ids)[0];
    var yData = dataSet.map(sample_value => sample_value.sample_values)[0];
    var textData = dataSet.map(sample_value => sample_value.otu_labels)[0];

    trace = {
        x: xData,
        y: yData,
        text: textData,
        mode: "markers",
        marker: {
            color: xData,
            size: yData
        }
    };

    var data = [trace];

    var layout = {
        xaxis: {title: "OUT ID"}
    };

    Plotly.newPlot('bubble-plot', data, layout);

}

// Function for gauge display
function displayGauge(filteredMeta){
    var data = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: filteredMeta[0].wfreq,
          title: { text: "Belly Button Washing Frequency <br> Scrubs Per Week", font: { size: 24 } },
          gauge: {
            axis: { range: [null, 9], tickwidth: 2, tickcolor: "darkblue" },
            bar: { color: "darkred" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
              { range: [0, 1], color: "rgba(240, 230, 215, .5)"},
              { range: [1, 2], color: "rgba(232, 226, 202, .5)" },
              { range: [2, 3], color:  "rgba(210, 206, 145, .5)" },
              { range: [3, 4], color: "rgba(202, 209, 95, .5)" },
              { range: [4, 5], color: "rgba(170, 202, 42, .5)" },
              { range: [5, 6], color: "rgba(110, 154, 22, .5)" },
              { range: [6, 7], color: "rgba(14, 127, 0, .5)" },
              { range: [7, 8], color: "rgba(10, 120, 22, .5)" },
              { range: [8, 9], color: "rgba(0, 105, 11, .5)" }
            ],
          }
        }
      ];

      var layout = {
        width: 500,
        height: 400,
        margin: { t: 25, r: 25, l: 25, b: 25 },
        paper_bgcolor: "white",
        font: { color: "black", family: "Arial" }
      };
      
      Plotly.newPlot('gauge', data, layout);
}

init()


