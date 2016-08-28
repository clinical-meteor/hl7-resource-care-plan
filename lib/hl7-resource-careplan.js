
CarePlans = new Meteor.Collection('CarePlans');

if (Meteor.isClient){
  Meteor.subscribe('CarePlans');
}



CarePlanSchema = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "CarePlan"
  },
  "patient" :  {
    optional: true,
    type: ReferenceSchema
  }, // (Patient) R!  The patient this person is related to
  "relationship" :  {
    optional: true,
    type: CodeableConceptSchema
  }, // The nature of the relationship
  "name" :  {
    optional: true,
    type: HumanNameSchema
  }, // A name associated with the person
  "telecom" :  {
    optional: true,
    type: [ ContactPointSchema ]
  }, // A contact detail for the person
  "gender" :  {
    optional: true,
    type: String
  }, // male | female | other | unknown
  "birthDate" :  {
    optional: true,
    type: Date
  }, // The date on which the related person was born
  "address" :  {
    optional: true,
    type: [ AddressSchema ]
  }, // Address where the related person can be contacted or visited
  "photo" :  {
    optional: true,
    type: [ AttachmentSchema ]
  }, // Image of the person
  "period" :  {
    optional: true,
    type: PeriodSchema
  } // Period of time that this relationship is considered valid
});
CarePlans.attachSchema(CarePlanSchema);
