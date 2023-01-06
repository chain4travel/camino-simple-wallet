<template>
    <div class="success_body">
        <img src="@/assets/success.svg" alt="" />
        <div class="success_content">
            <h1>Address verification was succefull</h1>
            <span>You may close this window now</span>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
    name: 'Success',
})
export default class Success extends Vue {}
</script>
<style scoped lang="scss">
@use "../../styles/main";
.success_body {
    display: flex;
    gap: 20px;
    align-items: center;
    flex-direction: column;
    text-align: center;
    max-width: 600px;
    img {
        width: 140px;
        height: 140px;
        max-height: none;
    }
}
.success_content {
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: center;
    .v-btn {
        max-width: 350px;
    }
}
</style>
