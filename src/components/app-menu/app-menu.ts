import { Component, EventEmitter, Input, Output, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../app/store/reducers';
import * as UserActions from '../../app/store/actions/user-actions';
import * as NavActions from '../../app/store/actions/nav-actions';

import * as PREFERENCES from '../../app/models/preferences-model';
/**
 * Generated class for the AppDrawComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'app-menu',
  templateUrl: 'app-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppMenuComponent {
  @Input() content;
  @Output() help = new EventEmitter<boolean>();
  private user: Observable<string>;
  private mode: Observable<string>;
  private templateModeTestVar = PREFERENCES.MODE.ONLINE;
  private templateNameTestVar = '';

  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.user = this.store.select(fromRoot.getUsername);
    this.mode = this.store.select(fromRoot.getPrefMode);
  }

  logout() {
    this.store.dispatch(new UserActions.Logout());
  }

  createUser() {
    this.store.dispatch(new NavActions.CreateUser());
  }

  login() {
    console.log('LOGIN!');
    this.store.dispatch(new NavActions.Login());
  }

  charList() {
    this.store.dispatch(new NavActions.CharacterList());
  }

  prefNav() {
    this.store.dispatch(new NavActions.Preferences());
  }

  showHelp() {
    this.help.emit(true)
  }
}
