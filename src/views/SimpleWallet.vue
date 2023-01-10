<template>
    <DefaultLayout>
        <div class="dashboard">
            <div class="header-title">
                <img src="@/assets/logo.svg" />
                <span>Camino Wallet</span>
            </div>
            <div class="content">
                <DisplayCard label="Balance">
                    <div class="item_inner">
                        <div class="balance_amount">
                            <img src="@/assets/coin.png" />
                            <span>{{ balanceTextLeft }} {{ nativeAssetSymbol }}</span>
                        </div>
                    </div>
                </DisplayCard>
                <DisplayCard label="Address">
                    <div class="item_inner item_balance">
                        <span class="balance">{{ address }}</span>
                        <CopyText :value="address" />
                    </div>
                </DisplayCard>
                <DisplayCard label="kyc Status">
                    <div class="item_inner">
                        <template v-if="loadKycStatus">
                            <span class="loading-span">loading...</span>
                        </template>
                        <template v-else>
                            <template v-if="kycStatus">
                                <div class="success_button">
                                    <v-icon>mdi-check-decagram</v-icon>
                                    {{ $t('kyc_process.kyc_verified') }}
                                </div>
                            </template>
                            <template v-else>
                                <div class="failed_button">
                                    <v-icon>mdi-alert-decagram</v-icon>
                                    {{ $t('kyc_process.kyc_not_verified') }}
                                </div>
                            </template>
                        </template>
                    </div>
                </DisplayCard>
                <DisplayCard label="Save Account">
                    <div class="item_inner">
                        <template v-if="account">
                            <button class="account_but" @click="openSettings">
                                <Identicon
                                    :value="account.baseAddresses.join('')"
                                    diameter="18"
                                ></Identicon>
                                <p>{{ account.name }}</p>
                            </button>
                            <AccountSettingsModal ref="settings_modal"></AccountSettingsModal>
                        </template>
                        <template v-else>
                            <SaveAccountModal ref="save_modal"></SaveAccountModal>
                            <button class="warning_button" @click="save">
                                <fa icon="exclamation-triangle" class="volatile_alert"></fa>
                                {{ $t('keys.save_account.title') }}
                            </button>
                        </template>
                    </div>
                </DisplayCard>
                <div class="content__item">
                    <paper-wallet
                        ref="print_modal"
                        v-if="walletType === 'mnemonic'"
                        :wallet="wallet"
                    ></paper-wallet>
                    <button
                        :disabled="walletType !== 'mnemonic'"
                        @click="viewPrintModal"
                        class="but_primary ava_button button_secondary print--button"
                    >
                        Print keyphrase
                    </button>
                </div>
                <div class="content__item">
                    <ConfirmLogout ref="logout"></ConfirmLogout>
                    <button @click="logout" class="ava_button logout">
                        {{ $t('logout.button') }}
                    </button>
                </div>
            </div>
        </div>
    </DefaultLayout>
</template>
<script lang="ts">
import AvaAsset from '@/js/AvaAsset'
import MnemonicWallet from '@/js/wallets/MnemonicWallet'
import { BN, WalletNameType, WalletType } from '@c4tplatform/camino-wallet-sdk'
import Big from 'big.js'
import { Vue, Component } from 'vue-property-decorator'
import { bnToBig } from '@/helpers/helper'
import { checkVerificationStatus } from '@/kyc_api'
import PaperWallet from '@/components/modals/PaperWallet/PaperWallet.vue'
import { iUserAccountEncrypted } from '@/store/types'
import SaveAccountModal from '@/components/modals/SaveAccount/SaveAccountModal.vue'
import AccountSettingsModal from '@/components/modals/AccountSettings/AccountSettingsModal.vue'
import Identicon from '@/components/misc/Identicon.vue'
import ConfirmLogout from '@/components/modals/ConfirmLogout.vue'
import DefaultLayout from '../layout/DefaultLayout.vue'
import DisplayCard from '../components/wallet/DisplayCard.vue'
import CopyText from '../components/misc/CopyText.vue'
@Component({
    name: 'SimpleWallet',
    components: {
        PaperWallet,
        AccountSettingsModal,
        SaveAccountModal,
        Identicon,
        ConfirmLogout,
        DefaultLayout,
        DisplayCard,
        CopyText,
    },
})
export default class SimpleWallet extends Vue {
    kycStatus = false
    loadKycStatus = true
    isDrawer: boolean = false
    $refs!: {
        // modal: Modal
        print_modal: PaperWallet
        save_modal: SaveAccountModal
        settings_modal: AccountSettingsModal
    }
    openSettings() {
        this.$refs.settings_modal.open()
    }
    logout(): void {
        // @ts-ignore
        this.$refs.logout.open()
        this.isDrawer = false
    }
    save() {
        this.$refs.save_modal.open()
    }
    async created() {
        await this.updateKycStatus()
        this.loadKycStatus = false
    }
    async updateKycStatus() {
        this.kycStatus = await checkVerificationStatus('0x' + this.wallet.ethAddress)
    }
    get wallet() {
        let wallet: MnemonicWallet = this.$store.state.activeWallet
        return wallet
    }
    /*********************  getAccount *********************/
    get account(): iUserAccountEncrypted | null {
        return this.$store.getters['Accounts/account']
    }
    /*********************  getbalance *********************/
    // updateBalance(): void {
    //     this.$store.dispatch('Assets/updateUTXOs')
    //     this.$store.dispatch('History/updateTransactionHistory')
    // }
    // get kycStatus() {}

