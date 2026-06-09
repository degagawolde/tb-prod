import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-image-viewer',
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.scss'],
})
export class ImageViewerComponent {
    scale: number = 1;
    @Input() imageUrl: string;
    @Input() maskUrl: string;
    @Input() single: boolean = true;

    onZoom(event: WheelEvent) {
        event.preventDefault();
        const delta = Math.sign(event.deltaY);
        this.scale += delta * 0.1;
        this.scale = Math.max(0.1, this.scale);
    }
}
