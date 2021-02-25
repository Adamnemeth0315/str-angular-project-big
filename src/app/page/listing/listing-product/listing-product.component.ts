import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Product } from 'src/app/model/product';
import { ConfigService, ITableCol } from 'src/app/service/config.service';
import { ProductService } from 'src/app/service/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listing-product',
  templateUrl: './listing-product.component.html',
  styleUrls: ['./listing-product.component.scss']
})
export class ListingProductComponent implements OnInit {

  constructor(
    private productService: ProductService,
    private router: Router,
    private config: ConfigService,
    private toastr: ToastrService,
  ) { }

  productList: BehaviorSubject<Product[]> = this.productService.list$;
  cols: ITableCol[] = this.config.productTableCols;
  currentSelectProperty: string = 'name';
  productProperties: string[] = Object.keys(new Product());
  sortedOrder = 'ASC';
  sortedColumn = 'id';
  sortedCount = 0;
  filterKey: string = 'name';
  filterKeys: string[] = Object.keys(new Product());
  phrase: string = '';
  column: string = '';

  @Output() onUpdate: EventEmitter<Product> = new EventEmitter();
  @Output() onDelete: EventEmitter<Product> = new EventEmitter();


  ngOnInit(): void {
    this.productService.getAll();

  }

  onRemove(product: Product): void {
    this.productService.remove(product.id),
      this.router.navigate(['']);
    this.onDelete.emit(product);

    if (product.id === 0) {
      this.productService.create(product).subscribe(
        () => {
          this.toastr.success('Sikeres termék törlése!', 'Törlés!', { timeOut: 3000 });
          this.router.navigate(['products']);
        },
        error => this.toastr.error('Hiba a termék törlésekor!', 'Hiba!', { timeOut: 3000 })
      )
    }
    else {
      this.productService.update(product).subscribe(
        () => {
          this.toastr.success('Sikeresen törölted a terméket!', 'Törlés!', { timeOut: 3000 });
          this.router.navigate(['products']);
        },
        error => this.toastr.error('Hiba történt a termék törlésekor!', 'Hiba!', { timeOut: 3000 })
      )
    }
  }


  columnKey: string = '';
  onColumnSelect(key: string): void {
    this.columnKey = key;

  }

  onChangePhrase(event: any): void {
    this.phrase = (event.target as HTMLInputElement).value;
  }




}