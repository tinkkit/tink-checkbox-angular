'use strict';
describe('tink-checkbox-angular', function() {

  var bodyEl = $('body'), sandboxEl;
  var $compile, $templateCache, scope,obj;

  beforeEach(module('tink.checkbox'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _$templateCache_) {
    scope = _$rootScope_.$new();
    $compile = _$compile_;
    $templateCache = _$templateCache_;
    bodyEl.html('');
    sandboxEl = $('<div>').attr('id', 'sandbox').appendTo(bodyEl);

    obj = {dataY:[]};
      obj.dataX = [
    {
                  id:'33',
                  name:'Lubbeekstraat',
                  
                  children:[]
                  },

                      {
                  id:'343',
                  name:'Lubbeekstraat',
                  },
        {
          id:'1',
          name:'Belgie',
          
          children:[
            {
              id:'2',
              name:'Antwerpen',
              
            },
            {
              id:'3',
              name:'Vlaams-brabant',
              
              children:[
                {
                id:'4',
                name:'Leuven',
                
                },
                {
                id:'5',
                name:'Heverlee',
                
                  children:[
                  {
                  id:'6',
                  name:'Doleegstraat',
                  },
                  {
                  id:'7',
                  name:'Bergstraat',
                  children:[
                  {
                  id:'8',
                  name:'Doleegstraat',
                  },
                  {
                  id:'9',
                  name:'Bergstraat',
                  children:[
                  {
                  id:'10',
                  name:'Doleegstraat',
                  },
                  {
                  id:'11',
                  name:'Bergstraat',
                  },
                  {
                  id:'12',
                  name:'Lubbeekstraat',
                  },
                ]
                  },
                  {
                  id:'13',
                  name:'Lubbeekstraat',
                  },
                ]
                  },
                  {
                  id:'14',
                  name:'Lubbeekstraat',
                  },
                ]
                },
              ]
            }
          ]
        }
      ];
  }));

  afterEach(function() {
    scope.$destroy();
    sandboxEl.remove();
  });

  function compileDirective(template, locals) {
    template = templates[template];
    angular.extend(scope, angular.copy(template.scope || templates['default'].scope), locals);
    var element = $(template.element).appendTo(sandboxEl);
    element = $compile(element)(scope);
    scope.$digest();
    return jQuery(element[0]);
  }

  var templates = {
    'default': {
      scope: {},
      element: '<div tink-checkbox-list="masterc" data-checked="dataY" ng-model="dataX" class="form-group"></div>'
    }
  };

 

  describe('default', function() {
    it('should run this basic setup',function(){
      var element = compileDirective('default',obj);
      sandboxEl.find('input[id=id3]').click();
      scope.$digest();
      expect(scope.dataY).toEqual(['3','4','5','6','7','8','9','10','11','12','13','14'])
      console.log(sandboxEl.find('input[id=id3]')[0])
    });

    it('should unslect a box',function(){
      var element = compileDirective('default',obj);
      sandboxEl.find('input[id=id3]').click();
      scope.$digest();
      sandboxEl.find('input[id=id8]').click();
      scope.$digest();
      expect(scope.dataY).toEqual(['4','6','9','10','11','12','13','14'])
    });

    it('should have indeterminate class',function(){
      var element = compileDirective('default',obj);
      sandboxEl.find('input[id=id3]').click();
      scope.$digest();
      sandboxEl.find('input[id=id8]').click();
      scope.$digest();

      expect(sandboxEl.find('input[id=id5]').hasClass('indeterminate')).toEqual(true);
    });
  });


});