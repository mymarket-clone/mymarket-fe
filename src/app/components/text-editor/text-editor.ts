import { AfterViewInit, Component, ElementRef, OnDestroy, signal, viewChild } from '@angular/core'
import { BaseInput } from '../../shared/components/base-input'
import { ReactiveFormsModule } from '@angular/forms'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import CharacterCount from '@tiptap/extension-character-count'

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.html',
  imports: [ReactiveFormsModule],
})
export class TextEditor extends BaseInput implements AfterViewInit, OnDestroy {
  public editorEl = viewChild<ElementRef<HTMLElement>>('editorEl')
  public active = signal<Record<string, boolean>>({
    B: false,
    I: false,
    U: false,
  })

  public editor?: Editor
  public readonly maxLength = 4000
  public styleButton = ['B', 'I', 'U']

  public ngAfterViewInit(): void {
    this.editor = new Editor({
      element: this.editorEl()?.nativeElement,
      extensions: [
        StarterKit,
        Underline,
        CharacterCount.configure({
          limit: this.maxLength,
        }),
      ],
      content: '',
      editorProps: {
        attributes: {
          spellcheck: 'false',
          autocorrect: 'off',
          autocomplete: 'off',
          autocapitalize: 'off',
        },
      },
      onUpdate: (): void => {
        this.syncActiveButtons()
        this.control().setValue(this.editor?.getHTML() ?? '', { emitEvent: false })
      },
      onSelectionUpdate: (): void => this.syncActiveButtons(),
    })
  }

  public ngOnDestroy(): void {
    this.editor?.destroy()
  }

  public toggle(key: string): void {
    if (!this.editor) return

    switch (key) {
      case 'B':
        this.editor.chain().focus().toggleBold().run()
        break
      case 'I':
        this.editor.chain().focus().toggleItalic().run()
        break
      case 'U':
        this.editor.chain().focus().toggleUnderline().run()
        break
    }

    this.syncActiveButtons()
  }

  private syncActiveButtons(): void {
    if (!this.editor) return

    this.active.set({
      B: this.editor.isActive('bold'),
      I: this.editor.isActive('italic'),
      U: this.editor.isActive('underline'),
    })
  }

  public getHTML(): string {
    return this.editor?.getHTML() ?? ''
  }

  public setHTML(html: string): void {
    this.editor?.commands.setContent(html)
  }

  public focusEditor(): void {
    this.editor?.commands.focus()
  }

  private get usedChars(): number {
    return this.editor?.storage.characterCount.characters() ?? 0
  }

  public get remainingChars(): number {
    return Math.max(this.maxLength - this.usedChars, 0)
  }
}
