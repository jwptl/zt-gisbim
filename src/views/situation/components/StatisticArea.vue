<script setup lang="ts">

const props = defineProps<{
  title: string
  class?: string
}>()

</script>

<template>
  <div :class="['area p-4', props.class]">
    <div class="flex items-center">
      <div class="font-ysbth text-xl tracking-widest">{{ props.title }}</div>
    </div>
    <div class="line"></div>

    <slot></slot>
  </div>
</template>

<style scoped>
.area {
  background-image: url("@/assets/images/index/area-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 32%;
}

.line {
  width: 100%;
  height: 1px;
  background: #ffffff;
  opacity: .5;
  margin: 0.5rem 0 1rem 0;
}
</style>
