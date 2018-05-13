$(function() {

initialLoad = true
time = initTime();
transitions(bars=1200, text=1500, update=100);

initSliderDate = time.timeRange[time.timeRange.length - 2].toISOString()

ajaxSettings = getTermsAjaxSettings(initSliderDate)


initTopTen(ajaxSettings);
initGradient();
initSlider(time.times);



// bars(time.timeRange);
// slider(time.times);

});


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
        "crossDomain": true,
        "url": "http://127.0.0.1:5000/politimoment/" + DATE,
        "method": "GET",
        "headers":    {
            "Content-Type": "application/json",
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
            .duration(10000)
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

/////////////////////////
// Create DOM Elements //
/////////////////////////

function initTopTen(ajaxSettings){

    svg =   d3.select('.canvas_frame')
            .append('svg')
            .attr('class', 'frame_svg')
            .attr('width', '100%')
            .attr('height', '100%') 

    barsFrame = svg.append('svg')
                .attr('class', 'bars_frame')
                .attr('width', '100%')
                .attr('height','90%')


    $.ajax(ajaxSettings).done(function (data) {



    for (var color in data) {
        var bdata = data['blue'];
        var rdata = data['red'];
        }

    termsData = {red:data['red'], blue:data['blue']}

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
                .attr('x', '50%')
                .attr('height', '8%')
                .attr("fill", "url(#redGradient)")
                .attr('width', '0px')
                .exit();

    blue_texts = barsFrame.append('g').attr('class', 'blueLabels').selectAll('text')
                .data(tenBlue)
                .enter()
                .append('text')
                .text(function(d) { return d.term; })
                .attr('class','labels')
                .classed('load', true)
                .attr('x', '50%')
                .attr('y', function(d, i) { return (i * 9) + 6 + '%'; });

    red_texts  = barsFrame.append('g').attr('class', 'redLabels').selectAll('text')
                .data(tenRed)
                .enter()
                .append('text')
                .text(function(d) { return d.term; })
                .attr('class','labels')
                .classed('load', true)
                .attr('x', '50%')
                .attr('y', function(d, i) { return (i * 9) + 6 + '%'; })
                .on('click', function () {
                    examineTermEnter(d3.select(this, termsData))
                    });

        
        updateTen(ajaxSettings)
})}

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


    var sliderDateSVG = d3.select(".slider_frame").append('text')
                    .attr('class', 'date_text')
                    .attr('x', '50%')
                    .attr('y', '-30%')
                    .style('text-anchor', 'middle')
                    .text(max_time);
}

function dragmove(){

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


    data = data

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
            .range([25, 50])
            .clamp(true);

        newrscale = d3.scaleLinear()
            .domain([Math.min(... redValues), Math.max(... redValues)])
            .range([25, 50])
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


    blue_texts.classed('load', true)
            .transition(t3)
            .on('end', function(d){ 
                blue_texts.data(newBlue)
                .text(function(d) { return d.term; })
                .classed('load', false)
                })
            .transition(t2)
            .delay(function(d, i) { return i * del; })
            .attr('x', (function(d) { return  (50 - (Math.floor(newbscale(d.score))/4))-6+'%';}));

    red_texts.classed('load', true)
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

})}

function examineTermEnter(term, termsData) {
    console.log(termsData)
    console.log(term.datum())
    d3.selectAll(".labels")



    // .transition()
    // .delay(function(d, i) { return i * del/4; })
    // .attr('x', '50%')
    // .style('opacity', '0')



}








