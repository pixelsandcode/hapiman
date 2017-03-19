'use strict';

const Joi = require('joi');
const Hoek = require('hoek');

const internals = {
  defaults: {
    methodsOrder: ['get', 'head', 'post', 'put', 'patch', 'delete', 'trace', 'options']
  },
  describe: (params) => {
    if (params === null || typeof params !== 'object') return null;
    return Joi.compile(params).describe();
  }
}

internals.getRoutes = function (routes) {
  return routes.map((route) => ({
    path: route.path,
    method: route.method.toUpperCase(),
    jsonp: route.settings.jsonp,
    description: route.settings.description,
    tags: route.settings.tags,
    params: {
      path: internals.describe(route.settings.validate.params),
      query: internals.describe(route.settings.validate.query),
      payload: internals.describe(route.settings.validate.payload),
      response: internals.describe((route.settings.response||{}).schema)
    },
    sample: (route.settings.plugins.hapiman||{}).sample,
    version: (route.settings.plugins.hapiman||{}).version
  }));
}

internals.handler = function (server, options, settings){
  return function(request, reply) {
    const routingTable = server.table();
    const connections = [];

    routingTable.forEach((connection) => {
      connection.table = connection.table.filter((item) => {
        return !item.settings.isInternal &&
          item.settings.plugins.hapiman !== false &&
          item.method !== 'options'
      }).sort((route1, route2) => {
        if (route1.path > route2.path) return 1;
        if (route1.path < route2.path) return -1;
        return settings.methodsOrder.indexOf(route1.method) - settings.methodsOrder.indexOf(route2.method);
      })
      connections.push(connection);
    });

    connections.forEach((connection) => {
      connection.table = internals.getRoutes(connection.table);
    });


    return reply(connections);
  }
}

exports.register = function (plugin, options, next) {
  const settings = Hoek.clone(internals.defaults);

  const handler = internals.handler( plugin, options, settings );


  plugin.dependency(['inert', 'vision'], (server, next) => {
    server.views({
      engines: {
        pug: require('pug')
      },
      path: __dirname + '/template/pages/'
    });

    server.route([
      {
        method: 'GET',
        path: '/docs',
        config:{
          handler: (request, reply) => {
            reply.view('index');
          },
          plugins: {
            hapiman: true
          }
        }
      },
      {
        method: 'GET',
        path: '/docs/api',
        config:{
          handler: handler,
          plugins: {
            hapiman: false
          }
        }
      },
      {
        method: 'GET',
        path: '/docs/assets/{path*}',
        config: {
          handler: { directory: { path: __dirname + '/template/assets' } },
          plugins: {
            hapiman: false
          }
        }
      }
    ]);
    next();
  });

  next();
};


exports.register.attributes = {
  pkg: require('./package.json')
};
