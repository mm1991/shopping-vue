import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        good_list: [],
        added: []
    },
    getters: {
        cartProducts: state => {
            return state.added.map(({gid, amount}) => {
                let product = state.good_list.find(item => item.gid == gid);
                return {
                    gid: product.gid,
                    name: product.name,
                    price: product.price.toFixed(2),
                    amount: amount,
                    total_num: (product.price * amount).toFixed(2)
                };
            });
        },

        // 计算总价
        totalPrice: (state, getters) => {
            let total = 0;
            getters.cartProducts.forEach(item => {
                total += item.price * item.amount;
            });
            return total.toFixed(2);
        },

        // 计算总数量
        totalNum: (state, getters) => {
            let total = 0;
            getters.cartProducts.forEach(item => {
                total += item.amount;
            });
            return total;
        }
    },
    mutations: {
        SET_GOOD_GOODLIST(state, data) {
            state.good_list = data;
        },
        // 加入购物车
        ADD_TO_CART(state, gid) {
            let record = state.added.find(item => item.gid === gid);
            if (!record) {
                state.added.push({
                    gid,
                    amount: 1
                });
            }
            else {
                record.amount++;
            }
        },

        // 购物车商品数量改变
        NUM_CHANGE(state, {gid, value}) {
            state.added.forEach((item, index) => {
                if (item.gid == gid) {
                    item.amount = value;
                }

            });
        },

        // 删除购物车的指定的商品
        DELETE(state, product) {
            state.added.forEach((item, index) => {
                if (item.gid == product.gid) {
                    // 找到index的下标值
                    state.added.splice(index, 1);
                }

            });
        },

        // 清空购物车
        CLEAR(state) {
            state.added = [];
        }
    },
    actions: {
    },
    modules: {
    }
});
