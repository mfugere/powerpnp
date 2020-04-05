import { shallowMount } from "@vue/test-utils"
import Menu from "@/components/Menu.vue"

describe("Menu.vue", () => {
  it("is a Vue instance", () => {
    const wrapper = shallowMount(Menu)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
