$(function() {

time = initTime();
trans = transitions();

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
                    .range([timeRange[timeRange.length - 1], timeRange[0]]);
    
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

function transitions(bars=1700, text=1900, update=100) {
    let t = d3.transition()
        .duration(bars)
        .ease(d3.easeBounce)

    let t2 = d3.transition()
        .duration(text)
        .ease(d3.easeBounce)

    var t3 = d3.transition()
        .duration(update)

    return {t, t2, t3}
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

    bbars = svg.append('g').attr('id', 'bbarsgroup').selectAll('svg')
                .data(tenBlue)
                .enter()
                .append('rect')
                .attr('class', 'bbars')
                .attr('y', function(d, i) { return (i * 9) + '%'; })
                .attr('x', '-50%')
                .attr('margin-top', '10px')
                .attr('height', '7.5%')
                .attr("fill", "url(#blueGradient)")
                .attr('width', '0px')
                .attr('transform', 'scale(-1,1)');

    rbars = svg.append('g').attr('id', 'rbarsgroup').selectAll('svg')
                .data(tenRed)
                .enter()
                .append('rect')
                .attr('class', 'rbars')
                .attr('y', function(d, i) { return (i * 9) + '%'; })
                .attr('x', '50%')
                .attr('margin-top', '10px')
                .attr('height', '7.5%')
                .attr("fill", "url(#redGradient)")
                .attr('width', '0px');

    blue_texts  = svg.append('g').attr('class', 'blueLabels').selectAll('text')
                .data(tenBlue)
                .enter()
                .append('text')
                .text(function(d) { return d.term; })
                .attr('class','blue_labels')
                .attr('x', '50%')
                .attr('y', function(d, i) { return (i * 9) + 5 + '%'; })
                .attr("fill-opacity", "1");

    red_texts  = svg.append('g').attr('class', 'redLabels').selectAll('text')
                .data(tenRed)
                .enter()
                .append('text')
                .text(function(d) { return d.term; })
                .attr('class','red_labels')
                .attr('x', '50%')
                .attr('y', function(d, i) { return (i * 9) + 5 + '%'; })
                .attr("fill-opacity", "0");
        
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


    var slider  = d3.select('.frame_svg').append('svg')
                    .attr("class", 'slider_frame')
                    .attr("x", "30%")
                    .attr('y', "98%")
                    .attr('height', '5%')
                    .attr('width', '40%')
                    .attr('overflow', 'visible')
                    .attr("id", "slider_id")
                    .append('g').attr('class', 'slider');

    var line    = slider.append('line')
                    .attr('class', 'track')
                    .attr('x1', "0%")
                    .attr('x2', "100%")
                    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
                    .attr("class", "track-inset")
                    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
                    .attr("class", "track-overlay");

    var handle  = slider.insert('circle')
                    .attr('class', 'handle')
                    .attr('r', '9')
                    .attr('cx', "100%")
                    .call(d3.drag()
                        // .subject(testing)
                        .on("drag", dragmove)
                        .on("end", updateTen));

    var sliderDateSVG = slider.append('text')
                    .attr('class', 'date_text')
                    .attr('x', '50%')
                    .attr('y', '-40px')
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
            .clamp(true);

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

    bbars.data(newBlue)
        .transition(trans.t)
        // .style('fill', function(d) {return d3.interpolateBlues(newbcscale(d.score));})
        .attr('width', function(d) {return Math.floor(newbscale(d.score)) + '%'; });

    rbars.data(newRed)
        .transition(trans.t)
        // .style('fill', function(d) {return d3.interpolateReds(newrcscale(d.score));})
        .attr('width', function(d) {return Math.floor(newrscale(d.score)) + '%'; });

    blue_texts
            .transition(trans.t3)
            .style('fill-opacity', '0')
            .style('font-size', '0.1')
            .on('end', function(d){ 
                blue_texts.data(newBlue)
                .text(function(d) { return d.term; })
                })
            .transition(trans.t2)
            .delay(200)
            .style('text-anchor', 'middle')
            .style('fill-opacity', '1')
            .style('font-size', '30')
            .attr('x', (function(d) { return  (50 - (Math.floor(newbscale(d.score))/2)) + '%';}));

    red_texts
            .transition(trans.t3)
            .style('fill-opacity', '0')
            .style('font-size', '0.1')
            .on('end', function(d){ 
                red_texts.data(newRed)
                .text(function(d) { return d.term; })
                })
            .transition(trans.t2)
            .delay(200)
            .style('text-anchor', 'middle')
            .style('fill-opacity', '1')
            .style('font-size', '30')
            .attr('x', (function(d) { return  (50 + (Math.floor(newrscale(d.score))/2)) + '%'; }));


})}

// function slideResizer(){}

// function bars(time_range){

// slider_date = time_range[time_range.length - 1].toISOString()

// var settings = {
//   "async": true,
//   "crossDomain": true,
//   "url": "http://127.0.0.1:5000/politimoment/" + slider_date,
//   "method": "GET",
//   "headers": {
//     "Content-Type": "application/json",
//     "Cache-Control": "no-cache",
//   }
// }

