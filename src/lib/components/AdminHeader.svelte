<script>
    let { handleLogout } = $props();
</script>

<header
    class="border-b border-white/5 bg-[#FFF7FB]/80 backdrop-blur-sm sticky top-0 z-40 px-6 py-4"
>
    <div class="max-w-[1400px] mx-auto flex items-center justify-between">
        <div class="flex items-center gap-2">
            <span class="h-2 w-2 rounded-full bg-pink-300"></span>
            <div>
                <p
                    class="text-[10px] uppercase tracking-[0.4em] text-[#C76592] font-medium"
                >
                    Panel de Control
                </p>
                <h1 class="text-xl font-light tracking-widest uppercase">
                    Panel de <span class="font-semibold text-[#B94F7F]"
                        >Stock</span
                    >
                </h1>
            </div>
        </div>

        <button
            onclick={handleLogout}
            class="rounded-full border border-[#E7B8CF] px-5 py-2.5 text-xs uppercase tracking-widest text-[#6B4259] hover:bg-[#F3C4DA]/10 hover:text-white transition-all"
        >
            Salir
        </button>
    </div>
</header>
