<script lang="ts">
	import '../app.css';
	import "@ibm/plex-sans-kr/css/ibm-plex-sans-kr-all.css"

	let { children } = $props();
</script>

{@render children()}

<style>
	:global(body) {
		font-family: "IBM Plex Sans KR", "Pretendard Variable", "Pretendard", "Noto Sans CJK KR", "Noto Sans KR", sans-serif;
		font-weight: 500;
	}

</style>
