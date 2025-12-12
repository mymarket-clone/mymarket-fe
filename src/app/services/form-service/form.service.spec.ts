import { beforeEach, describe, it, expect } from 'vitest'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { FormService } from './form.service'

interface TestForm {
  name: FormControl<string | null>
  age: FormControl<number | null>
}

describe('FormService', () => {
  let service: FormService<TestForm>
  let form: FormGroup<TestForm>

  beforeEach(() => {
    service = new FormService<TestForm>()

    form = new FormGroup<TestForm>({
      name: new FormControl('', Validators.required),
      age: new FormControl(0, Validators.min(0)),
    })

    service.setForm(form)
  })

  it('should set and get the form', () => {
    expect(service.form).toBe(form)
  })

  it('should get a control by key', () => {
    expect(service.getControl('name')).toBe(form.controls.name)
  })

  it('should mark form as dirty and set submitted', () => {
    service.setSubmitted()
    expect(service.submitted).toBe(true)
    expect(form.dirty).toBe(true)
  })

  it('should reset submitted flag', () => {
    service.setSubmitted()
    service.resetSubmitted()
    expect(service.submitted).toBe(false)
  })
})
