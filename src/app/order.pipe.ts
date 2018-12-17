import { OrderService } from './order.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'order',
  pure: false
})
export class OrderPipe implements PipeTransform {
  constructor(private orderService: OrderService) {}

  transform(items: Object[]): Object[] {
    // this.orderService.sortByName();
    return this.orderService.items;
  }

}
