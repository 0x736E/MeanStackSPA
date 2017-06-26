const Promise = require('promise');
const task = require('../../../models/task.js');

module.exports = function(io, socket, taskWrap) {

  let user =  socket.request != null &&
              socket.request.session != null &&
              socket.request.session.passport != null ?
              socket.request.session.passport.user : null;

  return new Promise( (resolve, reject) => {

    task.model.find({
      owner: (user != null ? user.id : 'public')
    })
    .then( (tasks) => {

      if(tasks.length < 1) {
        return resolve();
      }

      // construct array
      let taskArray = [];
      let taskObj;
      for(let i=0; i<tasks.length; i++) {
        taskObj = tasks[i];
        taskArray.push({
          id: taskObj.id,
          created_at: taskObj.created_at,
          text: taskObj.text
        });
      }

      io.emit('task' + socket.client.id, {
        method: task.CREATE,
        task: taskArray
      });

      // done
      return resolve();

    }).catch( (err) => {
      return reject(err);
    });

  });

}
