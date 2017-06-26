import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import { Task } from './task';
import { TaskWrapper } from './task-wrapper';

@Injectable()
export class TaskSourceService {

    private _channels = {
      task: 'task'
    };
    public isConnected: Subject<boolean> = new BehaviorSubject<boolean>(false);
    public createTasks: Subject<Task> = new BehaviorSubject<Task>(null);
    public updateTasks: Subject<Task> = new BehaviorSubject<Task>(null);
    public deleteTasks: Subject<Task> = new BehaviorSubject<Task>(null);

    constructor(private socket: Socket) {

      this.socket.on('connect', () => {
        this.isConnected.next(true);

        // select our unique task channel
        this._channels.task += this.socket.ioSocket.id;
        //console.log('[socket.io] ' +this._channels.task);

        this.socket.on(this._channels.task, (taskWrap: TaskWrapper) => {
          //console.log(JSON.stringify(taskWrap));
          if(taskWrap.task instanceof Array) {
            let target: Task;
            if(taskWrap.method == TaskWrapper.CREATE) {
              for(let i=0; i<taskWrap.task.length; i++) {
                target = taskWrap.task[i];
                if(target == null) continue;
                this.createTasks.next(target);
              }
            }
          } else if(Object.prototype.hasOwnProperty.call(taskWrap, 'method')) {

            let targetTask = taskWrap.task as Task;

            if(taskWrap.method == TaskWrapper.CREATE) {
              this.createTasks.next(targetTask);
            } else if(taskWrap.method == TaskWrapper.UPDATE) {
              this.updateTasks.next(targetTask);
            } else if(taskWrap.method == TaskWrapper.DELETE) {
              this.deleteTasks.next(targetTask);
            }

          } else {
            console.log('Uknown task type: ' + typeof(taskWrap.task) + ' ' + JSON.stringify(taskWrap.task));
          }
        });
      });

      this.socket.on('disconnect', () => {
        this.isConnected.next(false);
      });
    }

    public createTask(task: Task) {

      if(task == null) {
        return;
      }

      let taskWrap: TaskWrapper = new TaskWrapper(TaskWrapper.CREATE, task);
      this.socket.emit(this._channels.task, taskWrap);

      //console.log(JSON.stringify(taskWrap));
    }

    public updateTask(task: Task) {

      if(task == null) {
        return;
      }

      let taskWrap: TaskWrapper = new TaskWrapper(TaskWrapper.UPDATE, task);
      this.socket.emit(this._channels.task, taskWrap);

      //console.log(JSON.stringify(taskWrap));
    }

    public deleteTask(task: Task) {

      if(task == null) {
        return;
      }

      let taskWrap: TaskWrapper = new TaskWrapper(TaskWrapper.DELETE, {
        id: task.id
      });
      this.socket.emit(this._channels.task, taskWrap);

      //console.log(JSON.stringify(taskWrap));
    }
}
