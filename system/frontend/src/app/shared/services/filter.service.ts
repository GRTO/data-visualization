import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

interface IFilters {
    merchant_type: string;
    card_type: string;
    gender: string;
    vista: string;
}

@Injectable()
export class FilterService {

    // Base url
    baseurl = 'http://52.202.253.46:5000';

    constructor(private http: HttpClient) { }

    // Http Headers
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }

    parseBody({ formCtrl, amount, credit, debit, female, male, transactions }) {
        const arrSolution = [];
        // merchant type
        if (formCtrl === null) {
            arrSolution.push('all');
        } else {
            arrSolution.push(formCtrl);
        }

        // card type
        if ((credit === null && debit === null) || (credit && debit)) {
            arrSolution.push('all');
        } else {
            arrSolution.push(credit !== null ? 'Crédito' : 'Débito');
        }

        // Gender
        if ((female === null && male === null) || (female && male)) {
            arrSolution.push('all');
        } else {
            arrSolution.push(male !== null ? 'M' : 'F');
        }

        // vista
        if(transactions === null && amount === null) {
            arrSolution.push('all');
        } else if(transactions) {
            arrSolution.push('Transacciones');
        } else {
            arrSolution.push('Montos');
        }

        return arrSolution.join('/');
    }

    // GET
    GetFilters(data): Observable<IFilters> {
        console.log('DATA');
        console.log('Here', this.parseBody(data));
        return this.http.get<IFilters>(this.baseurl + '/consult/' + this.parseBody(data))
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }

    // Error handling
    errorHandl(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.log(errorMessage);
        return throwError(errorMessage);
    }

}