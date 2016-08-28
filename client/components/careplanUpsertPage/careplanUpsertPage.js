Session.setDefault('careplanReadOnly', true);


Router.map(function () {
  this.route('newCarePlanRoute', {
    path: '/insert/careplan',
    template: 'careplanUpsertPage',
    onAfterAction: function () {
      Session.set('careplanReadOnly', false);
    }
  });

});
Router.route('/upsert/careplan/:id', {
  name: 'upsertCarePlanRoute',
  template: 'careplanUpsertPage',
  data: function () {
    return CarePlans.findOne(this.params.id);
  },
  onAfterAction: function () {
    Session.set('careplanReadOnly', false);
  }
});
Router.route('/view/careplan/:id', {
  name: 'viewCarePlanRoute',
  template: 'careplanUpsertPage',
  data: function () {
    return CarePlans.findOne(this.params.id);
  },
  onAfterAction: function () {
    Session.set('careplanReadOnly', true);
  }
});


//-------------------------------------------------------------


Template.careplanUpsertPage.rendered = function () {
  Template.appLayout.layout();
};


Template.careplanUpsertPage.helpers({
  getName: function(){
    return this.name[0].text;
  },
  getEmailAddress: function () {
    if (this.telecom && this.telecom[0] && (this.telecom[0].system === "email")) {
      return this.telecom[0].value;
    } else {
      return "";
    }
  },
  isNewCarePlan: function () {
    if (this._id) {
      return false;
    } else {
      return true;
    }
  },
  isReadOnly: function () {
    if (Session.get('careplanReadOnly')) {
      return 'readonly';
    }
  },
  getCarePlanId: function () {
    if (this._id) {
      return this._id;
    } else {
      return '---';
    }
  }
});

Template.careplanUpsertPage.events({
  'click #removeUserButton': function () {
    CarePlans.remove(this._id, function (error, result) {
      if (error) {
        console.log("error", error);
      };
      if (result) {
        Router.go('/list/careplans');
      }
    });
  },
  'click #saveUserButton': function () {
    //console.log( 'this', this );

    Template.careplanUpsertPage.saveCarePlan(this);
    Session.set('careplanReadOnly', true);
  },
  'click .barcode': function () {
    // TODO:  refactor to Session.toggle('careplanReadOnly')
    if (Session.equals('careplanReadOnly', true)) {
      Session.set('careplanReadOnly', false);
    } else {
      Session.set('careplanReadOnly', true);
      console.log('Locking the careplan...');
      Template.careplanUpsertPage.saveCarePlan(this);
    }
  },
  'click #lockCarePlanButton': function () {
    //console.log( 'click #lockCarePlanButton' );

    if (Session.equals('careplanReadOnly', true)) {
      Session.set('careplanReadOnly', false);
    } else {
      Session.set('careplanReadOnly', true);
    }
  },
  'click #careplanListButton': function (event, template) {
    Router.go('/list/careplans');
  },
  'click .imageGridButton': function (event, template) {
    Router.go('/grid/careplans');
  },
  'click .tableButton': function (event, template) {
    Router.go('/table/careplans');
  },
  'click #previewCarePlanButton': function () {
    Router.go('/customer/' + this._id);
  },
  'click #upsertCarePlanButton': function () {
    console.log('creating new CarePlans...');
    Template.careplanUpsertPage.saveCarePlan(this);
  }
});


Template.careplanUpsertPage.saveCarePlan = function (careplan) {
  // TODO:  add validation functions

  if (careplan._id) {
    var careplanOptions = {
      careplanname: $('#careplannameInput').val(),
      emails: [{
        address: $('#careplanEmailInput').val()
      }],
      profile: {
        fullName: $('#careplanFullNameInput').val(),
        avatar: $('#careplanAvatarInput').val(),
        description: $('#careplanDescriptionInput').val()
      }
    };

    CarePlans.update({
      _id: careplan._id
    }, {
      $set: careplanOptions
    }, function (error, result) {
      if (error) console.log(error);
      Router.go('/view/careplan/' + careplan._id);
    });

    if (careplan.emails[0].address !== $('#careplanEmailInput')
      .val()) {
      var options = {
        careplanId: careplan._id,
        email: $('#careplanEmailInput')
          .val()
      };
      Meteor.call('updateEmail', options);
    }


  } else {
    var careplanOptions = {
      careplanname: $('#careplannameInput').val(),
      email: $('#careplanEmailInput').val(),
      profile: {
        fullName: $('#careplanFullNameInput').val(),
        avatar: $('#careplanAvatarInput').val(),
        description: $('#careplanDescriptionInput').val()
      }
    };
    //console.log( 'careplanOptions', careplanOptions );

    careplanOptions.password = $('#careplannameInput')
      .val();
    Meteor.call('addUser', careplanOptions, function (error, result) {
      if (error) {
        console.log('error', error);
      }
      if (result) {
        console.log('result', result);
        Router.go('/view/careplan/' + result);
      }
    });

  }
};
