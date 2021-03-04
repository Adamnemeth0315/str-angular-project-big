import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { Customer } from 'src/app/model/customer';
import { CustomerService } from 'src/app/service/customer.service';
import { ConfigService, ITableCol } from 'src/app/service/config.service';
import { StatisticsService } from 'src/app/service/statistics.service';
@Component({
  selector: 'app-listing-customer',
  templateUrl: './listing-customer.component.html',
  styleUrls: ['./listing-customer.component.scss'],
})
export class ListingCustomerComponent implements OnInit {
  constructor(
    private customerService: CustomerService,
    private router: Router,
    private config: ConfigService,
    private toastr: ToastrService,
    private statisticsService: StatisticsService
  ) { }
  scroll(id: string) {
    const elmnt = document.getElementById(id);
    elmnt?.scrollIntoView(false);
  }
  customerList$: BehaviorSubject<Customer[]> = this.customerService.list$;
  phrase: string = '';
  cols: ITableCol[] = this.config.customerTableCols;
  filterKey: string = 'id';
  filterKeys: string[] = Object.keys(new Customer());
  currentSelectProperty: string = 'name';
  customerProperties: string[] = Object.keys(new Customer());
  sortedOrder = 'ASC';
  sortedColumn = 'id';
  sortedCount = 0;
  column: string = '';
  direction: boolean = false;
  columnKey: string = '';
  firstSorting = true;
  numberOfAllCustomers$ = this.statisticsService.numberOfAllCustomers$;
  numberOfActiveCustomers$ = this.statisticsService.numberOfActiveCustomers$;
  numberOfPassiveCustomers$ = this.statisticsService.numberOfPassiveCustomers$;
  ngOnInit(): void {
    this.customerService.getAll();
    this.statisticsService.subscribeForData();
  }
  onRemove(customer: Customer): void {
    if (!confirm(`Biztosan törli a vásárlót? (id: ${customer.id} Keresztnév: ${customer.firstName} Vezetéknév: ${customer.lastName} Email: ${customer.email})`)) {
      return
    }
    this.customerService.remove(customer).subscribe(
      () => {
        this.toastr.success('Sikeresen törölted a vásárlót!', 'Törlés!', { timeOut: 3000 });
        this.customerService.getAll();
        this.router.navigate(['customers']);
      },
      error => this.toastr.error('Hiba történt a vásárló törlésekor!', 'Hiba!', { timeOut: 3000 })
    )
  }
  onColumnSelect(columnName: string): void {
    if (this.firstSorting) {
      this.sortedOrder = 'ASC';
      this.firstSorting = false;
    }
    else this.sortedOrder == 'ASC' ? this.sortedOrder = 'DESC' : this.sortedOrder = 'ASC';
    this.sortedColumn = columnName;
    this.direction = !this.direction;
  }
  onChangePhrase(event: any): void {
    this.phrase = (event.target as HTMLInputElement).value;
  }
}

