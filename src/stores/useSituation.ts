import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useSituationStore = defineStore('situation', () => {
    const orgIdList = ref<string[]>()

    return {
        orgIdList
    }
})
