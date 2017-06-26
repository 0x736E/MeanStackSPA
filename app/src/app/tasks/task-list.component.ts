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
        if(this.isEditMode) {
          this.exitEditMode();
        }
        return false; // Prevent bubbling
    }));

    _tasksService.isConnected.subscribe( (isConnected) => {
        if(isConnected) {
          this.tasks = [];
        }
    });

    _tasksService.createTasks.subscribe( (task: Task) => {
        if(task != null) {
          //this.tasks.push(task);
          this.tasks.splice(0,0,task);
          this.exitEditMode(task);
            console.log('> Task: ' + task.text + ' (' + task.id + ')');
        }
    });

    _tasksService.updateTasks.subscribe( (task: Task) => {
        if(task != null) {
          let target: Task;
          for(let i=0; i<this.tasks.length; i++) {
            if(this.tasks[i].id == task.id) {
              this.tasks[i] = task;
              this._changeDetector.markForCheck();
              setTimeout( () => {
                this.exitEditMode(task);
              }, 10); // add delay to allow user to navigate
              console.log('> Update: ' + task.text + ' (' + task.id + ')');
              return;
            }
          }
        }
    });

    _tasksService.deleteTasks.subscribe( (task: Task) => {
        if(task != null) {
          let target: Task;
          for(let i=0; i<this.tasks.length; i++) {
            target = this.tasks[i];
            if(target.id == task.id) {
              this.tasks.splice(i, 1);
              this.exitEditMode(target);
              console.log('> Delete ' + JSON.stringify(target));
              return;
            }
          }
        }
    });
  }

  ngOnInit() {
  }

  // exit out of edit mode
  // if a task is provided, we will exit out of edit mode only
  // if the currently selected task is the same as that provided.
  exitEditMode(task?: Task) {
    if( task != null &&
        this.selectedTask != null &&
        this.selectedTask.id != task.id) {
      return;
    }

    if(this.selectedTask != null) {
      console.log('> Deselect: ' + this.selectedTask.text + ' (' + this.selectedTask.id + ')')
    }

    this.isEditMode = false;
    this.selectedTask = null;
  }

  createTask() {
    let taskText = this._sanitizer.sanitize(SecurityContext.HTML, this.taskEditorCreateTextField.trim());
    if(taskText.length < 1) {
      return;
    }

    let newTask = new Task(taskText);
    this.taskEditorCreateTextField = "";
    this._tasksService.createTask(newTask);
  }

  deleteTask(task: Task) {
    this._tasksService.deleteTask(task);
  }

  updateTask() {
    if(this.taskEditorUpdateTextField == null || this.taskEditorUpdateTextField.length < 1) {
      return;
    }
    let taskText = this._sanitizer.sanitize(SecurityContext.HTML, this.taskEditorUpdateTextField.trim());
    if(taskText.length < 1) {
      return;
    }

    let task = Object.assign({}, this.selectedTask);
    task.text = taskText;
    this._tasksService.updateTask(task);
  }

  deselectTask() {
    console.log('> Deselected' + (this.selectedTask ? ': ' + this.selectedTask.text + ' (' + this.selectedTask.id + ')' : ''));
    this.exitEditMode();
  }

  selectTask(task: Task) {

    // deselect task if we attempt to select 'nothing'
    // or, if we select the same task that is already
    // selected
    if(this.selectedTask != null) {

      // we deslected a task after editing it
      // lets save our changes.
      if( this.isEditMode &&
          this.selectedTask.text != this.taskEditorUpdateTextField) {
          this.updateTask();
      } else if(this.selectedTask.id == task.id) {
          this.deselectTask();
          return;
      }

    }

    this.selectedTask = task;
    this.isEditMode = true;
    this.taskEditorUpdateTextField = task.text;
    console.log('> Selected: ' + task.text + ' (' + task.id + ')');
  }
}
