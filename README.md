# hapiman
API documentation generator + API explroer for [**hapi**](https://github.com/hapijs/hapi)

## Description
**hapiman** is a documentation generator for **hapi** servers, providing a human-readable 
guide for every endpoint using the route configuration and Joi validations. 

In addition this will provide an API explorer for developers to play with the API.

## Usage
hapiman depends on vision and inert, make sure you register them with hapi.

```javascript
var Hapi = require('hapi');
var server = new Hapi.Server();

server.connection({ port: 80 });

server.register([require('vision'), require('inert'), { register: require('hapiman') }], function(err) {
});

server.start(function () {
     console.log('Server running at:', server.info.uri);
});
```

## Parameters
There is nothing to pass atm as this is not the final release. But the idea is you being able to customise the template and also add auth to this.

### Ignoring a route in documentation
If you want a specific route not to appear in hapiman's documentation, 
you have to set hapiman settings for this specific route to false.

Here is an example snippet of a route configuration :

```javascript
{
  method: 'GET',
  path: '/my/route',
  config: {
    ...,
    plugins: {
      hapiman: false
    }
  }
}
```
