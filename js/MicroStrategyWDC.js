(function () {

    console.log('Tableau Data connector');
    var myConnector = tableau.makeConnector();

    myConnector.init = function(initCallback){
      tableau.authType = tableau.authTypeEnum.custom;

      // If we are in the auth phase we only want to show the UI needed for auth
      if (tableau.phase == tableau.phaseEnum.authPhase) {
        $("#getvenuesbutton").css('display', 'none');
      }
      if (tableau.phase == tableau.phaseEnum.gatherDataPhase) {
        // If API that WDC is using has an enpoint that checks
        // the validity of an access token, that could be used here.
        // Then the WDC can call tableau.abortForAuth if that access token
        // is invalid.
      }
      var accessToken = Cookies.get("accessToken");
      console.log("Access token is '" + accessToken + "'");
      var hasAuth = (accessToken && accessToken.length > 0) || tableau.password.length > 0;
      updateUIWithAuthState(hasAuth);

      initCallback();
      // If we are not in the data gathering phase, we want to store the token
      // This allows us to access the token in the data gathering phase
      if (tableau.phase == tableau.phaseEnum.interactivePhase || tableau.phase == tableau.phaseEnum.authPhase) {
          if (hasAuth) {
              tableau.password = accessToken;

              if (tableau.phase == tableau.phaseEnum.authPhase) {
                // Auto-submit here if we are in the auth phase
                tableau.submit()
              }

              return;
          }
      }
    };
    myConnector.getSchema = function (schemaCallback) {
      tableau.log("Hello WDC!");
    };
    myConnector.getData = function (table, doneCallback) {

    };
    tableau.registerConnector(myConnector);
    $(document).ready(function () {
    $("#submitButton").click(function () {
        console.log('9 million ');
        tableau.connectionName = "USGS Earthquake Feed";
        tableau.submit();
    });
});
})();
