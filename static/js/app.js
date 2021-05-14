//const sampleFile = "samples.json";

var subjectIndex = 0;


/*
// Use D3 to select the dropdown menu
var dropdownMenu = d3.select("#selDataset");
// Assign the value of the dropdown menu option to a variable
var dataset = dropdownMenu.property("value");
*/


// grab subject ID from dropdown menu

function popDropDown() {
    d3.json("samples.json").then(function(data){
        var population = data.names
        console.log(population)
        //var selectList = d3.select("#selDataset");
        population.forEach(function(patient){
            d3.select("#selDataset")
                .append("option")
                .text(patient);
        });
    });
};



d3.selectAll(".well").on("change", updatePage);
// Function to handle input change
function updatePage() {
    
    // grab the value of the input field
    var dropMenu = d3.selectAll("#selDataset").node();

    subjectIndex = dropMenu.id;
    console.log(subjectIndex);

    var dropMenuSelected = dropMenu.value;
    console.log(dropMenuSelected);

    updatePage.on("change", buildPlot);
    updatePage.on("change", demoInfo);
};



function buildPlot() {
    d3.json("samples.json").then(function(data){
        // console.log(data)
        var graphData = data.samples[subjectIndex];
        var values = graphData.sample_values.slice(0,10).reverse();
        var labels = graphData.otu_ids.slice(0,10).reverse();
        var hovertext =  graphData.otu_labels.slice(0,10).reverse();
        //console.log(graphData);  
        //console.log(values);
        //console.log(labels);
        //console.log(hovertext);

        var trace1 = {
            x: values,
            y: labels.map(object => `OTU ${object}`),
            type: "bar",
            orientation: "h",
            text: hovertext
        }
        ;
        
        data = [trace1];

        layout = {
            title: "First 10 OTUs"
        }

        Plotly.newPlot("bar", data, layout);

        d3.json("samples.json").then(function(data){
            var bValues = data.samples[subjectIndex].sample_values;
            var bLabels = data.samples[subjectIndex].otu_ids;
            var bText =  data.samples[subjectIndex].otu_labels;
            
            var trace2 = {
                x: bLabels,
                y: bValues,
                text: bText,
                mode: 'markers',
                marker: {
                    color: bLabels,
                    size: bValues
                }
            }
            ;
            
            data = [trace2];
    
            layout = {
                title: "OTU ID Bubble Plot"
                //"position": "bottom"
            }
    
            Plotly.newPlot("bubble", data, layout);
        })
    })
};


function demoInfo() {
    d3.json("samples.json").then(function(data){
        var panel = d3.select(".panel-body");
        var panelrow = panel.append("p").text(`ID: ${data.metadata[subjectIndex].id}`);
        var panelrow = panel.append("p").text(`Age: ${data.metadata[subjectIndex].age}`);
        var panelrow = panel.append("p").text(`Ethnicity: ${data.metadata[subjectIndex].ethnicity}`);
        var panelrow = panel.append("p").text(`Gender: ${data.metadata[subjectIndex].gender}`);
        var panelrow = panel.append("p").text(`Location: ${data.metadata[subjectIndex].location}`);
        var panelrow = panel.append("p").text(`wfreq: ${data.metadata[subjectIndex].wfreq}`);
    })
};



buildPlot();

popDropDown();

demoInfo();