import _ from "lodash";

module.exports = {
  make: (api) => {
      var url = api.path;
      if(api.params.path) {
        var params = api.params.path.children;
        for(var key in params) {
          var item = params[key];
          if(_.find(item, 'examples') && item.examples[0])
            url = url.replace(`{${key}}`, item.examples[0]);
        }
      }
      return url;
  },
  getParams: (api, scope) => {
    JSON.flatten = function(data) {
      var result = {};
      function recurse (obj, prop) {
        if (!obj.children) {
          result[prop] = obj;
        } else {
          for (var key in obj.children) {
            recurse(obj.children[key], prop ? `${prop}[${key}]` : key);
          }
        }
      }
      recurse(data);
      return result;
    }
    var params = [];
    if(api.params[scope]) {
      var items = JSON.flatten( api.params[scope]);
      for(var key in items) {
        var item = items[key];
        var required = (item.flags||{}).presence == "required"
        var data = { label: key, name: key, value: (item.examples||[])[0], required: required, include: required };
        data = _.extend( item, data);
        params.push( data );
      }
    }
    return params;
  },
  explain: {
    flag: (flag, value, item) => {
      var message = '';
      if(flag == 'allowOnly'){
        if(item.valids.length==1) {
          message = `Value must be <b>${item.valids[0]}</b>.`;
        } else {
          message = `Value must be one of <b>${item.valids.join('</b>, <b>')}</b>.`;
        }
      }
      return message;
    },
    rule: (rule, item) => {
      var message = '';
      if(rule.name=='min')
        message = `${item.label} > <b>${rule.arg}</b>`
      if(rule.name=='max')
        message = `${item.label} < <b>${rule.arg}</b>`
      if(rule.name=='email')
        message = `it must be valid <b>email address</b>`
      if(rule.name=='regex')
        message = `${item.label} must be valid <b>${rule.arg}</b>`
      return message;
    }
  },
  toData: (params) => {
    var data = {};
    params.forEach( (item) => {
      var name = item.name.replace(/\[/g,'.').replace(/]/g,'');
      _.set(data, name, item.value)
    });
    return data;
  },
  getResponse: (response) => {
    var headers = _.pickBy( response.headers(), (value, key) => {
      return typeof value == 'string'
    });
    return {
      status: response.status,
      data: response.data,
      headers: headers
    }
  }
}
