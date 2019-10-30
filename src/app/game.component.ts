import { Component } from '@angular/core';
import { Grange } from 'grange';
import { GameService, Move} from "./game.service";
import {takeUntil} from "rxjs/operators";


@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
})
export class GameComponent {
    position = ''
    constructor(
        private grange: Grange,
        private GameService: GameService,
    ){
      this.GameService.position.subscribe(current => {
        this.position = current;
      });
    }



    move(move: Move) {
      this.GameService.makeMove(move)
    }

    resetBoard(){
      this.GameService.reset();
    }

    join(){
      this.GameService.join();
    }

}
