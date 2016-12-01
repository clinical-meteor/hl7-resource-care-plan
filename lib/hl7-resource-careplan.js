
// create the object using our BaseModel
CarePlan = BaseModel.extend();


//Assign a collection so the object knows how to perform CRUD operations
CarePlan.prototype._collection = CarePlans;

// Create a persistent data store for addresses to be stored.
// HL7.Resources.Patients = new Mongo.Collection('HL7.Resources.Patients');
CarePlans = new Mongo.Collection('CarePlans');

//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
CarePlans._transform = function (document) {
  return new CarePlan(document);
};


if (Meteor.isClient){
  Meteor.subscribe("CarePlans");
}

if (Meteor.isServer){
  Meteor.publish("CarePlans", function (argument){
    if (this.userId) {
      return CarePlans.find();
    } else {
      return [];
    }
  });
}


CarePlanSchema = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "CarePlan"
  },
  "identifier" : {
    optional: true,
    type:  [ IdentifierSchema ]
    },
  "subject" : {
    optional: true,
    type: ReferenceSchema
    },
  "status" : {
    optional: true,
    type: Code
    },
  "context" : {
    optional: true,
    type: ReferenceSchema
    },
  "period" : {
    optional: true,
    type: PeriodSchema
    },
  "author" : {
    optional: true,
    type: [ ReferenceSchema ]
    },
  "modified" : {
    optional: true,
    type: Date
    },
  "category" : {
    optional: true,
    type: [ CodeableConceptSchema ]
    },
  "description" : {
    optional: true,
    type: String
    },
  "addresses" : {
    optional: true,
    type: [ ReferenceSchema ]
    },
  "support" : {
    optional: true,
    type: [ ReferenceSchema ]
    },

  "relatedPlan.$.code" :  {
    optional: true,
    type: Code
    },
  "relatedPlan.$.plan" :  {
    optional: true,
    type: ReferenceSchema
    },

  "participant.$.role" :  {
    optional: true,
    type: CodeableConceptSchema
    },
  "participant.$.member" :  {
    optional: true,
    type: ReferenceSchema
    },

  "goal" :  {
    optional: true,
    type: [ ReferenceSchema ]
    },

  "activity.$.actionResulting" :  {
    optional: true,
    type: [ ReferenceSchema ]
    },
  "activity.$.progress" :  {
    optional: true,
    type: [ AnnotationSchema ]
    },
  "activity.$.reference" :  {
    optional: true,
    type: ReferenceSchema
    },

  "activity.$.detail.category" :  {
    optional: true,
    type: CodeableConceptSchema
    },
  "activity.$.detail.code" :  {
    optional: true,
    type: CodeableConceptSchema
    },
  "activity.$.detail.reasonCode" :  {
    optional: true,
    type: [ CodeableConceptSchema ]
    },
  "activity.$.detail.reasonReference" :  {
    optional: true,
    type: [ ReferenceSchema ]
    },
  "activity.$.detail.goal" :  {
    optional: true,
    type: [ ReferenceSchema ]
    },
  "activity.$.detail.status" :  {
    optional: true,
    type: Code
    },
  "activity.$.detail.statusReason" :  {
    optional: true,
    type: CodeableConceptSchema
    },
  "activity.$.detail.prohibited" :  {
    optional: true,
    type: Boolean
    },
  "activity.$.detail.scheduledTiming" :  {
    optional: true,
    type: TimingSchema
    },
  "activity.$.detail.scheduledPeriod" :  {
    optional: true,
    type: PeriodSchema
    },
  "activity.$.detail.scheduledString" :  {
    optional: true,
    type: String
    },
  "activity.$.detail.location" :  {
    optional: true,
    type: ReferenceSchema
    },
  "activity.$.detail.performer" : {
    optional: true,
    type:  [ ReferenceSchema ]
    },
  "activity.$.detail.productCodeableConcept" :  {
    optional: true,
    type: CodeableConceptSchema
    },
  "activity.$.detail.productReference" :  {
    optional: true,
    type: ReferenceSchema
    },
  "activity.$.detail.dailyAmount" :  {
    optional: true,
    type: QuantitySchema
    },
  "activity.$.detail.quantity" :  {
    optional: true,
    type: QuantitySchema
    },
  "activity.$.detail.description" :  {
    optional: true,
    type: String
    },
  "note" :  {
    optional: true,
    type: AnnotationSchema
    }
});
CarePlans.attachSchema(CarePlanSchema);