    get isUpdateBalance(): boolean {
        if (!this.wallet) return true
        return this.wallet.isFetchUtxos
    }
    get ava_asset(): AvaAsset | null {
        let ava = this.$store.getters['Assets/AssetAVA']
        return ava
    }
    get nativeAssetSymbol(): string {
        return this.ava_asset?.symbol ?? ''
    }
    get evmUnlocked(): BN {
        if (!this.wallet) return new BN(0)
        // convert from ^18 to ^9
        let bal = this.wallet.ethBalance
        return bal.div(new BN(Math.pow(10, 9).toString()))
    }

    get totalBalance(): BN {
        if (!this.ava_asset) return new BN(0)

        let tot = this.ava_asset.getTotalAmount()
        // add EVM balance
        tot = tot.add(this.evmUnlocked)
        return tot
    }
    get walletType(): WalletNameType {
        let wallet = this.wallet
        if (!wallet) return 'mnemonic'
        return wallet.type
    }
    get totalBalanceBig(): Big {
        if (this.ava_asset) {
            let denom = this.ava_asset.denomination
            let bigTot = bnToBig(this.totalBalance, denom)
            return bigTot
        }
        return Big(0)
    }
    get balanceText(): string {
        if (this.ava_asset !== null) {
            let denom = this.ava_asset.denomination
            return this.totalBalanceBig.toLocaleString(denom)
        } else {
            return '--'
        }
    }

    get balanceTextLeft(): string {
        // if (this.isUpdateBalance) return '--'
        let text = this.balanceText
        if (text.includes('.')) {
            let left = text.split('.')[0]
            return left
        }
        return text
    }
    get address() {
        try {
            let wallet: MnemonicWallet = this.$store.state.activeWallet
            if (!wallet) return '-'
            // console.log(wallet.getCurrentAddressPlatform())
            return wallet.getCurrentAddressPlatform()
        } catch (e) {
            return '-'
        }
    }
    /*********************  getbalance *********************/
    viewPrintModal() {
        this.$refs.print_modal.open()
    }
}
</script>
<style scoped lang="scss">
@use '../styles/main';
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
        max-width: 100%;
        min-width: 300px;
    }
    .content__item {
        .button_secondary {
            width: 100%;
            height: 48px;
            padding: 12px 20px;
            border-radius: var(--border-radius-lg);
        }
        .access_wallet,
        .logout {
            width: 100%;
            height: 48px;
            padding: 12px 20px;
            background-color: var(--disabled-bg);
            border-radius: var(--border-radius-lg);
        }
    }
}

.header-title {
    display: flex;
    align-items: center;
    color: var(--primary-color);
    gap: 10px;
    font-size: 47px;
    font-weight: 700;
    line-height: 47px;
}
.warning_button {
    text-align: left;
    color: var(--warning);
    svg {
        margin-right: 10px;
    }
    &:hover {
        opacity: 0.5;
    }
}

.account_but {
    //padding: 4px 8px;
    //border-radius: 4px;
    //background-color: var(--bg-light);
    color: var(--primary-color);
    display: flex;
    flex-direction: row;
    align-items: center;
    // justify-content: center;
    text-transform: capitalize;
    width: 100%;
    p {
        text-align: left;
        margin-left: 12px !important;
        width: auto;
        max-width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &:hover {
        opacity: 0.5;
    }
}

.item_balance {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 30px;
    .balance {
        display: inline-block;
        max-width: calc(98% - 32px);
        word-wrap: break-word;
    }
}

.balance_amount {
    display: flex;
    flex-direction: row;
    gap: 10px;
    font-size: 20px;
    font-weight: 700;
    line-height: 24px;
    color: var(--primary-contrast-text);
    align-items: center;
    img {
        width: 20px;
        height: 20px;
    }
}

.loading-span {
    display: flex;
    align-items: center;
    font-weight: 700;
    line-height: 24px;
}

.success_button {
    display: flex;
    align-items: center;
    text-align: left;
    color: var(--success);
    .v-icon {
        color: var(--success);
        margin-right: 4px;
    }
}

.failed_button {
    display: flex;
    align-items: center;
    text-align: left;
    color: var(--error);
    .v-icon {
        color: var(--error);
        margin-right: 4px;
    }
}

@include main.mobile-device {
    .content {
        padding: 12px;
    }
    .item_balance {
        max-width: calc(90% - 32px) !important;
    }
    .header-title {
        flex-direction: column;
        span {
            text-align: center;
        }
    }
}
</style>
