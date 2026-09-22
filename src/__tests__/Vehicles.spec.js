import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Vehicles from '../views/admin/Vehicles.vue'

describe('Vehicles', () => {
  it('redirects to the dashboard when the close button is clicked', async () => {
    const push = vi.fn()

    const wrapper = mount(Vehicles, {
      global: {
        mocks: {
          $router: { push },
        },
      },
    })

    await wrapper.find('.btn-close').trigger('click')

    expect(push).toHaveBeenCalledWith('/dashboard')
  })
})
