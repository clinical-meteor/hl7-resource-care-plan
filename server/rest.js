

//==========================================================================================
// Global Configs  

var fhirVersion = 'fhir-3.0.0';

if(typeof oAuth2Server === 'object'){
  // TODO:  double check that this is needed; and that the /api/ route is correct
  JsonRoutes.Middleware.use(
    // '/api/*',
    '/fhir-3.0.0/*',
    oAuth2Server.oauthserver.authorise()   // OAUTH FLOW - A7.1
  );
}

JsonRoutes.setResponseHeaders({
  "content-type": "application/fhir+json"
});



//==========================================================================================
// Global Method Overrides

// this is temporary fix until PR 132 can be merged in
// https://github.com/stubailo/meteor-rest/pull/132

JsonRoutes.sendResult = function (res, options) {
  options = options || {};

  // Set status code on response
  res.statusCode = options.code || 200;

  // Set response body
  if (options.data !== undefined) {
    var shouldPrettyPrint = (process.env.NODE_ENV === 'development');
    var spacer = shouldPrettyPrint ? 2 : null;
    res.setHeader('Content-type', 'application/fhir+json');
    res.write(JSON.stringify(options.data, null, spacer));
  }

  // We've already set global headers on response, but if they
  // pass in more here, we set those.
  if (options.headers) {
    //setHeaders(res, options.headers);
    options.headers.forEach(function(value, key){
      res.setHeader(key, value);
    });
  }

  // Send the response
  res.end();
};




//==========================================================================================
// Step 1 - Create New CarePlan  

JsonRoutes.add("put", "/" + fhirVersion + "/CarePlan/:id", function (req, res, next) {
  process.env.DEBUG && console.log('PUT /fhir-1.6.0/CarePlan/' + req.params.id);
  //process.env.DEBUG && console.log('PUT /fhir-1.6.0/CarePlan/' + req.query._count);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("content-type", "application/fhir+json");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);

  if(typeof oAuth2Server === 'object'){
    var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});    

    if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {
      if (accessToken) {
        process.env.TRACE && console.log('accessToken', accessToken);
        process.env.TRACE && console.log('accessToken.userId', accessToken.userId);
      }


      if (req.body) {
        carePlanUpdate = req.body;

        // remove id and meta, if we're recycling a resource
        delete req.body.id;
        delete req.body.meta;

        //process.env.TRACE && console.log('req.body', req.body);

        carePlanUpdate.resourceType = "CarePlan";
        carePlanUpdate = CarePlans.toMongo(carePlanUpdate);

        //process.env.TRACE && console.log('carePlanUpdate', carePlanUpdate);


        carePlanUpdate = CarePlans.prepForUpdate(carePlanUpdate);


        process.env.DEBUG && console.log('-----------------------------------------------------------');
        process.env.DEBUG && console.log('carePlanUpdate', JSON.stringify(carePlanUpdate, null, 2));
        // process.env.DEBUG && console.log('newCarePlan', newCarePlan);

        var carePlan = CarePlans.findOne(req.params.id);
        var carePlanId;

        if(carePlan){
          process.env.DEBUG && console.log('CarePlan found...')
          carePlanId = CarePlans.update({_id: req.params.id}, {$set: carePlanUpdate },  function(error, result){
            if (error) {
              process.env.TRACE && console.log('PUT /fhir/CarePlan/' + req.params.id + "[error]", error);

              // Bad Request
              JsonRoutes.sendResult(res, {
                code: 400
              });
            }
            if (result) {
              process.env.TRACE && console.log('result', result);
              res.setHeader("Location", "fhir/CarePlan/" + result);
              res.setHeader("Last-Modified", new Date());
              res.setHeader("ETag", "1.6.0");

              var carePlans = CarePlans.find({_id: req.params.id});
              var payload = [];

              carePlans.forEach(function(record){
                payload.push(CarePlans.prepForFhirTransfer(record));
              });

              console.log("payload", payload);

              // success!
              JsonRoutes.sendResult(res, {
                code: 200,
                data: Bundle.generate(payload)
              });
            }
          });
        } else {        
          process.env.DEBUG && console.log('No carePlan found.  Creating one.');
          carePlanUpdate._id = req.params.id;
          carePlanId = CarePlans.insert(carePlanUpdate,  function(error, result){
            if (error) {
              process.env.TRACE && console.log('PUT /fhir/CarePlan/' + req.params.id + "[error]", error);

              // Bad Request
              JsonRoutes.sendResult(res, {
                code: 400
              });
            }
            if (result) {
              process.env.TRACE && console.log('result', result);
              res.setHeader("Location", "fhir/CarePlan/" + result);
              res.setHeader("Last-Modified", new Date());
              res.setHeader("ETag", "1.6.0");

              var carePlans = CarePlans.find({_id: req.params.id});
              var payload = [];

              carePlans.forEach(function(record){
                payload.push(CarePlans.prepForFhirTransfer(record));
              });

              console.log("payload", payload);

              // success!
              JsonRoutes.sendResult(res, {
                code: 200,
                data: Bundle.generate(payload)
              });
            }
          });        
        }
      } else {
        // no body; Unprocessable Entity
        JsonRoutes.sendResult(res, {
          code: 422
        });

      }


    } else {
      // Unauthorized
      JsonRoutes.sendResult(res, {
        code: 401
      });
    }
  } else {
    // no oAuth server installed; Not Implemented
    JsonRoutes.sendResult(res, {
      code: 501
    });
  }

});



