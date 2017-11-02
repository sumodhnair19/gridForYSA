var app = angular.module('app', ['ngAnimate', 'ngTouch', 'ui.grid','ui.grid.edit','ui.grid.validate']);
app.directive("datePicker", function() {
        return {
            restrict: "EA",
            template:"<input type='date' ng-model='dateSelected' ng-change='valueChanged()'/>",
            scope: {'datec':"="},
            link: function(scope, elem, attrs) {
              scope.dateSelected = "";
                scope.valueChanged = function() {
                //  scope.$apply(function() {
                    console.log(scope.dateSelected);
                    scope.datec = scope.dateSelected;
                    scope.$digest();
                  //});
                }
            }
        }
    });

    app.directive("compareCells", function() {
            return {
                restrict: "EA",
                template:"<input type='date' ng-model='dateSelected' ng-change='valueChanged()'/>",
                scope: {'datec':"="},
                link: function(scope, elem, attrs) {
                  scope.dateSelected = "";
                    scope.valueChanged = function() {
                    //  scope.$apply(function() {
                        console.log(scope.dateSelected);
                        scope.datec = scope.dateSelected;
                        scope.$digest();
                      //});
                    }
                }
            }
        });


app.controller('MainCtrl', ['$scope', '$http', 'uiGridConstants','$interval','uiGridValidateService','statesData', function ($scope, $http, uiGridConstants,$interval,uiGridValidateService,statesData) {
  var today = new Date();
  var nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  $scope.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
    if( col.filters[0].term ){
      return 'header-filtered';
    } else {
      return '';
    }
  };
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
  var rowTemplate = function() {
    console.log("rowTemplate")
  }
  $scope.typeaheadSelected = function(entity, selectedItem) {
      entity.state = selectedItem;
   };

  uiGridValidateService.setValidator('startWith',
     function(argument) {
       return function(oldValue, newValue, rowEntity, colDef) {
         if (!newValue) {
           return true; // We should not test for existence here
         } else {
           return newValue.startsWith(argument);
         }
       };
     },
     function(argument) {
       return 'You can only insert names starting with: "' + argument + '"';
     }
   );

   $scope.cellStateEditableTemplate = '<div class="typeaheadcontainer"><input type="text" ' +
  'class="typeaheadcontrol"' +
  'ng-model="grid.appScope.myData[rowRenderIndex].state" ' +
  'uib-typeahead="name as state.name for state in grid.appScope.states | filter:$viewValue | limitTo:8" ' +
  'ng-required="true" ' +
  'typeahead-editable ="false"' +
  'typeahead-on-select="grid.appScope.typeaheadSelected(row.entity, $item)" ' +
  '/></div>';
  $scope.gridOptions = {
    enableFiltering: true,
    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;


      gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
         console.log('edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue );
         $scope.$apply();
       });
    },
    columnDefs: [
      // default
      { name: 'name', displayName: 'Name (editable)',
            validators: {required: true, startWith: 'M'},
             cellTemplate: 'ui-grid/cellTitleValidator'
           },
      // pre-populated search field
      { field: 'gender', filter: {
          term: '1',
          type: uiGridConstants.filter.SELECT,
          selectOptions: [ { value: '1', label: 'male' }, { value: '2', label: 'female' }, { value: '3', label: 'unknown'}, { value: '4', label: 'not stated' }, { value: '5', label: 'a really long value that extends things' } ]
        },
        cellFilter: 'mapGender', headerCellClass: $scope.highlightFilteredHeader },
      // no filter input
      { field: 'company' ,enableFiltering: false, filter: {
        noTerm: true,
        condition: function(searchTerm, cellValue) {
          return cellValue.match(/a/);
        }
      }},
      // specifies one of the built-in conditions
      // and a placeholder for the input
      {
        field: 'email',
        filter: {
          condition: uiGridConstants.filter.ENDS_WITH,
          placeholder: 'ends with'
        }, headerCellClass: $scope.highlightFilteredHeader,enableCellEdit: true
      },
      // custom condition function
      {
        field: 'phone',
        filter: {
          condition: function(searchTerm, cellValue) {
            var strippedValue = (cellValue + '').replace(/[^\d]/g, '');
            return strippedValue.indexOf(searchTerm) >= 0;
          }
        }, headerCellClass: $scope.highlightFilteredHeader
      },
      // multiple filters
      { field: 'age', filters: [
        {
          condition: uiGridConstants.filter.GREATER_THAN,
          placeholder: 'greater than'
        },
        {
          condition: uiGridConstants.filter.LESS_THAN,
          placeholder: 'less than'
        }
      ], headerCellClass: $scope.highlightFilteredHeader},
      // date filter
      { field: 'mixedDate', cellFilter: 'date', filter: {
          condition: uiGridConstants.filter.LESS_THAN,
          placeholder: 'less than',
          term: nextWeek
        }, headerCellClass: $scope.highlightFilteredHeader
      },
      { field: 'mixedDate', displayName: "Long Date",filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="datec in col.filters"><div date-picker datec=datec></div></div>'
 ,type: 'date', cellFilter: 'date:"yyyy-MM-dd"'
      }
    ]
  };

  $http.get('https://cdn.rawgit.com/angular-ui/ui-grid.info/gh-pages/data/500_complex.json')
    .success(function(data) {
      $scope.gridOptions.data = data;
      $scope.gridOptions.data[0].age = -5;

      data.forEach( function addDates( row, index ){
        row.mixedDate = new Date();
        row.mixedDate.setDate(today.getDate() + ( index % 14 ) );
        row.gender = row.gender==='male' ? '1' : '2';
      });
    });

  $scope.toggleFiltering = function(){
    $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
    $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
  };
}])
.filter('mapGender', function() {
  var genderHash = {
    1: 'male',
    2: 'female'
  };

  return function(input) {
    if (!input){
      return '';
    } else {
      return genderHash[input];
    }
  };
});
