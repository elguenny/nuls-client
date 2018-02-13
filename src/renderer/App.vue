<template>
	<div id="app">
		<!--top start -->
		<Top></Top>
		<!--top end -->
		<transition>
			<router-view></router-view>
		</transition>
		<!--bottom start -->
		<Bottom></Bottom>
		<!--bottom end -->
	</div>
</template>

<script>
	import Top from './components/TopBar.vue'
	import Bottom from './components/BottomBar.vue'

	export default {
		name: 'app',
		components: {
			Top,
			Bottom
		},
		computed: {}
	}
</script>