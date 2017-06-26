import { Task } from './task';

export class TaskWrapper {
  method: String;
  task: Task | Object | Array<Task> ;

  static CREATE = 'create';
  static READ = 'read';
  static UPDATE = 'update';
  static DELETE = 'delete';

  constructor(method: String, task: Task | Object) {
    this.method = method;
    this.task = task;
  }

}
