Package.describe({
  name: 'clinical:hl7-resource-careplan',
  version: '1.0.7',
  summary: 'HL7 FHIR Resource - CarePlan',
  git: 'https://github.com/clinical-meteor/hl7-resource-careplan',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.1.0.3');

  api.use('meteor-platform');
  api.use('mongo');
  api.use('aldeed:simple-schema@1.3.3');
  api.use('aldeed:collection2@2.3.3');
  api.use('clinical:hl7-resource-datatypes@0.4.7');
  api.use('simple:json-routes@2.1.0');
  api.use('prime8consulting:meteor-oauth2-server@0.0.2');

  api.addFiles('lib/hl7-resource-careplan.js', ['client', 'server']);
  api.addFiles('server/rest.js', 'server');
  api.addFiles('server/initialize.js', 'server');

  api.use('clinical:base-model@1.3.1');
    // api.use('clinical:router@2.0.17');

    // api.addFiles('client/components/careplanUpsertPage/careplanUpsertPage.html', ['client']);
    // api.addFiles('client/components/careplanUpsertPage/careplanUpsertPage.js', ['client']);
    // api.addFiles('client/components/careplanUpsertPage/careplanUpsertPage.less', ['client']);
    //
    // api.addFiles('client/components/careplansTablePage/careplansTablePage.html', ['client']);
    // api.addFiles('client/components/careplansTablePage/careplansTablePage.js', ['client']);
    // api.addFiles('client/components/careplansTablePage/careplansTablePage.less', ['client']);
    // api.addFiles('client/components/careplansTablePage/jquery.tablesorter.js', ['client']);
    //
    // api.addFiles('client/components/careplanPreviewPage/careplanPreviewPage.html', ['client']);
    // api.addFiles('client/components/careplanPreviewPage/careplanPreviewPage.js', ['client']);
    // api.addFiles('client/components/careplanPreviewPage/careplanPreviewPage.less', ['client']);
    //
    // api.addFiles('client/components/careplansListPage/careplansListPage.html', ['client']);
    // api.addFiles('client/components/careplansListPage/careplansListPage.js', ['client']);
    // api.addFiles('client/components/careplansListPage/careplansListPage.less', ['client']);

  api.export('CarePlan');
  api.export('CarePlans');
});
