<script>
    import { goto } from "$app/navigation";
</script>

<section
    class="min-h-screen bg-[#FFF7FB] text-[#4A3140] flex items-center justify-center px-6"
>
    <div
        class="w-full max-w-2xl rounded-[2rem] border border-[#E7B8CF] bg-white/80 p-10 text-center shadow-2xl"
    >
        <p class="text-xs uppercase tracking-[0.35em] text-[#C76592]">
            Pedido registrado
        </p>

        <h1 class="mt-5 text-5xl font-thin uppercase tracking-widest">
            Gracias por tu compra
        </h1>

        <p class="mt-6 text-white/55 leading-relaxed">
            Tu pedido fue registrado correctamente. Pronto será preparado para
            entrega.
        </p>

        <div class="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
                onclick={() => goto("/catalogo")}
                class="rounded-full bg-[#F9DDEB] px-8 py-4 text-xs uppercase tracking-[0.25em] text-black hover:bg-[#F3C4DA]"
            >
                Seguir comprando
            </button>

            <button
                onclick={() => goto("/")}
                class="rounded-full border border-[#E7B8CF] px-8 py-4 text-xs uppercase tracking-[0.25em] text-[#6B4259] hover:bg-[#F3C4DA]/10"
            >
                Volver al inicio
            </button>
        </div>
    </div>
</section>
