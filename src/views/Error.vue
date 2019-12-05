<template>
    <div v-if="$validator.has(input)" class="alert-error" :class="inputClass">
        {{ $validator.first(input) }}
    </div>
</template>
<script>
export default {
    props: {
        input: {
            type: String,
            required: true,
        },
        inputClass: {
            type: [String, Object],
            required: false,
        },
    },
    name: 'error-message',
};
</script>
