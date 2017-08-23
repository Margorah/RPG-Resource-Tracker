import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';

import { HttpService } from '../../services/http.service';
import { StorageService } from '../../services/storage.service';

import * as UserActions from '../actions/user-actions';
import * as NavActions from '../actions/nav-actions';
import * as CharacterActions from '../actions/character-actions';
import * as fromRoot from '../reducers';

@Injectable()
export class UserEffects {
    @Effect()
    $create: Observable<Action> = this.actions$.ofType(UserActions.CREATE)
        .map(toPayload)
        .switchMap(payload => this.http.createUser(payload.name, payload.email, payload.password))
        .mergeMap((user) => {
            let mergeActions = [
                new UserActions.CreateSuccess(user),
                new NavActions.CharacterList()
            ];
            this.storage.setUserState(user);
            return mergeActions;
        });

    @Effect()
    login$: Observable<Action> = this.actions$.ofType(UserActions.LOGIN)
        .map(toPayload)
        .switchMap(payload => {
            return this.http.login(payload.email, payload.password);
        })
        .mergeMap((user) => {
            let mergeActions = [
                new UserActions.LoginSuccess(user),
                new NavActions.CharacterList()
            ];
            this.storage.setUserState(user);           
            return mergeActions;
        });

    @Effect()
    delete$: Observable<Action> = this.actions$.ofType(UserActions.DELETE)
        .withLatestFrom(this.store$.select(fromRoot.getAuth), (action, token) => token)
        .switchMap((authToken) => this.http.logout(authToken))
        .mergeMap(() => {
            let mergeActions = [
                new UserActions.DeleteSuccess(),
                new CharacterActions.RemoveAll(),
                new NavActions.Login()
            ];
            return mergeActions;
        });
    
    @Effect()
    load$: Observable<Action> = this.actions$.ofType(UserActions.LOAD)
        .mergeMap(() => {
            let newAction: Action[] = [];
            const userState = this.storage.getUserState();
            // Fit a Catch in here for loaderror?
            if (userState === null) {
                newAction.push(new UserActions.LoadNone());
            } else {
                newAction.push(new UserActions.LoadSuccess(userState));
                newAction.push(new NavActions.Load());
            }
            return newAction;
        });

    constructor(private http: HttpService,
                private actions$: Actions,
                private store$: Store<fromRoot.State>,
                private storage: StorageService) { }
};
