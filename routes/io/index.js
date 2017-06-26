const taskRoute = require('./tasks/index.js');
const taskRouteRead = require('./tasks/read.js');

module.exports = function(app, sessionMiddleware) {

    const port = process.env.SOCKET_IO_PORT || 8988;
    const server = require('http').createServer(app);
    const io = require('socket.io')(server);

    // use express middleware for socket.io session
    io.use(function(socket, next) {
        sessionMiddleware(socket.request, socket.request.res, next);
    });

    io.on('connection', (socket) => {

        console.log('[socket.io] connection established with ' + socket.client.id);
        let channels = {
          task: 'task' + socket.client.id
        };

        // send existing tasks
        let user = null;
        let taskWrap = null;
        taskRouteRead(io, socket, taskWrap);

        socket.on('disconnect', () => {
            console.log('[socket.io] connection terminated from ' + socket.client.id);
        });

        // Socket.io Routes
        socket.on(channels.task, (taskWrap) => {
          //console.log(taskWrap);
          taskRoute(null, io, socket, taskWrap)
            .catch( (err) => {
              //TODO inform client of errors
              console.log(err);
            });
        });

    });

    server.listen(port, () => {
        console.log('[socket.io] listening on port ' + port);
    });
};