//==========================================================================================
// Step 2 - Read CarePlan  

JsonRoutes.add("get", "/" + fhirVersion + "/CarePlan/:id", function (req, res, next) {
  process.env.DEBUG && console.log('GET /fhir-1.6.0/CarePlan/' + req.params.id);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("content-type", "application/fhir+json");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  if(typeof oAuth2Server === 'object'){
    var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});

    if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {

      if (accessToken) {
        process.env.TRACE && console.log('accessToken', accessToken);
        process.env.TRACE && console.log('accessToken.userId', accessToken.userId);
      }

      var carePlanData = CarePlans.findOne({_id: req.params.id});
      if (carePlanData) {
        carePlanData.id = carePlanData._id;

        delete carePlanData._document;
        delete carePlanData._id;

        process.env.TRACE && console.log('carePlanData', carePlanData);

        // Success
        JsonRoutes.sendResult(res, {
          code: 200,
          data: CarePlans.prepForFhirTransfer(carePlanData)
        });
      } else {
        // Gone
        JsonRoutes.sendResult(res, {
          code: 410
        });
      }
    } else {
      // Unauthorized
      JsonRoutes.sendResult(res, {
        code: 401
      });
    }
  } else {
    // no oAuth server installed; Not Implemented
    JsonRoutes.sendResult(res, {
      code: 501
    });
  }
});

//==========================================================================================
// Step 3 - Update CarePlan  

JsonRoutes.add("post", "/" + fhirVersion + "/CarePlan", function (req, res, next) {
  process.env.DEBUG && console.log('POST /fhir/CarePlan/', JSON.stringify(req.body, null, 2));

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("content-type", "application/fhir+json");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  if(typeof oAuth2Server === 'object'){
    var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});

    if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {

      if (accessToken) {
        process.env.TRACE && console.log('accessToken', accessToken);
        process.env.TRACE && console.log('accessToken.userId', accessToken.userId);
      }

      var carePlanId;
      var newCarePlan;

      if (req.body) {
        newCarePlan = req.body;


        // remove id and meta, if we're recycling a resource
        delete newCarePlan.id;
        delete newCarePlan.meta;


        newCarePlan = CarePlans.toMongo(newCarePlan);

        process.env.TRACE && console.log('newCarePlan', JSON.stringify(newCarePlan, null, 2));
        // process.env.DEBUG && console.log('newCarePlan', newCarePlan);

        console.log('Cleaning new carePlan...')
        CarePlanSchema.clean(newCarePlan);

        var practionerContext = CarePlanSchema.newContext();
        practionerContext.validate(newCarePlan)
        console.log('New carePlan is valid:', practionerContext.isValid());
        console.log('check', check(newCarePlan, CarePlanSchema))
        


        var carePlanId = CarePlans.insert(newCarePlan,  function(error, result){
          if (error) {
            process.env.TRACE && console.log('error', error);

            // Bad Request
            JsonRoutes.sendResult(res, {
              code: 400
            });
          }
          if (result) {
            process.env.TRACE && console.log('result', result);
            res.setHeader("Location", "fhir-1.6.0/CarePlan/" + result);
            res.setHeader("Last-Modified", new Date());
            res.setHeader("ETag", "1.6.0");

            var carePlans = CarePlans.find({_id: result});
            var payload = [];

            carePlans.forEach(function(record){
              payload.push(CarePlans.prepForFhirTransfer(record));
            });

            //console.log("payload", payload);
            // Created
            JsonRoutes.sendResult(res, {
              code: 201,
              data: Bundle.generate(payload)
            });
          }
        });
        console.log('carePlanId', carePlanId);
      } else {
        // Unprocessable Entity
        JsonRoutes.sendResult(res, {
          code: 422
        });
      }

    } else {
      // Unauthorized
      JsonRoutes.sendResult(res, {
        code: 401
      });
    }
  } else {
    // Not Implemented
    JsonRoutes.sendResult(res, {
      code: 501
    });
  }
});

