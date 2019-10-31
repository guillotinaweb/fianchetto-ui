import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from "rxjs";
import { takeUntil}  from "rxjs/operators";
import { Resource } from "grange-core";
import { TraverserSelectors } from "ngx-state-traverser";
import { Grange } from "grange";
import { AuthenticationService } from "grange-core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  // FIXME: at the moment it's working ok without type. but should be fixed.
  moves = null;

  constructor(
    public grange: Grange,
    protected authentication: AuthenticationService,
    private http: HttpClient,
    private wsService: WebsocketService,
  ) {

  }

  makeMove(move: Move) {
    this.moves.next(move);
  }

  // This is listened to by the chessboard component and updates the 'position' of all pieces
  // Ie this is the position= argument on <ng-chessboard>
  position = new BehaviorSubject<string>(''); // board state

  reset(): void {
    this.position.next('start');
  }

  join(): void{
    // TODO: at the moment I can't figure out how to use grange.api.get with custom authentication header
    // Otherwise it should be simpler method
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authentication': 'bearer OIgkd16OpmDC00bt7f-10zD0YurruyJNR0-Xeey2C-4',
        'Authorization': 'Basic cm9vdDpyb290'
      })
    };
    
    // FIXME: Not sure why I am having to subscribe to the context here? Is there an easier way to get context.id?
    this.context.subscribe((data)=> {
      let game = data;
      let parent = game['parent'];
      this.http.get(parent['@id'] + '/@wstoken', httpOptions).subscribe((subdata) => {
        const token = subdata['token'];
        
        //FIXME: generate the ws:// url from the context
        const url = 'ws://localhost:8080/db/chess/mytestgame/@simple?ws_token=' + token;
        this.moves = this.wsService.connect(url);
        this.moves.subscribe((message: MessageEvent) =>{
          // Handle incoming messages. In future we will want more than just moves.
          // Maybe something to parse/dispatch generic messages?
          this.handleMove(message);
        })

        /* For now just set the board to the default start position on connection. 
            Would be better to draw position from last available move on the game,
            which would allow rejoining an existing game.
        */
        this.position.next('start');
      });
    });
  }

  handleMove(message: MessageEvent): void {
    // FIXME: surely the message doesn't need to be parsed like this?
    const newPos = JSON.parse(JSON.parse(message.data)[1])['newPos']
    this.position.next(newPos)
  }
}
