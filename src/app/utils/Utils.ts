import z, { ZodType } from 'zod'
import { ITreeNode } from '../interfaces/common/ITreeNode'

export class Utils {
  private flattenTree<T>(nodes: ITreeNode<T>[]): ITreeNode<T>[] {
    const flat: ITreeNode<T>[] = []
    const stack: ITreeNode<T>[] = [...nodes]

    while (stack.length) {
      const node = stack.pop()!
      flat.push({ ...node, children: undefined })
      if (node.children) {
        stack.push(...node.children)
      }
    }

    return flat
  }

  public validateTree<T>(payload: unknown, dataSchema: ZodType<T>): boolean {
    try {
      const flatNodes = this.flattenTree(payload as ITreeNode<T>[])
      const FlatNodeSchema = z.object({
        id: z.number(),
        parentId: z.number(),
        data: dataSchema,
      })

      z.array(FlatNodeSchema).parse(flatNodes)

      return true
    } catch {
      return false
    }
  }
}
