import { Zod } from '../../../../utils/Zod'
import { Component, signal } from '@angular/core'
import { FormService } from '../../../../services/form.service'
import { IAddPostForm } from '../../../../interfaces/forms/IAddPostForm'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { PostType } from '../../../../types/enums/PostType'
import { CurrencyType } from '../../../../types/enums/CurrencyType'
import { PromoType } from '../../../../types/enums/PromoType'
import { TranslocoService, TranslocoDirective } from '@jsverse/transloco'
import { Dropdown } from '../../../../components/dropdown/dropdown'
import { ConditionType } from '../../../../types/enums/ConditionType'
import { SelectChipM } from '../../../../components/select-chip/select-ship'
import { SvgIconComponent } from 'angular-svg-icon'
import { Input } from '../../../../components/input/input'
import { NgTemplateOutlet } from '@angular/common'
import { TextEditor } from '../../../../components/text-editor/text-editor'

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
  ],
  styles: [``],
})
export class AddAdvertisement {
  public postTypeItems = signal<Record<PostType, string> | null>(null)
  public postTypeValues = Object.values(PostType).filter((v) => typeof v === 'number')
  public conditionTypeItems = signal<Record<ConditionType, string> | null>(null)
  public conditionTypeValues = Object.values(ConditionType).filter((v) => typeof v === 'number')
  public isEnglishOpen = signal<boolean>(false)
  public isRussianOpen = signal<boolean>(false)

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
}
