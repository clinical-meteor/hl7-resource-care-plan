## clinical:hl7-resource-careplan  

#### Licensing  

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)


#### Integration & Verification Tests  

[![CircleCI](https://circleci.com/gh/clinical-meteor/hl7-resource-careplan/tree/master.svg?style=svg)](https://circleci.com/gh/clinical-meteor/hl7-resource-careplan/tree/master)


#### API Reference  

This package implements the FHIR List resource schema provided at [https://www.hl7.org/fhir/careplan.html](https://www.hl7.org/fhir/careplan.html).


#### Installation  

````bash
# to add hl7 resource schemas and rest routes
meteor add clinical:hl7-resource-careplan

# to initialize default data
INITIALIZE=true meteor
````

#### Example   

```js
var newCarePlan = {
  resourceType: "CarePlan",
  identifier: [],
  subject: {
    display: "Jane Doe",
    reference: "Patients/p3wQgM6YeWq8DZCkg"
  },
  status: "active",
  context: {
    display: "2016-09-20",
    reference: "Encounters/6zfKfRpMWmfXo69e5"
  },
  period: {
    start: new Date(2016, 09, 20),
    end: new Date(2016, 09, 21)
  },
  author: {
    display: "System",
    reference: "Meteor.users/System"
  },
  description: "Daily exercise plan",
  addresses: {
    display: "Overweight",
    reference: "Conditions/CGZMzf92YzNNy9QXg"
  },
  relatedPlan: [{
    code: 'fullfills',
    plan: {
      display: "Daily Exercise Template",
      reference: "CarePlans/Ezmogee2PZ2ShhYu5"
    }
  }],
  participant: [{
    role: {
      text: "Primary Care Physician"
    },
    member: {
      display: "Dr. Gregory House",
      reference: "Practitioners/rY4Yxup43mNm5PTPB"
    }
  }],
  goal: [{
    display: "10,000 Steps per Day",
    reference: "Goals/5swyrDw6ajMfYD2qA"    
  }],
  activity: [{
    actionResulting: [],
    progress: [],
    reference: [],
    detail: {
      category: {
        text: 'diet'
      },
      reasonCode: [],
      reasonReference: [],
      goal: [],
      status: "in-progress",
      statusReason: {},
      prohibited: false,
      scheduledPeriod: {
        start: new Date(2016, 09, 20),
        end: new Date(2016, 09, 21)
      },
      location: {},
      performer: {
        display: "Jane Doe",
        reference: "Patients/p3wQgM6YeWq8DZCkg"
      },
      productReference: {
        display: "Water",
        reference: "Medications/3NxeHc7RcTiSvncFy"
      },
      dailyAmount: {
        value: 250,
        comparator: ">",
        unit: "ml",
        system: "http://unitsofmeasure.org"
      }
      quantity: {},
      description: "Keep hydrated as you exercise."
    }
  }]


}
CarePlans.insert(newCarePlan);
```


#### Extending the Schema

```js
ExtendedCarePlanSchema = new SimpleSchema([
  ObservationSchema,
  {
    "createdAt": {
      "type": Date,
      "optional": true
    }
  }
]);
CarePlans.attachSchema( ExtendedCarePlanSchema );
```


#### Utilities  

If you're working with HL7 FHIR Resources, we recommend using [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en).


#### References  

The following may be useful for determining Goals and Activities.  
[https://loinc.org/sdh/](LOINC - Social Determinants of Health)

