$(function() {

initialLoad = true

time = initTime();
transitions(bars=1200, text=1500, update=100);

initSliderDate = time.timeRange[time.timeRange.length - 2].toISOString()

ajaxSettings = getTermsAjaxSettings(initSliderDate)

    svg =   d3.select('.canvas_frame')
            .append('svg')
            .attr('class', 'frame_svg')
            .attr('width', '100%')
            .attr('height', '100%') 

initHeaderBar();

initLoader();

})

//////////////////////////
// Initialize Variables //

function initTime() {
    var timeNow     = new Date();
    var weekBack    = d3.timeWeek.offset(timeNow, -1);
    var timeRange   = d3.timeHour.every(4).range(weekBack,timeNow);
    var times       = d3.scaleTime()
                    .domain([100, 0])
                    .range([timeRange[timeRange.length - 2], timeRange[0]]);
    
    return {times, timeRange}
}

function getTermsAjaxSettings(DATE, async=true, crossDomain=true, method='GET'){

    var settings = {
        "async": true,
        "url": "http://34.215.237.208/politimoment/" + DATE,
        "method": "GET",
        "xhrFields": {
            "withCredentials": false
                    },
        "headers":    {
            "Content-Type": "text/plain",
            "Cache-Control": "no-cache",
                    }
        }
    return settings
}

function transitions(bars, text, update) {
    
    t = d3.transition()
        .duration(bars)
        .ease(d3.easeBounce)

    if (initialLoad){
    
    t2 = d3.transition()
            .duration(100)
            .ease(d3.easeBounce);
    }else{
        t2 = d3.transition()
        .duration(text)
        .ease(d3.easeBounce)
    }

    t3 = d3.transition()
        .duration(update)

    del = 100
}

function initLoader(){

    svg.append('g').attr('class', 'loader_box')
        .append('rect')
        .attr('transform-origin', '50%, 50%')
        .attr('x', '20%')
        .attr('y', '20%')
        .attr('height', '60%')
        .attr('width', '60%')
        .attr('opacity', '.0')
        .transition()
        .duration(1000)
        .delay(1000)
        .attr('opacity', '.5')
        .transition()
        .delay(20000)
        .style('opacity', '0')
        .on('end', function (d) {d3.select('.loader_box').remove();
                    initTopTen(ajaxSettings);
                    initGradient();
                    initSlider(time.times);})

d3.select('.loader_box').append('text')
    .text('Reading Articles')
    .attr('x', '50%')
    .attr('y', '62%')
    .attr('text-anchor', 'middle')
    .attr('class', 'labels loader')
    .style('opacity', '0')
    .transition().delay(1000)
    .style('opacity', '1')
    .transition().delay(1000)
    .style('opacity', '0')
    .transition().delay(1000)
    .style('opacity', '1')
    .text('Preprocessing Pandering')
    .transition().delay(1000)
    .style('opacity', '0')
    .transition().delay(1000)
    .text('Mocking Pundits')
    .transition().style('opacity', '1')
    .transition().delay(1000)
    .style('opacity', '0')
    .transition().delay(1000)
    .text('Complete...')
    .transition().style('opacity', '1')
    .transition()
    .delay(1000)
    .style('opacity', '0')
    .transition().delay(1000)
    .on('end', function (d) {d3.select('.loader_box')
    .append('svg:text')
    .attr('x', '50%')
    .attr('y', '35%')
    .attr('text-anchor', 'middle')
    .attr('class', 'labels loader')
    .append('svg:tspan')
    .text("Right now, PolitiClimate's")
    .append('svg:tspan')
    .attr('x', '50%')
    .attr('dy', '4.5%')
    .text('Politibot is Learning')
    .append('svg:tspan')
    .attr('x', '50%')
    .attr('dy', '4.5%')
    .text('The Topics Coming From')
    .append('svg:tspan')
    .attr('x', '50%')
    .attr('dy', '4.5%')
    .text('Our News Media Every 4 Hours.')
    .append('svg:tspan')
    .attr('x', '50%')
    .attr('dy', '4.5%')
    .text('Soon, it will Learn to Speak')
    .append('svg:tspan')
    .attr('x', '50%')
    .attr('dy', '4.5%')
    .text('The Way They Do.')
    .append('svg:tspan')
    .attr('x', '50%')
    .attr('dy', '4.5%')
    .text('Stay Tuned.')})
    .transition()
    .delay(9000)
    .duration(2000)
    .style('opacity', '0')
// Politibot is learning the \n terms most used in \n our media")



d3.select('.loader_box').append('svg:image')
    .attr('xlink:href', 'svg_loaders/tail-spin.svg')
    .style('opacity', '0')
    .attr('height', '10%')
    .attr('width', '10%')
    .attr('x', '45%')
    .attr('y', '45%')
    .transition()
    .delay(1000)
    .style('opacity', '1')
    .transition()
    .delay(10000)
    .attr('y', '70%')
    .attr('x', '47%')
    .attr('height', '6%')
    .attr('width', '6%')
}

