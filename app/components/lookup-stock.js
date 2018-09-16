import Component from '@ember/component';
import $ from 'jquery';
import { computed } from '@ember/object';

function getSentiment(stock){
  let url = "https://api.iextrading.com/1.0/stock/" + stock + "/news";
  var score = 0;
  $.getJSON({url: url, async: false}).done(function(data){
    let json = '{"documents": [';
    for(let i = 0; i < data.length;){
      let title = data.get(i + ".headline");
      json += '{"language": "en", "id": "' + (++i) + '", "text": "' + title + '"}'
      if(i < data.length) json += ',';
    }
    json += "]}";
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
      async: false,
    })
      .done(function(response) {
        let scores = response.documents;
        for (let i = 0; i < scores.length; i++) {
          score += scores.get(i + ".score");
        }
        score = score/scores.length;
      })
      .fail(function() {
        alert("BIG ERROR");
      });
  });
  return score;
}

function getCompanyName(stock){
  let url = "https://api.iextrading.com/1.0/stock/" + stock + "/company";
  let companyName;
    $.getJSON({url: url, async: false}).done(function(data){
      companyName = data.companyName;
    });
  return companyName;
  }

export default Component.extend({
  loading: false,
  input: '',
  percentSentiment: 0,
  searchSuccess: false,
  error: false,
  landing: true,
  invest: false,
  middle: false,
  noInvest: false,
  hasntSearched: true,
  onePeer: false,
  twoPeer: false,
  threePeer: false,
  fourPeer: false,
  fivePeer: false,
  sixPeer: false,
  noPeer: false,
  image: '',
  companyData: computed(function(){
    return [];
  }),
  graphOptions: computed(function(){
    return {};
  }),
  data: computed(function(){
    return [];
  }),
  peer: computed(function(){
    return [];
  }),
  actions:{
    search(){
      this.set('loading', true);
      this.set('hasntSearched', false);
      this.set('input', this.stockSearch.toUpperCase());
      this.set('invest', false);
      this.set('middle', false);
      this.set('noInvest', false);
      this.set('data', []);
      this.set('error', false);
      this.set('searchSuccess', false);
      this.set('companyData', []);
      var self = this;
      let searchURL = "https://api.iextrading.com/1.0/stock/" + this.get('input') + "/chart/3m";
      $.getJSON(searchURL, function(data){
        let cats = [];
        let minimum = data[data.length-31].close;
        let maximum = data[data.length-1].close;
        for(var i=0;i<30;i++){
          if(data[data.length-(31-i)].close == undefined){
            self.data.push(null);
          }else{
            let close = data[data.length-(31-i)].close;
            if(close > maximum){
              maximum = close;
            }
            if(close < minimum){
              minimum = close;
            }
            self.data.push(close);
          }
          cats.push(data[data.length-(31-i)].date);
        }
        self.set('graphOptions',
          {chart: {
            type: 'area',
            zoomType: 'x',
            backgroundColor: '#f2f2f2'
          },
          title: {
            text:  getCompanyName(self.input) + " Trends"
          },
          xAxis:{
            title:{
              text: 'Dates (YYYY-MM-DD)'
            },
            categories:cats
          },
          yAxis: {
            title: {
              text: 'Stock Value (in USD)'
            },
            min: minimum-1,
            max: maximum+1
          },
          tooltip: {
            headerFormat: 'Date: {point.key}<br>',
            pointFormat: 'Value: ${point.y:.2f}',
            shared: true
          },
          series:[{
            name: self.input,
            data: self.data
          }]
        });
        self.set('searchSuccess', true);
      }).fail(function(e){
        self.set('searchSuccess', false);
        self.set('error', true);
      });
      let sentiment = getSentiment(this.input);
      sentiment = Math.floor(sentiment * 1000) / 10;
      self.set('percentSentiment', sentiment);
      if(self.get('percentSentiment') >= 75){
        self.set('invest', true);
      }else if(self.get('percentSentiment') >= 50){
        self.set('middle', true);
      }else{
        self.set('noInvest', true);
      }
      this.set('image', "https://storage.googleapis.com/iex/api/logos/" + this.input + ".png");
      searchURL = "https://api.iextrading.com/1.0/stock/" + this.get('input') + "/quote?displayPercent=true";
      $.getJSON({url:searchURL, async: false}, function(data){
        let d = self.get('companyData');
        let da = {
          name: getCompanyName(self.input),
          latestPrice: data.latestPrice,
          changePercent: Math.floor(data.changePercent * 10000) / 10000,
          ytdChange: Math.floor(data.ytdChange * 100) / 100,
          week52High: data.week52High,
          week52Low: data.week52Low
        };
        d.push(da);
      });
      searchURL = "https://api.iextrading.com/1.0/stock/" + this.get('input') + "/peers";
      $.getJSON({url:searchURL, async:false}, function(data){
        let p = self.get('peer');
        for(var i=0;i<data.length;i++){
          p.push({'i': data[i]});
        }
      }).then(function(){
        let l = self.get('peer').length;
        if(l == 1){
          self.set('onePeer', true);
        }else if(l == 2){
          self.set('twoPeer', true);
        }else if(l == 3){
          self.set('threePeer', true);
        }else if(l == 4){
          self.set('fourPeer', true);
        }else if(l == 5){
          self.set('fivePeer', true);
        }else if(l == 0){
          self.set('noPeer', true);
        }else{
          self.set('sixPeer', true);
        }
      });
      console.log(this.peer);
      this.set('loading', false);
    }
  }
});
