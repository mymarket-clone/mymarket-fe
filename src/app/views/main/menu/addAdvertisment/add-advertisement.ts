import { Zod } from '../../../../utils/Zod'
import { Component, signal } from '@angular/core'
import { FormService } from '../../../../services/form.service'
import { IAddAdForm } from '../../../../interfaces/forms/IAddAdForm'
import { FormControl, FormGroup } from '@angular/forms'
import { PostType } from '../../../../types/enums/PostType'
import { CurrencyType } from '../../../../types/enums/CurrencyType'
import { PromoType } from '../../../../types/enums/PromoType'
import { TranslocoService } from '@jsverse/transloco'

@Component({
  selector: 'add-advertisement',
  templateUrl: './add-advertisement.html',
  providers: [FormService],
})
export class AddAdvertisement {
  public postTypeItems = signal<Record<PostType, string> | null>(null)
  public postTypeValues = Object.values(PostType).filter((v) => typeof v === 'number') as PostType[]

  public constructor(
    private readonly zod: Zod,
    public readonly adForm: FormService<IAddAdForm>,
    public readonly ts: TranslocoService
  ) {
    this.postTypeItems.set({
      [PostType.Sell]: this.ts.translate('menu.sell'),
      [PostType.Buy]: this.ts.translate('menu.buy'),
      [PostType.Rent]: this.ts.translate('menu.rent'),
      [PostType.Service]: this.ts.translate('menu.services'),
    })

    this.adForm.setForm(
      new FormGroup({
        postType: new FormControl(PostType.Sell as PostType, {
          nonNullable: true,
          validators: zod.required(),
        }),
        categoryId: new FormControl(0, {
          nonNullable: true,
          validators: zod.required(),
        }),
        title: new FormControl('', {
          nonNullable: true,
          validators: zod.required(),
        }),
        description: new FormControl('', {
          nonNullable: true,
          validators: zod.required(),
        }),
        forDisabledPerson: new FormControl(false, {
          nonNullable: true,
          validators: zod.required(),
        }),
        price: new FormControl(0, {
          nonNullable: true,
          validators: zod.required(),
        }),
        currencyType: new FormControl(CurrencyType.GEL as CurrencyType, {
          nonNullable: true,
          validators: zod.required(),
        }),
        salePercentage: new FormControl(0, {
          nonNullable: true,
          validators: zod.required(),
        }),
        canOfferPrice: new FormControl(false, {
          nonNullable: true,
          validators: zod.required(),
        }),
        isNegotiable: new FormControl(false, {
          nonNullable: true,
          validators: zod.required(),
        }),
        name: new FormControl('', {
          nonNullable: true,
          validators: zod.required(),
        }),
        phoneNumber: new FormControl('', {
          nonNullable: true,
          validators: zod.required(),
        }),
        userId: new FormControl(0, {
          nonNullable: true,
          validators: zod.required(),
        }),
        promoType: new FormControl(null as PromoType | null),
        isColored: new FormControl(false, {
          nonNullable: true,
          validators: zod.required(),
        }),
        autoRenewal: new FormControl(false, {
          nonNullable: true,
          validators: zod.required(),
        }),
      })
    )
  }

  public setPostType(index: number): void {
    this.adForm.getControl('postType').setValue(this.postTypeValues[index])
  }
}
