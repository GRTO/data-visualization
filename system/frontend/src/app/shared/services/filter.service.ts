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

    parseBody({ formCtrl, amount, credit, debit, female, male, transactions, startDate, endDate }) {
        const arrSolution = [];
        // merchant type
        if (formCtrl === null) {
            arrSolution.push('all');
        } else {
            arrSolution.push(`'${formCtrl}'`);
        }

        // card type
        if ((credit === null && debit === null) || (credit && debit)) {
            arrSolution.push('all');
        } else {
            if(credit !== null && credit) {
                arrSolution.push(`'TC'`);
            } else if(debit !== null && debit) {
                arrSolution.push(`'TD'`);
            } else {
                arrSolution.push('all');
            }
        }

        // Gender
        if ((female === null && male === null) || (female && male)) {
            arrSolution.push('all');
        } else {
            if(male !== null && male) {
                arrSolution.push(`'M'`);
            } else if(female !== null && female) {
                arrSolution.push(`'F'`);
            } else {
                arrSolution.push('all');
            }
        }

        // vista
        if(transactions === null && amount === null) {
            arrSolution.push('all');
        } else if(transactions) {
            arrSolution.push('Transacciones');
        } else {
            arrSolution.push('Montos');
        }

        if(startDate === null) {
            arrSolution.push('all');
        } else {
            arrSolution.push(`'${startDate}'`);
        }

        if(endDate === null) {
            arrSolution.push('all');
        } else {
            arrSolution.push(`'${endDate}'`);
        }

        return arrSolution.join('/');
    }

    parseMicroBody({type_consult, formCtrl, startDate, endDate}) {
        const arrSolution = [];
        // type consult
        if(type_consult === 0 || type_consult === null) {
            arrSolution.push('all');
        } else {
            arrSolution.push(type_consult);
        }

        // merchant type
        if (formCtrl === null) {
            arrSolution.push('all');
        } else {
            arrSolution.push(`'${formCtrl}'`);
        }

        if(startDate === null) {
            arrSolution.push(`'2010-01-01'`);
        } else {
            arrSolution.push(`'${startDate}'`);
        }

        if(endDate === null) {
            arrSolution.push('all');
        } else {
            arrSolution.push(`'${endDate}'`);
        }
        return arrSolution.join('/');
    }

    // GET
    GetFilters(data): Observable<any> {
        return this.http.get<any>(this.baseurl + '/consult/' + this.parseBody(data))
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            )
    }

    GetMicroFilters(data): Observable<any> {
        return this.http.get<any>(this.baseurl + '/consult_micro/' + this.parseMicroBody(data))
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
        return throwError(errorMessage);
    }

}