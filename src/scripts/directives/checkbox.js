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
