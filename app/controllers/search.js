import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  queryParams: ['symbol'],
  symbol: null,
  actions: {
    init(){
      this.set('stockSearch', symbol);
    }
  }
});
