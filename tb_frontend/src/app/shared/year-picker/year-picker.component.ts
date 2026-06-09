import { Component, forwardRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

const moment = _rollupMoment || _moment;

export const YEAR_MODE_FORMATS = {
    parse: {
        dateInput: 'YYYY',
    },
    display: {
        dateInput: 'YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'app-year-picker',
    templateUrl: './year-picker.component.html',
    styleUrls: ['./year-picker.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: YEAR_MODE_FORMATS },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => YearPickerComponent),
            multi: true,
        },
    ],
})
export class YearPickerComponent implements ControlValueAccessor, OnInit {
    ngOnInit(): void {
        this._inputCtrl.setValue(moment(), { emitEvent: false });
    }
    /** Component label */
    @Input() label = '';

    _max: Moment;
    @Input() get max(): number | Date {
        return this._max ? this._max.year() : undefined;
    }

    set max(max: number | Date) {
        if (max) {
            const momentDate = typeof max === 'number' ? moment([max, 0, 1]) : moment(max);
            this._max = momentDate.isValid() ? momentDate : undefined;
        }
    }

    _min: Moment;
    @Input() get min(): number | Date {
        return this._min ? this._min.year() : undefined;
    }

    set min(min: number | Date) {
        if (min) {
            const momentDate = typeof min === 'number' ? moment([min, 0, 1]) : moment(min);
            this._min = momentDate.isValid() ? momentDate : undefined;
        }
    }

    @Input() touchUi = false;

    @ViewChild('datepicker') _picker: MatDatepicker<Moment>;

    // eslint-disable-next-line @typescript-eslint/member-ordering
    _inputCtrl: FormControl = new FormControl();


    // Function to call when the date changes.
    onChange = (year: Date) => {


    };

    // Function to call when the input is touched (when a star is clicked).
    onTouched = () => {

    };

    writeValue(date: Date): void {
        if (date && this._isYearEnabled(date.getFullYear())) {
            const momentDate = moment(date);
            if (momentDate.isValid()) {
                this._inputCtrl.setValue(moment(date), { emitEvent: false });
            }
        }
    }
    _closedHandler(event: any, datepicker: any) {
        // Set the selected value if the datepicker was closed without selecting a date
        if (!this._inputCtrl.value) {
            const today = new Date();
            this._inputCtrl.setValue(today);
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    // Allows Angular to disable the input.
  /*  setDisabledState(isDisabled: boolean): void {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        isDisabled ? this._picker.disabled = true : this._picker.disabled = false;

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        isDisabled ? this._inputCtrl.disable() : this._inputCtrl.enable();
    }*/

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    _yearSelectedHandler(chosenDate: Moment, datepicker: MatDatepicker<Moment>) {
        if (!this._isYearEnabled(chosenDate.year())) {
            datepicker.close();
            return;
        }

        this._inputCtrl.setValue(chosenDate, { emitEvent: false });
        this.onChange(chosenDate.toDate());
        this.onTouched();
        console.log("innyear select ");

        datepicker.close();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    _openDatepickerOnClick(datepicker: MatDatepicker<Moment>) {
        if (!datepicker.opened) {
            datepicker.open();
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    _openDatepickerOnFocus(datepicker: MatDatepicker<Moment>) {
        setTimeout(() => {
            if (!datepicker.opened) {
                datepicker.open();
            }
        });
    }

    /** Whether the given year is enabled. */
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    private _isYearEnabled(year: number) {
        // disable if the year is greater than maxDate lower than minDate
        if (year === undefined || year === null ||
            (this._max && year > this._max.year()) ||
            (this._min && year < this._min.year())) {
            return false;
        }

        return true;
    }

}
