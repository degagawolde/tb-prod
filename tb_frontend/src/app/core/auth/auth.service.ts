import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, switchMap, throwError} from 'rxjs';

import {UserService} from 'app/core/user/user.service';
import {environment} from '../../../environments/environment';

@Injectable()
export class AuthService {
    private _authenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */

    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */

    signIn(credentials: { username: string; password: string }): Observable<any> {


        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError(() => 'User is already logged in.');
        }

        return this._httpClient.post(environment.baseUrl + 'token/', credentials).pipe(
            switchMap((response: any) => {

                // Store the access token in the local storage

                    this.accessToken = response.access;
                    this.getUserDetail();
                    // Set the authenticated flag to true
                    this._authenticated = true;
                // Return a new observable with the response
                return of(response);
            })
        );
    }

    getUserDetail(): void {
        this._httpClient.get(environment.baseUrl + 'user-detail/')
            .subscribe({
                next: (user: any) => {
                    // Store the user on the user service
                    this._userService.user = user;
                }
            });
    }


    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');
        // Set the authenticated flag to false
        this._authenticated = false;
        // Return the observable
        return of(true);
    }


    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated && this._userService.user) {
            return of(true);
        }

        // Check the access token availability
        else if (!this.accessToken) {
            return of(false);
        }

        //Check the access token expire date
        else if (this.accessToken && !this._userService.user) {
            return this._httpClient.get(environment.baseUrl + 'user-detail/')
                .pipe(
                    switchMap((response: any) => {
                        this._userService.user = response;
                        return of(true);

                    }));
        }
    }
}
