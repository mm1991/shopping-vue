<template>
  	<div>
  		<layout page="home"></layout>
    </div>
</template>

<script>
import layout from '../components/layout';
import {$http} from '../utils/fetch';
import { mapMutations } from 'vuex';

export default {
	name: 'home',
  	data() {
		return {
		}
	},
  components: {
    layout
  },
	methods: {
		...mapMutations([
            'SET_GOOD_GOODLIST'
        ]),
    },
    async created(){
		let result;
        try {
			result = await $http('http://127.0.0.1:3333/getGoods');
		} catch (e) {
			console.log(e);
			return;
		}
		if (result && result.errno === 0 && result.data) {
			this['SET_GOOD_GOODLIST'](result.data);
		}
    }
}
</script>

<style scoped>

</style>
