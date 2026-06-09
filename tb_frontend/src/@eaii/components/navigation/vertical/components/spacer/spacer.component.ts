import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { EaiiVerticalNavigationComponent } from '@eaii/components/navigation/vertical/vertical.component';
import { EaiiNavigationService } from '@eaii/components/navigation/navigation.service';
import { EaiiNavigationItem } from '@eaii/components/navigation/navigation.types';

@Component({
    selector       : 'eaii-vertical-navigation-spacer-item',
    templateUrl    : './spacer.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EaiiVerticalNavigationSpacerItemComponent implements OnInit, OnDestroy
{
    @Input() item: EaiiNavigationItem;
    @Input() name: string;

    private _eaiiVerticalNavigationComponent: EaiiVerticalNavigationComponent;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _eaiiNavigationService: EaiiNavigationService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Get the parent navigation component
        this._eaiiVerticalNavigationComponent = this._eaiiNavigationService.getComponent(this.name);

        // Subscribe to onRefreshed on the navigation component
        this._eaiiVerticalNavigationComponent.onRefreshed.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe(() => {

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
