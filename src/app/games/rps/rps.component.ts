import { switchMap, tap, first } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { GameService } from './../../services/game.service';
import { Component, OnInit } from '@angular/core';
import { IGameMove } from 'src/app/models/i-game-move';
import { IPlayer } from 'src/app/models/i-player';

@Component({
  selector: 'app-rps',
  templateUrl: './rps.component.html',
  styleUrls: ['./rps.component.css']
})
export class RpsComponent implements OnInit {
  currentMatchId: string;
  myMoves: IGameMove[] = [];
  myPick: "rock" | "paper" | "scissors"
  working: boolean = false;

  constructor(public gameService: GameService) { }

  ngOnInit() {
    this.gameService.getMatches().subscribe();
    this.gameService.Reset.subscribe(() => {
      this.gameService.getMatches().subscribe();
      this.currentMatchId = null;
      this.myPick = null;
      this.myMoves = [];
    })
  }

  issueChallenge = () => this.gameService.ActiveMatches.pipe(first(), switchMap(matches => {
    return this.gameService.Opponent.pipe(tap(player => {
      if (!matches.some(m => m.playerId === player.id)) {
        return of(this.gameService.issueChallenge(player.connectionId));
      } else {
        alert('You already have an active challenge with this opponent!')
      }
    }))
  })).subscribe();

  getGameMoves() {
    if (this.currentMatchId)
      this.gameService.getGameMoves(this.currentMatchId).subscribe(moves => {
        this.myMoves = moves
        this.parseMove();
        this.working = false;
      });
  }

  sendMove(type: string) {
    if (this.myMoves.length === 0 && !this.working) {
      this.working = true;
      this.gameService.sendMove(this.currentMatchId, type).then(() => {
        this.getGameMoves()
      });
    }
  }

  parseMove() {
    if (this.myMoves.length === 1) {
      this.myPick = JSON.parse(this.myMoves[0].moveData);
    }
  }

  showChallenge(challenger: IPlayer) {
    if (confirm(`Accept challenge from ${challenger.username}?`)) {
      this.gameService.respondToChallenge(true, challenger);
    }
    else this.gameService.respondToChallenge(false, challenger);

    this.gameService.removeChallenge(challenger).subscribe();
  }
}
