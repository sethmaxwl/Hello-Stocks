import Component from '@ember/component';
import $ from 'jquery';

export default Component.extend({
  searchSuccess: true,
  stockSearch: "",
  graphOptions: {},
  actions:{
    search(){
      let searchURL = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + this.get("stockSearch") + "&interval=5min&apikey=F3XPPAPBQJU1RE34";
      $.getJSON(searchURL, function(data){
        console.log(data);
      });
    }
  }
});
