import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {WebUiApp} from './web-ui-app'

const API_URL= 'http://somedomain.com/api/employee';

@Injectable({
    providedIn:'root'
})
export class WebUiAppCrudService{
    
    constructor(private http:HttpClient){

    }

    findAll():Observable<WebUiApp[]>{
        return this.http.get<WebUiApp[]>(API_URL);
    }

    
}