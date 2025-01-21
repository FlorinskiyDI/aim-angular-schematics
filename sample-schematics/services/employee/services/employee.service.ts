import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {Services/employee} from './services/employee'

const API_URL= 'http://somedomain.com/api/employee';

@Injectable({
    providedIn:'root'
})
export class Services/employeeCrudService{
    
    constructor(private http:HttpClient){

    }

    findAll():Observable<Services/employee[]>{
        return this.http.get<Services/employee[]>(API_URL);
    }

    
}