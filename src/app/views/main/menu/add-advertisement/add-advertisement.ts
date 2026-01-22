import { Zod } from '../../../../utils/Zod'
import { Component, signal } from '@angular/core'
import { FormService } from '../../../../services/form.service'
import { IAddAdForm } from '../../../../interfaces/forms/IAddAdForm'
import { FormControl, FormGroup } from '@angular/forms'
import { PostType } from '../../../../types/enums/PostType'
import { CurrencyType } from '../../../../types/enums/CurrencyType'
import { PromoType } from '../../../../types/enums/PromoType'
import { TranslocoService } from '@jsverse/transloco'
import { Dropdown } from '../../../../components/dropdown/dropdown'
import { ConditionType } from '../../../../types/enums/ConditionType'
import { SelectChipM } from '../../../../components/select-chip/select-ship'
import { ICategoryFlat } from '../../../../interfaces/response/ICategoryFlat'

@Component({
  selector: 'add-advertisement',
  templateUrl: './add-advertisement.html',
  providers: [FormService],
  imports: [Dropdown, SelectChipM],
})
export class AddAdvertisement {
  public postTypeItems = signal<Record<PostType, string> | null>(null)
  public postTypeValues = Object.values(PostType).filter((v) => typeof v === 'number')
  public conditionTypeItems = signal<Record<ConditionType, string> | null>(null)
  public conditionTypeValues = Object.values(ConditionType).filter((v) => typeof v === 'number')

  public categoryFilter = (c: ICategoryFlat): boolean =>
    c.parentId === this.adForm.getControlSignal('postType')()

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

    this.conditionTypeItems.set({
      [ConditionType.Used]: this.ts.translate('menu.used'),
      [ConditionType.New]: this.ts.translate('menu.new'),
      [ConditionType.LikeNew]: this.ts.translate('menu.likeNew'),
      [ConditionType.ForParts]: this.ts.translate('menu.forParts'),
    })

    this.adForm.setForm(
      new FormGroup({
        postType: new FormControl(PostType.Sell as PostType, {
          nonNullable: true,
          validators: zod.required(),
        }),
        categoryId: new FormControl('', {
          nonNullable: true,
          validators: zod.required(),
        }),
        conditionType: new FormControl(ConditionType.Used as ConditionType, {
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
}
