<script>
    import "../app.css";

    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import CartModal from "$lib/components/CartModal.svelte";

    import { initAuth } from "$lib/authStore.svelte.js";
    import { onMount } from "svelte";

    import { page } from "$app/state";

    let { children } = $props();

    onMount(() => {
        initAuth();
    });

    const isAdminRoute = $derived(page.url.pathname.startsWith("/admin"));
</script>

{#if !isAdminRoute}
    <Header />
{/if}

{@render children()}

{#if !isAdminRoute}
    <Footer />
{/if}

<CartModal />
