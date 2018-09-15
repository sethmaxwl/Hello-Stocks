import Component from '@ember/component';
import $ from 'jquery';

export default Component.extend({
  stock: '',
  actions:{
    lookup(stock){
      let stockData = this.getInfo(stock);
      let ticker = stockData.getElementsByName("Symbol")[0];
      let name = stockData.getElementsByName("Name")[0];
      let url = 'http://dev.markitondemand.com/MODApis/Api/Quote?symbol=' + ticker;
      $.getJSON(url, function(json){
        let percent = json.get("QuoteApiModel.Data.ChangePercent");
        let yearChange = json.get("QuoteApiModel.Data.ChangePercentYTD");
        return {ticker, name, percent, yearChange};
      });
    },

    getSentiment(stock){
      //todo
    },

    getInfo(stock){
      let url = 'http://dev.markitondemand.com/MODApis/Api/Lookup?input=' + stock;
      let request = new XMLHttpRequest();
      request.open("GET", url);
      let xml = request.responseXML;
      let list = xml.getElementsByName("LookupResultList");
      return list.getElementById(0);
    }
  }
});