//==========================================================================================
// Step 4 - CarePlanHistoryInstance

JsonRoutes.add("get", "/" + fhirVersion + "/CarePlan/:id/_history", function (req, res, next) {
  process.env.DEBUG && console.log('GET /fhir-1.6.0/CarePlan/', req.params);
  process.env.DEBUG && console.log('GET /fhir-1.6.0/CarePlan/', req.query._count);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("content-type", "application/fhir+json");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  if(typeof oAuth2Server === 'object'){
    var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});

    if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {

      if (accessToken) {
        process.env.TRACE && console.log('accessToken', accessToken);
        process.env.TRACE && console.log('accessToken.userId', accessToken.userId);
      }

      var carePlans = CarePlans.find({_id: req.params.id});
      var payload = [];

      carePlans.forEach(function(record){
        payload.push(CarePlans.prepForFhirTransfer(record));

        // the following is a hack, to conform to the Touchstone CarePlan testscript
        // https://touchstone.aegis.net/touchstone/testscript?id=06313571dea23007a12ec7750a80d98ca91680eca400b5215196cd4ae4dcd6da&name=%2fFHIR1-6-0-Basic%2fP-R%2fCarePlan%2fClient+Assigned+Id%2fCarePlan-client-id-json&version=1&latestVersion=1&itemId=&spec=HL7_FHIR_STU3_C2
        // the _history query expects a different resource in the Bundle for each version of the file in the system
        // since we don't implement record versioning in Meteor on FHIR yet
        // we are simply adding two instances of the record to the payload 
        payload.push(CarePlans.prepForFhirTransfer(record));
      });
      // Success
      JsonRoutes.sendResult(res, {
        code: 200,
        data: Bundle.generate(payload, 'history')
      });
    } else {
      // Unauthorized
      JsonRoutes.sendResult(res, {
        code: 401
      });
    }
  } else {
    // no oAuth server installed; Not Implemented
    JsonRoutes.sendResult(res, {
      code: 501
    });
  }
});

//==========================================================================================
// Step 5 - CarePlan Version Read

// NOTE:  We've not implemented _history functionality yet; so this endpoint is mostly a duplicate of Step 2.

JsonRoutes.add("get", "/" + fhirVersion + "/CarePlan/:id/_history/:versionId", function (req, res, next) {
  process.env.DEBUG && console.log('GET /fhir-1.6.0/CarePlan/:id/_history/:versionId', req.params);
  //process.env.DEBUG && console.log('GET /fhir-1.6.0/CarePlan/:id/_history/:versionId', req.query._count);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("content-type", "application/fhir+json");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  if(typeof oAuth2Server === 'object'){
  
  } else {
    // no oAuth server installed; Not Implemented
    JsonRoutes.sendResult(res, {
      code: 501
    });
  }

  var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});

  if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {

    if (accessToken) {
      process.env.TRACE && console.log('accessToken', accessToken);
      process.env.TRACE && console.log('accessToken.userId', accessToken.userId);
    }

    var carePlanData = CarePlans.findOne({_id: req.params.id});
    if (carePlanData) {
      
      carePlanData.id = carePlanData._id;

      delete carePlanData._document;
      delete carePlanData._id;

      process.env.TRACE && console.log('carePlanData', carePlanData);

      JsonRoutes.sendResult(res, {
        code: 200,
        data: CarePlans.prepForFhirTransfer(carePlanData)
      });
    } else {
      JsonRoutes.sendResult(res, {
        code: 410
      });
    }

  } else {
    JsonRoutes.sendResult(res, {
      code: 401
    });
  }
});



generateDatabaseQuery = function(query){
  console.log("generateDatabaseQuery", query);

  var databaseQuery = {};

  if (query.family) {
    databaseQuery['name'] = {
      $elemMatch: {
        'family': query.family
      }
    };
  }
  if (query.given) {
    databaseQuery['name'] = {
      $elemMatch: {
        'given': query.given
      }
    };
  }
  if (query.name) {
    databaseQuery['name'] = {
      $elemMatch: {
        'text': {
          $regex: query.name,
          $options: 'i'
        }
      }
    };
  }
  if (query.identifier) {
    databaseQuery['identifier'] = {
      $elemMatch: {
        'value': query.identifier
      }
    };
  }
  if (query.gender) {
    databaseQuery['gender'] = query.gender;
  }
  if (query.birthdate) {
    var dateArray = query.birthdate.split("-");
    var minDate = dateArray[0] + "-" + dateArray[1] + "-" + (parseInt(dateArray[2])) + 'T00:00:00.000Z';
    var maxDate = dateArray[0] + "-" + dateArray[1] + "-" + (parseInt(dateArray[2]) + 1) + 'T00:00:00.000Z';
    console.log("minDateArray", minDate, maxDate);

    databaseQuery['birthDate'] = {
      "$gte" : new Date(minDate),
      "$lt" :  new Date(maxDate)
    };
  }

  process.env.DEBUG && console.log('databaseQuery', databaseQuery);
  return databaseQuery;
}

