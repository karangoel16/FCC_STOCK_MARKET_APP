function getdata(data)
{
  //$.getJSON('/data/:', function (val) {
    // Create the chart
      console.log(data);
      Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 1
        },
        title: {
            text: 'Stock Price'
        },
        series: [{
            name: data.name.data,
            data: data.data[0].reverse(),
            tooltip: {
                valueDecimals: 2
            }
    }]
  });
}