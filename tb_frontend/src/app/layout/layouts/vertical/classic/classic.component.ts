import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {EaiiMediaWatcherService} from '@eaii/services/media-watcher';
import {EaiiNavigationService, EaiiVerticalNavigationComponent} from '@eaii/components/navigation';
import {Navigation} from 'app/core/navigation/navigation.types';
import {NavigationService} from 'app/core/navigation/navigation.service';

@Component({
    selector: 'classic-layout',
    templateUrl: './classic.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: ['.wrapper{position:  relative; height:100% ; object-fit:fill; background: url("../../../../../assets/images/Rectangle 1.png") 0 0 no-repeat;background-size: cover;overflow: hidden;}']
})
export class ClassicLayoutComponent implements OnInit, OnDestroy {
    isScreenSmall: boolean;
    navigation: Navigation;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _eaiiMediaWatcherService: EaiiMediaWatcherService,
        private _eaiiNavigationService: EaiiNavigationService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to navigation data
        this.navigation = {
            default: [{
                id: 'dashboards',
                title: 'Home',
                tooltip: 'Home',
                type: 'basic',
                link: '/home',
                icon: 'heroicons_outline:home',
            },
                {
                    id: 'reg',
                    title: 'New Case',
                    tooltip: 'Registration',
                    type: 'basic',
                    link: '/registration',
                    icon: 'feather:user-plus'
                },
                {

                    id: 'list',
                    title: 'Patient Record',
                    tooltip: 'Patients',
                    link: 'list',
                    type: 'basic',
                    icon: 'feather:users'
                },
            ]
        };
        // Subscribe to media changes
        this._eaiiMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation = this._eaiiNavigationService.getComponent<EaiiVerticalNavigationComponent>(name);

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }
}