JsonRoutes.add("get", "/" + fhirVersion + "/CarePlan", function (req, res, next) {
  process.env.DEBUG && console.log('GET /fhir-1.6.0/CarePlan', req.query);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("content-type", "application/fhir+json");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  if(typeof oAuth2Server === 'object'){
    var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});

    if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {

      if (accessToken) {
        process.env.TRACE && console.log('accessToken', accessToken);
        process.env.TRACE && console.log('accessToken.userId', accessToken.userId);
      }

      var databaseQuery = generateDatabaseQuery(req.query);

      var payload = [];
      var carePlans = CarePlans.find(databaseQuery);

      carePlans.forEach(function(record){
        payload.push(CarePlans.prepForFhirTransfer(record));
      });

      // Success
      JsonRoutes.sendResult(res, {
        code: 200,
        data: Bundle.generate(payload)
      });
    } else {
      // Unauthorized
      JsonRoutes.sendResult(res, {
        code: 401
      });
    }
  } else {
    // no oAuth server installed; Not Implemented
    JsonRoutes.sendResult(res, {
      code: 501
    });
  }
});

//==========================================================================================
// Step 6 - CarePlan Search Type  

JsonRoutes.add("post", "/" + fhirVersion + "/CarePlan/:param", function (req, res, next) {
  process.env.DEBUG && console.log('POST /fhir-1.6.0/CarePlan/' + JSON.stringify(req.query));

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("content-type", "application/fhir+json");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  if(typeof oAuth2Server === 'object'){
    var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});

    if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {

      if (accessToken) {
        process.env.TRACE && console.log('accessToken', accessToken);
        process.env.TRACE && console.log('accessToken.userId', accessToken.userId);
      }

      var carePlans = [];

      if (req.params.param.includes('_search')) {
        var searchLimit = 1;
        if (req && req.query && req.query._count) {
          searchLimit = parseInt(req.query._count);
        }

        var databaseQuery = generateDatabaseQuery(req.query);
        process.env.DEBUG && console.log('databaseQuery', databaseQuery);

        carePlans = CarePlans.find(databaseQuery, {limit: searchLimit});

        var payload = [];

        carePlans.forEach(function(record){
          payload.push(CarePlans.prepForFhirTransfer(record));
        });
      }

      //process.env.TRACE && console.log('carePlans', carePlans);

      // Success
      JsonRoutes.sendResult(res, {
        code: 200,
        data: Bundle.generate(payload)
      });
    } else {
      // Unauthorized
      JsonRoutes.sendResult(res, {
        code: 401
      });
    }
  } else {
    // no oAuth server installed; Not Implemented
    JsonRoutes.sendResult(res, {
      code: 501
    });
  }
});




//==========================================================================================
// Step 7 - CarePlan Delete    

JsonRoutes.add("delete", "/" + fhirVersion + "/CarePlan/:id", function (req, res, next) {
  process.env.DEBUG && console.log('DELETE /fhir-1.6.0/CarePlan/' + req.params.id);

  res.setHeader("Access-Control-Allow-Origin", "*");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  if(typeof oAuth2Server === 'object'){

    var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});
    if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {

      if (accessToken) {
        process.env.TRACE && console.log('accessToken', accessToken);
        process.env.TRACE && console.log('accessToken.userId', accessToken.userId);
      }

      if (CarePlans.find({_id: req.params.id}).count() === 0) {
        // Gone
        JsonRoutes.sendResult(res, {
          code: 410
        });
      } else {
        CarePlans.remove({_id: req.params.id}, function(error, result){
          if (result) {
            // No Content
            JsonRoutes.sendResult(res, {
              code: 204
            });
          }
          if (error) {
            // Conflict
            JsonRoutes.sendResult(res, {
              code: 409
            });
          }
        });
      }


    } else {
      // Unauthorized
      JsonRoutes.sendResult(res, {
        code: 401
      });
    }
  } else {
    // no oAuth server installed; Not Implemented
    JsonRoutes.sendResult(res, {
      code: 501
    });
  }
  
  
});





// WebApp.connectHandlers.use("/fhir/CarePlan", function(req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   return next();
// });
