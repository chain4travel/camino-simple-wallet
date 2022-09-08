<template>
    <div class="content__item">
        <label class="content__item--label">{{ label }}</label>
        <span class="content__item--span"><slot /></span>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
export default {
    name: 'DisplayCard',
    props: {
        label: {
            type: String,
            default: '',
        },
    },
}
</script>
<style lang="scss" scoped>
.content {
    &__item {
        display: flex;
        flex-direction: column;
        text-align: left;
        background: var(--bg-light-2);
        border-radius: var(--border-radius-lg);
        padding: 20px;
        gap: 10px;
        &--label {
            text-transform: uppercase;
            margin-bottom: initial !important;
            color: var(--text-color);
        }
    }
}
</style>
