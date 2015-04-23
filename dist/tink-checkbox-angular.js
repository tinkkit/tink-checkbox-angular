'use strict';
(function(module) {
  try {
    module = angular.module('tink.checkbox');
  } catch (e) {
    module = angular.module('tink.checkbox', []);
  }
  module.controller('TinkCheckboxController', ['$scope','$filter','$compile',function (scope,$filter,$compile) {
    var self = this;

    this.groups = {};
    var config={};

    this.init = function(scope){
      //get the scope from the start is not needed
      config.scope = scope;
      //create private scope variables to handle the dom
      config.scope.checkboxSelect = {};
      config.scope.secretIndeterminate = {};
      config.scope.secretSelected = {};

      if(scope.checked === null || scope.checked === undefined || !scope.checked instanceof Array ){
        scope.checked = [];
      }

      if(config.scope.ngModel === undefined || config.scope.ngModel === null || !config.scope.ngModel instanceof Array){
        return;
      }
      /*Map all the data to the scope.
      * only use the selected variable.
      */
      self.mapArray(config.scope.ngModel,config.scope.secretSelected);

      //get all the elements that has no parent
      var childs = objectToWatch(config.scope.ngModel).watch;
      //Loop trough this elements and give them the selected state of the data
      childs.forEach(function (element) {
        config.scope.secretSelected['id'+element.id] = element.selected;
      });

      //get alle the elements that has children
      var parents = objectToWatch(config.scope.ngModel).parents;
      /*Check every parent element if their childs are selected or not
      * We do this to see if the parent needs thave cheched or inderterminate status.
      */
      parents.reverse().forEach(function (element) {
        checkState(element);
      });
    };


    /*
    * Function to map every slected property to a map object.
    */
    this.mapArray = function(arr,map){
      //Loop trough the array
      arr.forEach(function (element) {
        //rename element
        var obj = element;
        //set the selected value and rename the id so it is always a valid id.
        map['id'+obj.id] = obj.selected;
        //If the object has children go trough.
        if(obj && obj.childs && obj.childs instanceof Array && obj.childs.length > 0){
          //Loop trough the children of the object.
          self.mapArray(obj.childs,map);
        }
      });
    };


    /*
    * Function to loop trough every array and set the selected value to a given boolean.
    * This function differs from allValueChange because this function does it on the scope.
    */
    function changeCheckValue(arr,value){
      //Loop trough the array of objects
      arr.forEach(function (element) {
        //set de inderteminate to false
        config.scope.secretIndeterminate['id'+element.id] = false;
        //set the proper value on the scope
        config.scope.secretSelected['id'+element.id] = value;
        var obj = element;
        //If the object has children go further.
        if(obj && obj.childs && obj.childs instanceof Array && obj.childs.length > 0){
        //Loop trough the children of the object.
          changeCheckValue(obj.childs,value);
        }
      });
    }

    /*
    *
    */
    function countValues(arr){
      var values = {checked:0,indeterminate:0};
      arr.forEach(function (element) {
        var safeId = 'id'+element.id;
        var inder = config.scope.secretIndeterminate[safeId];
        var check = config.scope.secretSelected[safeId];
        if(inder){
          values.indeterminate++;
        }else if(check){
          values.checked++;
        }
      });
      values.all = (values.checked === arr.length);
      return values;
    }

    /*
    *
    */
    function resetValue(id){
      config.scope.secretSelected[id] = false;
      config.scope.secretIndeterminate[id] = false;
    }

    /*
    *
    */
    scope.$watch('secretIndeterminate',function(newI){
      for (var id in newI) {
        if(newI[id]){
          $(self.element).find('input[name='+id+']').attr('checked',false);
          config.scope.secretSelected[id] = false;
          //config.scope.secretIndeterminate[id] = false;
        }
        $(self.element).find('input[name='+id+']').prop('indeterminate', newI[id]);

      }
    },true);

    scope.$watch('secretSelected',function(newI){
      for (var id in newI) {
        var Did = id.substr(2,id.length);
          var index = scope.checked.indexOf(Did);
          if(newI[id]){
            if(index === -1){
              scope.checked.push(Did);
            }
          }else{
            if(index !== -1){
              scope.checked.splice(index,1);
            }
          }
        }
    },true);

    function checkState(selected){
      if(selected && selected.childs){
        var counts = countValues(selected.childs);
        var safeID = 'id'+selected.id;

        resetValue(safeID);
        if(counts.all){
          config.scope.secretSelected[safeID] = true;
        }else if(counts.checked > 0 || counts.indeterminate > 0){
          config.scope.secretIndeterminate[safeID] = true;
        }
      }
    }

    function objectToWatch(arr){
      var found = {watch:[],parents:[]};
      arr.forEach(function (element) {
        var obj = element;
        var myChild = null;
        if(obj && obj.childs && obj.childs instanceof Array && obj.childs.length > 0){
          found.parents.push(obj);
          myChild = objectToWatch(obj.childs);
          found.watch = found.watch.concat(myChild.watch);
          found.parents = found.parents.concat(myChild.parents);
        }else{
          found.watch.push(obj);
        }
      });
      return found;
    }

    scope.checkboxChange = function(id){
      var selected = findTheParent(config.scope.ngModel,id);
      var valueSelected = config.scope.secretSelected[id];
      config.scope.secretIndeterminate[id] = false;
      if(selected.obj.childs){
        changeCheckValue(selected.obj.childs,valueSelected);
      }
      if(selected.newd){
        selected.newd.forEach(function (element) {
          checkState(element);
        });
      }else{
        checkState(selected.obj);
      }
    };

    function findTheParent(arr,id){
      var found = false;
      arr.forEach(function (element) {
        if(found === false || found === undefined){
          var obj = element;
          var safeId = 'id'+obj.id;
          var isMyChild;
          if(safeId === id){
            found = {go:true,obj:obj};
            return true;
          }else{
            if(obj && obj.childs && obj.childs instanceof Array && obj.childs.length > 0){
              isMyChild = findTheParent(obj.childs,id);
            }
          }
          if(isMyChild !== false && typeof isMyChild === 'object' && isMyChild.go){
            found = {parent:obj,obj:isMyChild.obj,newd:[]};
            found.newd.push(obj);
            isMyChild.go = false;
          }else{
            if(isMyChild && isMyChild.newd){
              isMyChild.newd.push(obj);
            }
            found = isMyChild;
          }
        }else{
          return;
        }
      });
      return found;
    }

    function createCheckbox (name,text,checked){
      if(checked === true){
        checked = 'checked';
      }else{
        checked = '';
      }
      var label = '<div class="checkbox">'+
                    '<input type="checkbox" ng-class="{indeterminate:secretIndeterminate.id'+name+'}" ng-change="checkboxChange(\'id'+name+'\')" ng-model="secretSelected.id'+name+'" name="id'+name+'" id="id'+name+'" '+checked+'>'+
                    '<label for="id'+name+'">'+text+'</label>'+
                  '</div>';
      return label;
    }
    this.element = null;
    this.createTemplate = function(arr){
      var template = self.teken(arr);
      this.element = $compile(template)(scope);
      //doTheChanges();
      return this.element;
    };

    this.teken = function(arr,parent){
      if(parent === undefined){
        parent = '';
      }else{
        parent += '.childs';
      }
      var aantal = 0;
      var str = '<ul class="checkbox-intermediate">';
      arr.forEach(function (element) {
          var obj = element;
          var subparent = parent + '['+aantal+']';
          str += '<li>';
          str += createCheckbox(obj.id,obj.name,obj.selected,subparent);

          if(obj && obj.childs && obj.childs instanceof Array && obj.childs.length > 0){
            str += self.teken(obj.childs,subparent);
          }
          str += '</li>';
          aantal++;
      });
      str += '</ul>';
      return str;
    };

  }]);
})();
;'use strict';
(function(module) {
  try {
    module = angular.module('tink.checkbox');
  } catch (e) {
    module = angular.module('tink.checkbox', []);
  }
  module.directive('tinkCheckboxList',[function () {
    return {
      restrict:'A',
      controller:'TinkCheckboxController',
      replace: false,
      scope:{
        ngModel:'=',
        checked:'='
      },
      link:function(scope,element, attrs, checkboxCtrl){
    
      if(scope.ngModel instanceof Array){
        checkboxCtrl.init(scope,attrs.ngModel);
        element.replaceWith(checkboxCtrl.createTemplate(scope.ngModel));
      }else{
        console.warn('checkbox directive - an array of object\'s are needed to show the content, see the docs');
      }
    }
  };
  }]);
})();
;angular.module('tink.checkbox').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/tinkDatePickerField.html',
    "<div role=datepicker class=\"dropdown-menu datepicker\" ng-class=\"'datepicker-mode-' + $mode\"> <table style=\"table-layout: fixed; height: 100%; width: 100%\"> <thead> <tr class=text-center> <th> <button tabindex=-1 type=button ng-disabled=pane.prev aria-label=\"vorige maand\" class=\"btn pull-left\" ng-click=$selectPane(-1)> <i class=\"fa fa-chevron-left\"></i> </button> </th> <th colspan=\"{{ rows[0].length - 2 }}\"> <button tabindex=0 type=button class=\"btn btn-block text-strong\" ng-click=$toggleMode()> <strong style=\"text-transform: capitalize\" ng-bind=title></strong> </button> </th> <th> <button tabindex=0 type=button ng-disabled=pane.next aria-label=\"volgende maand\" class=\"btn pull-right\" ng-click=$selectPane(+1)> <i class=\"fa fa-chevron-right\"></i> </button> </th> </tr> <tr class=datepicker-days ng-bind-html=labels ng-if=showLabels></tr> </thead> <tbody> <tr ng-repeat=\"(i, row) in rows\" height=\"{{ 100 / rows.length }}%\"> <td class=text-center ng-repeat=\"(j, el) in row\"> <button tabindex=0 type=button class=btn style=\"width: 100%\" ng-class=\"{'btn-selected': el.selected, 'btn-today': el.isToday && !el.elected, 'btn-grayed':el.isMuted}\" ng-focus=elemFocus($event) ng-click=$select(el.date) ng-disabled=el.disabled> <span role=\"\" ng-class=\"{'text-muted': el.muted}\" ng-bind=el.label></span> </button> </td> </tr> </tbody> </table> </div>"
  );


  $templateCache.put('templates/tinkDatePickerInput.html',
    "<div class=datepicker-input-fields tabindex=-1> <input role=date aria-label=datepicker tabindex=-1 tink-format-input data-format=00/00/0000 data-placeholder=dd/mm/jjjj data-date dynamic-name=dynamicName data-max-date=maxDate data-min-date=minDate ng-model=\"ngModel\">\n" +
    "<span role=\"datepicker icon\" class=datepicker-icon> <i class=\"fa fa-calendar\"></i> </span> </div>"
  );

}]);
