Session.setDefault( 'careplanSearchFilter', '' );
Session.setDefault( 'tableLimit', 20 );
Session.setDefault( 'paginationCount', 1 );
Session.setDefault( 'selectedPagination', 0 );
Session.setDefault( 'skipCount', 0 );



//------------------------------------------------------------------------------
// ROUTING

Router.route( '/list/careplans/', {
  name: 'careplansListPage',
  template: 'careplansListPage',
  data: function () {
    return CarePlans.find();
  }
});


//------------------------------------------------------------------------------
// TEMPLATE INPUTS

Template.careplansListPage.events( {
  'click .addRecordIcon': function () {
    Router.go( '/insert/careplan' );
  },
  'click .careplanItem': function () {
    Router.go( '/view/careplan/' + this._id );
  },
  // use keyup to implement dynamic filtering
  // keyup is preferred to keypress because of end-of-line issues
  'keyup #careplanSearchInput': function () {
    Session.set( 'careplanSearchFilter', $( '#careplanSearchInput' ).val() );
  }
} );


//------------------------------------------------------------------------------
// TEMPLATE OUTPUTS


var OFFSCREEN_CLASS = 'off-screen';
var EVENTS = 'webkitTransitionEnd oTransitionEnd transitionEnd msTransitionEnd transitionend';

Template.careplansListPage.rendered = function () {
  console.log( 'trying to update layout...' );

  Template.appLayout.delayedLayout( 20 );
};


Template.careplansListPage.helpers( {
  hasNoContent: function () {
    if ( CarePlans.find()
      .count() === 0 ) {
      return true;
    } else {
      return false;
    }
  },
  careplansList: function () {
    Session.set( 'receivedData', new Date() );

    Template.appLayout.delayedLayout( 20 );

    return CarePlans.find( {
      'profile.fullName': {
        $regex: Session.get( 'careplanSearchFilter' ),
        $options: 'i'
      }
    } );
  }
} );
