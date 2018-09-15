import Component from '@ember/component';
import $ from 'jquery';
import { computed } from '@ember/object';

function getSentiment(stock){
  let url = "https://api.iextrading.com/1.0/stock/" + stock + "/news";
  $.getJSON(url, function(data){
    let json = '{"documents": [';
    for(let i = 0; i < data.length;){
      let title = data.get(i + ".headline");
      json += '{"language": "en", "id": "' + (++i) + '", "text": "' + title + '"}'
      if(i < data.length) json += ',';
    }
    json += "]}";
    let score = 0;
    $.ajax({
      url: "https://eastus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment",
      beforeSend: function(xhrObj){
        // Request headers
        xhrObj.setRequestHeader("Content-Type","application/json");
        xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","a894e56911454a629b57bf9bfa68de8c");
      },
      type: "POST",
      // Request body
      data: json,
    })
      .done(function(response) {
        let scores = response.documents;
        for (let i = 0; i < scores.length; i++) {
          score += scores.get(i + ".score");
        }
        score = score/scores.length;
        console.log(score);
        return score;
      })
      .fail(function() {
        alert("BIG ERROR");
      });
  });
}

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
      getSentiment(this.get("stockSearch"));
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
