import Component from '@ember/component';
import $ from 'jquery';
import { computed } from '@ember/object';
export default Component.extend({
  searchSuccess: false,
  error: false,
  graphData: computed(function(){
    return [];
  }),
  graphOptions: computed(function(){
    return {};
  }),
  actions:{
    search(){
      this.set('data', []);
      this.set('error', false);
      this.set('searchSuccess', false);
      var self = this;
      let searchURL = "https://api.iextrading.com/1.0/stock/" + this.get('stockSearch') + "/chart/1d";
      $.getJSON(searchURL, function(data){
        let d = self.get('graphData');
        for(var i=0;i<30;i++){
          d.push([data[data.length-(i+1)].minute, data[data.length-(i+1)].close]);
        }
        self.set('graphOptions', {chart: {type: 'area'},title: {text:  "Stock Trends"},xAxis:{title:{text: 'XAXIS'},categories: ['stock']},yAxis: {title: {text: 'YAXIS'}},series:{data: self.graphData}});
        self.set('searchSuccess', true);
      }).fail(function(e){
        self.set('searchSuccess', false);
        self.set('error', true);
      });
    }
  }
});
