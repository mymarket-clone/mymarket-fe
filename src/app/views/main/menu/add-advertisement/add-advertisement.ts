import { AddAdvertisementService } from './../../../../services/views/add-advertisement.service'
import { Dropdown } from './../../../../components/dropdown/dropdown'
import { Zod } from '../../../../utils/Zod'
import { Component, computed, effect, OnDestroy, signal } from '@angular/core'
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
import { DropdownEl, WithName } from '../../../../types/DropdownEl'
import { Checkbox } from '../../../../components/checkbox/checkbox'
import { mapEnumToDropdown } from '../../../../helpers/mapEnumToDropdown'
import { ApiService } from '../../../../services/http/api.service'
import { Button } from '../../../../components/button/button'
import { Router } from '@angular/router'
import { scrollToFirstElement } from '../../../../utils/ScrollToFirstElement'

type PreviewFile = { file: File; url: string }

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
    Checkbox,
    Button,
  ],
})
export class AddAdvertisement implements OnDestroy {
  public isEnglishOpen = signal<boolean>(false)
  public isRussianOpen = signal<boolean>(false)
  public totalPrice = signal<number[]>([0, 0])
  public firstInvalidControl = signal<string | null>(null)
  public files = signal<PreviewFile[] | null>(null)

  public addPostState?: ReturnType<ApiService['addPost']>

