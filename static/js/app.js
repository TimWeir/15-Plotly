//const sampleFile = "samples.json";

var subjectIndex = 0;





function optionChanged(subjectIndex) {
    buildPlot(subjectIndex);
    demoInfo(subjectIndex);
}

/*
d3.selectAll("#selDataset").on("change", updatePage);
// Function to handle input change
function updatePage() {
    // grab the value of the input field
    var dropMenu = d3.selectAll("#selDataset").node();
    
    //selectIndex = dropMenu.text;
    //console.log(selectIndex);

    var subjectIndex = dropMenu.value;
    console.log(subjectIndex);
    return subjectIndex;
    
    //buildPlot();
    //demoInfo();
};
*/


function buildPlot(patient) {
    d3.json("samples.json").then(function(data){
        var patientData = data.samples.filter(object => object.id == patient);
        var graphData = patientData[0];
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
            title: `First 10 OTUs of ${patient}`
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
                title: `OTU ID Bubble Plot of ${patient}`
                //"position": "bottom"
            }
    
            Plotly.newPlot("bubble", data, layout);
        })
    })
};


function demoInfo(patient) {
    d3.json("samples.json").then(function(data){
        var panel = d3.select("#sample-metadata");
        panel.selectAll("p")
            .data(data)
            .exit()
            .remove();
        var filterInfo = data.metadata.filter(object => object.id == patient);
        var info = filterInfo[0];
        Object.entries(info).forEach(([k,v]) => {
            panel.append("p").text(`${k}: ${v}`);
        });
    });
};


//buildPlot();
//demoInfo();

function init() {
    d3.json("samples.json").then(function(data){
        var population = data.names
        //console.log(population);
        population.forEach(function(patient){
            d3.select("#selDataset")
                .append("option")
                .property("value", patient)
                .text(patient);
        });
        var patientZero = population[0];
        buildPlot(patientZero);
        demoInfo(patientZero)
    });
};

function optionChanged(patient) {
    buildPlot(patient);
    demoInfo(patient);
    //console.log(patient)
}

init();