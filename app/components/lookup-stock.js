import Component from '@ember/component';
import $ from 'jquery';
import { computed } from '@ember/object';

export default Component.extend({
  searchSuccess: false,
  error: false,
  graphOptions: computed(function(){
    return {};
  }),
  data: computed(function(){
    return [];
  }),
  actions:{
    search(){
      this.set('data', []);
      this.set('error', false);
      this.set('searchSuccess', false);
      var self = this;
      let searchURL = "https://api.iextrading.com/1.0/stock/" + this.get('stockSearch') + "/chart/3m";
      $.getJSON(searchURL, function(data){
        console.log(data);
        let cats = [];
        let min, max = data[data.length-1].close;
        for(var i=0;i<30;i++){
          if(data[data.length-(31-i)].close == undefined){
            self.data.push(null);
          }else{
            let close = data[data.length-(31-i)].close;
            if(close > max){
              max = close;
            }
            if(close < min){
              min = close;
            }
            self.data.push(close);
          }
          cats.push(data[data.length-(31-i)].date);
        }
        self.set('graphOptions',
          {chart: {
            type: 'area'
          },
          title: {
            text:  self.stockSearch.toUpperCase() + " Trends"
          },
          xAxis:{
            title:{
              text: 'Dates (MM-DD-YYYY)'
            },
            categories:cats
          },
          yAxis: {
            title: {
              text: 'Stock Value (in USD)'
            }
          },
          tooltip: {
            headerFormat: 'Date: {point.key}<br>',
            pointFormat: 'Value: ${point.y}',
            shared: true
          },
          series:[{
            name: self.stockSearch.toUpperCase(),
            data: self.data
          }]
        });
        self.set('searchSuccess', true);
      }).fail(function(e){
        self.set('searchSuccess', false);
        self.set('error', true);
      });
    }
  }
});
