<script>
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import { authStore } from "$lib/authStore.svelte.js";
    import { logout } from "$lib/auth.js";
    import { openCart, getCartCount } from "$lib/cart.svelte.js";
    import logo from "$lib/assets/logo.png";

    let menuAbierto = $state(false);

    async function handleLogout() {
        await logout();
        menuAbierto = false;
        goto("/login");
    }
</script>

<header
    class="sticky top-4 z-40 mx-auto w-[min(92%,1100px)] rounded-[2rem] border border-[#E7B8CF] bg-[#F9DDEB]/90 px-6 py-4 shadow-xl backdrop-blur"
>
    <div class="flex items-center justify-between gap-6">
        <button
            onclick={() => goto("/")}
            class="text-lg font-bold text-[#B94F7F]"
        >
            <a href="/" class="logo">
                <img src={logo} alt="Chucheritas Aralan" class="logo-img" />
            </a>
        </button>

        <nav class="hidden md:flex items-center gap-5 text-sm text-[#6B4259]">
            <button
                onclick={() => goto("/")}
                class:font-bold={page.url.pathname === "/"}
            >
                Inicio
            </button>

            <button
                onclick={() => goto("/catalogo")}
                class:font-bold={page.url.pathname === "/catalogo"}
            >
                Catálogo
            </button>
            <button onclick={openCart}>
                Carrito ({getCartCount()})
            </button>
            {#if authStore.user}
                <button onclick={handleLogout}>Salir</button>
            {:else}
                <button onclick={() => goto("/login")}>Login</button>
            {/if}
        </nav>

        <button
            onclick={() => (menuAbierto = !menuAbierto)}
            class="md:hidden rounded-full border border-[#E7B8CF] px-4 py-2 text-[#4A3140]"
        >
            {menuAbierto ? "✕" : "☰"}
        </button>
    </div>
</header>

{#if menuAbierto}
    <div
        class="fixed inset-0 z-50 bg-black/30"
        onclick={() => (menuAbierto = false)}
    ></div>

    <aside
        class="fixed right-4 top-4 z-50 w-72 rounded-[2rem] border border-[#E7B8CF] bg-[#FFF7FB] p-6 text-[#4A3140] shadow-2xl"
    >
        <div class="flex items-center justify-between">
            <strong>Menú</strong>
            <button onclick={() => (menuAbierto = false)}>✕</button>
        </div>

        <div class="mt-6 grid gap-4">
            <button
                onclick={() => {
                    menuAbierto = false;
                    goto("/");
                }}>Inicio</button
            >
            <button
                onclick={() => {
                    menuAbierto = false;
                    goto("/catalogo");
                }}>Catálogo</button
            >
            <button
                onclick={() => {
                    menuAbierto = false;
                    openCart();
                }}>Carrito ({getCartCount()})</button
            >

            {#if authStore.user}
                <button onclick={handleLogout}>Salir</button>
            {:else}
                <button
                    onclick={() => {
                        menuAbierto = false;
                        goto("/login");
                    }}>Login</button
                >
                <button
                    onclick={() => {
                        menuAbierto = false;
                        goto("/register");
                    }}>Crear cuenta</button
                >
            {/if}
        </div>
    </aside>
{/if}
