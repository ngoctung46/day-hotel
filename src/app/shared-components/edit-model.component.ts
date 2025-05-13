import { Component } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'shared-edit-model',
  imports: [NgbTooltipModule],
  template: `
    <div class="row row-cols-auto g-3 align-items-center">
      <div class="col-auto">
        <label for="name" class="col-form-label">Tên</label>
        <input
          type="text"
          id="name"
          class="form-control"
          aria-describedby="Tên"
          ngbTooltip="Tên"
        />
      </div>
      <div class="col-auto">
        <label for="price" class="col-form-label">Giá</label>
        <input
          type="number"
          id="price"
          class="form-control"
          aria-describedby="Giá"
          ngbTooltip="Giá"
        />
      </div>
      <div class="col-auto">
        <label for="price" class="col-form-label">Số lượng</label>
        <input
          type="number"
          id="quantity"
          class="form-control"
          aria-describedby="quantity"
          ngbTooltip="Số lượng"
        />
      </div>
    </div>
  `,
  styles: ``,
})
export class EditModelComponent {}
