import type { DirectiveBinding, Directive } from 'vue'
import { usePermissionStore } from '@/stores/permission'
import { intersection } from 'lodash-es'


const auth: Directive = {
    mounted(el: HTMLElement, binding: DirectiveBinding<string[]>) {
        const { value } = binding
        if (value.length) {
            // 取交集后的权限数量是否等于传递的权限数量，判断是否具有权限
            if (intersection(usePermissionStore().permissions, value).length !== value.length) {
                el.parentNode?.removeChild(el)
            }

        } else {
            throw new Error('need auths! Like v-auth="[\'btn:add\',\'btn:edit\']"')
        }
    }
}
export default auth
