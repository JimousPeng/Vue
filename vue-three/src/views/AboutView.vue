<!--
 * @Author: jimouspeng
 * @Date: 2023-03-15 19:29:52
 * @Description: 
 * @FilePath: \vue\vue-three\src\views\AboutView.vue
-->
<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click.stop="increment">点击了：{{count}}</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const count = ref(0);

console.log('====================================');
console.log(count, '9090');
console.log('====================================');

function increment() {
  count.value++
}

onMounted(() => {
  console.log('计数器的初始值：', count.value);
})

</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
