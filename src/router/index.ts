import Vue from 'vue'
import VueRouter, { Route } from 'vue-router'
import SimpleWallet from '../views/SimpleWallet.vue'
import VerifyAddress from '../views/verify/VerifyAddress.vue'
import AccessVerify from '../views/verify/AccessVerify.vue'
import AccessVerifyAddress from '../views/verify/AccessVerifyAddress.vue'
import MnemonicVerify from '../views/verify/MnemonicVerify.vue'
import Success from '../views/verify/Success.vue'

import Transfer from '@/views/wallet/Transfer.vue'
import ManageKeys from '@/views/wallet/ManageKeys.vue'
import Menu from '../views/access/Menu.vue'
import Mnemonic from '@/views/access/Mnemonic.vue'
import Access from '../views/access/Access.vue'
import Create from '@/views/Create.vue'
import Earn from '@/views/wallet/Earn.vue'
import Advanced from '@/views/wallet/Advanced.vue'
import Activity from '@/views/wallet/Activity.vue'
import Account from '@/views/access/Account.vue' // your vuex store
import Launch from '@/views/wallet/Launch.vue'
import Legal from '@/views/Legal.vue'
import store from '../store/index'
import Studio from '@/views/wallet/Studio.vue'
import Export from '@/views/wallet/CrossChain.vue'
Vue.use(VueRouter)

const ifNotAuthenticated = (to: Route, from: Route, next: Function) => {
    if (!store.state.isAuth) {
        next()
        return
    }
    next('/wallet')
}

const ifAuthenticated = (to: Route, from: Route, next: Function) => {
    if (store.state.isAuth) {
        next()
        return
    }
    next(to.path === '/verifyaddress/verify' ? '/verifyaddress/mnemonic' : '/')
}

const routes = [
    {
        path: '/',
        name: 'home',
        component: Access,
        beforeEnter: ifNotAuthenticated,
    },
    {
        path: '/access',
        children: [
            {
                path: '/',
                name: 'access',
                component: Menu,
            },
            {
                path: 'mnemonic',
                component: Mnemonic,
            },
            {
                path: 'account/:index',
                component: Account,
                name: 'Account',
            },
        ],
        component: Access,
        beforeEnter: ifNotAuthenticated,
    },
    {
        path: '/legal',
        name: 'legal',
        component: Legal,
    },
    {
        path: '/create',
        name: 'create',
        component: Create,
        beforeEnter: ifNotAuthenticated,
    },
    {
        path: '/verifyaddress',
        component: AccessVerify,
        children: [
            {
                path: '/',
                name: 'verifyaddress',
                component: AccessVerifyAddress,
            },
            {
                path: 'mnemonic',
                name: 'mnemonic',
                component: MnemonicVerify,
            },
        ],
        beforeEnter: ifNotAuthenticated,
    },
    {
        path: '/verifyaddress',
        component: AccessVerify,
        children: [
            {
                path: '/verifyaddress/success',
                component: Success,
                beforeEnter: ifAuthenticated,
            },
        ],
        beforeEnter: ifAuthenticated,
    },
    {
        path: '/verifyaddress/verify',
        component: VerifyAddress,
        beforeEnter: ifAuthenticated,
    },
    {
        path: '/wallet',
        children: [
            {
                path: '/',
                name: 'wallet',
                component: SimpleWallet,
            },
            {
                path: 'transfer',
                component: Transfer,
            },
            {
                path: 'cross_chain',
                component: Export,
            },
            {
                path: 'keys',
                component: ManageKeys,
            },
            {
                path: 'earn',
                component: Earn,
            },
            {
                path: 'studio',
                component: Studio,
            },
            {
                path: 'advanced',
                component: Advanced,
            },
            {
                path: 'activity',
                component: Activity,
            },
            {
                path: 'launch',
                component: Launch,
            },
        ],
        component: SimpleWallet,
        beforeEnter: ifAuthenticated,
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
})

export default router
