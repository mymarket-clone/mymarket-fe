import { Dropdown } from './../../../../components/dropdown/dropdown'
import { Zod } from '../../../../utils/Zod'
import { Component, signal } from '@angular/core'
import { FormService } from '../../../../services/form.service'
import { IAddPostForm } from '../../../../interfaces/forms/IAddPostForm'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { PostType } from '../../../../types/enums/PostType'
import { CurrencyType } from '../../../../types/enums/CurrencyType'
import { PromoType } from '../../../../types/enums/PromoType'
import { TranslocoService, TranslocoDirective } from '@jsverse/transloco'
import { ConditionType } from '../../../../types/enums/ConditionType'
import { SelectChipM } from '../../../../components/select-chip/select-ship'
import { SvgIconComponent } from 'angular-svg-icon'
import { Input } from '../../../../components/input/input'
import { NgTemplateOutlet } from '@angular/common'
import { TextEditor } from '../../../../components/text-editor/text-editor'
import { CheckboxChip } from '../../../../components/checkbox-chip/checkbox-chip'
import { PromoService } from '../../../../types/PromoService'
import { DropdownEl } from '../../../../types/DropdownEl'

@Component({
  selector: 'add-advertisement',
  templateUrl: './add-advertisement.html',
  providers: [FormService],
  imports: [
    Dropdown,
    SelectChipM,
    SvgIconComponent,
    NgTemplateOutlet,
    Input,
    TextEditor,
    ReactiveFormsModule,
    TranslocoDirective,
    CheckboxChip,
  ],
})
export class AddAdvertisement {
  public postTypeItems = signal<Record<PostType, string> | null>(null)
  public postTypeValues = Object.values(PostType).filter((v) => typeof v === 'number')
  public conditionTypeItems = signal<Record<ConditionType, string> | null>(null)
  public conditionTypeValues = Object.values(ConditionType).filter((v) => typeof v === 'number')
  public currencyTypeOptions = Object.values(CurrencyType)
    .filter((v): v is number => typeof v === 'number')
    .map((id) => ({ id, name: CurrencyType[id] }))
  public promoService = signal<PromoService[] | null>(null)
  public isEnglishOpen = signal<boolean>(false)
  public isRussianOpen = signal<boolean>(false)
  public totalPrice = signal<number[]>([0, 0])

