(function () {
    var myConnector = tableau.makeConnector();
  /*  myConnector.getColumnHeaders = function (){
       var fieldNames = ['id','Actuals','plan','forecast','platform'];
       var fieldTypes = ['float','float','float','float','String'];
       tableau.headersCallback(fieldNames,fieldTypes);
    }*/
    /*myConnector.getTableData = function (lastRecordToken){
       var dataToReturn = [];
       //var lastRecordToken = 0;
       var hasMoreData = false;
       var MicroStrategy = tableau.connectionData;
       var endDate = new Date();
       var startDate = new Date();
       var connectionUri = URL = "http://localhost:8080/MicroStrategy/servlet/taskAdmin?taskId=TAB001&taskEnv=xhr&taskContentType=json&GUID=75920A1F4631DF150F2855A8B175492C&password=Solera2080&UserName=administrator";
       var xhr = $.ajax({
         url: connectionUri,
         dataType: 'json',
         success: function (data){
           if(data.query.results){
             var quotes = data.query.results.quote;
             var ii;
             for (ii = 0;ii < quotes.length; +ii){
               var entry = {
                 "id": ii,
                 "platform": quotes[ii].platform,
                 "Actuals": quotes[ii].Actuals,
                 "forecast": quotes[ii].forecast,
                 "plan": quotes[ii].plan
               };
               dataToReturn.push(entry);
             }
             tableau.dataCallback(dataToReturn, lastRecordToken,false);
           }
           else{
             tableau.abortWithError("No results found");
           }
         },
         error: function (xhr, ajaxOptions,thrownError){
           tableau.log("Connection error:" + xhr.responseText + "\n" + thrownError);
           tableau.abortWithError("Erorr while connecting to MicroStrategy");
         }
       });

     }

       tableau.dataCallback(dataToReturn, lastRecordToken.toString(),hasMoreData);
    }
    */

    myConnector.getSchema = function (schemaCallback) {
       tableau.log("Hello WDC!");
       var cols = [
        { id : "platform", alias : "platform", columnRole: "dimension", dataType : tableau.dataTypeEnum.string },
        { id : "id",alias : "id", dataType : tableau.dataTypeEnum.float },
        { id : "Actuals", alias : "Actuals", dataType : tableau.dataTypeEnum.float },
        { id : "plan", alias : "plan", dataType : tableau.dataTypeEnum.float },
        { id : "forecast", alias : "forecast", dataType : tableau.dataTypeEnum.float }

       ];
       var tableInfo = {
        id : "rows",
        alias : "Expense Submitted by Platform Owners",
        columns : cols
       };

       schemaCallback([tableInfo]);

    };

    myConnector.getData = function (table, doneCallback) {
      var URL = '';
      //alert("Get called before URL");
      console.log('Does it even get called ?');
      URL = "http://localhost:8080/MicroStrategy/servlet/taskAdmin?callback=?&taskId=TAB001&taskEnv=xhr&taskContentType=json&GUID=75920A1F4631DF150F2855A8B175492C&password=Solera2080&UserName=administrator";
      /*URL = 'https://fpgm.solerainc.com:443/SoleraInc/asp/TaskAdmin.aspx?' +
            'taskId=getRepData&taskEnv=xhr&taskContentType=json&ServerID=' + $("#server").val() +
            '&ProjID=' + $("#project").val() +
            '&UserID=' + $("#userid").val() +
            '&Pwd=' + $("#pwd").val() +
            '&Guid=' + $("#guid").val();*/
      //URL='https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson';
      $.getJSON('../data.JSON', function(resp) {
       var feat = resp.rows,
           tableData = [];
           //alert("After fetching....");
       // Iterate over the JSON object
       for (var i = 0, len = feat.length; i < len; i++) {
           tableau.log(feat[i].platform);
           tableau.log(feat[i].Actuals);
           tableau.log(feat[i].forecast);
           tableau.log(feat[i].plan);
           tableData.push({
               "id": i,
               "platform": feat[i].platform,
               "Actuals": feat[i].Actuals,
               "forecast": feat[i].forecast,
               "plan": feat[i].plan
           });
       }

       table.appendRows(tableData);
       doneCallback();
      });
    };

    tableau.registerConnector(myConnector);

})();

$(document).ready(function () {
    $("#submitButton").click(function () {
        tableau.log('Button Clicked');
        tableau.connectionName = "MicroStrategy Feed";
        tableau.connectionData = $("#project").val().trim();
        tableau.log(tableau.connectionData);
        tableau.submit();
    });
});