/////////////////////////
// Create DOM Elements //
/////////////////////////

function initHeaderBar(){
    headerBar = svg.append('g').attr('class', 'header_bar')

    headerBar.append('rect')
    .attr('width', '100%')
    .attr('height', '10%')
    .attr('opacity', '.5')
    
    headerBar.append('text')
    .text('PolitiClimate').attr('class', 'title')
    .attr('x', '50%')
    .attr('y', '7%')
    .attr('text-anchor', 'middle')
    
    headerBar.append('text')
    .text('A News Media Bot Written by Dima Karpa')
    .attr('class', 'labels header')
    .attr('font-size', '1em')
    .attr('x', '20%')
    .attr('y', '8.5%')
    .attr('text-anchor', 'middle')
    
    headerBar.append('text')
    .text('Version .02a')
    .attr('class', 'labels header')
    .attr('x', '85%')
    .attr('y', '8.5%')
    .attr('text-anchor', 'right')
}

function initTopTen(ajaxSettings){

    barsFrame = svg.append('svg')
                .attr('class', 'bars_frame')
                .attr('y', '10%')
                .attr('width', '100%')
                .attr('height','80%')


    $.ajax(ajaxSettings).done(function (data) {


    for (var color in data) {
        var bdata = data['blue'];
        var rdata = data['red'];
        }

        var tenBlue = [];
        var tenRed  = [];
        
        for (var key in bdata) {
        tenBlue.push(bdata[key][0]);
        }
        for (var key in rdata) {
        tenRed.push(rdata[key][0]);
        }

        blueValues = [];
        for (value in tenBlue){
            blueValues.push(tenBlue[value]['score'])
        }
        redValues = [];
        for (value in tenRed){
            redValues.push(tenRed[value]['score'])
        }

    bbars = barsFrame.append('g').attr('id', 'bbarsgroup').selectAll('svg')
                .data(tenBlue)
                .enter()
                .append('rect')
                .attr('class', 'bbars')
                .attr('y', function(d, i) { return (i * 9) + '%'; })
                .attr('x', '-50%')
                .attr('height', '8%')
                .attr("fill", "url(#blueGradient)")
                .attr('width', '0px')
                .attr('transform', 'scale(-1,1)')
                .exit();

    rbars = barsFrame.append('g').attr('id', 'rbarsgroup').selectAll('svg')
                .data(tenRed)
                .enter()
                .append('rect')
                .attr('class', 'rbars')
                .attr('y', function(d, i) { return (i * 9) + '%'; })
                .attr('r', '15')
                .attr('x', '50%')
                .attr('height', '8%')
                .attr("fill", "url(#redGradient)")
                .attr('width', '0px')
                .exit();

    trbars = barsFrame.append('g').attr('id', 'tbarsgroup').selectAll('svg')
                .data(tenRed)
                .enter()
                .append('rect')
                .attr('class', 'tbars')
                .attr('y', function(d, i) { return (i * 9) + '%'; })
                .attr('x', '50%')
                .attr('height', '8%')
                .attr('width', '0px')
                .exit();

    tlbars = barsFrame.append('g').attr('id', 'tbarsgroup').selectAll('svg')
                .data(tenBlue)
                .enter()
                .append('rect')
                .attr('class', 'tbars')
                .attr('y', function(d, i) { return (i * 9) + '%'; })
                .attr('x', '-50%')
                .attr('transform', 'scale(-1,1)')
                .attr('height', '8%')
                .attr('width', '0px')
                .exit();

    blue_texts = barsFrame.append('g').attr('class', 'blueLabels').selectAll('text')
                .data(tenBlue)
                .enter()
                .append('text')
                .text(function(d) { return d.term; })
                .attr('class','labels topics')
                .classed('load', true)
                .attr('x', '50%')
                .attr('y', function(d, i) { return (i * 9) + 6 + '%'; });

    red_texts  = barsFrame.append('g').attr('class', 'redLabels').selectAll('text')
                .data(tenRed)
                .enter()
                .append('text')
                .text(function(d) { return d.term; })
                .attr('class','labels topics')
                .classed('load', true)
                .attr('x', '50%')
                .attr('y', function(d, i) { return (i * 9) + 6 + '%'; });

    topicTerms = barsFrame.append('g').attr('class', 'termLabels').selectAll('text')
                .data(tenRed)
                .enter()
                .append('text')
                .attr('class','labels termLabel')
                .classed('load', true)
                .attr('x', '50%')
                .attr('y', function(d, i) { return (i * 9) + 6 + '%'; });

        updateTen(ajaxSettings)

}).fail(function() {console.log("Sorry.  Can't access Data :(")})
}

