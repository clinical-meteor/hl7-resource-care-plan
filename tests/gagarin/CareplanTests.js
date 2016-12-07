describe('clinical:hl7-resources-careplan', function () {
  var server = meteor();
  var client = browser(server);

  it('CarePlans should exist on the client', function () {
    return client.execute(function () {
      expect(CarePlans).to.exist;
    });
  });

  it('CarePlans should exist on the server', function () {
    return server.execute(function () {
      expect(CarePlans).to.exist;
    });
  });

});
