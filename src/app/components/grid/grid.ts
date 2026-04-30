import { NgTemplateOutlet } from '@angular/common'
import { Component, computed, input, signal } from '@angular/core'
import { ColumnsType } from '@app/types/ColumnsType'
import { TranslocoPipe } from '@jsverse/transloco'
import { SvgIconComponent } from 'angular-svg-icon'

@Component({
  selector: 'grid',
  templateUrl: 'grid.html',
  imports: [NgTemplateOutlet, SvgIconComponent, TranslocoPipe],
})
export class Grid<T> {
  public columns = input.required<ColumnsType<T>[]>()
  public data = input.required<T[]>()
  public loading = input<boolean>(false)

  public sortState = signal<{
    key: string | null
    direction: 'asc' | 'desc' | null
  }>({
    key: null,
    direction: null,
  })

  public sortedData = computed(() => {
    const data = this.data()
    const { key, direction } = this.sortState()

    if (!key || !direction) return data

    const column = this.columns().find((c) => (c.key ?? c.dataIndex) === key)
    if (!column) return data

    const sorted = [...data]

    sorted.sort((a, b) => {
      if (typeof column.sorter === 'function') {
        return direction === 'asc' ? column.sorter(a, b) : -column.sorter(a, b)
      }

      const aVal = this.resolveValue(a, column)
      const bVal = this.resolveValue(b, column)

      if (aVal == null) return -1
      if (bVal == null) return 1

      if (aVal > bVal) return direction === 'asc' ? 1 : -1
      if (aVal < bVal) return direction === 'asc' ? -1 : 1

      return 0
    })

    return sorted
  })

  public toggleSort(col: ColumnsType<T>): void {
    if (!col.sorter) return

    const key = col.key ?? col.dataIndex!
    const current = this.sortState()

    if (current.key !== key) {
      this.sortState.set({ key, direction: 'asc' })
      return
    }

    if (current.direction === 'asc') {
      this.sortState.set({ key, direction: 'desc' })
      return
    }

    this.sortState.set({ key: null, direction: null })
  }

  public get gridTemplate(): string {
    return this.columns()
      .map((col) => {
        if (col.width == null) return '1fr'
        if (typeof col.width === 'number') return `${col.width}px`
        return col.width
      })
      .join(' ')
  }

  public getCellValue(row: T, col: ColumnsType<T>): T[keyof T] | null {
    if (!col.dataIndex) return null
    return row[col.dataIndex as keyof T]
  }

  public resolveValue(row: T, col: ColumnsType<T>): unknown {
    const raw = this.getCellValue(row, col)
    return col.render ? col.render(raw, row) : raw
  }
}
