## clinical:hl7-resource-careplan  

> **NOTICE:  After a very successful run of nearly 50+ pilots and prototypes, this package is being retired and archived.  Future work on FHIR Care Plan resource is being done in the [clinical:hl7-fhir-data-infrastructure](https://github.com/clinical-meteor/hl7-fhir-data-infrastructure) atmosphere package and the [material-fhir-ui](https://github.com/clinical-meteor/material-fhir-ui) NPM package.**    

> One of our learnings over the 50+ pilots was how to best organize our packages, and we've determined that we want to a) consolidate React pure function components (Tables, Cards, etc) into an NPM package that is accessible to Webpack and other build environments.  And b) we wanted to consolidate the React class components which rely on Meteor's reactive data infrastructure into it's own separate package.  We're also c) moving the Rest server endpoints into a third package.   

> Separating each FHIR resource into it's own package was a time consuming task; but was definately worth.  Over the 50+ pilots, we were able to track usage patterns and what functionality was specific to each resource and what was shared, common, infrastructure.  Our refactor back into a consolidated package architecture will be based on all those learnings, and we look forward to publishing some of the best FHIR UI libraries on the web.  


#### Licensing  

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)


#### API Reference  

This package implements the FHIR List resource schema provided at [https://www.hl7.org/fhir/DSTU2/careplan.html](https://www.hl7.org/fhir/DSTU2/careplan.html).


#### Installation  

````bash
# to add hl7 resource schemas and rest routes
meteor add clinical:hl7-resource-careplan

# to initialize default data
INITIALIZE=true meteor
````

#### Example   

If you are going to use the `CarePlanDesignerPage`, you will need to set the following keys in your `Meteor.settings` file.  

```
{
  "public": {
    "modules": {
      "fhir": {
        "CarePlans": {
            "displayGoalsCard": true,
            "displayMedicationsCard": true,
            "displayActivitiesCard": true,
            "displayQuestionnairesCard": true
          }
      }
    }
  }
}
```

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



--------------------------------------------  
#### Acknowledgements     

Many thanks to DxRx Medical, the HL7 Argonaut Project, Clinicians on FHIR, UPenn Medical, and Parkland Center for Care Innovation for helping sponsor this package.  
