var map=[];
  function getRandomColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
  }
function getdata(data)
{
  //$.getJSON('/data/:', function (val) {
    // Create the chart
      map.forEach(function(m){
        if(m.name===data.name){
          console.log("value already exist");
          return ;
        }
      })
      console.log(data);
      map.push({
            name: data.name,
            data: data.data[0].reverse(),
            color:getRandomColor(),
            tooltip: {
                valueDecimals: 2
            }});
      Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 1
        },
        title: {
            text: 'Stock Price'
        },
        series:map
  });
}