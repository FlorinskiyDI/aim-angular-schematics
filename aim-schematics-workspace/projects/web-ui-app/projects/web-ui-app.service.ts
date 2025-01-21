import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {Projects\webUiApp} from './projects\web-ui-app'

const API_URL= 'http://somedomain.com/api/employee';

@Injectable({
    providedIn:'root'
})
export class Projects\webUiAppCrudService{
    
    constructor(private http:HttpClient){

    }

    findAll():Observable<Projects\webUiApp[]>{
        return this.http.get<Projects\webUiApp[]>(API_URL);
    }

    
}