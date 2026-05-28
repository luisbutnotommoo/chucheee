<script>
    import { addToCart } from "$lib/cart.svelte.js";

    let { product = null, onClose } = $props();

    function handleAdd() {
        addToCart(product);
        onClose();
    }
</script>

{#if product}
    <div class="fixed inset-0 z-40">
        <button
            aria-label="Cerrar producto"
            onclick={onClose}
            class="absolute inset-0 bg-black/70 backdrop-blur-sm"
        ></button>

        <article
            class="absolute left-1/2 top-1/2 w-[92vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-[#E7B8CF] bg-[#FFF7FB] text-[#4A3140] overflow-hidden shadow-2xl"
        >
            <div class="grid md:grid-cols-2">
                <img
                    src={product.product_pictures?.[0]?.picture_url ??
                        "https://picsum.photos/seed/product/600/800"}
                    alt={product.name}
                    class="h-96 md:h-full w-full object-cover"
                />

                <div class="p-8">
                    <p
                        class="text-xs uppercase tracking-[0.35em] text-[#C76592]"
                    >
                        {product.categories?.description}
                    </p>

                    <h2
                        class="mt-4 text-4xl font-thin uppercase tracking-widest"
                    >
                        {product.name}
                    </h2>

                    <p class="mt-6 text-[#7A5068] leading-relaxed">
                        {product.description}
                    </p>

                    <p class="mt-8 text-2xl">
                        ${Number(product.price).toFixed(2)}
                    </p>

                    <p class="mt-2 text-sm text-[#A67790]">
                        Stock disponible: {product.stock}
                    </p>

                    <button
                        onclick={handleAdd}
                        disabled={product.stock <= 0}
                        class="mt-8 w-full rounded-full bg-[#F9DDEB] px-6 py-4 text-sm uppercase tracking-[0.25em] text-black disabled:opacity-40"
                    >
                        Agregar al carrito
                    </button>

                    <button
                        onclick={onClose}
                        class="mt-4 w-full text-sm text-[#8A5F76] hover:text-white"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </article>
    </div>
{/if}
