Package.describe({
  name: 'clinical:hl7-resource-careplan',
  version: '1.3.10',
  summary: 'HL7 FHIR Resource - CarePlan',
  git: 'https://github.com/clinical-meteor/hl7-resource-careplan',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.1.0.3');

  api.use('meteor-platform');
  api.use('mongo');
  api.use('ecmascript@0.9.0');

  api.use('aldeed:collection2@3.0.0');
  api.use('clinical:hl7-resource-datatypes@4.0.0');
  api.use('clinical:hl7-resource-bundle@1.4.0');

  api.use('simple:json-routes@2.1.0');
  api.use('momentjs:moment@2.17.1');

  api.use('session');
  api.use('http');
  api.use('react-meteor-data@0.2.15');

  api.use('clinical:glass-ui@2.1.4');
  api.use('clinical:extended-api@2.2.2');
  api.use('clinical:base-model@1.4.0');
  api.use('clinical:user-model@1.6.2');
  api.use('matb33:collection-hooks@0.7.15');
  api.use('clinical:alert@2.1.3')

  api.use('clinical:hl7-resource-goal@1.3.6');
  api.use('clinical:hl7-resource-condition@1.7.18');
  api.use('clinical:hl7-resource-medication@1.3.5');
  api.use('clinical:hl7-resource-patient@3.4.8');

  api.addFiles('lib/CarePlans.js', ['client', 'server']);
  api.addFiles('server/rest.js', 'server');
  api.addFiles('server/initialize.js', 'server');
  api.addFiles('server/methods.js', 'server');

  if(Package['clinical:fhir-vault-server']){
    api.use('clinical:fhir-vault-server@0.0.3', ['client', 'server'], {weak: true});
  }

  api.export('CarePlan');
  api.export('CarePlans');
  api.export('CarePlanSchema');

  api.mainModule('index.jsx', 'client');
});

Npm.depends({
  "simpl-schema": "1.5.3",
  "moment": "2.22.2",
  "lodash": "4.17.4",
  "react-icons": "3.2.2"
})