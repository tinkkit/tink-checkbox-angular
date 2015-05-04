'use strict';
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
      var elementHulp;
      scope.$watch('ngModel',function(){
        checkboxCtrl.init(scope,attrs.ngModel);
        if(scope.ngModel instanceof Array){
          elementHulp = checkboxCtrl.createTemplate(scope.ngModel);
          element.replaceWith(elementHulp);
          element = elementHulp;
        }else{
          console.warn('you have to give a array of objects check the docs !');
        }
      },true);

      function unique(list) {
          var result = [];
          $.each(list, function(i, e) {
              if ($.inArray(e, result) === -1){ result.push(e); }
          });
          return result;
      }
   /*function checkchilds(childs){
      var c = 0;
      childs.forEach(function (element) {
        if(scope.ngModel.indexOf(element.id)){
          c++;
        } 
      });
      return c;
    }*/

    scope.$watch('checked',function(newD,oldD){

      var uniqueT = unique(newD);
      if(uniqueT.length !== newD.length){
        scope.checked = uniqueT;
        return;
      }

      var added = $(newD).not(oldD).get();
      var removed = $(oldD).not(newD).get();
      added.forEach(function (element) {
        var obj = scope.findTheParent(scope.ngModel,'id'+element);
        if(obj.obj){
          if(!(obj.obj.children && obj.obj.children.length >0)){
            scope.secretSelected['id'+element] = true;
            scope.checkboxChange('id'+element,obj);
          }
        } 
      });

      removed.forEach(function (element) {
        var obj = scope.findTheParent(scope.ngModel,'id'+element);
        if(obj.obj){
          if(!(obj.obj.children && obj.obj.children.length >0)){
            scope.secretSelected['id'+element] = false;
            scope.checkboxChange('id'+element,obj);
          }
        }   
      });

    },true);
  }
};
}])
})();
