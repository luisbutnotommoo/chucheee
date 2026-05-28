<script>
    import { goto } from "$app/navigation";
    import { openCart, getCartCount } from "$lib/cart.svelte.js";
</script>

<section class="min-h-screen bg-[#FFF7FB] text-[#4A3140] overflow-hidden">
    <main
        class="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr]"
    >
        <section>
            <p class="text-xs uppercase tracking-[0.45em] text-[#C76592]">
                Beauty shop
            </p>

            <h1
                class="mt-6 max-w-4xl text-6xl font-thin uppercase leading-[0.95] tracking-[0.12em] md:text-8xl"
            >
                Glow para días icónicos
            </h1>

            <p class="mt-8 max-w-xl text-lg leading-relaxed text-white/55">
                Maquillaje, skincare y chucherías bonitas para armar tu rutina,
                regalar algo lindo o simplemente consentirte porque sí.
            </p>

            <div class="mt-10 flex flex-wrap gap-4">
                <button
                    onclick={() => goto("/catalogo")}
                    class="rounded-full bg-[#F9DDEB] px-8 py-4 text-xs uppercase tracking-[0.25em] text-black transition hover:bg-[#F3C4DA]"
                >
                    Ver catálogo
                </button>

                <button
                    onclick={() => goto("/register")}
                    class="rounded-full border border-pink-200 px-8 py-4 text-xs uppercase tracking-[0.25em] text-[#150e06] transition hover:bg-[#F3C4DA]/10 hover:text-white"
                >
                    Crear cuenta
                </button>
            </div>
        </section>
    </main>
</section>
