import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Customer } from '../model/customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerService0 {
  customersUrl: string = 'http://localhost:3000/customers';
  list$: BehaviorSubject<Customer[]> = new BehaviorSubject<Customer[]>([]);

  constructor(private http: HttpClient) {}

  getAll(): void {
    this.list$.next([]);
    this.http
      .get<Customer[]>(this.customersUrl)
      .subscribe((customers) => this.list$.next(customers));
  }

  get(id: number): Observable<Customer> {
    return Number(id) === 0
      ? of(new Customer())
      : this.http.get<Customer>(`${this.customersUrl}/${Number(id)}`);
  }

  create(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.customersUrl, customer);
  }

  update(customer: Customer): Observable<Customer> {
    return this.http.patch<Customer>(
      `${this.customersUrl}/${customer.id}`,
      customer
    );
  }

  remove(customer: Customer): Observable<Customer> {
    return this.http.delete<Customer>(`${this.customersUrl}/${customer.id}`);
  }
}
