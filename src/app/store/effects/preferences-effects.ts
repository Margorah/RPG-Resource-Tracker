import 'rxjs/add/operator/map';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/mergeMap';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';

import { StorageService } from '../../services/storage.service';

import { PreferenceState } from '../reducers/preferences-reducer';
import * as PREFERENCES from '../../models/preferences-model';

import * as PrefActions from '../actions/preferences-actions';
import * as UserActions from '../actions/user-actions';
import * as CharacterActions from '../actions/character-actions';
import * as NavActions from '../actions/nav-actions';
import * as fromRoot from '../reducers';

@Injectable()
export class PreferencesEffects {
    @Effect()
    $load: Observable<Action> = this.actions$.ofType(PrefActions.LOAD)
        .mergeMap(() => this.storage.getPrefState())
        .withLatestFrom(this.store$.select(fromRoot.getPrefState), (storage: PreferenceState, store: PreferenceState) => {
            return {storage, store};
        })
        .mergeMap((state) => {
            let newActions: Action[] = [];
            // console.log(state.store);
            if (state.storage === null) {
                // Save to skip this next load;
                newActions.push(new PrefActions.Save(state.store));
                // First Time runnining, assume offline mode, go to CharacterListPage
                newActions.push(new NavActions.CharacterList());
            } else {
                if (state.storage.mode === PREFERENCES.MODE.OFFLINE) {

                } else {

                }
            }
            newActions.push(new UserActions.Load());
            return newActions;
        });

    @Effect({dispatch: false})
    $save: Observable<Action> = this.actions$.ofType(PrefActions.SAVE)
        .map(toPayload)
        .map((state) => {
            this.storage.setPrefState(state);
            return null;
        })

    constructor(private store$: Store<fromRoot.State>, private actions$: Actions, private storage: StorageService) { }
}