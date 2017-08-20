import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';

import { CharacterListPage } from '../../../pages/character-list/character-list';

import { HttpService } from '../../services/http.service';

import * as UserActions from '../actions/user-actions';
import * as CharacterActions from '../actions/character-actions';
import * as AuthActions from '../actions/auth-actions';
import * as StatActions from '../actions/stat-actions';
import * as NavActions from '../actions/nav-actions';

import * as fromRoot from '../reducers';

@Injectable()
export class AuthEffects {
    @Effect()
    create$: Observable<Action> = this.actions$.ofType(AuthActions.CREATE)
        .map(toPayload)
        .switchMap(payload => {
            return this.http.login(payload.email, payload.password);
        })
        .mergeMap((user) => {
            let mergeActions = [
                new AuthActions.CreateSuccess(user.authToken),
                new UserActions.AddSuccess(user),
                new NavActions.CharacterList()
            ];
            return mergeActions;
        });

    @Effect()
    delete$: Observable<Action> = this.actions$.ofType(AuthActions.DELETE)
        .withLatestFrom(this.store$.select(fromRoot.getAuth), (action, token) => token)
        .switchMap((authToken) => this.http.logout(authToken))
        .mergeMap(() => {
            let mergeActions = [
                new AuthActions.DeleteSuccess(),
                new UserActions.RemoveSuccess(),
                new CharacterActions.RemoveAllSuccess(),
                new NavActions.Login()
            ];
            return mergeActions;
        });
  
    constructor(
        private http: HttpService,
        private actions$: Actions,
        private store$: Store<fromRoot.State>) { }
};
