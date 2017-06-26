const Promise = require('promise');
const task = require('../../../models/task.js');

module.exports = function(io, socket, taskWrap) {

  let user =  socket.request != null &&
              socket.request.session != null &&
              socket.request.session.passport != null ?
              socket.request.session.passport.user : null;

  return new Promise( (resolve, reject) => {

    task.model.findOne({
      id: taskWrap.task.id,
      owner: (user != null ? user.id : 'public')
    })
    .then( (taskDoc) => {

      if(taskDoc == null) {
        return resolve();
      }

      return taskDoc.remove();

    }).then( () => {

      // update clients
      io.emit('task' + socket.client.id, {
        method: task.DELETE,
        task: taskWrap.task
      });

      // done
      return resolve();

    }).catch( (err) => {

      return reject(err);
    });

  });

}
