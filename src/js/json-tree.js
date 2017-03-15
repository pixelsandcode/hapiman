'use strict';

(function (angular) {

  angular.module('ngJsonTree', []).directive('jsonTree', ['$compile', function (compile) {

    var isDefined = angular.isDefined;

    return {
      restrict: 'AE',
      scope: {
        json: '=',
        jsonTree: '=',
        onEdit: '&'
      },
      replace: true,
      link: function link(scope, element, attrs) {
        var currentValue = {},
            editor = null,
            clonedElement = null;

        element.on( 'click', '.item:has(.child) > .key, .item:has(.child) > .sep, .zip', (e) => {
          $(e.target).parent('.item').toggleClass('hide-child');
          e.stopPropagation();
        });

        var objWatch = scope.$watch('jsonTree', function (newValue) {
          var html = highlight(newValue);
          element.empty().append(html).find('.item:has(.child) > .key, .item:has(.child) > .sep, .zip').addClass('pointer');
        });

        var scan = (obj) => {
          var k;
          var item = '';
          if (obj instanceof Object) {
            for (k in obj){
              if (obj.hasOwnProperty(k)){
                var inner = scan( obj[k] );
                var wrapper = [ '{', '}' ];
                var next;
                if( Array.isArray(obj) ) {
                  if (obj[k] instanceof Object && ! Array.isArray(obj[k]) ) {
                    next = `<span class='sep'>{</span><div class='child'>${inner}</div><span class='zip'></span><span class='sep'>}</span>`;
                  } else {
                    next = `${inner}`;
                  }
                } else {
                  if (obj[k] instanceof Object && ! Array.isArray(obj[k]) ) {
                    next = `<span class='key'>"${k}": </span><span class='sep'>{</span><div class='child'>${inner}</div><span class='zip'></span><span class='sep'>}</span>`;
                  } else {
                    next = `<span class='key'>"${k}": </span>${inner}`;
                  }
                }
                item = `${item}<div class='item'>${next}</div>`;
              }
            }
            if( Array.isArray(obj) ) {
              item = `<span class='sep'>[</span><div class='child'>${item}</div><span class='zip'></span><span class='sep'>]</span>`
            }
          } else {
            switch (typeof obj) {
              case 'string':
                item = `<span class='string'><span class='sep'>"</span>${obj}<span class='sep'>"</span></span>`;
                break;
              case 'number':
                item = `<span class='number'>${obj}</span>`;
                break;
              case 'boolean':
                item = `<span class='boolean'>${obj}</span>`;
                break;
              default:
                item = `<span class='null'>${obj}</span>`;
            }
          }
          return item;
        }

        var highlight = (value) => {
          var html = `<span class='sep'>{</span><div class='child'>${scan(value)}</div><span class='sep'>}</span>` || "";
          return html;
        };
      }
    };
  }]);
})(window.angular);
