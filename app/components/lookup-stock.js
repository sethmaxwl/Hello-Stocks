import Component from '@ember/component';
import $ from 'jquery';

export default Component.extend({
  searchSuccess: true,
  stockSearch: '',
  actions:{
    search(){
      let searchURL = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + stockSearch + "&output=compact&apikey=F3XPPAPBQJU1RE34";
      $.getJSON(searchURL, function(data){
        console.log(data);
      });
    }
  }
});
