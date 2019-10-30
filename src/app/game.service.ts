import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {map, takeUntil} from "rxjs/operators";
import {Resource} from "grange-core";
import {TraverserSelectors} from "ngx-state-traverser";
import {Grange} from "grange";
import {AuthenticationService} from "grange-core";
import { WebSocketSubject} from 'rxjs/webSocket';
import {Message} from "@angular/compiler/src/i18n/i18n_ast";
import { webSocket } from "rxjs/webSocket";
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { WebsocketService } from "./websocket.service";

export interface Move {
  newPos: object;
  oldPos: any;
  orientation: string;
  piece: string;
  source: string;
  target: string;
}



@Injectable({
  providedIn: 'root'
})
export class GameService {
  private destroy = new Subject();
  context = TraverserSelectors.TraverserContext<Resource>(this.grange.store).pipe(takeUntil(this.destroy));
  game = null;
  token  = null;
  websocket = null;
  public moves = null;
  public messages: Subject<Message>;

  constructor(
    public grange: Grange,
    protected authentication: AuthenticationService,
    private http: HttpClient,
    private wsService: WebsocketService,
  ) {

  }
  makeMove(move: Move) {
    console.log('Moving:', move.piece, 'from:', move.source, 'to:', move.target);
    /* This is where we will send moves to the websocket */
    // create observable
    const message = {
      author: "jon",
      message: move,
    }
    this.moves.next("this is the move");
  }

  position = new BehaviorSubject<string>(''); // board state

  reset(): void {
    this.position.next('start');
  }


  join(): void{
    const position = this.position;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authentication': 'bearer OIgkd16OpmDC00bt7f-10zD0YurruyJNR0-Xeey2C-4',
        'Authorization': 'Basic cm9vdDpyb290'
      })
    };
    this.context.subscribe((data)=> {
      this.game = data;
      const parent = this.game['parent'];
      this.http.get(parent['@id'] + '/@wstoken', httpOptions).subscribe((subdata) => {
        console.log('Auth Token:', subdata['token']) ;
        this.token = subdata['token'];
        // need to connect to a ws:// url here
        //TODO: generate the url from the context
        const url = 'ws://localhost:8080/db/chess/mytestgame/@test?ws_token=' + this.token;
        this.moves = this.wsService.connect(url);
        this.moves.subscribe((move) =>{
          console.log('Move received from stream');
          this.handleMove(move);
        })
        position.next('start');
      });
    });
  }

  handleMove(move): void {
    console.log('Incoming move:', move)
  }
}
