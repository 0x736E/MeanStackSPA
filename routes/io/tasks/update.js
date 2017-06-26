const Promise = require('promise');
const task = require('../../../models/task.js');

module.exports = function(io, socket, taskWrap) {

  let user =  socket.request != null &&
              socket.request.session != null &&
              socket.request.session.passport != null ?
              socket.request.session.passport.user : null;

  return new Promise( (resolve, reject) => {

    task.model  .findOne({
      'id': taskWrap.task.id,
      owner: (user != null ? user.id : 'public')
    })
    .then( (taskDoc) => {

      if(taskDoc == null) {
        return resolve();
      }

      taskDoc.text = taskWrap.task.text;
      return taskDoc.save();

    }).then( (taskDoc) => {

      // Don't return the object directly
      // from the database. Doing so exposes
      // db internals such as _id
      let taskObj = {
        id: taskDoc.id,
        created_at: taskDoc.created_at,
        text: taskDoc.text
      };

      // update client
      io.emit('task' + socket.client.id, {
        method: task.UPDATE,
        task: taskObj
      });

      // done
      return resolve();

    }).catch( (err) => {

      return reject(err);
    });

  });

}
