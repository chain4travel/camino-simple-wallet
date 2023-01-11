<template>
    <div class="dashboard">
        <div class="content">
            <div class="alignment_explenantion">
                <span>{{ $t('verifyAddress.alignment.top_desc1') }}</span>
                <span>{{ $t('verifyAddress.alignment.top_desc2') }}</span>
                <span>{{ $t('verifyAddress.alignment.top_desc3') }}</span>
            </div>
            <router-link to="/verifyaddress/mnemonic" class="menu_option button_secondary">
                <span>
                    {{ $t('verifyAddress.but_mnemonic') }}
                </span>
            </router-link>
            <span class="disclamer">{{ $t('verifyAddress.alignment.bottom_desc1') }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import DefaultLayout from '../../layout/DefaultLayout.vue'
import DisplayCard from '../../components/wallet/DisplayCard.vue'

@Component({
    components: {
        DefaultLayout,
        DisplayCard,
    },
})
export default class VerifyAddress extends Vue {
    status = false
}
</script>
<style scoped lang="scss">
@use '../../styles/main';
@use '/src/components/Access/menu';

.menu_option {
    display: flex;
    align-items: center;
    justify-content: center;
}
.v-icon {
    color: var(--icon-color-light);
}
.alignment_explenantion {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    margin-bottom: 20px;
    line-height: 20px;
    gap: 18px;
    color: var(--primary-color);
    text-align: left;

    text-align: left;
    background-color: var(--bg-light-2);
    border-radius: var(--border-radius-sm);
    margin-bottom: 30px;
    font-size: 18px !important;
    padding: 25px;
    font-weight: 500;
    line-height: 1.5;

    a {
        color: var(--secondary-color) !important;
    }
}

.disclamer {
    font-weight: 700;
}

.dashboard {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 50px;
    margin-bottom: 50px;
    gap: 40px;
    width: 100vw;
    .content {
        display: flex;
        flex-direction: column;
        gap: 20px;
        min-width: 300px;
        width: 600px;
    }
    .content__item {
        .button_secondary {
            width: 100%;
            height: 48px;
            padding: 12px 20px;
            border-radius: var(--border-radius-lg);
        }
    }
}

.header-title {
    display: flex;
    align-items: center;
    color: var(--primary-color);
    gap: 10px;
    font-size: 44px;
    font-weight: 700;
    line-height: 47px;
}

.item_balance {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 30px;
    .balance {
        display: inline-block;
        word-wrap: break-word;
        width: 100%;
    }
}

@include main.medium-device {
    .content {
        max-width: 100%;
    }
}

@include main.mobile-device {
    .dashboard {
        margin-top: 0;
    }
    .content {
        padding: 12px;
        max-width: 100%;
    }
    .item_balance {
        max-width: calc(90% - 32px) !important;
    }
    .header-title {
        font-size: 33px;
        flex-direction: column;
        span {
            text-align: center;
        }
    }
}
</style>
