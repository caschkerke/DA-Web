/**
 * Helper function to select sample data
 * Returns an array of values
 * @param {array} rows
 * @param {integer} index
 * ==== samples.json structure breakdown ====
 * 
 * Array 0 - metadata:
 *  == Contains 153 nested arrays ==
 *  == Found within each nested array: ==
 *      - id
 *      - ethnicity
 *      - gender
 *      - age
 *      - location
 *      - bbtype
 *      - wfreq
 * 
 * Array 1 - names:
 *  == Contains 153 ID values ==
 * 
 * Array 2 - samples:
 *  == Contains 153 nested arrays ==
 *  == Found within each nested array: ==
 *      - an array of otu_ids
 *      - an array of sample_values
 *      - an array of otu_labels
 */

function unpack(rows, index) {
    return rows.map(function(row) {
      return row[index];
    });
}

//  Defining init function to hold a tentative "template" of graph/visual displays
function init() {
    d3.json("data/samples.json").then((importedData) => {
        
        var data = importedData;
        var sampleData = data.samples
        var dropdownMenu = document.getElementById("selDataset"); 
        var ids = [];

        for (var i = 0; i < sampleData.length; i++) {
            
            var id = sampleData[i].id;
            ids.push(id);
            
            var ele = document.createElement("option");
            ele.textContent = ids[i];
            ele.value = ids[i];
            dropdownMenu.appendChild(ele);

        }

        var dataBar = [{
            x: [],
            y: []
        }];

        var layoutBar = {
            title: `Top 10 OTUs found for `,
            xaxis: { title: "Values" },
            yaxis: { title: "OTU IDs" }
        };

        Plotly.newPlot("bar", dataBar, layoutBar);

        console.log(data);
        console.log(ids);
    })
}

// Calling updatePlotly() when a change to the DOM takes place
d3.selectAll("#selDataset").on("change", updatePlotly);

function updatePlotly() {

    d3.json("data/samples.json").then((importedData) => {

// Defining + flattening dropdownmenu ID, flattening data calls
        var data = importedData;
        var s = data.samples;
        var m = data.metadata;
        var dropdownMenu = d3.select("#selDataset");
        var dataset = dropdownMenu.property("value");

        console.log(m)

// Creating empty lists to hold matching iterated values
        var sampleIDs = [];
        var sampleOtuIDs = [];
        var sampleValues = [];
        var sampleOtuLabs = [];
        var sampOtuIdTen = [];
        var sampValTen = [];
        var sampOtuLabTen = [];

        var metaID = [];
        var metaEthnicity = [];
        var metaGender = [];
        var metaAge = [];
        var metaLocation = [];
        var metaBBType = [];
        var metaWfreq = [];
        
// Looping through dataset and pulling relevant values by ID
        for (var i = 0; i < s.length; i++) {
            
            var sID = s[i].id;
            var mID = m[i].id;

            if (sID === dataset) {
                
                var oId = s[i].otu_ids;        
                var value = s[i].sample_values;
                var lab = s[i].otu_labels;
                var oIdTen = s[i].otu_ids.slice(0, 10);        
                var valueTen = s[i].sample_values.slice(0, 10);
                var labTen = s[i].otu_labels.slice(0, 10);
                
                sampleIDs.push(sID);
                sampleOtuIDs.push(oId);
                sampleValues.push(value);
                sampleOtuLabs.push(lab);
                sampOtuIdTen.push(oIdTen);
                sampValTen.push(valueTen);
                sampOtuLabTen.push(labTen);

            }

            if (mID == dataset && mID == sID) {
                
                var meEth = m[i].ethnicity;
                var meGen = m[i].gender;
                var meAge = m[i].age;
                var meLoc = m[i].location;
                var meBBT = m[i].bbtype;
                var meWfrq = m[i].wfreq;

                metaID.push(mID);
                metaEthnicity.push(meEth);
                metaGender.push(meGen);
                metaAge.push(meAge);
                metaLocation.push(meLoc);
                metaBBType.push(meBBT);
                metaWfreq.push(meWfrq);

            }
        }

// Verifying successful data import via console
        console.log(sampOtuIdTen.map(String));
        console.log(sampValTen);
        console.log(sampOtuLabTen);
        console.log(sampleValues);
        console.log(sampleOtuIDs),
        console.log(sampleOtuLabs)

        console.log(metaID);
        console.log(metaEthnicity);
        console.log(metaGender);
        console.log(metaAge);
        console.log(metaLocation);
        console.log(metaBBType);
        console.log(metaWfreq);
        console.log(sampOtuIdTen)
// Populating demographic panel with subject information
        var p1 = document.getElementById("sample-id")
        p1.textContent = `id: ${metaID}`;

        var p2 = document.getElementById("sample-eth")
        p2.textContent = `ethnicity: ${metaEthnicity}`;

        var p3 = document.getElementById("sample-gen")
        p3.textContent = `gender: ${metaGender}`;

        var p4 = document.getElementById("sample-age")
        p4.textContent = `age: ${metaAge}`;

        var p5 = document.getElementById("sample-loc")
        p5.textContent = `location: ${metaLocation}`;

        var p6 = document.getElementById("sample-bbt")
        p6.textContent = `bbtype: ${metaBBType}`;
        
        var p7 = document.getElementById("sample-wfrq")
        p7.textContent = `wfreq: ${metaWfreq}`;

// Creating chart traces
        // var colorScale = d3.scale.ordinal().domain(["000","1000","2000",""])
        //         .range(["#FF0000", "#00FF00", "#0000FF"]);

        var traceBar = {
            type: "bar",
            x: sampValTen[0],
            y: `${sampOtuIdTen.map(String)}`,
            text: sampOtuLabTen[0],
            marker: { 
                color: "#009999",
                line: {
                    width: 2
                },
            },
            orientation: "h",
        };

        var traceBubble = {

            x: sampleOtuIDs[0],
            y: sampleValues[0],
            mode: "markers",
            marker: {
                // color: colorScale,
                // rules: [{
                //     alpha: 0.8,
                //     backgroundColor: '#ff8a80',
                //     rule: "y >= 2500"
                //   },
                //   {
                //     alpha: 0.8,
                //     backgroundColor: '#82b1ff',
                //     rule: "y > 1250 && y < 2500"
                //   },
                //   {
                //     alpha: 0.8,
                //     backgroundColor: '#b388ff',
                //     rule: "y < 1250"
                //   }],
                size: sampleValues[0],
                sizeref: 0.1,
                sizemode: "area"
            },
            text: sampleOtuLabs[0],
            type: "scatter"
        };

// Defining chart datasets
        var dataBar = [traceBar];
        var dataBubble = [traceBubble];
        
// Defining chart layouts/styles
        var layoutBar = {
            title: `Top 10 OTUs found for ${dataset}`,
            xaxis: { 
                title: "Values",
                autorange: true
            },
    // Couldn't figure out how to rename the tick labels.
            yaxis: { 
                autotick: false,
                // showticklabels: true,
                // showtickprefix: "all",
                // tickprefix: sampOtuIdTen.map(String)
                // tickprefix: `${sampOtuIdTen.map(String)}`
                // tickprefix: sampOtuIdTen.keys()
            }
        };

        var layoutBubble = {
            xaxis: {
                title: "OTU ID"
            }
        };

// Opted to use purge instead of restyle/update when creating new bar graphs by user selection
        Plotly.purge("bar");

// Creating the charts
        Plotly.newPlot("bar", dataBar, layoutBar);
        Plotly.newPlot("bubble", dataBubble, layoutBubble);
    });
}

// Running initialization function
init();




// I miss python