/* globals $, d3, Handlebars */

/**
 * @brief A fluent implementation wrapper for rendering D3 charts
 * @note  api: chart(selector) // return this.charts[selector]
 */
window.indystar_chart = {
  
  chart: function(selector) 
  {
    var chart = this.charts[selector];  
    if (typeof chart.settings === 'undefined') {Object.assign(chart, this.chartServiceLogic);}
    return chart;
  },
  
  
  /**
   * @brief Charts have the following api:
   *  getter/setters
   *    container(strSelector)
   *    data(data)
   *    
   *    // fetch data, 
   *    // returns a promise that resolves with (and expects delegate callback function(error, data) {})
   *    fetchData(url)
   *    // renders data into the container (data and container can be passed in directly, 
   *    // and optionally updates the graph settings )
   *    render(data, container, update=true)
   * 
   */
  
  // charts are a transformData and a render function, 
  // additionally they are decorated with chartServiceLogic (see the bottom of the script)
  charts: {
    
    'circleChart1' : {
      // programmatic styling 
      styling : {
        // chart
        chart: {
          
          // margin
          margin: {
            top: 50, 
            right: 50, 
            bottom: 50, 
            left: 50
          }, // end margin
          
          dots: {
            radius: 2
          }, // end dots
          
        } // end chart
      }, // end styling
      
      /**
       * Data
       */
      
        data: null,
        originalData: null,
      
        /**
         * @brief Transform data
         * @note  After ajax response is received, adjust data as needed for rendering via d3.js
         */
        _dateParser : null,
        dateParser: function(value)
        {
          if (this._dateParser === null) {this._dateParser = d3.timeParse("%Y-%m-%d");}
          return (value instanceof Date) ? value : this._dateParser(value);
        },
        dataTransform: function(data) 
        {
          for (var key in data) {
            var d = data[key];
  
            if (!(d.date instanceof Date)) {
              d.date = this.dateParser(d.date);
            }
  
            // d.ctr = d.ctr * 100;
          } // end for
        }, // end transform data
      
        
 
      
      /**
       * Rendering
       */
       
      isClear : true,
        /**
         * Renders a chart with axis, but no data rendered on it
         */
        renderChart: function(options)
        {
          /**
           * context handle for closures that receive bound context by d3
           */
          var that = this;
  
          /**
           * rendering options
           */
          if (typeof options === 'undefined') {options = {}; }
          if (typeof options.animate === 'undefined') {options.animate = true;}
          if (typeof options.drawData === 'undefined') {options.drawData = true;}
          if (typeof options.clearChart === 'undefined') {options.clearChart = true;}
          if (typeof options.redrawLines === 'undefined') {options.redrawLines = false;}

          /**
           * clear existing rendered content
           */
          if (options.clearChart && !this.isClear) {
            this.clear();
            return this.renderChart(options);
          } else {
            this.isClear = false;
          }
          
          /**
           * calculate components (chart prep)
           */
          this.calculateChartGlobals();
          this.calculateScaling();
          this.calculateLinesData();
          this.calculateLineCoords();
          this.calculateAxes();
          
          this.calculateY2Scaling();
          this.calculateY2Axis();
          
          /**
           * chart container
           */
          this.chart = d3.select(this.container())
                .attr('width', that.width)
                .attr('height', that.height)
              .append("g")
                .attr('transform', 
                  'translate(' 
                  + this.styling.chart.margin.left 
                  + ', ' 
                  + this.styling.chart.margin.right
                  + ')'
                )
          ;
          
          /**
           * data region background (black background)
           */
          this.chart.append('rect')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', this.marginalWidth)
                    .attr('height', this.marginalHeight)
          ;
          
          
          /**
           * axes
           */
          setTimeout(function() {
            $('.x-axis').remove(); // remove any existing x-axis
            that.chart.xaxis =
            that.chart.append('g')
                .attr('class', 'axis x-axis')
                .attr('transform', 'translate('
                                    + '0'
                                    + ',' 
                                    + that.marginalHeight 
                                    + ')'
                )
                
                .call(that.xAxis)
            ;
            that.chart.xaxis.selectAll('text').style("text-anchor", "middle");
            
            $('.y-axis').remove(); // remove any existing y-axis
            that.chart.append('g')
              .attr('class', 'axis y-axis')
              .call(that.yAxis)
            ;
            
            $('.y2-axis').remove(); // remove any existing y-axis
            that.chart.append('g')
              .attr('class', 'axis y2-axis')
              .attr('transform', 'translate(' 
                                  + that.marginalWidth
                                  + ', 0' 
                                  + ')'
              )
              .call(that.y2Axis)
            ;
          }, 1);
          
          this.drawAxesLabels();
          
          this.initLines();
          
          if (options.drawData) {
            this.drawData(options);
          }
          
          return this;
        },

      /**
       * Render actual data onto the chart
       */
      
      drawData: function(options) 
      {
        /**
         * context handle for closures that receive bound context by d3
         */
        var that = this;
        
        /**
         * rendering options
         */
        if (typeof options === 'undefined') {options = {};}
        if (typeof options.animate === 'undefined') {options.animate = true;}
        
        // render dots based upon the current dataset
        this.renderDots();

        // render lines
        //this.renderAverage();
        
        // redraw lines
        if (options.redrawLines) {
          setTimeout(
            function() {
              this.redrawLines();
              this.moveLinesToFront
            }.bind(this),
            100
          );
        }
        
        // update the chart title, outside the scope of the svg, in surrounding html
        this.renderExternal();
        
        // jank ass safari rendering fix
        setTimeout(function() {
          var n = document.createTextNode(' ');
          $('body').append(n);
          setTimeout(function(){n.parentNode.removeChild(n)}, 0);
        }.bind(this), 100);
        

      },
      redrawLines: function()
      {
        this.setLineLength('adnetwork', 1);
        this.setLineLength('adnetwork-indystar', 1);
        this.setLineLength('indystar', 1);
      },
      renderDots: function()
      {
        var that = this;
        /**
         * chart dots
         */
        // init/handle and data-binding
        that.circles = that.chart.selectAll('circle')
            .data(that.data())
        ;
        // data enter handlers
        that.circles
          .enter()
            .append('circle')
              .classed('indystar-data-point', 
                function(d, i) {return d.campaign_type === 'indystar';}
              )
              .classed('adnetwork-data-point', 
                function(d, i) {return d.campaign_type === 'adnetwork';}
              )
              .classed('adnetwork-indystar-data-point', 
                function(d, i) {return d.campaign_type === 'adnetwork_indystar';}
              )
              .attr('cx', function(d, i) {
                return that.x( d.date );
              })
              .attr('cy', function(d, i) {
                return that.y( d.ctr );
              })
              .attr('r', this.styling.chart.dots.radius)
        ;
        // data exit handlers
        that.circles
          .exit()
            .remove()
        ;
      },

      /**
       * @brief Chart global variables
       */
      width           : null, // chart width
      height          : null, // chart height
      marginalWidth   : null, // chart width after margins are removed
      marginalHeight  : null, // chart height after margins are removed
      allDates        : null, // array of all dates in the dataset
      minX  : null, // minimum x value
      maxX  : null, // maximum x value
      minY  : null, // minimum y value
      maxY  : null, // maximum y value

      calculateChartGlobals : function()
      {
        var that = this;
        this.width   = $('.circlechart1-container').width();
        this.height  = $('.circlechart1-container').height();
        
        this.marginalWidth = this.width
                    - this.styling.chart.margin.left 
                    - this.styling.chart.margin.right
        ;
        this.marginalHeight = this.height
                    - this.styling.chart.margin.top 
                    - this.styling.chart.margin.bottom
        ;
        
        this.minY = d3.min(this.originalData(), function(d) {return d.ctr;});
        this.maxY = d3.max(this.originalData(), function(d) {return d.ctr;});
        this.minX = d3.min(this.originalData(), function(d) {return that.dateParser(d.date);});
        this.maxX = d3.max(this.originalData(), function(d) {return that.dateParser(d.date);});

        this.allDates           = this.getAllDates();
        this.allDatesMonths     = this.getAllMonths(this.allDates);
        this.allDatesMonthNames = this.getAllMonthNames(this.allDatesMonths);

        this.campaigns = [
          this.getByCampaignType('adnetwork'),
          this.getByCampaignType('adnetwork_indystar'),
          this.getByCampaignType('indystar'),
        ];
        
        
        
        
        return true;
      },
      
      /**
       * @brief Scaling
       */
      x : null, // scaling function, accepts x-value and returns pixel horizontal position
      y : null, // scaling function, accepts y-value and returns pixel vertical position
      calculateScaling: function()
      {
        var that = this;
        if (this.x === null) {
          this.x = d3.scaleTime()
                    .range([4, that.marginalWidth - 4])
                    //.domain(d3.extent(that.originalData(), function(d) { return d.date; }))
                    .domain([this.minX, this.maxX])
                    //.nice(1)
          ;
        }
        if (this.y === null) {
          this.y = d3.scaleLinear()
                    .range(
                      [
                        (that.marginalHeight), 
                        that.styling.chart.dots.radius
                      ]
                    )
                    .domain([0, that.maxY])
          ;
        }

        
        return true;
      },
      
      y2    : null,
      minY2 : null, // minimum y2 value
      maxY2 : null, // maximum y2 value
      calculateY2Scaling: function()
      {
        var that = this;
        
        this.minY2 = d3.min(this._averages, function(d) {return d.ctr;});
        this.maxY2 = d3.max(this._averages, function(d) {return d.ctr;});
        
        if (this.y2 === null) {
          this.y2 = d3.scaleLinear()
                    .range([(that.marginalHeight - that.styling.chart.dots.radius), 0])
                    .domain([.0005, that.maxY2 * 1.1])
          ;
        }
        
      },
      
      /**
       * Axes
       */
      xAxis : null,   // xAxis
      yAxis : null,   // yAxis
      calculateAxes: function() 
      {
        var that = this;
        var line = [];
        var coords = that.getLineByDatatype('google-benchmark').coords;
        // clone array (shallow)
        for (var key in coords) {
          line.push(coords[key]);
        };
        // remove the first entry
        line.shift();
        // remove the last entry
        line.pop();
        this.xTickValues = [];
        for (var key in line) {
          this.xTickValues.push(line[key].x);
        }
        
        var xTickValues = line.coords
        this.xAxis = d3.axisBottom()
            .tickFormat(d3.timeFormat("%B"))
            .tickValues(that.xTickValues)
            .ticks(that.xTickValues.length)
            .scale(that.x)
        ;
        this.yAxis = d3.axisLeft()
            .scale(that.y)
            .tickFormat(function(d) {
              var value     = parseFloat((d * 100));
              var strValue  = value.toFixed(1);
              var display   = strValue + '%';
              return display;
            })
            .tickPadding(7)
        ;
        
        return true;
      },
      // y2
      y2Axis: null,
      calculateY2Axis: function()
      {
        var that = this;
        this.y2Axis = d3.axisRight()
            .scale(that.y2)
            .tickFormat(function(d) {
              var value     = parseFloat((d * 100));
              var strValue  = value.toFixed(2);
              var display   = strValue + '%';
              return display;
            })
            .tickPadding(40)
        ;
      },
      
      /**
       * Responsive support
       */
      handleResponsive: function()
      {
        this.x = null;
        this.y = null;
        
        this.renderChart({
          drawData: true,
          redrawLines: true
        });
        setTimeout(function() {
          this.renderLabels();
          this.renderBubbleDiv();
        }.bind(this), 100);
        
      },
      
      /**
       * Axes Labels
       */
      drawAxesLabels: function()
      {
        this.drawYAxisLabel();
        this.drawY2AxisLabel();
      },
      // y axis
      drawYAxisLabel: function()
      {
        var that = this;
        this.yAxisLabelText = 'CTR';
        // console.log('drawing YAxis Label with text: ', this.yAxisLabelText);
          that.chart.yAxisLabel =
          that.chart.append('g')
              .attr('class', 'axis-label y-axis-label')
              .attr('transform', 'translate('
                                  + '-' + this.styling.chart.margin.left / 1.25 // horizontal
                                  + ',' 
                                  + '0' // vertical
                                  + ')'
              )
          ;
          
          this.chart.yAxisLabelText = 
            this.chart.yAxisLabel.append('text')
              .text(this.yAxisLabelText)
              .attr("transform", function(d, i) { 
                return "translate(0, 0)"; 
              })
              .style('text-anchor', 'start')
          ;
          that.chart.yAxisLabel.selectAll('text').style("text-anchor", "start");
          
      },
      // y2 axis
      drawY2AxisLabel: function()
      {
        var that = this;
        this.y2AxisLabelText = 'AVG';
        
        // console.log('drawing Y2Axis Label', this.y2AxisLabelText);
          that.chart.yAxisLabel =
          that.chart.append('g')
              .attr('width', this.styling.chart.margin.right)
              .attr('class', 'axis-label y2-axis-label')
              .attr('transform', 'translate('
                                  + (this.marginalWidth + (this.styling.chart.margin.right / 1.25)) // horizontal
                                  + ',' 
                                  + '0' // vertical
                                  + ')'
              )
              
          ;
          
          this.chart.yAxisLabelText = 
            this.chart.yAxisLabel.append('text')
              .text(this.y2AxisLabelText)
              .attr("transform", function(d, i) { 
                return "translate(0, 0)"; 
              })
              .style('text-anchor', 'start')
          ;
          that.chart.yAxisLabel.selectAll('text').style("text-anchor", "end");        
        
      },
      
      
      
      
      /**
       * Average trend lines
       */
      googleBenchmarkLineData : {
        averages: {
          'april' : {
            ctr: .0007 
          },
          'may' : {
            ctr: .0007
          },
          'june' : {
            ctr: .0007
          },
          'july' : {
            ctr: .0008 
          },
          'august' : {
            ctr: .0008
          }
        }
        
      },
      calculateLinesData: function()
      {
        this.linesData = {}; // this.linesMockData;
        // console.log('calculating this.linesData: ', this.linesData);
        for (var datatype in this.dataTypes) {
          //if (datatype === 'adnetwork_indystar') {datatype = 'adnetwork-indystar';}
          if (datatype === 'google-benchmark') {
            this.linesData[datatype] = this.googleBenchmarkLineData;
            continue;
          }
          var campaignType = datatype;
          if (campaignType === 'adnetwork-indystar') {campaignType = 'adnetwork_indystar';}
            
          
          if (!this.linesData.hasOwnProperty(datatype)) {
            this.linesData[datatype] = {averages: {}};
          } // end if
          
          for (var monthKey in this.allDatesMonthNames) {
            var monthName = this.allDatesMonthNames[monthKey];
            
            if ( this.linesData[datatype].averages === undefined ) { this.linesData[datatype].averages = {};}
            var average = {
              ctr : this.getAverageCtrByDataTypeAndMonth({
                datatype: campaignType,
                month: monthName
              })
            };
            this.linesData[datatype].averages[monthName] = average;
            
            // (for calculating min/max Y2)
            if (this._averages === undefined || this._averages === null) {this._averages = [];}
            this._averages.push(average);
              
            ;
          } // end for monthKey
        
        } // end for datatype
      }, // end calculateLinesData
      calculateGoogleBenchmarkSegments: function()
      {
        var line = this.getLineByDatatype('google-benchmark');
        // console.log('calculateGoogleBenchmarkSegments line: ', line);
        
        var segments = [];
        
        var parseSegment = function(options)
        {
          var coords  = options.coords;
          var isFirst = options.isFirst;
          var isLast  = options.isLast;
          
          var start = {
            x: !isFirst ? this.getFirstOfMonth(coords.x)  : coords.x,
            y: coords.y
          };
          var end   = {
            x: !isLast  ? this.getLastOfMonth(coords.x)    : coords.x,
            y: coords.y
          };
          
          return {
            start: start,
            end: end
          };
        }.bind(this);
        
        for (var i = 0; i < line.coords.length; i++) {
          var coords = line.coords[i];
          segments.push(
            parseSegment({
              coords  : coords,
              isFirst : i === 0,
              isLast  : i === line.coords.length -1
            })
          );
        }
        
        this.googleBenchmarkSegments = segments;
        
      },
      getFirstOfMonth: function(date)
      {
        var firstDayOfMonth = new Date(date.getTime());
        firstDayOfMonth.setDate(1);
        return firstDayOfMonth;
      },
      getLastOfMonth: function(date)
      {
        var lastDayOfMonth = new Date(date.getFullYear(), date.getMonth()+1, 0);
        return lastDayOfMonth;
      },
      drawGoogleBenchmarkSegments: function()
      {
        // jledraw
        
        var that = this;
        
        $('.average-line-google-benchmark-segment').remove();
        
        for (var key in this.googleBenchmarkSegments) {
          
          var segment = this.googleBenchmarkSegments[key];
          // console.log('drawing segment: ', segment);
          
          var renderedSegment = this.chart.append("line")          // attach a line
            .attr("class", "average-line-google-benchmark-segment fade-in")  // class
            .attr("x1", that.x(segment.start.x) + 12)   // x position of the first end of the line
            .attr("y1", that.y2(segment.start.y)    )   // y position of the first end of the line
            .attr("x2", that.x(segment.end.x) + 12  )   // x position of the second end of the line
            .attr("y2", that.y2(segment.end.y)      )   // y position of the second end of the line
          ;
          // console.log('rendered segment: ', renderedSegment);
        }
        
      },
      getAverageCtrByDataTypeAndMonth: function(options)
      {
        var campaign    = this.getCampaignByType(options.datatype);
        var cMonthData  = this.getByMonthFromCampaign(campaign, options.month);
        var averageCtr  = 0;
        var totalCtr    = 0;

        for (var key in cMonthData) {
          var outcome = cMonthData[key];
          totalCtr += outcome.ctr;
        }
        
        averageCtr = totalCtr/cMonthData.length;
        return averageCtr;
      },
      getCampaignByType: function(datatype)
      {
        for (var key in this.campaigns) {
          if (this.campaigns[key][0].campaign_type === datatype) {return this.campaigns[key];}
        }
        return null;
      },
      getByMonthFromCampaign: function(campaign, month)
      {
        var monthNumber = (typeof month === 'string') 
                        ? this.getMonthNumberFromName(month)
                        : month
        ;
        var type = typeof monthNumber;
        
        var results = [];
        for (var key in campaign) {
          var outcome = campaign[key];
          if (outcome.date.getMonth() === monthNumber) {
            results.push(outcome);
          }
        }
        
        return results;
      },
      getMonthNumberFromName: function(monthName)
      {
        for (var key in this.monthNames) {
          var candidateMonthName = this.monthNames[key];
          if (monthName === candidateMonthName) {return parseInt(key, 10);}
        }
        return null;
      },
       
      // mock data to get rendering working (will plug in real data after)
      linesMetaData: {
        months: [
          {
            month: 'april', 
            date: '2016-04-15'
          },
          {
            month: 'may', 
            date: '2016-05-15'
          },
          {
            month: 'june', 
            date: '2016-06-15'
          },
          {
            month: 'july', 
            date: '2016-07-15'
          },
          {
            month: 'august',
            date: '2016-08-15'
          }
        ] // end months
      },
      
      
      initLines : function() {

        var that = this;
        var lines = this.lines;
        
        
        // declare the line function
        this.linefunction = d3.line()
          .x(
            function(d) {
            	var xVal = that.x(d.x) + 12;
            	return xVal;
        	  }
      	  )
          .y(
            function(d) { 
              var value = that.y2(d.y);
              return value;
      	    }
    	    )
      	;
        
        this.chart.lines =  
       	  this.chart.selectAll('path')
       	  .data(this.lines, function(d, i) {return d + i;})
        ;
        
        // on line enter
        this.chart.lines
        	.enter()
        		.append("path")
            	// .attr("class", "testline")
            	.attr('class', 'average-line')
            	.classed('average-line-google-benchmark fade-in', function(d) { return d.datatype === 'google-benchmark';})
            	.classed('average-line-indystar',         function(d) { return d.datatype === 'indystar';})
            	.classed('average-line-adnetwork',        function(d) { return d.datatype === 'adnetwork';})
            	.classed('average-line-adnetwork-indystar', function(d) { return d.datatype === 'adnetwork-indystar';})
            	.attr('d', function(d) {
            	  return that.linefunction(d.coords);
            	})
            	.attr('stroke-opacity', 0)
            	.transition()
                .ease(d3.easeLinear)
                .duration(0)
                .attr('stroke-opacity', 1)
                .attr("stroke-dasharray", function(d, i) {
              	  if (window.chartPaths === undefined) {window.chartPaths = [];}
                  window.chartPaths.push(this);
              	  return this.getTotalLength() + " " + this.getTotalLength() ;
            	  })
            	  .attr("stroke-dashoffset", function(d, i) {
            	    return this.getTotalLength();
          	    })
          	    .attr("transform", function() {return "translate(-6,0)";} )
        ;
        this.chart.lines
      	  .exit()
    	      .remove()
	      ;
	      this.calculateGoogleBenchmarkSegments();
        this.drawGoogleBenchmarkSegments();

        return this;
      },
      
      calculateLineCoords: function() 
      {
        
        if (this.linesData === undefined) {this.calculateLinesData();}
        /**
         * Collect first index, datatype
         */
        var datatypes   = [];
        for (var key in this.dataTypes) {
          datatypes.push(key);
        }

        /**
         * Collect x-values
         */
        var monthNames  = [];
        var dates       = [];
        for (var key in this.linesMetaData.months) {
          var month = this.linesMetaData.months[key];
          monthNames.push(month.month);
          dates.push(month.date);
        }
        
        /*
        var debug = {
          monthNames: monthNames,
          dates: dates
        };
        console.log('debug: ', debug);
        */
        
        /**
         * Collect y-values and marry to x-values
         */
        var lines = [];
        // for each data type
        for (var key in datatypes) {
          var datatype = datatypes[key];
          // console.log('datatype: ', datatype);

          // each data type gets 1 line
          var line = [];
          // for each date
          for (var key2 in dates) {
            var date  = this.dateParser(dates[key2]);
            var month = monthNames[key2];
            // find it's corresponding ctr for this datetype and date

            var lineData = this.linesData[datatype];
            // console.log('lineData: ', lineData);
            
            var average = lineData.averages[month];
            // console.log('lineData.averages[month]: ', average);
            
            var ctr = average.ctr;
            
            // add the coordinate to the line
            line.push({x: date, y: ctr});
            //line.push([ date, ctr ]);
          }
          // add this freshly-built line (array of coords), to the array of lines
          lines.push({datatype: datatype, coords: line});
        }

        // expose via the public api
        this.lines = lines;
        
        return this.lines;
      },
      
      setLineLength: function(identifier, percentLength, duration, callback)
      {
        
        if (duration === undefined) {duration = 0;}
      	var totalLength = window.indystar_chart.chart('circleChart1')
      	  .chart
      	  .select('.average-line-' + identifier)
      	  .nodes()[0]
      	  .getTotalLength()
  	    ;
      	window.indystar_chart.chart('circleChart1').chart
      	  .select('.average-line-' + identifier)
      	  //.transition()
      	  //.duration(duration)
      	  .attr('stroke-dashoffset', totalLength * (1 - percentLength))
      	  //.on("end", callback)
    	  ;
    	  this.moveLinesToFront();
      },
      moveGoogleBenchmarkLineToFront : false,
      googleBenchmarkFadeInDuration  : 900, // in ms
      moveLinesToFront: function()
      {
        if (!this.moveGoogleBenchmarkLineToFront 
        &&   this.moveGoogleBenchmarkLineToFrontTimeout === undefined) 
        {
          this.moveGoogleBenchmarkLineToFrontTimeout = setTimeout(
            function() {
            this.moveGoogleBenchmarkLineToFront = true;
            }.bind(this), 
            this.googleBenchmarkFadeInDuration
          );
        }
        if (this.moveGoogleBenchmarkLineToFront) {
          $('.average-line-google-benchmark').removeClass('fade-in');
          $('.average-line-google-benchmark-segment').removeClass('fade-in');
          this.chart.selectAll('.average-line-google-benchmark').moveToFront();
          this.chart.selectAll('.average-line-google-benchmark-segment').moveToFront();
        }
        this.chart.selectAll('.average-line-adnetwork').moveToFront();
        this.chart.selectAll('.average-line-adnetwork-indystar').moveToFront();
        this.chart.selectAll('.average-line-indystar').moveToFront();

      },
      
      /**
       * Labels
       */
      renderLabels: function()
      {
        this.calculateLabels();
        this.renderLabelsFor('indystar');
        this.renderLabelsFor('adnetwork');
        this.renderLabelsFor('adnetwork-indystar');
        this.renderLabelsFor('google-benchmark');
      },
      
      calculateLabels: function()
      {
        this.calculateLabelsFor('indystar');
        this.calculateLabelsFor('adnetwork');
        this.calculateLabelsFor('adnetwork-indystar');
        this.calculateLabelsFor('google-benchmark');
      },
      calculateLabelsFor: function(datatype) 
      {
          // console.log('rendering labels for datatype: ', datatype);
          var that = this;
          var lineData = this.getLineByDatatype(datatype);
          var coords = [];
          for (var key in lineData.coords) {
            coords.push(lineData.coords[key]);
          }
          coords.shift();
          coords.pop();
          
          if (this.labels === undefined) {this.labels = {};}
          if (this.labels[datatype] === undefined) {this.labels[datatype] = {};}
          
          this.labels[datatype].labelCoords = coords;
      },
      calculateLabelCollisions: function()
      {
        var that = this;
        console.log('calculating label collisions for these labels: ', this.labels);
        // get a flat array of labels
        this.labelsCollision = [];
        
        for (var key in this.labels) {
          var datatypeCollection = this.labels[key];
          var collisions = this.compareLabelsAgainstOtherDataTypes(datatypeCollection);
          
          
        }
      },
      compareLabelsAgainstOtherDataTypes: function(datatypeCollection)
      {
        var collisions = [];
        for (var key in this.labels) {
          var otherDatatypeCollection = this.labels[key];
          if (datatypeCollection === otherDatatypeCollection) {
            continue; // skip if it's the some datatypeCollection
          } 
          var detectedCollisions = 
            this.compareLabelsAgainstAnotherDatatype(
              datatypeCollection, 
              otherDatatypeCollection
            )
          ;
          
          collisions.concat(detectedCollisions);
          
          
        }
        
        return collisions;
      },
      alreadyCompared: [],
      compareLabelsAgainstAnotherDatatype: function(datatypeCollection, otherDatatypeCollection) 
      {
        for (var key in this.alreadyCompared) {
          
        }
        console.log('comparing datatypeCollection: ', datatypeCollection, 
        'otherDatatypeCollection: ', otherDatatypeCollection);
        
        
        
      },
      
      renderLabelsFor: function(datatype)
      {
        var that = this;
        // console.log('coords: ', coords);
        
          this.labels[datatype].labels = 
            this.chart.selectAll("." + datatype + "-label")
                .data(that.labels[datatype].labelCoords)
              .enter()
                .append("g")
                  .attr("class", "label " + datatype + "-label fade-in")
                  .attr("transform", function(d, i) { return "translate(" + that.x(d.x) + "," + that.y2(d.y) + ")"; })
                  .attr('datatype', datatype)
                  .on('click', that.handleAverageBoxClick)
          ;
          // console.log('this.labels[' + datatype + '].labels: ', this.labels[datatype].labels);
          this.labels[datatype].labelWidth = 50;
          this.labels[datatype].labelHeight = 18;
          
          switch (datatype) {
            case 'indystar':
              var averageBoxGradient = '#blueGradVertical';
              break;
            case 'adnetwork':
              var averageBoxGradient = '#orangeGradVertical';
              break;
            case 'adnetwork-indystar':
              var averageBoxGradient = '#greenGradVertical';
              break;
            default:
              var averageBoxGradient = '#whiteGradVertical';
          }

          this.labels[datatype].averageBoxGradient = averageBoxGradient;
          
          this.labels[datatype].rects = 
            this.labels[datatype].labels.append("rect")
              .attr("width", that.labels[datatype].labelWidth)
              .attr("height", that.labels[datatype].labelHeight)
              .attr("transform", function(d, i) { 
                var x = ( that.labels[datatype].labelWidth  / 4 ) * -1;
                var y = ( that.labels[datatype].labelHeight / 2 ) * -1;
                return "translate(" + x + "," + y + ")"; 
              })
              .attr('rx', 4)
              .attr('ry', 5)
              .style('fill', 'url(' + that.labels[datatype].averageBoxGradient + ')')
          ;
          // console.log('this.labels[' + datatype + '[.rects: ', this.labels[datatype].rects);
          this.labels[datatype].textPaddingVerticle = 4;
          this.labels[datatype].labelTexts = 
            this.labels[datatype].labels.append("text")
              .text(function(d, i) {
                var value = d.y;
                value = value * 100;
                return value.toFixed(2) + '%';
              })
              .attr("transform", function(d, i) { 
                var x = -2, y = that.labels[datatype].textPaddingVerticle;
                
                return "translate(" + x + "," + y + ")"; 
              })
              .style('text-anchor', 'start')
          ;
          this.chart.selectAll('.label').moveToFront();
      },
      handleAverageBoxClick: function(d, i) 
      {
        /* variable initialization */
        var datatype  = this.attributes.datatype.nodeValue;
        if (datatype === 'google-benchmark') {return}
        var x         = this.__data__.x;
        var y         = this.__data__.y;
        var chart     = window.indystar_chart.chart('circleChart1');
        var ele       = this;
        
        var datatypesCapitalized = {
          'indystar'            : 'Indystar', 
          'adnetwork'           : 'AdNetwork',
          'adnetwork-indystar'  : 'AdNetwork / Indystar',
          'google-benchmark'    : 'Google'
        };
        
        if ( chart.lastBoxClicked !== undefined 
          && chart.lastBoxClicked.ele === ele
          && !chart.toggledOff
        ) {chart.toggledOff = true; return chart.removeExistingBubble();}
        chart.toggledOff = false;
        
        var otherAverages = 
          chart
            .getOtherAveragesByDatatypeAndMonth(
              x.getMonth(), 
              datatype
            )
        ;
        
        var differences = {};
        for (var key in otherAverages) {
          var otherAverage = otherAverages[key];
          differences[key] = {
            lift: (y - otherAverage) / otherAverage,
            datatype: key
          };
        }
        if (chart.bubble_template === undefined) {
          chart.bubble_template = Handlebars.compile(
            $('#bubble-template').html()  
          );
        }
        
        /* debug info */        
        var boxClicked = {
          d : d,
          i : i,
          ele: ele,
          datatype: datatype, 
          x: x,
          y: y,
          otherAverages: otherAverages
        };
        // console.log('averageBoxClick: ', boxClicked);
        if (window.boxesClicked === undefined) {window.boxesClicked = [];}
        window.boxesClicked.push(boxClicked);
        chart.lastBoxClicked = boxClicked;
        
        /* formatting for display */
        var formattedAverage = {};
        formattedAverage = {
          ctr: (y * 100).toFixed(2) + '%',
          datatype: datatypesCapitalized[datatype]
        };
        
        var formattedOtherAverages = {};
        for (var key in otherAverages) {
          var otherAverage = otherAverages[key];
          var adjustedOtherAverage = otherAverage * 100;
          var absAdjustedOtherAverage = Math.abs(adjustedOtherAverage);
          var strOtherAverage = adjustedOtherAverage.toFixed(2);
          var strAbsAdjustedOtherAverage = absAdjustedOtherAverage.toFixed(2);
          formattedOtherAverages[key] = {
            ctr: strOtherAverage + '%',
            absctr: strAbsAdjustedOtherAverage + '%',
            datatype: datatypesCapitalized[key]
          }
        }
        
        var formattedDifferences = {};
        for (var key in differences) {
          var difference = differences[key];
          formattedDifferences[key] = {
            lift: Math.round( (difference.lift * 1000) / 10).toFixed(0) + '%',
            abslift: Math.abs( Math.round( (difference.lift * 1000) / 10).toFixed(0) ) + '%',
            datatype: datatypesCapitalized[difference.datatype],
            absctr: formattedOtherAverages[key].absctr,
            ctr: formattedOtherAverages[key].ctr,
            absctr: formattedOtherAverages[key].absctr,
            isIndystar          : key === 'indystar',
            isGoogle            : key === 'google-benchmark',
            isAdnetwork         : key === 'adnetwork',
            isAdnetworkIndystar : key === 'adnetwork-indystar'
          };
          formattedDifferences[key].isPositive = differences[key].lift > 0;          
          formattedDifferences[key].isNegative = differences[key].lift < 0;          
          switch (key) {
            case 'indystar':
              formattedDifferences[key].className = 'bubble-info-difference-indystar';
              break;
            case 'adnetwork':
              formattedDifferences[key].className = 'bubble-info-difference-adnetwork';
              break;
            case 'adnetwork-indystar':
              formattedDifferences[key].className = 'bubble-info-difference-adnetwork-indystar';
              break;
            case 'google-benchmark':
              formattedDifferences[key].className = 'bubble-info-difference-google';
              break;
            default:
              formattedDifferences[key].className = 'bubble-info-difference-unknown';
          }
          formattedDifferences[key].rawlift = differences[key].lift;
          formattedDifferences[key].rawctr = otherAverages[key];
          
        }

        var formattedDifferencesArray = [];
        for (var key in formattedDifferences) {
          var formattedDifference = formattedDifferences[key];
          formattedDifferencesArray.push(formattedDifference);
        }
        formattedDifferencesArray.sort(function (a, b) {
          if (a.rawctr < b.rawctr) {
            return -1;
          }
          if (a.rawctr > b.rawctr) {
            return 1;
          }
          // a must be equal to b
          return 0;
        });

        chart.lastClickedElement = ele;
        
        
        /* build dataContext to pass to template  for display */
        var dataContext = {
          formattedAverage        : formattedAverage,
          formattedOtherAverages  : formattedOtherAverages,
          formattedDifferences    : formattedDifferencesArray,
          datatype                : datatype,
          datatypeCapitalized     : datatypesCapitalized[datatype],
          clickedElement          : ele,
          //position                : position,
          differences             : differences,
          otherAverages           : otherAverages
        };
        window.indystar_chart.chart('circleChart1').dataContext = dataContext;
        chart.lastBoxClicked.dataContext = dataContext;
        
        /* build/display the bubble (handlebars/jquery) */
        chart.bubbleDivHtml  = chart.bubble_template(dataContext);
        
        chart.renderBubbleDiv();
        
        
      },
      renderBubbleDiv: function()
      {
        if (this.lastClickedElement === undefined) {return;}
        
        if ($(this.bubbleDiv).hasClass('chart-hidden')) {return;}
        
        // if a bubble div already exists, remove it from the dom and from memory
        if (this.bubbleDiv !== undefined) {
          this.removeExistingBubble();
        }
        
        this.bubbleDiv       = document.createElement('div');
        this.bubbleDiv.className = "outside-bubble-info-container";
        this.bubbleDiv.innerHTML = this.bubbleDivHtml;
        this.bubbleDiv.style.visibility = 'hidden';
        document.body.appendChild(this.bubbleDiv);
        
        /* calculate bubble position (mock data for now) and display */
        this.clickedElementPosition = this.lastClickedElement.getBoundingClientRect();

        var position = {
          y             : this.clickedElementPosition.top + document.body.scrollTop,
          x             : this.clickedElementPosition.left,
          vOrientation  : 'above', // 'above' or 'below'
          hOrientation  : 'center', // 'center', 'left', or 'right'
        };
        position.originalX = position.x;
        position.originalY = position.y;
        
        var bubbleDivHeight = $(this.bubbleDiv).height();

        /* center and move up or down */
        switch (position.vOrientation) {
          case 'above':
            position.y = position.originalY
                        - bubbleDivHeight 
            ;
            break;
          case 'below':
            position.y = position.originalY
                        + parseInt($(this.lastClickedElement).find('rect').attr('height'), 10)
                        + bubbleDivHeight
            ;
            break;
          default:
            position.y = position.originalY
                        - bubbleDivHeight
            ;
        }

        switch (position.hOrientation) {
          case 'right':
            break;
          case 'left':
            position.x =  position.x
                          - parseInt($('.bubble-info-container').width(), 10)
                          + parseInt($(this.lastClickedElement).find('rect').attr('width'), 10)
            ;
            break;
          case 'center':
            position.x =  position.x 
                          - (parseInt($('.bubble-info-container').width(), 10) / 2)
                          + (parseInt($(this.lastClickedElement).find('rect').attr('width'), 10) / 2)
            ;
            break;
          default:
            position.x =  position.x 
                          - (parseInt($('.bubble-info-container').width(), 10) / 2)
                          + (parseInt($(this.lastClickedElement).find('rect').attr('width'), 10) / 2)
            ;
        }
        
        this.lastBoxClicked.position = position;
        
        this.bubbleDiv.style.position    = 'absolute';
        this.bubbleDiv.style.top         = position.y + 'px';
        this.bubbleDiv.style.left        = position.x + 'px';
        this.bubbleDiv.style.visibility  = 'visible';
        this.bubbleDiv.style.zIndex      = 1000000;
        this.bubbleDiv.setAttribute('datatype', this.dataContext.datatype);
        // console.log('chart.bubbleDiv: ', chart.bubbleDiv);
        
      },
      /**
       * @brief Gets the other average values for other datatype in a given month (averages along trend-line)
       * @param {int} month           - month number
       * @param {string} notDatatype  - return values for all datatypes except this one
       */
      getOtherAveragesByDatatypeAndMonth: function(month, notDatatype)
      {
        var otherAverages = {};
        for (var key in this.lines) {
          var line = this.lines[key];
          if (line.datatype !== notDatatype) {
            for (var key2 in line.coords) {
              var value = line.coords[key2];
              if (value.x.getMonth() === month) {
                otherAverages[line.datatype] = value.y;
              }
            }
          }
        }
        return otherAverages;
      },
      removeExistingBubble: function()
      {
        this.bubbleDiv.parentNode.removeChild(this.bubbleDiv);
        delete this.bubbleDiv;
      },
      /**
       * Date Range Bounding
       */
      dateRangeStart: new Date('2016-05-15'),
      dateRangeEnd: new Date('2016-08-15'),
      eliminateOutOfDateRange: function(data)
      {
        // console.log('eliminating out-of-date-range items');
        for (var key in data) {
          var d = data[key];
          if ( d.date < this.dateRangeStart ) {
            d.date.setDate(d.date.getDate() + 15)
          }
          if ( d.date > this.dateRangeEnd ) {
            d.date.setDate(d.date.getDate() - 15)
          }
        }
      }
      
      
      
      
    }, // end circleChart1

    
    
    
  
    
    
    
  }, // end charts
  
  
  /**
   * Chart Fluent API Service Logic (each chart listed above is decorated with these functions on initialization)
   */
  chartServiceLogic :
  {
      // settings
      settings : {
        container: null,
        originalData: null,
        data: null,
        fromUrl: null,
        lastFetchError: null
      },
      
      // fluent getter/setters
      container: function(value) 
      {
        if (typeof value === 'undefined') {return this.settings.container;}
        this.settings.container = value;
        return this;
      },
      data: function(value, transform) 
      {
        if (typeof value === 'undefined') {return this.settings.data;}
        if (typeof transform === 'undefined') {transform = true;}
        if (transform && this.dataTransform) {
          this.dataTransform(value)
          this.eliminateOutOfDateRange(value);
        };
        if (this.settings.originalData === null) {this.originalData(value.slice(), false);}
        this.settings.data = value;
        return this;
      },
      originalData: function(value, transform) 
      {
        if (typeof value === 'undefined') {return this.settings.originalData;}
        if (typeof transform === 'undefined') {transform = true;}
        if (transform && this.transformData) {this.transformData(value)};
        this.settings.originalData = value;
        return this;
      },
      
      fromUrl: function(value) 
      {
        if (typeof value === 'undefined') {return this.settings.fromUrl;}
        this.settings.fromUrl = value;
        return this;
      },      
      lastFetchError: function(value) 
      {
        if (typeof value === 'undefined') {return this.settings.lastFetchError;}
        this.settings.lastFetchError = value;
        return this;
      },
      
      // fetch data, returns promise
      fetchData: function(fromUrl)
      {
        if (typeof fromUrl !== 'undefined') {this.fromUrl(fromUrl);}
        var dfd = $.Deferred();
        d3.json(this.settings.fromUrl, 
          function(error, data) {
            this.chart.lastFetchError(error);
            if (this.chart.lastFetchError() !== null) {
              // console.log('data fetch error: ', this.chart.lastFetchError());
              dfd.reject(this.chart);
            }
            if (typeof data !== 'undefined') {this.chart.data(data);}
            this.dfd.resolve(this.chart);
          }.bind({chart: this, dfd: dfd})
        );
        return dfd.promise()
      },
      
      isClear : true,
      clear : function() {
        // console.log('clearing chart: ', this.container());
        $(this.container()).find('*').remove();
        this.isClear = true;
      },
      shuffleArray: function(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array;
      },
      shuffleData: function()
      {
        this.data(this.shuffleArray(this.data()));
        return this;
      },
      dataTypes : {
        'adnetwork'           : {
          datatype    : 'adnetwork',
          toggleable  : true,
          enabled     : true,
          selectors   : {
            dataPoint   : '.adnetwork-data-point',
            dataLine    : '.average-line-adnetwork',
            cplButton   : '.adnetwork-dot-legend ellipse',
            label       : '.adnetwork-label'
          },
          language: {
            titleVs: 'AdNetwork'
          }
        },
        'adnetwork-indystar'  : {
          datatype    : 'adnetwork-indystar',
          toggleable  : true,
          enabled     : true,
          selectors   : {
            dataPoint   : '.adnetwork-indystar-data-point',
            dataLine    : '.average-line-adnetwork-indystar',
            cplButton   : '.adnetwork-indystar-dot-legend ellipse',
            label       : '.adnetwork-indystar-label'
          },
          language: {
            titleVs: 'AdNetwork/IndyStar'
          }
        },
        'google-benchmark'    : {
          datatype    : 'google-benchmark',
          toggleable  : true,
          enabled     : true,
          selectors   : {
            dataPoint   : '.google-benchmark-data-point',
            dataLine    : '.average-line-google-benchmark-segment',
            cplButton   : '.google-benchmark-dot-legend ellipse',
            label       : '.google-benchmark-label'
          },
          language: {
            titleVs: 'Google Benchmarks'
          }
        },
        'indystar'            : {
          datatype    : 'indystar',
          toggleable  : true,
          enabled     : true,
          selectors   : {
            dataPoint   : '.indystar-data-point',
            dataLine    : '.average-line-indystar',
            cplButton   : '.indystar-dot-legend ellipse',
            label       : '.indystar-label'
          },
          language: {
            titleVs: 'IndyStar'
          }
        },
        
      },
      dataType: function(dataType) 
      {
        return this.dataTypes[dataType];
      },
      toggleData: function(strDataType)
      {
        var dataType = this.dataType(strDataType);
        if (!dataType.toggleable) {return;}
        
        // toggle enabled
        dataType.enabled = !dataType.enabled;
        
        this.renderExternal([dataType]);
      },
      renderExternal: function(dataTypes) 
      {
        if (dataTypes === undefined) {
          dataTypes = this.dataTypes;
        }
        // conditional stuff here.. 
        for (var key in dataTypes) {
          var dataType = dataTypes[key];
          var dataPointSelector = this.container() + ' ' + dataType.selectors.dataPoint;
          var dataLineSelector  = this.container() + ' ' + dataType.selectors.dataLine;
          var labelSelector     = this.container() + ' ' + dataType.selectors.label;
          
          // when the datatype is enabled,
          if (dataType.enabled) {
            $(dataPointSelector).removeClass('chart-hidden');
            $(dataLineSelector).removeClass('chart-hidden');
            $(labelSelector).removeClass('chart-hidden');
            $(dataType.selectors.cplButton).removeClass('off');
            
            if (this.bubbleDiv && this.bubbleDiv.getAttribute('datatype') === dataType.datatype) {
              $(this.bubbleDiv).removeClass('chart-hidden');
            }

          } else { // otherwise..
            $(dataPointSelector).addClass('chart-hidden');
            $(dataLineSelector).addClass('chart-hidden');
            $(labelSelector).addClass('chart-hidden');
            $(dataType.selectors.cplButton).addClass('off');
            if (this.bubbleDiv && this.bubbleDiv.getAttribute('datatype') === dataType.datatype) {
              $(this.bubbleDiv).addClass('chart-hidden');
            }
          }

          if (this.bubbleDiv !== undefined) {
            setTimeout(function() {
              this.renderBubbleDiv();
            }.bind(this), 0);
          }

          
          
        }
        
        // build the title
        this.buildChartTitle();
      },
      buildChartTitle: function(selector) {
        if (selector !== undefined) {
          this.chartTitleSelector = selector;
        }
        $(this.chartTitleSelector).html(this._buildChartTitle());
        return this;
      },
      _buildChartTitle: function() {
        var enabledDataTypes = [];
        for (var key in this.dataTypes) {
          var dataType = this.dataTypes[key];
          if (dataType.enabled) {
            enabledDataTypes.push(dataType.language.titleVs);
          }
        }
        return enabledDataTypes.join(' vs. ')
      },
      
      /**
       * Data Chunking
       */
      getBetweenDates: function(qStartDate, qEndDate, data, convertToDates)
      {
        if (this.dateParser === undefined) {this.dateParser = d3.timeParse("%Y-%m-%d");}
        if (data === undefined || data === null) {data = this.data();}
        
        var startDate = (qStartDate instanceof Date)
                      ? qStartDate
                      : this.dateParser(qStartDate)
        ;
        var endDate   = (qEndDate instanceof Date)
                      ? qEndDate
                      : this.dateParser(qEndDate)
        ;
      
        
        var results = [];
        for (var key in data)
        {
          var datum = data[key];
          if (datum.campaign_type === undefined || datum.campaign_type === null || datum.campaign_type.trim() === '') {
            continue;
          } else {
            if ( 
                  datum.date >= startDate
              &&  datum.date < endDate
            ) {
              results.push(datum);
            }
          }
        }
        return results;
      },
      getByCampaignType: function(strType, useOriginalData)
      {
        if (useOriginalData === undefined || useOriginalData === null) {useOriginalData = true;}
        var results = [];
        var theData = useOriginalData 
                    ? this.originalData()
                    : this.data()
        ;
        
        for (var key in theData)
        {
          var datum = theData[key];
          if (datum.campaign_type === undefined || datum.campaign_type === null || datum.campaign_type.trim() === '') {
            continue;
          } else {
            if ( datum.campaign_type.trim().toLowerCase() === strType.trim().toLowerCase() ) {
              results.push(datum);
            }
          }
        }
        return results;
      },
      getAllDates: function()
      {
        // create the array
        var dates = [];
        
        // define the interval of your dates
        // remember: new Date(year, month starting in 0, day);
        var currentDate = this.minX; // date cursor
        var endDate = this.maxX; // end date marker
        
        // create a loop between the interval
        while (currentDate <= endDate)
        {
           // add on array
           dates.push(currentDate);
           // add one day
           currentDate = this.addDays(1).toDate(currentDate);
        }  
        
        return dates;
      },
      monthNames: [
        'january',
        'february',
        'march',
        'april',
        'may',
        'june',
        'july',
        'august',
        'september',
        'october',
        'november',
        'december'
      ],
      getAllMonths(dates) 
      {
        var months = [];
        for (var key in dates) {
          var date = dates[key];
          // console.log('inspecting date for month: ', date);
          var month = date.getMonth();
          if (months.indexOf(month) === -1) {
            months.push(month);
          }
        }
        return months;
      },
      getAllMonthNames(months) 
      {
        var monthNames = [];
        for (var key in months) {
          var month     = months[key];
          var monthName = this.monthNames[month]
          if (monthNames.indexOf(monthName) === -1) {
            monthNames.push(monthName);
          }
        }
        return monthNames;
      },
      addDays: function(numDays)
      {
        return {
          numDays: numDays,
          toDate: function(date)
          {
            var dat = new Date(date.valueOf());
            dat.setDate(dat.getDate() + this.numDays);
            return dat;
          }
        }
      },
      
      clearData : function()
      {
        this.data().splice(0, this.data().length);
        return this;
      },
      addData: function(arrData)
      {
        //console.log('adding data: ', arrData);
        this.insertData(arrData, this.data().length);
        return this;
      },
      insertData: function(arrData, index)
      {
        Array.prototype.splice.apply(this.data(), [index, 0].concat(arrData));
        return this;
      },
      replaceData: function(arrData)
      {
        this.clearData()
            .addData(arrData)
        ;
        return this;
      },
      restoreData: function()
      {
        this.data(this.originalData().slice(), false);
        return this;
      },
      
      renderByDate: function(options) 
      {
        
        var that = this;
        options = (options === undefined) ? {} : options;
        
        options.showAverageTrendline  = (options.showAverageTrendline === undefined || options.showAverageTrendline === null)
                              ? true
                              : false
        ;
        
        options.clearChart  = (options.clearChart === undefined || options.clearChart === null)
                            ? false
                            : options.clearChart
        ;
        options.delay     = (options.delay === undefined || options.delay === null)
                  ? 1
                  : options.delay
        ;
        options.data      = (options.data === undefined || options.data === null)
                  ? this.originalData()
                  : options.data
        ;
        options.direction = (options.direction === undefined || options.direction === null)
                  ? 'left-to-right'
                  : options.direction
        ;
        options.lineJumpAhead = (options.lineJumpAhead === undefined || options.lineJumpAhead === null)
                  ? 0
                  : options.lineJumpAhead
        ;
        
        var campaignType = options.data[0].campaign_type;
        if (campaignType === 'adnetwork_indystar') {campaignType = 'adnetwork-indystar';}
        
        var dates = this.allDates; // enumeration of all dates in the data

        // empty chart data
        if (options.clearChart) { this.clearData(); }

        var incrementNumber = 1;
        
        var animationFunction = function(i, dates, options) {
          var newData = this.getBetweenDates(
                          dates[i],            // startDate (inclusive)
                          dates[i + 1],        // endDate (not-inclusive)
                          options.data                // the originally fetched data
                        )
          ;
          var percentLength = (i + options.lineJumpAhead) / dates.length;
          if (percentLength > 1) {percentLength = 1;}

          // show averageTrendline?
          if (options.showAverageTrendline) {
            this.setLineLength(campaignType, percentLength);
          }

          this.addData(newData);  // add the data-chunk into the chart data
          this.drawData();        // render the chart data  
          
        };
        
       
        for (var i = 0; i < dates.length; i = i + incrementNumber) {
          setTimeout(
            animationFunction.bind(this
              ,i
              ,dates
              ,options
            ),
            options.delay * i
          );
        }
      
        // make callback when all animationFunctions have completed
        setTimeout(
          options.callback, 
          (options.delay * (dates.length + 1))
        );
        
        
      },
      renderLineByDatatype : function(datatype, duration, callback)
      {
        this.setLineLength(datatype, 1, 100, callback);
      },
      renderDataByDateAndType: function(delay) 
      {
        if (delay === undefined) {delay = 15;}
        this.clearData();
        this.drawData();

        this.delayAdjustmentAdjustmentBase = .6;
        this.animationNumber = 0;
        this.animations = [
          function(callback) {
            var theData = this.campaigns[this.animationNumber];
            var delayAdjustment = 1 + (this.delayAdjustmentAdjustmentBase * this.animationNumber);
            // console.log('animation 0 delayAdjustment: ', delayAdjustment);
            
            return this.renderByDate({
              delay: delay * delayAdjustment, 
              data: theData, 
              callback: callback,
              lineJumpAhead: 7
            });
          }.bind(this)
          ,
          function(callback) {
            var theData = this.campaigns[this.animationNumber];
            var delayAdjustment = 1 + (this.delayAdjustmentAdjustmentBase * (this.animationNumber * 1.15));
            // console.log('animation 1 delayAdjustment: ', delayAdjustment);
            
            return this.renderByDate({
              delay: delay * delayAdjustment, 
              data: theData, 
              callback: callback,
              lineJumpAhead: 4
            });
            
          }.bind(this)
          ,
          function(callback) {
            var theData = this.campaigns[this.animationNumber];
            var delayAdjustment = 1 + (this.delayAdjustmentAdjustmentBase * this.animationNumber);
            // console.log('animation 2 delayAdjustment: ', delayAdjustment);
            
            return this.renderByDate({
              delay: delay * delayAdjustment, 
              data: theData, 
              callback: callback,
              lineJumpAhead: 5
            });
            
          }.bind(this)
          ,
          function(callback) {
            this.renderLabels();
            setTimeout(function() {
              $('.label').removeClass('fade-in')
            }, 1000)
          }.bind(this)
          ,

        ];
        
        this.animationNumber = -1;
        this.doNextAnimation = function() 
        {
          this.animationNumber = this.animationNumber + 1;
          if (this.animationNumber < this.animations.length && this.animations[this.animationNumber]) {
            this.animations[this.animationNumber](this.doNextAnimation.bind(this));
          }
        }.bind(this)
        this.doNextAnimation();
        
        return this;
      },
      getLineByDatatype: function(datatype)
      {
        for (var key in this.lines) {
          var line = this.lines[key];
          if (line.datatype === datatype) {
            return line;
          }
        }
        return null;
      }
      
      
      
  },
  

  
  
  
};

