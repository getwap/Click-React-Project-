import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IPayment, Payment } from '../payment.model';
import { PaymentService } from '../service/payment.service';
import {SharedconfirmService} from "../../../shared/sharedconfirm";

@Component({
  selector: 'jhi-payment-update',
  templateUrl: './payment-update.component.html',
})
export class PaymentUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    cik: [],
    ccc: [],
    payment_amount: [],
    name: [],
    email: [],
    phone: [],
  });

  constructor(protected  sharedConfirmService: SharedconfirmService,
              protected paymentService: PaymentService,
              protected activatedRoute: ActivatedRoute,
              protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ payment }) => {
      this.updateForm(payment);
    });
  }

  previousState(): void {
    window.history.back();
  }

  // save2(){
  //   const payment = this.sharedConfirmService.getMessage();
  //   this.subscribeToSaveResponse((this.paymentService.create(payment));
  // }


  save(): void {
    this.isSaving = true;
    const payment = this.createFromForm();
    if (payment.id !== undefined) {
      this.subscribeToSaveResponse(this.paymentService.update(payment));
    } else {
      this.subscribeToSaveResponse(this.paymentService.amount(payment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPayment>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(payment: IPayment): void {
    this.editForm.patchValue({
      id: payment.id,
      cik: payment.cik,
      ccc: payment.ccc,
      payment_amount: payment.payment_amount,
      name: payment.name,
      email: payment.email,
      phone: payment.phone,
    });
  }



  protected createFromForm(): IPayment {
    return {
      ...new Payment(),
      id: this.editForm.get(['id'])!.value,
      cik: this.editForm.get(['cik'])!.value,
      ccc: this.editForm.get(['ccc'])!.value,
      payment_amount: this.editForm.get(['payment_amount'])!.value,
      name: this.editForm.get(['name'])!.value,
      email: this.editForm.get(['email'])!.value,
      phone: this.editForm.get(['phone'])!.value,
    };
  }
}
