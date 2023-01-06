<template>
    <DefaultLayout>
        <div class="dashboard">
            <div class="header-title">
                <img src="@/assets/logo.svg" />
                <span>Camino Address Alignment</span>
            </div>
            <div class="content">
                <div class="alignment_explenantion">
                    <span>
                        Camino heavily extends Avalanche's capabilities to fullfil the needs fot the
                        travel industry, like introducing a blockchain-based KYC service, enabling
                        multisignature funds management and allowing a consortium to exist on a
                        layer-1 blockchain.
                    </span>
                    <span>
                        To ensure the utmost security and safety, as well as fonctionality of the
                        network, diffrent addresses need to be aigned.
                    </span>
                    <span>To do this, please login using you keyphrase below.</span>
                </div>
                <router-link to="/verifyaddress/mnemonic/" class="menu_option button_primary">
                    {{ $t('access.but_mnemonic') }}
                    <v-icon>mdi-list-box-outline</v-icon>
                </router-link>
            </div>
        </div>
    </DefaultLayout>
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
    justify-content: space-between;
    align-items: center;
    img {
        width: 24px;
        height: 24px;
        margin: 0;
        object-fit: contain;
    }
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
    gap: 15px;
    color: var(--primary-color);
    & > span {
        font-size: 16px;
        font-weight: 500;
    }
    a {
        color: var(--secondary-color) !important;
    }
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
