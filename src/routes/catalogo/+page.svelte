<script>
    import { getProducts, getCategories } from "$lib/products.js";
    import { addToCart, openCart, getCartCount } from "$lib/cart.svelte.js";
    import ProductModal from "$lib/components/ProductModal.svelte";
    import { onMount } from "svelte";

    let products = $state([]);
    let categories = $state([]);
    let selectedCategory = $state("ALL");
    let selectedProduct = $state(null);
    let error = $state("");
    let loading = $state(true);

    let filteredProducts = $derived(
        selectedCategory === "ALL"
            ? products.filter((p) => p.status === "active")
            : products.filter(
                  (p) =>
                      p.status === "active" &&
                      p.category_id === selectedCategory,
              ),
    );

    async function loadCatalog() {
        loading = true;

        const [productsRes, categoriesRes] = await Promise.all([
            getProducts(),
            getCategories(),
        ]);

        if (productsRes.error) {
            error = productsRes.error.message;
        } else {
            products = productsRes.products;
        }

        if (categoriesRes.error) {
            error = categoriesRes.error.message;
        } else {
            categories = categoriesRes.categories;
        }

        loading = false;
    }

    function handleQuickAdd(product) {
        addToCart(product);
    }

    onMount(() => {
        loadCatalog();
    });
</script>

<section class="min-h-screen bg-[#FFF7FB] text-[#4A3140] px-6 py-10">
    <div class="max-w-7xl mx-auto">
        <header class="flex items-start justify-between gap-6">
            <div>
                <p class="text-xs uppercase tracking-[0.35em] text-[#C76592]">
                    Chucheritas Aralan
                </p>

                <h1
                    class="mt-4 text-5xl md:text-7xl font-thin uppercase tracking-widest"
                >
                    Catálogo
                </h1>

                <p class="mt-5 max-w-xl text-[#8A5F76]">
                    Maquillaje, skincare y cositas bonitas para armar tu glow.
                </p>
            </div>

            <button
                onclick={openCart}
                class="rounded-full border border-[#E7B8CF] px-5 py-3 text-xs uppercase tracking-widest text-[#6B4259] hover:bg-[#F3C4DA]/10"
            >
                Carrito ({getCartCount()})
            </button>
        </header>

        <div class="mt-10 flex flex-wrap gap-3">
            <button
                onclick={() => (selectedCategory = "ALL")}
                class="rounded-full border px-5 py-2 text-xs uppercase tracking-widest {selectedCategory ===
                'ALL'
                    ? 'border-pink-200 bg-[#F9DDEB] text-black'
                    : 'border-[#E7B8CF] text-[#7A5068] hover:bg-[#F3C4DA]/10'}"
            >
                Todo
            </button>

            {#each categories as category}
                <button
                    onclick={() => (selectedCategory = category.category_id)}
                    class="rounded-full border px-5 py-2 text-xs uppercase tracking-widest {selectedCategory ===
                    category.category_id
                        ? 'border-pink-200 bg-[#F9DDEB] text-black'
                        : 'border-[#E7B8CF] text-[#7A5068] hover:bg-[#F3C4DA]/10'}"
                >
                    {category.description}
                </button>
            {/each}
        </div>

        {#if error}
            <p
                class="mt-10 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-red-300"
            >
                {error}
            </p>
        {:else if loading}
            <p class="mt-10 text-[#8A5F76]">Cargando catálogo...</p>
        {:else}
            <div
                class="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
                {#each filteredProducts as product}
                    <article
                        class="group rounded-[1.5rem] border border-[#E7B8CF] bg-white/70 overflow-hidden hover:bg-[#F3C4DA]/[0.06] transition"
                    >
                        <button
                            onclick={() => (selectedProduct = product)}
                            class="block w-full text-left"
                        >
                            <img
                                src={product.product_pictures?.[0]
                                    ?.picture_url ??
                                    "https://picsum.photos/seed/catalog/600/800"}
                                alt={product.name}
                                class="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105"
                            />

                            <div class="p-4">
                                <p
                                    class="text-[10px] uppercase tracking-[0.25em] text-pink-300/60"
                                >
                                    {product.categories?.description}
                                </p>

                                <h2 class="mt-2 text-sm font-medium">
                                    {product.name}
                                </h2>

                                <p
                                    class="mt-2 text-sm text-[#8A5F76] line-clamp-2"
                                >
                                    {product.description}
                                </p>

                                <p class="mt-4 font-medium">
                                    ${Number(product.price).toFixed(2)}
                                </p>
                            </div>
                        </button>

                        <div class="px-4 pb-4">
                            <button
                                onclick={() => handleQuickAdd(product)}
                                disabled={product.stock <= 0}
                                class="w-full rounded-full border border-pink-200/40 px-4 py-3 text-xs uppercase tracking-widest text-pink-100 hover:bg-[#F9DDEB] hover:text-black disabled:opacity-40"
                            >
                                Agregar
                            </button>
                        </div>
                    </article>
                {/each}
            </div>
        {/if}
    </div>
</section>

<ProductModal
    product={selectedProduct}
    onClose={() => (selectedProduct = null)}
/>
