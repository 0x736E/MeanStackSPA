const Promise = require('promise');
const task = require('../../../models/task.js');

module.exports = function(io, socket, taskWrap) {

  let user =  socket.request != null &&
              socket.request.session != null &&
              socket.request.session.passport != null ?
              socket.request.session.passport.user : null;

  return new Promise( (resolve, reject) => {

    if(taskWrap.task.text == null || taskWrap.task.text.trim().length < 1) {
      return reject('Unsuitable text input');
    }

    task.model.create({
      created_at: taskWrap.task.created_at || new Date(),
      text: taskWrap.task.text,
      owner: (user != null ? user.id : 'public')
    }, function (err, taskDoc) {

      if(err) {
        console.log(err);
        return reject(err);
      }

      io.emit('task' + socket.client.id, {
        method: task.CREATE,
        task: {
          id: taskDoc.id,
          created_at: taskDoc.created_at,
          text: taskDoc.text
        }
      });

      return resolve();

    });

  });

}
