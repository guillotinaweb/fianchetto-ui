import { Component } from '@angular/core';
import { GrangeViews, Grange } from 'grange';
import {GameComponent} from "./game.component";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    isAuthenticated = false;

    constructor(
        private grange: Grange,
        private views: GrangeViews,
    ) {
        this.views.initialize();
        /*this.grange.traverser.addView('view', 'Database', HomeComponent);*/
        this.grange.traverser.addView('board', '*', GameComponent);
        this.grange.core.auth.isAuthenticated.subscribe(auth => this.isAuthenticated = auth.state);
        this.grange.core.loading.status.subscribe(current => {
          console.log(current);
        })
    }

    logout() {
        this.grange.core.auth.logout();
    }

}
