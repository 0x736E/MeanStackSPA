import { Component, OnInit } from '@angular/core';
import { TaskSourceService } from './task-source.service';
import { Task } from './task';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

@Component({
  selector: 'task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  providers: [ TaskSourceService ]
})
export class TaskListComponent implements OnInit {

  public isEditMode: boolean = false;
  public selectedTask: Task;
  public taskEditorCreateTextField: String;
  public taskEditorUpdateTextField: String;
  public tasks: Array<Task> = [];

  constructor(  private _tasksService: TaskSourceService,
                private _sanitizer: DomSanitizer,
                private _changeDetector: ChangeDetectorRef,
                private _hotkeysService: HotkeysService) {

    this._hotkeysService.add(new Hotkey('esc', (event: KeyboardEvent): boolean => {
        this.exitEditMode();
        return false;
    }));

    _tasksService.isConnected.subscribe( (isConnected) => {
        if(isConnected) {
          // on connection, clear our current task list
          // as the server will soon send us an updated
          // array of tasks from the database.
          this.tasks = [];
        }
    });

    _tasksService.createTasks.subscribe( (task: Task) => {
        this._addTask(task);
        this.exitEditMode(task);
    });

    _tasksService.updateTasks.subscribe( (task: Task) => {
      this._updateTask(task);
      this.exitEditMode(task);
    });

    _tasksService.deleteTasks.subscribe( (task: Task) => {
        this._removeTask(task);
        this.exitEditMode(task);
    });
  }

  ngOnInit() {}

  private _removeTask( task: Task ) {

    if(task == null) {
      return;
    }

    let target: Task;
    for(let i=0; i<this.tasks.length; i++) {
      target = this.tasks[i];
      if(target.id == task.id) {
        this.tasks.splice(i, 1);
        console.log('> Delete ' + JSON.stringify(target));
        return;
      }
    }
  }

  private _addTask(task: Task) {

    if(task == null) {
      return;
    }
    this.tasks.splice(0, 0, task);
    console.log('> Task: ' + task.text + ' (' + task.id + ')');
  }

  private _updateTask( task: Task, taskId?: String ) {

    if(task == null) {
      return;
    }

    let target: Task;
    let targetId = taskId != null ? taskId : task.id;
    for(let i=0; i<this.tasks.length; i++) {
      if(this.tasks[i].id == targetId) {
        this.tasks[i] = task;
        this._changeDetector.markForCheck();
        console.log('> Update: ' + task.text + ' (' + task.id + ')');
        return;
      }
    }
  }

  // Check to see if the provided task is currently selected
  // or if none is provided, check if *any* task is selected
  private _isTaskSelected( task?:  Task ) {

      if(task == null && this.selectedTask != null) {
        return true;
      }

      if( task != null &&
          this.selectedTask != null &&
          this.selectedTask.id == task.id) {
        return true;
      }

      return false;
  }

  // exit out of edit mode
  // if a task is provided, we will exit out of edit mode only
  // if the currently selected task is the same as that provided.
  public exitEditMode(task?: Task, immediate?: boolean) {

    if(!immediate) {
      let scope = this;
      let target = this.exitEditMode;
      setTimeout( () => {
        target.call(scope, task, true);
      }, 10); // add delay to allow user to navigate
      return;
    }

    if(!this.isEditMode) {
      return;
    }

    if(this.selectedTask != null) {
      console.log('> Deselect: ' + this.selectedTask.text + ' (' + this.selectedTask.id + ')')
    }

    this.isEditMode = false;
    this.selectedTask = null;
  }

  public createTask() {
    let taskText = this._sanitizer.sanitize(SecurityContext.HTML, this.taskEditorCreateTextField.trim());
    if(taskText.length < 1) {
      return;
    }

    let newTask = new Task(taskText);
    this.taskEditorCreateTextField = "";
    this._tasksService.createTask(newTask);
  }

  public deleteTask(task: Task) {
    this._tasksService.deleteTask(task);
  }

  public updateFormTask() {

    if( this.taskEditorUpdateTextField == null ||
      this.taskEditorUpdateTextField.length < 1) {
      return;
    }

    let taskText = this._sanitizer.sanitize(
                        SecurityContext.HTML,
                        this.taskEditorUpdateTextField.trim());

    if(taskText.length < 1) {
      return;
    }

    let task = Object.assign({}, this.selectedTask);
    task.text = taskText;
    this._tasksService.updateTask(task);
  }

  // Deselect a task if specified, or if none
  // is specified, deselect the current task.
  public deselectTask( task?: Task ) {

    if(task != null && !this._isTaskSelected(task)) {
      return;
    }

    if( this.isEditMode &&
        this.selectedTask.text != this.taskEditorUpdateTextField) {

        // we are going to deselect a task after editing it,
        // so lets save our changes first.
        this.updateFormTask();
    }

    this.exitEditMode();
  }

  // select specified task if it is not already selected
  public selectTask(task?: Task) {

    // deselect task if we attempt to select 'nothing'
    // or, if we select the same task that is already
    // selected
    if(task == null || this._isTaskSelected(task)) {
      this.deselectTask(task);
      return;
    }

    this.selectedTask = task;
    this.isEditMode = true;
    this.taskEditorUpdateTextField = task.text;
    console.log('> Selected: ' + task.text + ' (' + task.id + ')');
  }
}