  public constructor(
    private readonly zod: Zod,
    public readonly adForm: FormService<IAddPostForm>,
    public readonly ts: TranslocoService
  ) {
    this.postTypeItems.set({
      [PostType.Sell]: this.ts.translate('addPost.sell'),
      [PostType.Buy]: this.ts.translate('addPost.buy'),
      [PostType.Rent]: this.ts.translate('addPost.rent'),
      [PostType.Service]: this.ts.translate('addPost.services'),
    })

    this.conditionTypeItems.set({
      [ConditionType.Used]: this.ts.translate('addPost.used'),
      [ConditionType.New]: this.ts.translate('addPost.new'),
      [ConditionType.LikeNew]: this.ts.translate('addPost.likeNew'),
      [ConditionType.ForParts]: this.ts.translate('addPost.forParts'),
    })

    this.promoService.set([
      {
        type: PromoType.VIP,
        title: 'VIP',
        features: [this.ts.translate('addPost.vipLabel')],
        price: [2.5],
        iconSrc: 'assets/vip.svg',
        color: 'bg-blue-gradient',
        bg: 'rgb(0, 106, 255)',
      },
      {
        type: PromoType.VIP_PLUS,
        title: 'VIP+',
        features: [this.ts.translate('addPost.vipPlusLabel'), this.ts.translate('addPost.vipPlusLabel2')],
        price: [4, 3.5, 3.15],
        iconSrc: 'assets/vip-plus.svg',
        color: 'bg-yellow-gradient',
        bg: 'rgb(254, 201, 0)',
      },
      {
        type: PromoType.SUPER_VIP,
        title: 'SUPER VIP',
        features: [this.ts.translate('addPost.vipSuperLabel'), this.ts.translate('addPost.vipSuperLabel2')],
        price: [9, 8, 7.5],
        iconSrc: 'assets/super-vip.svg',
        color: 'bg-orange-gradient',
        bg: 'rgb(253, 65, 0)',
      },
    ])

    this.adForm.setForm(
      new FormGroup<IAddPostForm>({
        postType: new FormControl(PostType.Sell, {
          nonNullable: true,
          validators: zod.required(),
        }),

        categoryId: new FormControl('', {
          nonNullable: true,
          validators: zod.required(),
        }),

        conditionType: new FormControl(ConditionType.Used, {
          nonNullable: true,
          validators: zod.required(),
        }),

        title: new FormControl('', {
          nonNullable: true,
          validators: zod.required(),
        }),

        description: new FormControl('', {
          nonNullable: true,
          validators: [zod.required(), zod.maxLength(4000)],
        }),

        forDisabledPerson: new FormControl(false, {
          nonNullable: true,
          validators: zod.required(),
        }),

        price: new FormControl(0, {
          nonNullable: true,
          validators: zod.required(),
        }),

        currencyType: new FormControl(CurrencyType.GEL, {
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

        cityId: new FormControl('', {
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

        promoType: new FormControl(PromoType.VIP, {
          validators: zod.required(),
        }),

        promoDays: new FormControl('Choose day', {
          nonNullable: true,
          validators: zod.required(),
        }),

        isColored: new FormControl(false, {
          nonNullable: true,
          validators: zod.required(),
        }),

        colorDays: new FormControl(0, {
          nonNullable: true,
          validators: zod.required(),
        }),

        autoRenewal: new FormControl(false, {
          nonNullable: true,
          validators: zod.required(),
        }),

        autoRenewalOnceIn: new FormControl(1, {
          nonNullable: true,
          validators: zod.required(),
        }),

        autoRenewalAtTime: new FormControl(0, {
          nonNullable: true,
          validators: zod.required(),
        }),
      })
    )
  }

  public toggleEnglish(): void {
    this.isEnglishOpen.update((v) => !v)
  }

  public toggleRussian(): void {
    this.isRussianOpen.update((v) => !v)
  }

  public onSubmit(): void {
    this.adForm.submit(() => {
      console.log(this.adForm.getValues())
    })
  }

  public onCardSelect(index: PromoType): void {
    const control = this.adForm.getControl('promoType')

    if (control.value === index) {
      control.setValue(null)
      return
    }

    const startPrice = this.promoService()?.find((v) => v.type === index)?.price[0]
    if (!startPrice) return

    this.totalPrice()[0] = startPrice

    control.setValue(index)
  }

  private dayLabel(count: number): string {
    if (count === 1) {
      return this.ts.translate('addPost.days.one', { count })
    }
    return this.ts.translate('addPost.days.other', { count })
  }

  private days(from: number, to: number): DropdownEl[] {
    return Array.from({ length: to - from + 1 }, (_, i) => {
      const count = from + i
      return {
        value: count,
        name: this.dayLabel(count),
      }
    })
  }

  private rangeLabel(from: number, to: number, price: number): string {
    return this.ts.translate('addPost.dayRange', { from, to, price })
  }

  public vipDays(): DropdownEl[] {
    return [
      {
        value: null,
        name: this.rangeLabel(1, 30, 2.5),
      },
      ...this.days(1, 30),
    ]
  }

  public vipPlusDays(): DropdownEl[] {
    return [
      { value: null, name: this.rangeLabel(1, 4, 4) },
      ...this.days(1, 4),
      { value: null, name: this.rangeLabel(5, 8, 3.5) },
      ...this.days(5, 8),
      { value: null, name: this.rangeLabel(9, 16, 3.15) },
      ...this.days(9, 16),
      { value: null, name: this.rangeLabel(17, 30, 3) },
      ...this.days(17, 30),
    ]
  }

  public superVipDays(): DropdownEl[] {
    return [
      { value: null, name: this.rangeLabel(1, 4, 9) },
      ...this.days(1, 4),
      { value: null, name: this.rangeLabel(5, 8, 8.5) },
      ...this.days(5, 8),
      { value: null, name: this.rangeLabel(9, 16, 7.5) },
      ...this.days(9, 16),
      { value: null, name: this.rangeLabel(17, 30, 7) },
      ...this.days(17, 30),
    ]
  }
}
