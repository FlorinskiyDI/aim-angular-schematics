import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {Employee} from './employee'

const API_URL= 'http://somedomain.com/api/employee';

@Injectable({
    providedIn:'root'
})
export class EmployeeCrudService{
    
    constructor(private http:HttpClient){

    }

    findAll():Observable<Employee[]>{
        return this.http.get<Employee[]>(API_URL);
    }

    
}