// $.ajax(settings).done(function (data) {

//     for (var color in data) {
//         var bdata = data['blue'];
//         var rdata = data['red'];
//     }

//     var topTenBlue = [];
//     var topTenRed  = [];
        
//         for (var key in bdata) {
//         topTenBlue.push(bdata[key][0]);
//         }
//         for (var key in rdata) {
//         topTenRed.push(rdata[key][0]);
//         }

//         bscale = d3.scaleLinear()
//             .domain([topTenBlue[9].score, topTenBlue[0].score])
//             .range([50, 100]);

//         rscale = d3.scaleLinear()
//             .domain([topTenRed[9].score, topTenRed[0].score])
//             .range([50, 100]);

//         let cmin = .65;
//         let cmax = .95;

//         bcscale = d3.scaleLinear()
//                 .domain([topTenBlue[9].score, topTenBlue[0].score])
//                 .range([cmin, cmax]);

//         rcscale = d3.scaleLinear()
//                 .domain([topTenBlue[9].score, topTenBlue[0].score])
//                 .range([cmin, cmax]);

// var t = d3.transition()
//       .duration(1700)
//       .ease(d3.easeBounce)

// var t2 = d3.transition()
//       .duration(1900)
//       .ease(d3.easeBounce)

//         bbars = svg.append('g').attr('id', 'bbarsgroup').selectAll('svg')
//                 .data(topTenBlue)
//                 .enter()
//                 .append('rect')
//                 .attr('class', 'bbars')
//                 .attr('y', function(d, i) { return (i * 9) + '%'; })
//                 .attr('transform', 'scale(-1,1)')
//                 .attr('x', '-50%')
//                 .attr('margin-top', '10px')
//                 .attr('height', '8%')
//                 .style('fill', function(d) {return d3.interpolateBlues(bcscale(d.score));})
//                 .attr('width', '0px')
//                 .text(function(d) { return d.term; });

//         window.rbars = svg.append('g').attr('id', 'rbarsgroup').selectAll('svg')
//               .data(topTenRed)
//                 .enter()
//                 .append('rect')
//                 .attr('class', 'rbars')
//                 .attr('y', function(d, i) { return (i * 9) + '%'; })
//                 .attr('x', '50%')
//                 // .attr('rx', '10')
//                 .attr('margin-top', '10px')
//                 .attr('height', '8%')
//                 .style('fill', function(d) {return d3.interpolateReds(rcscale(d.score));})
//                 .attr('width', '0px')
//                 .text(function(d) { return d.term; });

//         var del = 200;

//         bbars.transition(t)
//             .delay(function(d, i) { return i * del; })
//             .attr('width', function(d) { return Math.floor(bscale(d.score))/2 + '%'; });
//         rbars.transition(t)
//             .delay(function(d, i) { return i * del; })
//             .attr('width', function(d) { return Math.floor(rscale(d.score))/2 + '%'; });

//         window.blue_texts  = svg.append('g').attr('class', 'blue_labels').selectAll('text')
//                             .data(topTenBlue)
//                             .enter()
//                             .append('text')
//                             .text(function(d) { return d.term; })
//                             .attr('class','blue_labels')
//                             .attr('x', '50%')
//                             .attr('y', function(d, i) { return (i * 9) + 5 + '%'; })
//                             .style("opacity", "0")
//                             ;

//         window.red_texts  = svg.append('g').attr('class', 'red_labels').selectAll('text')
//                             .data(topTenRed)
//                             .enter()
//                             .append('text')
//                             .text(function(d) { return d.term; })
//                             .attr('class','red_labels')
//                             .attr('x', '50%')
//                             .attr('y', function(d, i) { return (i * 9) + 5 + '%'; })
//                             .style("opacity", "0")
//                             ;

//         blue_texts.transition(t2)
//                 .delay(function(d, i) { return i * del; })
//                 .style("opacity", ".9")
//                 .attr('x', (function(d) { return  (50 - Math.floor(bscale(d.score))/4) + '%'; }))

//         red_texts.transition(t2)
//                 .delay(function(d, i) { return i * del; })
//                 .style("opacity", ".9")
//                 .attr('x', (function(d) { return  (50 + Math.floor(rscale(d.score))/4) + '%';}))

// })
// }

// function zero_pad(dateString){
//     if (dateString[17] != '1'){
//         dateString = dateString.slice(0,17) + '0' + dateString.slice(17)}

//     return dateString
//     } 


// function slider(times){

// var options = {
//             weekday: "short",
//             year: "numeric",
//             month: "2-digit",
//             day: "2-digit",
//             hour: "2-digit"
//             };

// var max_time = zero_pad(times(100).toLocaleString([],options))


//     var slider  = d3.select('.frame_svg').append('svg')
//                     .attr("class", 'slider_frame')
//                     .attr("x", "30%")
//                     .attr('y', "98%")
//                     .attr('height', '5%')
//                     .attr('width', '40%')
//                     .attr('overflow', 'visible')
//                     .attr("id", "slider_id")
//                     .append('g').attr('class', 'slider');

