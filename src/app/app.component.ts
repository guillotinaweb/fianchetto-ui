import { Component } from '@angular/core';
import { GrangeViews, Grange } from 'grange';

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
        this.grange.core.auth.isAuthenticated.subscribe(auth => this.isAuthenticated = auth.state);
    }

    logout() {
        this.grange.core.auth.logout();
    }
}