function initSlider(times) {

    var options = {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit"
        };

    var max_time = zero_pad(times(100).toLocaleString([],options))


    var slider  = svg.append('svg')
                    .attr("class", 'slider_frame')
                    .attr("x", "30%")
                    .attr('y', "90%")
                    .attr('height', '10%')
                    .attr('width', '40%')
                    .attr('overflow', 'visible')
                    .attr("id", "slider_id")
                    .append('g').attr('class', 'slider');

    let timeTicks = []
    for (i in time.timeRange){
    if (i % 6 == 0){
        var newTime = time.timeRange[i].toLocaleDateString().slice(0,-5)
    timeTicks.push(newTime)}
    }

    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
        .selectAll("text")
        .data(timeTicks)
        .enter().append("text")
        .attr("x", function(d, i) {return i * (100/timeTicks.length) + "%"}) 
        .attr("y", "40%")
        .attr("text-anchor", "middle")
        .text(function(d, i) { return d; })
        .exit()
        .append('rect')

    var line    = slider.append('line')
                    .attr('class', 'track')
                    .attr('x1', "0%")
                    .attr('x2', "100%")
                    .attr('y1', "25%")
                    .attr('y2', "25%")
                    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
                    .attr("class", "track-inset")
                    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
                    .attr("class", "track-overlay");

    slider.selectAll('circle')
        .data(timeTicks)
        .enter()
        .append('circle')
        .attr("cx", function(d, i) {return i * (100/timeTicks.length) + "%"})
        .attr('r', '3')
        .attr('cy', '25%')

    var handle  = slider.insert('circle')
                    .attr('class', 'handle')
                    .attr('r', '9')
                    .attr('cy', "25%")
                    .attr('cx', "100%")
                    .call(d3.drag()
                        .on("drag", dragmove)
                        .on("end", updateTen));

    var sliderDateSVG = svg.append('text')
                    .attr('class', 'date_text')
                    .attr('x', '50%')
                    .attr('y', '90%')
                    .style('text-anchor', 'middle')
                    .text(max_time);
}

function dragmove(){

    if (termMode){
        d3.selectAll('.tbars')
            .transition()
            .attr('width', '0%')
            .on('end', function(d){
                d3.selectAll('.tbars')
                .exit().remove()
            });

        topicTerms
        .classed('load', true)
        .exit().remove()

        d3.selectAll('.bbars')
        .transition()
        .delay(function(d, i) { return (i+3) * del; })
        .attr('x', '-50%')

        d3.selectAll('.rbars')
        .transition()
        .delay(function(d, i) { return (i+3) * del; })
        .attr('x', '50%')
    }

    var options = {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit"
        };

    var slider_frame = document.getElementById('slider_id');

    var bBox = slider_frame.getBBox();
    
    var slideScaler = d3.scaleLinear()
            .domain([0, bBox.width])
            .range([0, 100])
            .clamp(true);

    var stepScaler = d3.scaleLinear()
            .domain([0, 100])
            .range([0, 41])
            .clamp(false);

    var sliderPosition = Math.max(0, Math.min(100, slideScaler(d3.event.x)))
    var clampedPosition = Math.round(stepScaler(sliderPosition))
    d3.select('.handle').attr("cx", stepScaler.invert(clampedPosition) + "%")
    
    var sliderDateText = time.times(stepScaler.invert(clampedPosition)).toLocaleString([],options)
    d3.select('.date_text').text(zero_pad(sliderDateText));

    sliderDate = time.times(stepScaler.invert(clampedPosition)).toISOString()

    ajaxSettings = getTermsAjaxSettings(sliderDate)
};