//     var line    = slider.append('line')
//                     .attr('class', 'track')
//                     .attr('x1', "0%")
//                     .attr('x2', "100%")
//                     .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
//                     .attr("class", "track-inset")
//                     .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
//                     .attr("class", "track-overlay");

//     var handle  = slider.insert('circle')
//                     .attr('class', 'handle')
//                     .attr('r', '9')
//                     .attr('cx', "100%")
//                     .call(d3.drag()
//                         .on("drag", dragmove)
//                         .on("end", update_bars));


// slider_frame = document.getElementById('slider_id');

// bBox = slider_frame.getBBox();

// slideScaler = d3.scaleLinear()
//         .domain([0, bBox.width])
//         .range([0, 100])
//         .clamp(true);  

// var sliderDateSVG = slider.append('text')
//                         .attr('class', 'date_text')
//                         .attr('x', '50%')
//                         .attr('y', '-40px')
//                         .style('text-anchor', 'middle')
//                         .text(max_time);

//     var options = {
//         weekday: "short",
//         year: "numeric",
//         month: "2-digit",
//         day: "2-digit",
//         hour: "2-digit"
//         };

// stepScaler = d3.scaleLinear()
//             .domain([0, 100])
//             .range([0, 41])
//             .clamp(true);



// }

// function update_bars(){

// var settings = {
//   "async": true,
//   "crossDomain": true,
//   "url": "http://127.0.0.1:5000/politimoment/" + slider_date,
//   "method": "GET",
//   "headers": {
//     "Content-Type": "application/json",
//     "Cache-Control": "no-cache",

//   }
// }
// $.ajax(settings).done(function (data) {

// for (var color in data) {
//         var bdata = data['blue'];
//         var rdata = data['red'];
//     }

//         var newBlue = [];
//         var newRed  = [];
        
//         for (var key in bdata) {
//         newBlue.push(bdata[key][0]);
//         }
//         for (var key in rdata) {
//         newRed.push(rdata[key][0]);
//         }

//         blueValues = [];
//         for (value in newBlue){
//             blueValues.push(newBlue[value]['score'])
//         }
//         redValues = [];
//         for (value in newRed){
//             redValues.push(newRed[value]['score'])
//         }


//         newbscale = d3.scaleLinear()
//             .domain([Math.min(... blueValues), Math.max(... blueValues)])
//             .range([50, 100]);

//         newrscale = d3.scaleLinear()
//             .domain([Math.min(... redValues), Math.max(... redValues)])
//             .range([50, 100]);

//         let cmin = .65;
//         let cmax = .95;

//         newbcscale = d3.scaleLinear()
//                 .domain([Math.min(... blueValues), Math.max(... blueValues)])
//                 .range([cmin, cmax]);

//         newrcscale = d3.scaleLinear()
//                 .domain([Math.min(... redValues), Math.max(... redValues)])
//                 .range([cmin, cmax]);

// var t = d3.transition()
//       .duration(1700)
//       .ease(d3.easeBounce)

// var t2 = d3.transition()
//       .duration(1900)
//       .ease(d3.easeBounce)

// var t3 = d3.transition()
//         .duration(100)

// var del = 50;

//     bbars.data(newBlue)
//         .transition(t)
//         .attr('width', function(d) { return Math.floor(newbscale(d.score))/2 + '%'; })
//         .style('fill', function(d) {return d3.interpolateBlues(newbcscale(d.score));});

//     rbars.data(newRed)
//         .transition(t)
//         .attr('width', function(d) { return Math.floor(newrscale(d.score))/2 + '%'; })
//         .style('fill', function(d) {return d3.interpolateReds(newrcscale(d.score));})

//     blue_texts
//             .transition(t3)
//             .style('fill-opacity', '0')
//             .style('font-size', '0.1')
//             .on('end', function(d){ 
//                 blue_texts.data(newBlue)
//                 .text(function(d) { return d.term; })
//                 })
//             .transition(t2)
//             .delay(200)
//             .style('text-anchor', 'middle')
//             .style('fill-opacity', '1')
//             .style('font-size', '30')
//             .attr('x', (function(d) { return  (50 - (Math.floor(newbscale(d.score))/4)) + '%';}));

//             (function(d) { return  (50 - (Math.floor(newbscale(d.score))/4)) + '%';})

//     red_texts
//             .transition(t3)
//             .style('fill-opacity', '0')
//             .style('font-size', '0.1')
//             .on('end', function(d){ 
//                 red_texts.data(newRed)
//                 .text(function(d) { return d.term; })
//                 })
//             .transition(t2)
//             .delay(200)
//             .style('text-anchor', 'middle')
//             .style('fill-opacity', '1')
//             .style('font-size', '30')
//             .attr('x', (function(d) { return  (50 + (Math.floor(newrscale(d.score))/4)) + '%'; }));
// })
// }








