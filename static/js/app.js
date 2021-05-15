//const sampleFile = "samples.json";


function optionChanged(subjectIndex) {
    buildPlot(subjectIndex);
    demoInfo(subjectIndex);
}


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
            var bValues = graphData.sample_values;
            var bLabels = graphData.otu_ids;
            var bText =  graphData.otu_labels;
            
            var trace2 = {
                x: bLabels,
                y: bValues,
                text: bText,
                mode: 'markers',
                marker: {
                    color: bLabels,
                    size: bValues
                }
            };
            
            data = [trace2];
    
            layout = {
                title: {text: `OTU ID Bubble Plot of ${patient}`,
                position: "bottom center"}
            };
    
            Plotly.newPlot("bubble", data, layout);
            /* Guage chart code pending comepletion
            var data = [
                {
                    domain: { x: [0, 1], y: [0, 1] },
                    value: 270,
                    title: { text: "Belly Button Scrubs per Week" },
                    type: "indicator",
                    mode: "gauge+number"
                }
            ];
            
            var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
            Plotly.newPlot("gauge", data, layout);
            */
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