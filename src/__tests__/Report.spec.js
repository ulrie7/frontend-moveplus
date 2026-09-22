import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Report from '../views/admin/Report.vue'

describe('Report', () => {
  it('ferme le panneau quand l’icône fermer est cliquée', async () => {
    const push = vi.fn()
    const close = vi.fn()

    const wrapper = mount(Report, {
      global: {
        mocks: {
          $router: { push },
        },
      },
    })
    wrapper.vm.$on?.('close', close)

    await wrapper.find('button[aria-label="Fermer les rapports"]').trigger('click')

    expect(push).toHaveBeenCalledWith('/dashboard')
  })
})
