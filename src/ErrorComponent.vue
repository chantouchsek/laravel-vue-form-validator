<template>
    <div v-if="$errors.has(input)" class="alert-error" :class="inputClass">
        {{ $errors.first(input) }}
    </div>
</template>
<script>
  export default {
    props: ['input', 'inputClass']
  }
</script>
