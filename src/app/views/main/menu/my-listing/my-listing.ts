import {
  Component,
  computed,
  effect,
  signal,
  TemplateRef,
  viewChild,
  ChangeDetectionStrategy,
  ViewContainerRef,
} from '@angular/core'
import { Grid } from '@app/components/grid/grid'
import { ColumnsType } from '@app/types/ColumnsType'
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { ApiService } from '@app/services/http/api.service'
import { IHttpService } from '@app/interfaces/common/IHttpService'
import { IMyPost } from '@app/interfaces/response/IMyPost'
import { HttpMethod } from '@app/types/enums/HttpMethod'
import { PostStatus } from '@app/types/enums/PostStatus'
import { Utils } from '@app/utils/Utils'
import { IMyPostItem } from '@app/interfaces/response/IMyPostItem'
import { SvgIconComponent } from 'angular-svg-icon'
import dayjs from 'dayjs'
import { NgTemplateOutlet } from '@angular/common'
import { TemplatePortal } from '@angular/cdk/portal'
import { PortalService } from '@app/services/portal.service'

type ModalState = {
  message: string
  action: () => void
  loading?: () => boolean
} | null

@Component({
  selector: 'my-listing',
  templateUrl: 'my-listing.html',
  imports: [Grid, TranslocoPipe, SvgIconComponent, NgTemplateOutlet, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      ::ng-deep .pt-green > svg-icon svg circle {
        fill: #0ec604;
      }

      ::ng-deep .pt-yellow > svg-icon svg path {
        fill: #fec900 !important;
      }
    `,
  ],
})
export class MyListing {
  public product = viewChild.required<TemplateRef<unknown>>('product')
  public edit = viewChild.required<TemplateRef<unknown>>('edit')
  public promoServices = viewChild.required<TemplateRef<unknown>>('promoServices')
  public confirmModal = viewChild.required<TemplateRef<unknown>>('confirmModal')

  public modal = signal<ModalState>(null)

  public postStatus = PostStatus
  public postType = signal<PostStatus>(PostStatus.Active)

  public postsState = signal<IHttpService<IMyPost> | null>(null)
  public postDeleteState!: IHttpService<void>
  public postDisableState!: IHttpService<void>

  public initalLoading = signal<boolean>(true)

  public openModal(config: ModalState): void {
    this.modal.set(config)

    const portal = new TemplatePortal(this.confirmModal(), this.vcr)
    this.portalService.open(portal, undefined, true)
  }

  public closeModal(): void {
    this.portalService.close()
    this.modal.set(null)
  }

  public handleConfirm(): void {
    const modal = this.modal()
    if (!modal || modal.loading?.()) return

    modal.action()
  }

  public readonly postStateFilters = computed(() => {
    const data = this.postsState()?.data()

    return [
      {
        status: PostStatus.Active,
        label: 'Active',
        icon: 'assets/pt-active.svg',
        amount: data?.activeCount ?? 0,
      },
      {
        status: PostStatus.Blocked,
        label: 'Blocked',
        icon: 'assets/pt-blocked.svg',
        amount: data?.blocked ?? 0,
      },
      {
        status: PostStatus.InActive,
        label: 'Inactive',
        icon: 'assets/pt-inactive.svg',
        amount: data?.inactiveCount ?? 0,
      },
    ]
  })

  public currentPostState = computed(() => this.postStateFilters().find((f) => f.status === this.postType()))

  public constructor(
    private readonly ts: TranslocoService,
    private readonly apiService: ApiService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly portalService: PortalService,
    private readonly vcr: ViewContainerRef,
    public readonly utils: Utils
  ) {
    const statusParam = this.route.snapshot.queryParamMap.get('status')
    if (statusParam) {
      const statusValue = parseInt(statusParam, 10)
      if (Object.values(PostStatus).includes(statusValue as PostStatus)) {
        this.postType.set(statusValue as PostStatus)
      }
    }

    effect(() => {
      const status = this.postType()

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { status },
        queryParamsHandling: 'merge',
      })

      const request = this.apiService.request({
        endpoint: `posts/my?postStatus=${status}`,
        method: HttpMethod.GET,
        onFinally: () => this.initalLoading.set(false),
      })

      this.postsState.set(request as IHttpService<IMyPost>)
    })
  }

  public openDelete(postId: number): void {
    this.openModal({
      message: 'Are you sure you want to delete?',
      loading: () => this.postDeleteState?.loading(),
      action: () => {
        this.postDeleteState = this.apiService.request({
          method: HttpMethod.DELETE,
          endpoint: `posts/${postId}`,
          onSuccess: () => this.removeFromList(postId),
          onFinally: () => this.closeModal(),
        })
      },
    })
  }

  public openDisable(postId: number, postStatus: PostStatus): void {
    const endpoint = postStatus === PostStatus.Active ? `posts/${postId}/disable` : `posts/${postId}/enable`

    this.openModal({
      message: 'Are you sure you want to change status?',
      loading: () => this.postDisableState?.loading(),
      action: () => {
        this.postDisableState = this.apiService.request({
          method: HttpMethod.POST,
          endpoint,
          onSuccess: () => this.updatePostAfterStatusChange(postId, postStatus),
          onFinally: () => this.closeModal(),
        })
      },
    })
  }

  private removeFromList(postId: number): void {
    const currentData = this.postsState()?.data()
    if (!currentData?.result.items) return

    this.postsState()?.data.set({
      ...currentData,
      result: {
        ...currentData.result,
        items: currentData.result.items.filter((item) => item.id !== postId),
      },
    })
  }

  private updatePostAfterStatusChange(postId: number, previousStatus: PostStatus): void {
    const currentData = this.postsState()?.data()
    if (!currentData) return

    const isActive = previousStatus === PostStatus.Active
    const updatedItems = currentData.result.items.filter((i) => i.id !== postId)

    const nextActiveCount = currentData.activeCount + (isActive ? -1 : 1)
    const nextInactiveCount = currentData.inactiveCount + (isActive ? 1 : -1)

    this.postsState()?.data.set({
      ...currentData,
      activeCount: Math.max(0, nextActiveCount),
      inactiveCount: Math.max(0, nextInactiveCount),
      result: {
        ...currentData.result,
        items: updatedItems,
      },
    })
  }

  public onPostStateChange(state: PostStatus): void {
    if (this.postType() === state) return
    this.postType.set(state)
  }

  public formattedDate(v: Date): string {
    return dayjs(v).format('DD/MM/YYYY')
  }

  public columns = computed((): ColumnsType<IMyPostItem>[] => {
    return [
      {
        title: this.ts.translate('myListing.title'),
        dataIndex: 'title',
        template: this.product(),
        width: 250,
        sorter: (a, b) => a.id - b.id,
      },
      {
        title: this.ts.translate('myListing.price'),
        dataIndex: 'price',
        render: (_, r): string => {
          const currency = this.utils.getCurrencySymbol(r)
          const finalPrice = r.priceAfterDiscount ?? r.price

          if (r.isNegotiable) return 'Price negotiable'

          return `${finalPrice.toFixed(2)} ${currency}`
        },
        sorter: (a, b): number => {
          const getPrice = (r: IMyPostItem): number => {
            if (r.isNegotiable) return -Infinity
            return r.priceAfterDiscount ?? r.price ?? 0
          }

          return getPrice(a) - getPrice(b)
        },
      },
      {
        title: this.ts.translate('myListing.views'),
        dataIndex: 'viewsCount',
        sorter: (a, b) => a.viewsCount - b.viewsCount,
      },
      {
        title: this.ts.translate('myListing.term'),
        dataIndex: 'endDate',
        template: this.edit(),
        sorter: (a, b): number => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0

          return aTime - bTime
        },
      },
    ]
  })
}
