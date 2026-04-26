import { Component, input } from '@angular/core'
import { ColumnsType } from '@app/types/ColumnsType'

@Component({
  selector: 'grid',
  templateUrl: 'grid.html',
})
export class Grid<T> {
  public columns = input.required<ColumnsType<T>[]>()
  public data = input.required<T[]>()

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
}
