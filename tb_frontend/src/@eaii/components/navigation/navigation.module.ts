import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { EaiiScrollbarModule } from '@eaii/directives/scrollbar/public-api';
import { EaiiHorizontalNavigationBasicItemComponent } from '@eaii/components/navigation/horizontal/components/basic/basic.component';
import { EaiiHorizontalNavigationBranchItemComponent } from '@eaii/components/navigation/horizontal/components/branch/branch.component';
import { EaiiHorizontalNavigationDividerItemComponent } from '@eaii/components/navigation/horizontal/components/divider/divider.component';
import { EaiiHorizontalNavigationSpacerItemComponent } from '@eaii/components/navigation/horizontal/components/spacer/spacer.component';
import { EaiiHorizontalNavigationComponent } from '@eaii/components/navigation/horizontal/horizontal.component';
import { EaiiVerticalNavigationAsideItemComponent } from '@eaii/components/navigation/vertical/components/aside/aside.component';
import { EaiiVerticalNavigationBasicItemComponent } from '@eaii/components/navigation/vertical/components/basic/basic.component';
import { EaiiVerticalNavigationCollapsableItemComponent } from '@eaii/components/navigation/vertical/components/collapsable/collapsable.component';
import { EaiiVerticalNavigationDividerItemComponent } from '@eaii/components/navigation/vertical/components/divider/divider.component';
import { EaiiVerticalNavigationGroupItemComponent } from '@eaii/components/navigation/vertical/components/group/group.component';
import { EaiiVerticalNavigationSpacerItemComponent } from '@eaii/components/navigation/vertical/components/spacer/spacer.component';
import { EaiiVerticalNavigationComponent } from '@eaii/components/navigation/vertical/vertical.component';

@NgModule({
    declarations: [
        EaiiHorizontalNavigationBasicItemComponent,
        EaiiHorizontalNavigationBranchItemComponent,
        EaiiHorizontalNavigationDividerItemComponent,
        EaiiHorizontalNavigationSpacerItemComponent,
        EaiiHorizontalNavigationComponent,
        EaiiVerticalNavigationAsideItemComponent,
        EaiiVerticalNavigationBasicItemComponent,
        EaiiVerticalNavigationCollapsableItemComponent,
        EaiiVerticalNavigationDividerItemComponent,
        EaiiVerticalNavigationGroupItemComponent,
        EaiiVerticalNavigationSpacerItemComponent,
        EaiiVerticalNavigationComponent
    ],
    imports     : [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatTooltipModule,
        EaiiScrollbarModule
    ],
    exports     : [
        EaiiHorizontalNavigationComponent,
        EaiiVerticalNavigationComponent
    ]
})
export class EaiiNavigationModule
{
}
