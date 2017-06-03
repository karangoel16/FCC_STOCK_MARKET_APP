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
      if(data!==null)
      {
        for(var i=0;i<map.length;i++)
        {
          if(map[i].name===data.name){
            console.log("value already exist");
            return false;
          }
        }
        console.log(data);
        map.push({
            name: data.name,
            data: data.data[0].reverse(),
            color:getRandomColor(),
            tooltip: {
                valueDecimals: 2
            }});
      }
      Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 1
        },
        title: {
            text: 'Stock Price'
        },
        series:map
  });
  return true;
}
function deleteMap(val){
  console.log("*");
  for(var i=0;i<map.length;i++){
    if(map[i].name===val){
      map.splice(i,1);//this is splice function
    }
  }
  console.log("*");
  getdata(null);
}