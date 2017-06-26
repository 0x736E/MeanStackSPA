const Promise = require('promise');
const task = require('../../../models/task.js');

const taskRouteCreate = require('./create.js');
const taskRouteRead = require('./read.js');
const taskRouteUpdate = require('./update.js');
const taskRouteDelete = require('./delete.js');

module.exports = function(user, io, socket, taskWrap) {

  return new Promise( (resolve, reject) => {

    let route;
    if(taskWrap.method == task.CREATE) {
      route = taskRouteCreate(io, socket, taskWrap);
    } else if(taskWrap.method == task.READ) {
      route = taskRouteRead(io, socket, taskWrap);
    } else if(taskWrap.method == task.UPDATE) {
      route = taskRouteUpdate(io, socket, taskWrap);
    }  else if(taskWrap.method == task.DELETE) {
      route = taskRouteDelete(io, socket, taskWrap);
    }

    return route;
  });
};
