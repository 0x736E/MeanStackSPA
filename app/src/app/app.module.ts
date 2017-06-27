import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HotkeyModule } from 'angular2-hotkeys';

// Socket.io
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
const socketIoConfig: SocketIoConfig = {
  url: 'http://localhost:8988',     // TODO: Change to hosted URL
	options: {}
};

// App
import { AppComponent } from './app.component';

// Tasks
import { TaskListComponent } from './tasks/task-list.component';
import { TaskSourceService } from './tasks/task-source.service';

// Misc
import { GiveFocusDirective } from './give-focus.directive';

// UI Router
import { UIRouterModule } from "@uirouter/angular";
let uiRouterConfig = {
  states: [],
  useHash: true
};


@NgModule({
  declarations: [
    AppComponent,
    TaskListComponent,
    GiveFocusDirective,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    UIRouterModule.forRoot(uiRouterConfig),
    SocketIoModule.forRoot(socketIoConfig),
    HotkeyModule.forRoot()
  ],
  providers: [TaskSourceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
