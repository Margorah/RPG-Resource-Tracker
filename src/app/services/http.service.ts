import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { User } from '../models/user-model';
import { Character } from '../models/character-model';
import { CharacterStat } from '../models/stat-model';
import { ENVIRONMENT } from '../../environments/environment.default';

@Injectable()
export class HttpService {

  constructor(private http: Http) { }

  // Add Check Email Availability
  createUser(name: string, email: string, password: string): Observable<any> {
    console.log(`${name}, ${email}, ${password}`);
    return this.http.post(`${this.getUrl()}Users`, {name, email, password})
      .map((response: Response) => {
        let toReturn = response.json();
        toReturn.authToken = response.headers.get('x-auth');
        return toReturn;
        // console.log(toReturn);
      }).catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.getUrl()}Users/Me`, { email, password })
      .map((response: Response) => {
        let toReturn = response.json();
        toReturn.authToken = response.headers.get('x-auth');
        return toReturn;
      }).catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  logout(authToken: string): Observable<boolean> {
    return this.http.delete(`${this.getUrl()}Users/Me`, this.createAuthHeader(authToken))
      .map((response: Response) => {
        return true;
      }).catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  getCharacters(authToken: string): Observable<Character[]> {
    return this.http.get(`${this.getUrl()}Users/Characters`, this.createAuthHeader(authToken))
      .map((response: Response) => {
        let responseJson = response.json();
        // array [_id, charNames]
        return response.json().map((resChar) => {
          return {
            id: resChar._id,
            name: resChar.name,
            // stats: []
          };
        });
      }).catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  createCharacter(authToken: string, charId: string, characterName: string): Observable<Character> {
    return this.http.post(`${this.getUrl()}Users/Characters`, { name: characterName, cid: charId }, this.createAuthHeader(authToken))
      .map((response: Response) => {
        let toReturn = response.json();
        return {
          id: toReturn,
          name: characterName,
        };
      }).catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  getCharacterStats(authToken: string, charId: string): Observable<any> {
    return this.http.get(`${this.getUrl()}Users/Characters/${charId}`, this.createAuthHeader(authToken))
      .map((response: Response) => {
        // return Character
        let toReturn = response.json();
        return toReturn;
      }).catch((error: Response) => {
        return Observable.throw(error);
      });
  }

  createCharacterStat(authToken: string, charId: string, newStat: CharacterStat): Observable<any> {
    // console.log(`${authToken}, ${characterId}, ${newStat}`);
    return this.http.post(
      `${this.getUrl()}Users/Characters/Stats/`, { cid: charId, ...newStat }, this.createAuthHeader(authToken))
        .map((response: Response) => {
          // return Character.[stats]
          // console.log(response.json());
          return response.json();
        }).catch((error: Response) => {
          return Observable.throw(error);
        });
  }

  patchCharacterStat(auth: string, charId: string, stat: CharacterStat): Observable<CharacterStat> {
    return this.http.patch(
      `${this.getUrl()}Users/Characters/Stats/`,
      { cid: charId, ...stat },
      this.createAuthHeader(auth))
        .map((response: Response) => {
          // return Character.[stats]
          return response.json();
        }).catch((error: Response) => {
          return Observable.throw(error);
        });
  }

  deleteCharacterStat(auth: string, charId: string, statName: string): Observable<boolean> {
    // rewrite server api to not expect json object
    return this.http.delete(
      `${this.getUrl()}Users/Characters/${charId}/Stats/${statName}`,
      this.createAuthHeader(auth))
        .map((response: Response) => {
          // return Character.[stats]
          return true;
        }).catch((error: Response) => {
          return Observable.throw(error);
        });
  }

  createAuthHeader(authToken: string) {
    const header = new Headers({'x-auth': authToken});
    return new RequestOptions({ headers: header});
  }

  getUrl = () => {
    return `http://${ENVIRONMENT.database.host}:${ENVIRONMENT.database.port}/`;
  };
};
