import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { EaiiHorizontalNavigationComponent } from '@eaii/components/navigation/horizontal/horizontal.component';
import { EaiiNavigationService } from '@eaii/components/navigation/navigation.service';
import { EaiiNavigationItem } from '@eaii/components/navigation/navigation.types';

@Component({
    selector       : 'eaii-horizontal-navigation-divider-item',
    templateUrl    : './divider.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EaiiHorizontalNavigationDividerItemComponent implements OnInit, OnDestroy
{
    @Input() item: EaiiNavigationItem;
    @Input() name: string;

    private _eaiiHorizontalNavigationComponent: EaiiHorizontalNavigationComponent;
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
        this._eaiiHorizontalNavigationComponent = this._eaiiNavigationService.getComponent(this.name);

        // Subscribe to onRefreshed on the navigation component
        this._eaiiHorizontalNavigationComponent.onRefreshed.pipe(
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
