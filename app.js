var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.validate', 'addressFormatter','ui.bootstrap']);

angular.module('addressFormatter', []).filter('address', function() {
    return function(input) {
        return input.street + ', ' + input.city + ', ' + input.state + ', ' + input.zip;
    };
});



app.controller('MainCtrl', ['$scope', '$http', '$window', 'uiGridValidateService', '$q', 'statesData',function($scope, $http, $window, uiGridValidateService, $q,statesData) {


    $scope.addData = function() {
        var n = $scope.gridOptions.data.length;
        $scope.gridOptions.data.push({
            "id": n,
            "guid": "0a1b0539-73ec-473a-846a-71a58e04551c",
            "isActive": false,
            "balance": "$3,567.00",
            "picture": "http://placehold.it/32x32",
            "age": 21,
            "name": "Bishop Carr",
            "gender": "male",
            "company": "Digirang",
            "email": "bishopcarr@digirang.com",
            "phone": "+1 (860) 463-2942",
            "address": {
                "street": 824,
                "city": "Homeworth",
                "state": "Oklahoma",
                "zip": 5215
            },
            "isNew": true,
            "about": "Nulla ullamco sint exercitation minim ea sunt. Excepteur minim tempor velit in. Proident id reprehenderit nisi officia in anim elit laboris aute sint amet voluptate. Deserunt et nostrud magna eu esse ea adipisicing non quis sint fugiat consectetur enim sint. Magna elit mollit eiusmod non voluptate sunt.\r\n",
            "registered": "2012-10-15T19:03:24+05:00",
            "friends": [{
                    "id": 0,
                    "name": "Young Gentry"
                },
                {
                    "id": 1,
                    "name": "Dean Lopez"
                },
                {
                    "id": 2,
                    "name": "Mccray Bradford"
                }
            ]
        });
    };


 $scope.$watch('selected', function(newValue, oldValue) {
   console.log("inside selected watcher", newValue, oldValue);
       if (newValue)
         console.log(oldValue+"->"+newValue);
    });

    $scope.states = statesData.getStates();
    $scope.myData = [
      {
        id: 1,
        state: {
          "id": 1,
          "name": "Alabama",
          "abbreviation": "AL"
        },
        age: 50
      },
      {
        id: 2,
        state: {
          "id": 5,
          "name": "Arkansas",
          "abbreviation": "AR"
        },
        age: 50
      },
      {
        id: 3,
        state: {
          "id": 9,
          "name": "Delaware",
          "abbreviation": "DE"
        },
        age: 50
      },
      {
        id: 4,
        state: {
          "id": 12,
          "name": "Florida",
          "abbreviation": "FL"
        },
        age: 50
      },
      {
        id: 5,
        state: {
          "id": 15,
          "name": "Hawaii",
          "abbreviation": "HI"
        },

        age: 50
      }
    ];

 $scope.typeaheadSelected = function(entity, selectedItem,rowRenderIndex) {
    entity.state = selectedItem;
    $scope.myData[rowRenderIndex].state = selectedItem;
    $scope.$broadcast('uiGridEventEndCellEdit');
 };

    uiGridValidateService.setValidator('highlightFields',
        function(argument) {
            return function(oldValue, newValue, rowEntity, colDef) {
                if ($scope.onLoadValidation) {
                    var currentCell = $scope.JSONToCompare[rowEntity.id];
                    if (currentCell.name === rowEntity.name) {
                        return true;
                    } else {
                        rowEntity.oldName = rowEntity.name;
                        rowEntity.name = currentCell.name;
                        return false;
                    }
                } else {
                    if (!newValue) {
                        return true; // We should not test for existence here
                    } else {
                        return newValue.startsWith(argument);
                    }

                }
            };
        },
        function(argument) {}
    );
    $scope.cellStateEditableTemplate = '<div><form name="inputForm"><input type="text" ' +
  'ng-class="colt"' +
  'ng-model="grid.appScope.myData[rowRenderIndex].state" ' +
  'uib-typeahead="name as state.name for state in grid.appScope.states | filter:$viewValue | limitTo:8" ' +
  'ng-required="true" ' +
  'typeahead-editable ="false"' +
  'typeahead-on-select="grid.appScope.typeaheadSelected(row.entity, $item, rowRenderIndex)" ' +
  '/></form></div>';


    $scope.gridOptions = {
        enableCellEditOnFocus: true,
        columnDefs : [{
                name: 'id',
                enableCellEdit: true,
                width: '10%',
                editableCellTemplate: "<div><form name=\"inputForm\"><input type=\"INPUT_TYPE\" ng-class=\"'colt' + col.uid\" ui-grid-editor ng-model=\"MODEL_COL_FIELD\" name=\"label\" ng-minlength=\"3\" ng-maxlength=\"10\" required custom-validation></form></div><span class=\"error\" ng-show=\"!inputForm.$valid\">Invalid!</span>"
            },
            {
                name: 'name',
                displayName: 'Name (editable)',
                width: '20%',
                headerTooltip: true,
                cellTitleValidator: true,
                cellTooltipValidator: true,
                validators: {
                    required: true,
                    highlightFields: ''
                },
                editableCellTemplate :  "<div><form name=\"inputForm\"><input type=\"INPUT_TYPE\" typeahead-editable =\"false\" ng-class=\"'colt' + col.uid\"  uib-typeahead=\"name as state.name for state in grid.appScope.states | filter:$viewValue | limitTo:8\"  typeahead-on-select=\"grid.appScope.typeaheadSelected(row.entity, $item,rowRenderIndex)\" ui-grid-editor ng-model=\"grid.appScope.myData[rowRenderIndex].state\"></form></div>",
                //cellTemplate :  "<div><form name=\"inputForm\"><input type=\"INPUT_TYPE\" typeahead-editable =\"false\" ng-class=\"'colt' + col.uid\"  uib-typeahead=\"name as state.name for state in grid.appScope.states | filter:$viewValue | limitTo:8\"  typeahead-on-select=\"grid.appScope.typeaheadSelected(row.entity, $item)\" ui-grid-editor ng-model=\"grid.appScope.myData[rowRenderIndex].state\"></form></div>"

                cellTemplate: '<div class=\"ui-grid-cell-contents\"  ng-class=\"{invalid:grid.validate.isInvalid(row.entity,col.colDef)}\"  title=\"{{grid.appScope.highlightError(grid.validate.isInvalid(row.entity,col.colDef),row.entity,col.colDef)}}">{{COL_FIELD CUSTOM_FILTERS}}</div>'
              //   editableCellTemplate :$scope.cellStateEditableTemplate,
              // cellTemplate : $scope.cellStateEditableTemplate

            },
            { field: 'company' ,enableFiltering: false,
            enableCellEdit: true},
        ],
        onRegisterApi : function(gridApi) {
            //set gridApi on scope
            $scope.gridApi = gridApi;
            gridApi.validate.on.validationFailed($scope, function(rowEntity, colDef, newValue, oldValue) {
                $scope.onLoadValidation = false;
            });
            gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
                //  $window.alert('edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue );
                $scope.$apply();
            });

            $scope.gridOptions.data = $scope.myJSON;
            if ($scope.onLoadValidation)
                compareCellsAndValidate();


        },
        cellEditableCondition: function($scope) {
            return $scope.row.entity.isNew;
        }
    };

    $scope.highlightError = function(trueOrFalse, rowEntity, colDef) {

        var textToShow = "";
        if (rowEntity["$$errorsname"] && rowEntity["$$errorsname"]["highlightFields"]) {
            textToShow = "Properties have been changed by another user, new change :" + rowEntity.oldName;
        } else {
            textToShow = rowEntity.name;
        }

        return textToShow;

    }

    $scope.gridApi = {};
    $scope.onLoadValidation = true;

    // Caller invoked on submit
    function compareCellsAndValidate() {

        var promise = validateGrid($scope.gridOptions);

        promise
            .then(function(data) {
                //  console.log("then");
            })
            .catch(function(data) {
                //  console.log("error");
            })
    }

    function validateGrid(gridOptions) {

        var promises = [];

        angular.forEach(gridOptions.data, function(rowEntity) {

            angular.forEach(gridOptions.columnDefs, function(colDef) {

                var promise = $scope.gridApi.grid.validate.runValidators(rowEntity, colDef, rowEntity[colDef.name], undefined, $scope.gridApi.grid);
                promises.push(promise);
            })
        });
        return $q.all(promises);
    }


    $scope.myJSON = [{
            "id": 0,
            "guid": "de3db502-0a33-4e47-a0bb-35b6235503ca",
            "isActive": false,
            "balance": "$3,489.00",
            "picture": "http://placehold.it/32x32",
            "age": 30,
            "name": "Sandoval Mclean",
            "gender": "male",
            "company": "Zolavo",
            "email": "sandovalmclean@zolavo.com",
            "phone": "+1 (902) 569-2412",
            "address": {
                "street": 317,
                "city": "Blairstown",
                "state": "Maine",
                "zip": 390
            },
            "about": "Fugiat velit laboris sit est. Amet eu consectetur reprehenderit proident irure non. Adipisicing mollit veniam enim veniam officia anim proident excepteur deserunt consectetur aliquip et irure. Elit aliquip laborum qui elit consectetur sit proident adipisicing.\r\n",
            "registered": "1991-02-21T23:02:31+06:00",
            "friends": [{
                    "id": 0,
                    "name": "Rosanne Barrett"
                },
                {
                    "id": 1,
                    "name": "Nita Chase"
                },
                {
                    "id": 2,
                    "name": "Briggs Stark"
                }
            ]
        },
        {
            "id": 1,
            "guid": "9f507483-5ecc-4af4-800f-349306820585",
            "isActive": false,
            "balance": "$2,407.00",
            "picture": "http://placehold.it/32x32",
            "age": 22,
            "name": "Nieves Mack",
            "gender": "male",
            "company": "Oulu",
            "email": "nievesmack@oulu.com",
            "phone": "+1 (812) 535-2614",
            "address": {
                "street": 155,
                "city": "Cherokee",
                "state": "Kentucky",
                "zip": 4723
            },
            "about": "Culpa anim anim nulla deserunt dolor exercitation eu in anim velit. Consectetur esse cillum ea esse ullamco magna do voluptate sit ut cupidatat ullamco. Et consequat eu excepteur do Lorem aute est quis proident irure.\r\n",
            "registered": "1989-07-26T15:52:15+05:00",
            "friends": [{
                    "id": 0,
                    "name": "Brewer Maxwell"
                },
                {
                    "id": 1,
                    "name": "Ayala Franks"
                },
                {
                    "id": 2,
                    "name": "Hale Nichols"
                }
            ]
        },
        {
            "id": 2,
            "guid": "58c66190-15be-4e75-9b09-183599403241",
            "isActive": false,
            "balance": "$3,409.00",
            "picture": "http://placehold.it/32x32",
            "age": 20,
            "name": "Terry hshdhsd",
            "gender": "female",
            "company": "Freakin",
            "email": "terryclay@freakin.com",
            "phone": "+1 (965) 462-3681",
            "address": {
                "street": 124,
                "city": "Wright",
                "state": "Pennsylvania",
                "zip": 8002
            },
            "about": "Exercitation exercitation adipisicing eu cupidatat reprehenderit laborum incididunt reprehenderit Lorem anim. Velit aliquip dolore qui excepteur dolor non occaecat aute et. Consectetur anim veniam irure ea id aliqua amet. Nostrud tempor ullamco velit labore consequat aute nostrud nostrud veniam cupidatat amet nostrud quis. Qui exercitation eiusmod esse eu officia officia Lorem Lorem ullamco voluptate excepteur fugiat nulla et. Ea ipsum ut do culpa labore non duis commodo sit. Id sint dolor ipsum consectetur nostrud nulla consectetur esse deserunt.\r\n",
            "registered": "2000-12-02T22:19:28+06:00",
            "friends": [{
                    "id": 0,
                    "name": "Etta Hawkins"
                },
                {
                    "id": 1,
                    "name": "Zamora Barlow"
                },
                {
                    "id": 2,
                    "name": "Lynette Vinson"
                }
            ]
        },
        {
            "id": 3,
            "guid": "0a1b0539-73ec-473a-846a-71a58e04551c",
            "isActive": false,
            "balance": "$3,567.00",
            "picture": "http://placehold.it/32x32",
            "age": 21,
            "name": "Bishop Carr",
            "gender": "male",
            "company": "Digirang",
            "email": "bishopcarr@digirang.com",
            "phone": "+1 (860) 463-2942",
            "address": {
                "street": 824,
                "city": "Homeworth",
                "state": "Oklahoma",
                "zip": 5215
            },
            "about": "Nulla ullamco sint exercitation minim ea sunt. Excepteur minim tempor velit in. Proident id reprehenderit nisi officia in anim elit laboris aute sint amet voluptate. Deserunt et nostrud magna eu esse ea adipisicing non quis sint fugiat consectetur enim sint. Magna elit mollit eiusmod non voluptate sunt.\r\n",
            "registered": "2012-10-15T19:03:24+05:00",
            "friends": [{
                    "id": 0,
                    "name": "Young Gentry"
                },
                {
                    "id": 1,
                    "name": "Dean Lopez"
                },
                {
                    "id": 2,
                    "name": "Mccray Bradford"
                }
            ]
        }
    ];

    $scope.JSONToCompare = [{
            "id": 0,
            "guid": "de3db502-0a33-4e47-a0bb-35b6235503ca",
            "isActive": false,
            "balance": "$3,489.00",
            "picture": "http://placehold.it/32x32",
            "age": 30,
            "name": "Sumodh",
            "gender": "male",
            "company": "Zolavo",
            "email": "sandovalmclean@zolavo.com",
            "phone": "+1 (902) 569-2412",
            "address": {
                "street": 317,
                "city": "Blairstown",
                "state": "Maine",
                "zip": 390
            },
            "about": "Fugiat velit laboris sit est. Amet eu consectetur reprehenderit proident irure non. Adipisicing mollit veniam enim veniam officia anim proident excepteur deserunt consectetur aliquip et irure. Elit aliquip laborum qui elit consectetur sit proident adipisicing.\r\n",
            "registered": "1991-02-21T23:02:31+06:00",
            "friends": [{
                    "id": 0,
                    "name": "Rosanne Barrett"
                },
                {
                    "id": 1,
                    "name": "Nita Chase"
                },
                {
                    "id": 2,
                    "name": "Briggs Stark"
                }
            ]
        },
        {
            "id": 1,
            "guid": "9f507483-5ecc-4af4-800f-349306820585",
            "isActive": false,
            "balance": "$2,407.00",
            "picture": "http://placehold.it/32x32",
            "age": 22,
            "name": "Nieves Mack",
            "gender": "male",
            "company": "Oulu",
            "email": "nievesmack@oulu.com",
            "phone": "+1 (812) 535-2614",
            "address": {
                "street": 155,
                "city": "Cherokee",
                "state": "Kentucky",
                "zip": 4723
            },
            "about": "Culpa anim anim nulla deserunt dolor exercitation eu in anim velit. Consectetur esse cillum ea esse ullamco magna do voluptate sit ut cupidatat ullamco. Et consequat eu excepteur do Lorem aute est quis proident irure.\r\n",
            "registered": "1989-07-26T15:52:15+05:00",
            "friends": [{
                    "id": 0,
                    "name": "Brewer Maxwell"
                },
                {
                    "id": 1,
                    "name": "Ayala Franks"
                },
                {
                    "id": 2,
                    "name": "Hale Nichols"
                }
            ]
        },
        {
            "id": 2,
            "guid": "58c66190-15be-4e75-9b09-183599403241",
            "isActive": false,
            "balance": "$3,409.00",
            "picture": "http://placehold.it/32x32",
            "age": 20,
            "name": "Terry Clay",
            "gender": "female",
            "company": "Freakin",
            "email": "terryclay@freakin.com",
            "phone": "+1 (965) 462-3681",
            "address": {
                "street": 124,
                "city": "Wright",
                "state": "Pennsylvania",
                "zip": 8002
            },
            "about": "Exercitation exercitation adipisicing eu cupidatat reprehenderit laborum incididunt reprehenderit Lorem anim. Velit aliquip dolore qui excepteur dolor non occaecat aute et. Consectetur anim veniam irure ea id aliqua amet. Nostrud tempor ullamco velit labore consequat aute nostrud nostrud veniam cupidatat amet nostrud quis. Qui exercitation eiusmod esse eu officia officia Lorem Lorem ullamco voluptate excepteur fugiat nulla et. Ea ipsum ut do culpa labore non duis commodo sit. Id sint dolor ipsum consectetur nostrud nulla consectetur esse deserunt.\r\n",
            "registered": "2000-12-02T22:19:28+06:00",
            "friends": [{
                    "id": 0,
                    "name": "Etta Hawkins"
                },
                {
                    "id": 1,
                    "name": "Zamora Barlow"
                },
                {
                    "id": 2,
                    "name": "Lynette Vinson"
                }
            ]
        },
        {
            "id": 3,
            "guid": "0a1b0539-73ec-473a-846a-71a58e04551c",
            "isActive": false,
            "balance": "$3,567.00",
            "picture": "http://placehold.it/32x32",
            "age": 21,
            "name": "Bishop Carr",
            "gender": "male",
            "company": "Digirang",
            "email": "bishopcarr@digirang.com",
            "phone": "+1 (860) 463-2942",
            "address": {
                "street": 824,
                "city": "Homeworth",
                "state": "Oklahoma",
                "zip": 5215
            },
            "about": "Nulla ullamco sint exercitation minim ea sunt. Excepteur minim tempor velit in. Proident id reprehenderit nisi officia in anim elit laboris aute sint amet voluptate. Deserunt et nostrud magna eu esse ea adipisicing non quis sint fugiat consectetur enim sint. Magna elit mollit eiusmod non voluptate sunt.\r\n",
            "registered": "2012-10-15T19:03:24+05:00",
            "friends": [{
                    "id": 0,
                    "name": "Young Gentry"
                },
                {
                    "id": 1,
                    "name": "Dean Lopez"
                },
                {
                    "id": 2,
                    "name": "Mccray Bradford"
                }
            ]
        }
    ];

    //      $http.get('https://cdn.rawgit.com/angular-ui/ui-grid.info/gh-pages/data/500_complex.json')
    //    .success(function(data) {
    // $scope.gridOptions.data = $scope.myJSON;
    // compareCellsAndValidate();
    //    });



}]);

app.directive('customValidation', function(uiGridEditConstants) {
    return {
        scope: false,
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            element.bind('blur', function(evt) {
                if (scope.inputForm && !scope.inputForm.$valid) {
                    //evt.stopImmediatePropagation();
                }
            });

        }
    };
})