  public constructor(
    private readonly zod: Zod,
    private readonly apiService: ApiService,
    private readonly router: Router,
    public readonly addAd: AddAdvertisementService,
    public readonly adForm: FormService<IAddPostForm>,
    public readonly ts: TranslocoService
  ) {
    this.adForm.setForm(
      new FormGroup<IAddPostForm>({
        postType: new FormControl(PostType.Sell, {
          nonNullable: true,
          validators: zod.required(),
        }),
        categoryId: new FormControl(null, {
          validators: zod.required(),
        }),
        conditionType: new FormControl(ConditionType.Used, {
          nonNullable: true,
          validators: zod.required(),
        }),
        images: new FormControl(null, {
          validators: zod.required(),
        }),
        mainImage: new FormControl(null, {
          validators: zod.required(),
        }),
        youtubeLink: new FormControl(null),
        title: new FormControl(null, {
          validators: zod.required(),
        }),
        description: new FormControl(null, {
          validators: zod.maxLength(4000),
        }),
        titleEn: new FormControl(null),
        descriptionEn: new FormControl(null, {
          validators: zod.maxLength(4000),
        }),
        titleRu: new FormControl(null),
        descriptionRu: new FormControl(null, {
          validators: zod.maxLength(4000),
        }),
        forDisabledPerson: new FormControl(false, {
          nonNullable: true,
          validators: zod.required(),
        }),
        price: new FormControl(null, {
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
        cityId: new FormControl(null, {
          validators: zod.required(),
        }),
        name: new FormControl(null, {
          validators: zod.required(),
        }),
        phoneNumber: new FormControl(null, {
          validators: zod.required(),
        }),
        userId: new FormControl(null),
        promoType: new FormControl(null),
        promoDays: new FormControl(null),
        isColored: new FormControl(false, {
          nonNullable: true,
          validators: zod.required(),
        }),
        colorDays: new FormControl(null),
        autoRenewal: new FormControl(false, {
          nonNullable: true,
          validators: zod.required(),
        }),
        autoRenewalOnceIn: new FormControl(null),
        autoRenewalAtTime: new FormControl(0, {
          nonNullable: true,
          validators: zod.required(),
        }),
      })
    )

    effect(() => this.syncColoredDaysToColored())
    effect(() => this.syncColoredToDays())
    effect(() => this.syncAutoRenewalToAutoRenewalOnceIn())
    effect(() => this.syncAutoRenewalOnceInToAutoRenewal())
    effect(() => this.syncPriceToPriceNegotiable())
    effect(() => this.dynamicTitleValidators())
    effect(() => this.syncColor())
    effect(() => this.syncPromoTypeToDays())
    effect(() => (this.addAd.title = this.adForm.getControlSignal('title')() as string))
  }

  public ngOnDestroy(): void {
    this.addAd.reset()
  }

  public toggleEnglish(): void {
    this.isEnglishOpen.update((v) => !v)
  }

  public toggleRussian(): void {
    this.isRussianOpen.update((v) => !v)
  }

  public onSubmit(): void {
    this.adForm.submit({
      onSuccess: () => {
        this.addPostState = this.apiService.addPost({
          form: this.adForm.form,
          formData: this.adForm.getFormData(),
          onSuccess: () => this.router.navigate(['/']),
        })
      },
      onFailure: () => scrollToFirstElement('.has-error'),
    })
  }

  public onCardSelect(index: PromoType): void {
    const control = this.adForm.getControl('promoType')

    if (control.value === index) {
      control.setValue(null)
      this.addAd.selectedService = null
      return
    }

    this.addAd.selectedService = index

    const startPrice = this.promoService?.find((v) => v.type === index)?.price[0]
    if (!startPrice) return

    this.totalPrice.update((tp) => [startPrice, tp[1]])
    control.setValue(index)
  }

  public calculatePrice(
    selectedValue: number,
    fullList: DropdownEl[]
  ): { finalPrice: number; salePrice: number } | null {
    if (selectedValue == null) return null

    const matched = fullList.find(
      (item): item is WithName & { value: number; id: number } =>
        typeof item.value === 'number' && item.value === selectedValue
    )

    if (!matched) return null

    const finalPricePerDay = matched.id
    const salePricePerDay = Number((fullList[1] as WithName).id)

    const finalPrice = finalPricePerDay * selectedValue
    const salePrice = salePricePerDay * selectedValue

    return { finalPrice, salePrice }
  }

  public onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (!input.files || input.files.length === 0) return

    const newFiles = Array.from(input.files)
    const newPreviews: PreviewFile[] = newFiles.map((f) => ({ file: f, url: URL.createObjectURL(f) }))

    const current = this.files() ?? []
    const all = [...current, ...newPreviews]

    this.adForm.getControl('images').setValue(all.map((p) => p.file))

    if (!this.adForm.getControl('mainImage').value) {
      this.adForm.getControl('mainImage').setValue(all[0].file)
      this.addAd.mainImage = all[0].file
    }

    this.files.set(all)
    input.value = ''
  }

  public handleDeleteImage(index: number): void {
    this.files.update((current) => {
      if (!current) return null

      const removed = current[index]
      // revoke URL
      try {
        URL.revokeObjectURL(removed.url)
      } catch {
        /* ignore */
      }

      const updated = current.filter((_, i) => i !== index)

      const mainImage = this.adForm.getControl('mainImage').value as File | null
      if (mainImage && index === current.findIndex((p) => p.file === mainImage)) {
        this.adForm.getControl('mainImage').setValue(null)
        this.addAd.mainImage = null

        if (updated.length > 0) {
          this.adForm.getControl('mainImage').setValue(updated[0].file)
          this.addAd.mainImage = updated[0].file
        }
      }

      this.adForm.getControl('images').setValue(updated.map((p) => p.file))

      return updated.length > 0 ? updated : null
    })
  }

  public handleMainImage(index: number): void {
    this.files.update((current) => {
      if (!current || index >= current.length) return current

      const clicked = current[index]
      const updated = [clicked, ...current.filter((_, i) => i !== index)]

      this.adForm.getControl('mainImage').setValue(clicked.file)
      this.addAd.mainImage = clicked.file
      this.adForm.getControl('images').setValue(updated.map((p) => p.file))

      return updated
    })
  }

  public get finalPrice(): number | undefined {
    return Number(
      this.calculatePrice(
        this.adForm.getControl('promoDays').value!,
        this.promoDaysList()
      )?.finalPrice?.toFixed(2)
    )
  }

  public get salePrice(): number | undefined {
    return Number(
      this.calculatePrice(
        this.adForm.getControl('promoDays').value!,
        this.promoDaysList()
      )?.salePrice?.toFixed(2)
    )
  }

  public get colorPrice(): number | undefined {
    return Number(
      this.calculatePrice(this.adForm.getControl('colorDays').value!, this.color)?.finalPrice?.toFixed(2)
    )
  }

  public get promoService(): PromoService[] {
    return [
      {
        type: PromoType.VIP,
        title: 'VIP',
        features: [this.ts.translate('addPost.vipLabel')],
        price: [2.5],
        iconSrc: 'assets/vip.svg',
        color: 'text-blue-gradient',
        bg: 'rgb(0, 106, 255)',
      },
      {
        type: PromoType.VIP_PLUS,
        title: 'VIP+',
        features: [this.ts.translate('addPost.vipPlusLabel'), this.ts.translate('addPost.vipPlusLabel2')],
        price: [4, 3.5, 3.15],
        iconSrc: 'assets/vip-plus.svg',
        color: 'text-yellow-gradient',
        bg: 'rgb(254, 201, 0)',
      },
      {
        type: PromoType.SUPER_VIP,
        title: 'SUPER VIP',
        features: [this.ts.translate('addPost.vipSuperLabel'), this.ts.translate('addPost.vipSuperLabel2')],
        price: [9, 8, 7.5],
        iconSrc: 'assets/super-vip.svg',
        color: 'text-orange-gradient',
        bg: 'rgb(253, 65, 0)',
      },
    ]
  }

  public get autoRenewalPrice(): number | undefined {
    return Number(
      this.calculatePrice(
        this.adForm.getControl('autoRenewalOnceIn').value!,
        this.color
      )?.finalPrice?.toFixed(2)
    )
  }

  public get currencyTypeOptions(): DropdownEl[] {
    return mapEnumToDropdown(CurrencyType)
  }

  public get postTypeItems(): Record<PostType, string> {
    return {
      [PostType.Sell]: this.ts.translate('addPost.sell'),
      [PostType.Buy]: this.ts.translate('addPost.buy'),
      [PostType.Rent]: this.ts.translate('addPost.rent'),
      [PostType.Service]: this.ts.translate('addPost.services'),
    }
  }

  public get postTypeValues(): PostType[] {
    return Object.values(PostType).filter((v) => typeof v === 'number') as PostType[]
  }

  public get conditionTypeItems(): Record<ConditionType, string> {
    return {
      [ConditionType.Used]: this.ts.translate('addPost.used'),
      [ConditionType.New]: this.ts.translate('addPost.new'),
      [ConditionType.LikeNew]: this.ts.translate('addPost.likeNew'),
      [ConditionType.ForParts]: this.ts.translate('addPost.forParts'),
    }
  }

  public get conditionTypeValues(): ConditionType[] {
    return Object.values(ConditionType).filter((v) => typeof v === 'number') as ConditionType[]
  }

  public get vipDays(): DropdownEl[] {
    return [
      {
        value: null,
        labeledProp: this.rangeLabel(1, 30, 2.5),
      },
      ...this.days(1, 30, 2.5),
    ]
  }

  public get vipPlusDays(): DropdownEl[] {
    return [
      { value: null, labeledProp: this.rangeLabel(1, 4, 4) },
      ...this.days(1, 4, 4),
      { value: null, labeledProp: this.rangeLabel(5, 8, 3.5) },
      ...this.days(5, 8, 3.5),
      { value: null, labeledProp: this.rangeLabel(9, 16, 3.15) },
      ...this.days(9, 16, 3.15),
      { value: null, labeledProp: this.rangeLabel(17, 30, 3) },
      ...this.days(17, 30, 3),
    ]
  }

  public get superVipDays(): DropdownEl[] {
    return [
      { value: null, labeledProp: this.rangeLabel(1, 4, 9) },
      ...this.days(1, 4, 9),
      { value: null, labeledProp: this.rangeLabel(5, 8, 8) },
      ...this.days(5, 8, 8),
      { value: null, labeledProp: this.rangeLabel(9, 16, 7.5) },
      ...this.days(9, 16, 7.5),
      { value: null, labeledProp: this.rangeLabel(17, 30, 7.1) },
      ...this.days(17, 30, 7),
    ]
  }

  public get color(): DropdownEl[] {
    return [
      { value: null, labeledProp: this.rangeLabel(1, 8, 0.3) },
      ...this.days(1, 8, 0.3),
      { value: null, labeledProp: this.rangeLabel(9, 16, 0.27) },
      ...this.days(9, 16, 0.27),
      { value: null, labeledProp: this.rangeLabel(17, 30, 0.25) },
      ...this.days(17, 30, 0.25),
    ]
  }

  public get renewal(): DropdownEl[] {
    return [{ value: null, labeledProp: this.rangeLabel(1, 30, 0.25) }, ...this.days(1, 30, 0.25)]
  }

  public get time(): DropdownEl[] {
    return Array.from({ length: 24 }, (_, hour) => ({
      value: hour,
      name: `${hour.toString().padStart(2, '0')}:00`,
    }))
  }

  public showPriceFinal = computed(() => {
    const promoDays = Number(this.adForm.getControlSignal('promoDays')())
    const colorDays = Number(this.adForm.getControlSignal('colorDays')())
    const renewalDays = Number(this.adForm.getControlSignal('autoRenewalOnceIn')())

    const promo = Number.isFinite(promoDays) ? this.calculatePrice(promoDays, this.promoDaysList()) : null
    const color = Number.isFinite(colorDays) ? this.calculatePrice(colorDays, this.color) : null
    const renewal = Number.isFinite(renewalDays) ? this.calculatePrice(renewalDays, this.color) : null

    const promoPrice = promo?.finalPrice ?? 0
    const colorPrice = color?.finalPrice ?? 0
    const renewalPrice = renewal?.finalPrice ?? 0

    return promoPrice + colorPrice + renewalPrice
  })

  public showPriceSale = computed(() => {
    const promoDays = Number(this.adForm.getControlSignal('promoDays')())
    const colorDays = Number(this.adForm.getControlSignal('colorDays')())
    const renewalDays = Number(this.adForm.getControlSignal('autoRenewalOnceIn')())

    const promo = Number.isFinite(promoDays) ? this.calculatePrice(promoDays, this.promoDaysList()) : null
    const color = Number.isFinite(colorDays) ? this.calculatePrice(colorDays, this.color) : null
    const renewal = Number.isFinite(renewalDays) ? this.calculatePrice(renewalDays, this.color) : null

    const promoPrice = promo?.salePrice ?? 0
    const colorPrice = color?.salePrice ?? 0
    const renewalPrice = renewal?.salePrice ?? 0

    return promoPrice + colorPrice + renewalPrice
  })

  public promoDaysList = computed(() => {
    switch (this.adForm.getControlSignal('promoType')()) {
      case PromoType.VIP:
        return this.vipDays
      case PromoType.VIP_PLUS:
        return this.vipPlusDays
      case PromoType.SUPER_VIP:
        return this.superVipDays
      default:
        return []
    }
  })

  public determineColor(): string {
    switch (this.addAd.selectedService) {
      case 1: {
        return 'rgb(74, 108, 250)'
      }
      case 2: {
        return 'rgb(254, 201, 0)'
      }
      case 3: {
        return 'rgb(255, 100, 31)'
      }
      default: {
        return 'rgb(147, 149, 155)'
      }
    }
  }

  public cancel(): void {
    this.router.navigate(['/'])
  }

  private dayLabel(count: number): string {
    if (count === 1) return this.ts.translate('addPost.days.one', { count })
    return this.ts.translate('addPost.days.other', { count })
  }

  private days(from: number, to: number, price: number): DropdownEl[] {
    return Array.from({ length: to - from + 1 }, (_, i) => {
      const count = from + i
      return {
        value: count,
        name: this.dayLabel(count),
        id: price,
      }
    })
  }

  private rangeLabel(from: number, to: number, price: number): string {
    return this.ts.translate('addPost.dayRange', { from, to, price })
  }

  private syncColoredToDays(): void {
    if (this.adForm.getControlSignal('isColored')()) {
      this.adForm.getControl('colorDays').setValue(this.adForm.getControl('colorDays').value ?? 1)
    } else {
      this.adForm.getControl('colorDays').setValue(null)
    }
  }

  private syncColoredDaysToColored(): void {
    if (this.adForm.getControlSignal('colorDays')()) {
      this.adForm.getControl('isColored').setValue(true)
    }
  }

  private syncAutoRenewalToAutoRenewalOnceIn(): void {
    if (this.adForm.getControlSignal('autoRenewal')()) {
      this.adForm
        .getControl('autoRenewalOnceIn')
        .setValue(this.adForm.getControl('autoRenewalOnceIn').value ?? 1)
    } else {
      this.adForm.getControl('autoRenewalOnceIn').setValue(null)
    }
  }

  private syncAutoRenewalOnceInToAutoRenewal(): void {
    if (this.adForm.getControlSignal('autoRenewalOnceIn')()) {
      this.adForm.getControl('autoRenewal').setValue(true)
    }
  }

  private syncPriceToPriceNegotiable(): void {
    const price = this.adForm.getControl('price')
    const isNegotiable = this.adForm.getControlSignal('isNegotiable')()

    if (isNegotiable) {
      price.clearValidators()
      price.setValue(null)
      price.setErrors(null)
    } else {
      price.setValidators(this.zod.required())
    }

    price.updateValueAndValidity({ emitEvent: false })
  }

  private syncPromoTypeToDays(): void {
    const promoType = this.adForm.getControlSignal('promoType')()
    if (promoType != null) {
      this.adForm.getControl('promoDays').setValue(this.adForm.getControl('promoDays').value ?? 1)
    } else {
      this.adForm.getControl('promoDays').setValue(null)
    }
  }

  private dynamicTitleValidators(): void {
    const titleEn = this.adForm.getControl('titleEn')!
    const descriptionEn = this.adForm.getControl('descriptionEn')!
    const titleRu = this.adForm.getControl('titleRu')!
    const descriptionRu = this.adForm.getControl('descriptionRu')!

    if (this.isEnglishOpen()) {
      titleEn.setValidators(this.zod.required())
    } else {
      titleEn.clearValidators()
      titleEn.setValue(null)
      descriptionEn.setValue(null)
    }

    if (this.isRussianOpen()) {
      titleRu.setValidators(this.zod.required())
    } else {
      titleRu.clearValidators()
      titleRu.setValue(null)
      descriptionRu.setValue(null)
    }

    titleEn.updateValueAndValidity({ emitEvent: false })
    titleRu.updateValueAndValidity({ emitEvent: false })
  }

  private syncColor(): void {
    const isColored = this.adForm.getControlSignal('isColored')()

    if (isColored) {
      this.addAd._colorSelected.set(true)
    } else {
      this.addAd._colorSelected.set(false)
    }
  }
}