/**
 * on window resize
 */
window.addEventListener("resize", function() {
  // re-render all charts
  for (var key in window.indystar_chart.charts) {
    var chart = window.indystar_chart.charts[key];
    if (chart !== undefined) {
      chart.handleResponsive();  
    }
  }
  
});

function rollAlong(lineNumber) {
  
  if (lineNumber === undefined || lineNumber === null) {
    lineNumber = Math.floor((Math.random() * 4) );;
  }
  
  var pen = window.indystar_chart.chart('circleChart1').chart.append('circle');
  pen.attr('r', 10);
  pen.attr('class', 'roll-along');
  
  var chartPaths = window.indystar_chart.chart('circleChart1').chart.selectAll('.average-line').nodes();
  // console.log('chartPaths: ', chartPaths);
  var roll = function() {
  		for(i = 0; i < 100; i++) {
  			setTimeout(function() {
  				var decimal = this.i / 100;
  				this.pen.attr('cx', this.path.getPointAtLength(chartPaths[lineNumber].getTotalLength() * decimal).x );
  				this.pen.attr('cy', this.path.getPointAtLength(chartPaths[lineNumber].getTotalLength() * decimal).y)
  			}.bind({pen: pen, i:i, path: chartPaths[lineNumber]}), 40 * i);
  		}
  }
  roll();
}

/* for capitalizing the first letter, re: templating layer */
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

Handlebars.registerHelper('if_eq', function(a, b, opts) {
  if(a == b) // Or === depending on your needs
  {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});
