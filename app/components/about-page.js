import Component from '@ember/component';

export default Component.extend({
  init: function(){
    this._super();
    this.set('renderLookup', false);
    console.log(this.renderLookup);
  }
});