function initGradient() {

    var defs = svg.append("defs");

    var blueGradient = defs.append("linearGradient")
                        .attr("id", "blueGradient")
                        .attr("x1", "0%")
                        .attr("x2", "100%")
                        .attr("y1", "50%")
                        .attr("y2", "50%");
        
        blueGradient.append("stop")
            .attr('class', 'start_blue')
            .attr("x", "0%");

        blueGradient.append("stop")
            .attr('class', 'middle_blue')
            .attr("offset", "20%");

        blueGradient.append("stop")
            .attr('class', 'stop_blue')
            .attr("offset", "50%");

    var redGradient = defs.append("linearGradient")
            .attr("id", "redGradient")
            .attr("x1", "0%")
            .attr("x2", "100%")
            .attr("y1", "50%")
            .attr("y2", "50%");

        redGradient.append("stop")
            .attr('class', 'start_red')
            .attr("x", "0%");

        redGradient.append("stop")
            .attr('class', 'middle_red')
            .attr("offset", "20%");

        redGradient.append("stop")
            .attr('class', 'stop_red')
            .attr("offset", "50%");

}

function zero_pad(dateString){
    if (dateString[17] != '1'){
        dateString = dateString.slice(0,17) + '0' + dateString.slice(17)}
    return dateString
    } 

function updateTen(){

    $.ajax(ajaxSettings).done(function (data) {


    for (var color in data) {
        var bdata = data['blue'];
        var rdata = data['red'];
        }

        var newBlue = [];
        var newRed  = [];
        
        for (var key in bdata) {
        newBlue.push(bdata[key][0]);
        }
        for (var key in rdata) {
        newRed.push(rdata[key][0]);
        }

        blueValues = [];
        for (value in newBlue){
            blueValues.push(newBlue[value]['score'])
        }
        redValues = [];
        for (value in newRed){
            redValues.push(newRed[value]['score'])
        }

        newbscale = d3.scaleLinear()
            .domain([Math.min(... blueValues), Math.max(... blueValues)])
            .range([35, 50])
            .clamp(true);

        newrscale = d3.scaleLinear()
            .domain([Math.min(... redValues), Math.max(... redValues)])
            .range([35, 50])
            .clamp(true);

        newbcscale = d3.scaleLinear()
                .domain([Math.min(... blueValues), Math.max(... blueValues)])
                .range([.7, .85]);

        newrcscale = d3.scaleLinear()
                .domain([Math.min(... redValues), Math.max(... redValues)])
                .range([.7, .85]);

    d3.select("#bbarsgroup").selectAll('rect')
        .data(newBlue)
        .transition(t)
        .delay(function(d, i) { return i * del; })
        .attr('width', function(d) {return Math.floor(newbscale(d.score)) + '%'; });

    d3.select("#rbarsgroup").selectAll('rect')
        .data(newRed)
        .transition(t)
        .delay(function(d, i) { return i * del; })
        .attr('width', function(d) {return Math.floor(newrscale(d.score)) + '%'; });


    blue_texts
            .classed('deselected', false)
            .on('click', function () {
                examineTermEnter(d3.select(this), bdata, 'blue')
                })
            .classed('load', true)
            .transition(t3)
            .on('end', function(d){ 
                blue_texts.data(newBlue)
                .text(function(d) { return d.term; })
                .classed('load', false)
                })
            .transition(t2)
            .delay(function(d, i) { return i * del; })
            .attr('x', (function(d) { return  (50 - (Math.floor(newbscale(d.score))/4))-6+'%';}));

    red_texts
            .classed('deselected', false)
            .on('click', function () {
                examineTermEnter(d3.select(this), rdata, 'red')
                })
            .classed('load', true)
            .transition(t3)
            .on('end', function(d){ 
                red_texts.data(newRed)
                .text(function(d) { return d.term; })
                .classed('load', false)
                })
            .transition(t2)
            .delay(function(d, i) { return i * del; })
            .attr('x', (function(d) { return  (50 + (Math.floor(newrscale(d.score))/4))+6+'%'; }));

    initialLoad = false

    termMode = false

})}

