
Router.map(function(){
  this.route('careplanPreviewPage', {
    path: '/careplan/:id',
    template: 'careplanPreviewPage',
    data: function () {
      return CarePlans.findOne({_id: this.params.id});
    },
    onAfterAction: function(){
      Template.appLayout.layout();
    }
  });
});


Template.careplanPreviewPage.rendered = function(){
  Template.appLayout.layout();
};



Template.careplanPreviewPage.events({
  "click .listButton": function(event, template){
    Router.go('/list/careplans');
  },
  "click .imageGridButton": function(event, template){
    Router.go('/grid/careplans');
  },
  "click .tableButton": function(event, template){
    Router.go('/table/careplans');
  },
  "click .indexButton": function(event, template){
    Router.go('/list/careplans');
  },
  "click .careplanId": function(){
    Router.go('/upsert/careplan/' + this._id);
  }
});