function examineTermEnter(term, termsData, color) {

    for (x in termsData){
      if (term.datum().term == termsData[x][0].term){
        var termData = termsData[x]
      }
    };

    // Move Red Bars
    d3.select("#rbarsgroup").selectAll('rect')
    // .classed('deselected', true)
    .transition()
    .attr('x', '80%');

    // Move Blue Bars
    d3.select("#bbarsgroup").selectAll('rect')
    // .classed('deselected', true)
    .transition()
    .attr('x', '-20%');

    // Move and Class Blue Text
    blue_texts
    .classed('deselected', true)
    .transition()
    .attr('x', "10%");
    
    // Move and Class Red Text
    red_texts
    .classed('deselected', true)
    .transition()
    .attr('x', "90%");

    // Unclass term
    term.classed('deselected', false);

    // Assign proper gradient based on selected term
    if (color == 'red'){
        var gradient = "#5E0812";
    }else{
        var gradient = "#2C3D55";
    };

    // Create new array of values
    termValues = [];
        for (value in termData){
            termValues.push(termData[value]['score'])
        }
    
    // Create scale from new array
    termScale = d3.scaleLinear()
        .domain([Math.min(... termValues), Math.max(... termValues)])
        .range([40, 50])
        .clamp(true);

    // Assign new bar widths and colors
    d3.selectAll("#tbarsgroup").selectAll('rect')
        .attr('fill', gradient)
        .data(termData)
        .transition(t)
        .delay(function(d, i) { return i * del; })
        .attr('width', function(d) {return Math.floor(termScale(d.score))/2 + '%'; });

    topicTerms.classed('load', true)
            .transition(t3)
            .on('end', function(d){ 
                topicTerms.data(termData)
                .text(function(d) { return d.term; })
                .classed('load', false)
                })
            .transition(t2)
            .delay(function(d, i) { return i * del; })

    d3.select('.termLabel').transition()
            .style('font-size', '6vmin')
            .attr('y', '7%')

    termMode = true

    // term.append('svg.image')
    //     .attr("xlink:href", "img/donkey.svg")
    //     .attr("width", 40)
    //     .attr("height", 40)
    //     .attr("x", 228)
    //     .attr("y",53);


    // d3.select("#rbarsgroup").selectAll('rect')
    //     .data(newRed)
    //     .transition(t)
    //     .delay(function(d, i) { return i * del; })
    //     .attr('width', function(d) {return Math.floor(newrscale(d.score)) + '%'; });


    // d3.selectAll(".labels")
    //     .classed('load', true)
    //     .transition()
    //     .delay(function(d, i) { return i * del/12; })
    //     .attr('x', '50%')
    //     .style('opacity', '0')
    //     .style('font-size', '0px')

    // d3.selectAll('.rbars')
    //     .transition()
    //     .delay(function(d, i) { return i * del/2; })
    //     .attr('width', '0%')

    // d3.selectAll('.bbars')
    //     .transition()
    //     .delay(function(d, i) { return i * del/2; })
    //     .attr('width', '0%')

    //     termValues = [];
    //         for (value in termData){
    //             termValues.push(termData[value]['score'])
    //         }
        
    //     termScale = d3.scaleLinear()
    //         .domain([Math.min(... termValues), Math.max(... termValues)])
    //         .range([25, 75])
    //         .clamp(true);

    // if (color == 'red'){

    //     d3.select("#rbarsgroup").selectAll('rect')
    //     .data(termData)
    //     // .attr('y', function(d, i) { return (i * 9) + '%'; })
    //     .transition()
    //     .delay(450)
    //     .attr('x', function(d) {return (200 - Math.floor(termScale(d.score)))/4 + '%';})
    //     // .attr('x', '0%')
    //     .attr('width', function(d) {return Math.floor(termScale(d.score))/2 + '%'; });


    // }





}








