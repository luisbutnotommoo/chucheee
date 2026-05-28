<script>
    import { logout } from "$lib/auth.js";
    import { goto } from "$app/navigation";
    import {
        getCategories,
        getProducts,
        addProduct,
        updateProduct,
    } from "$lib/products.js";
    import { onMount } from "svelte";

    // --- TUS COMPONENTES NUEVOS ---
    import AdminHeader from "$lib/components/AdminHeader.svelte";
    import ProductFormDrawer from "$lib/components/ProductFormDrawer.svelte";

    // --- TUS ESTADOS ORIGINALES (INTACTOS) ---
    let categories = $state([]);
    let products = $state([]);
    let error = $state("");
    let editingId = $state(null);
    let selectedFiles = $state([]);
    let form = $state({
        categoryId: "",
        name: "",
        description: "",
        price: "",
        stock: "",
        status: "active",
    });

    // --- ESTADOS NUEVOS PARA LA UI (NECESARIOS) ---
    let isDrawerOpen = $state(false);

    // --- TUS FUNCIONES ORIGINALES (INTACTAS) ---
    async function handleLogout() {
        await logout();
        goto("/admin/login");
    }

    async function loadCategories() {
        const result = await getCategories();
        if (result.error) {
            error = result.error.message;
            return;
        }
        categories = result.categories;
        if (categories.length > 0 && !form.categoryId) {
            form.categoryId = categories[0].category_id;
        }
    }

    async function loadProducts() {
        const result = await getProducts();
        if (result.error) {
            error = result.error.message;
            return;
        }
        products = result.products;
    }

    function resetForm() {
        editingId = null;
        selectedFiles = [];
        form = {
            categoryId: categories[0]?.category_id ?? "",
            name: "",
            description: "",
            price: "",
            stock: "",
            status: "active",
        };
        isDrawerOpen = false; // Cerrar al resetear
    }

    async function saveProduct() {
        error = "";
        const payload = {
            ...form,
            pictureFiles: selectedFiles,
        };
        const result = editingId
            ? await updateProduct(editingId, payload)
            : await addProduct(payload);
        if (result.error) {
            error = result.error.message;
            return;
        }
        resetForm();
        await loadProducts();
    }

    function editProduct(product) {
        editingId = product.product_id;
        form = {
            categoryId: product.category_id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            status: product.status,
        };
        selectedFiles = [];
        isDrawerOpen = true; // Abrir formulario al editar
    }

    async function toggleProduct(product) {
        const nextStatus =
            product.status === "active" ? "discontinued" : "active";
        const result = await updateProduct(product.product_id, {
            ...product, // Usar spread para simplificar
            status: nextStatus,
            pictureFiles: [],
        });
        if (result.error) {
            error = result.error.message;
            return;
        }
        await loadProducts();
    }

    // --- NUEVAS FUNCIONES DE UI ---
    function openNewProductForm() {
        resetForm();
        isDrawerOpen = true;
    }

    onMount(() => {
        loadCategories();
        loadProducts();
    });
</script>

<section class="min-h-screen bg-[#FFF7FB] text-[#4A3140]">
    <AdminHeader {handleLogout} />

    <main class="max-w-[1400px] mx-auto p-6 md:p-10">
        <div
            class="flex items-center justify-between mb-8 pb-4 border-b border-[#F3D4E2]"
        >
            <h2 class="text-2xl font-light tracking-tight">
                Catálogo de Productos
            </h2>

            <button
                onclick={openNewProductForm}
                class="flex items-center gap-2.5 rounded-full bg-[#F9DDEB] px-6 py-3 text-sm uppercase tracking-[0.2em] text-black hover:bg-pink-100 transition-colors"
            >
                <span class="text-lg">+</span> Nuevo Producto
            </button>
        </div>

        {#if error}
            <div
                class="mb-8 rounded-2xl border border-red-400/20 bg-red-500/10 p-5 text-red-300 flex items-center gap-3"
            >
                <span class="text-xl">⚠️</span>
                <p>{error}</p>
            </div>
        {/if}

        <div
            class="rounded-3xl border border-[#F3D4E2] bg-[#FFFDFE] overflow-hidden"
        >
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left">
                    <thead
                        class="text-xs uppercase tracking-widest text-[#A67790] border-b border-[#F3D4E2]"
                    >
                        <tr>
                            <th scope="col" class="px-6 py-5 font-normal"
                                >Producto</th
                            >
                            <th scope="col" class="px-6 py-5 font-normal"
                                >Categoría</th
                            >
                            <th
                                scope="col"
                                class="px-6 py-5 font-normal text-right"
                                >Precio</th
                            >
                            <th
                                scope="col"
                                class="px-6 py-5 font-normal text-right"
                                >Stock</th
                            >
                            <th scope="col" class="px-6 py-5 font-normal"
                                >Estado</th
                            >
                            <th
                                scope="col"
                                class="px-6 py-5 font-normal text-right"
                                >Acciones</th
                            >
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-white/5">
                        {#each products as product}
                            <tr class="hover:bg-[#FFF0F6] transition-colors">
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-4">
                                        <img
                                            src={product.product_pictures?.[0]
                                                ?.picture_url ??
                                                "https://api.dicebear.com/8.x/icons/svg?seed=pkg"}
                                            alt={product.name}
                                            class="h-14 w-12 rounded-lg object-cover border border-[#E7B8CF] bg-[#FFF0F6]"
                                        />
                                        <div>
                                            <p
                                                class="font-medium text-base text-[#4A3140]"
                                            >
                                                {product.name}
                                            </p>
                                            <p
                                                class="text-[#8A5F76] text-xs mt-0.5 line-clamp-1"
                                            >
                                                {product.description}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-[#ABAAA9]">
                                    {product.categories?.description}
                                </td>
                                <td
                                    class="px-6 py-4 text-right text-base font-mono"
                                >
                                    ${product.price.toFixed(2)}
                                </td>
                                <td class="px-6 py-4 text-right font-mono">
                                    <span
                                        class={product.stock > 10
                                            ? "text-green-500"
                                            : product.stock > 0
                                              ? "text-yellow-500"
                                              : "text-red-500"}
                                    >
                                        {product.stock}
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <span
                                        class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize {product.status ===
                                        'active'
                                            ? 'bg-[#DDF6E8] text-[#4E9B6E]'
                                            : 'bg-white/5 text-[#8A5F76]'}"
                                    >
                                        <span
                                            class="h-1.5 w-1.5 rounded-full {product.status ===
                                            'active'
                                                ? 'bg-[#6BC48D]'
                                                : 'bg-white/30'}"
                                        ></span>
                                        {product.status}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <div class="flex justify-end gap-2">
                                        <button
                                            onclick={() =>
                                                toggleProduct(product)}
                                            class="rounded-lg border border-[#F3D4E2] bg-[#FFF0F6] px-3 py-2 text-xs uppercase tracking-widest text-[#6B4259] hover:bg-[#F3C4DA]/10"
                                        >
                                            {product.status === "active"
                                                ? "Ocultar"
                                                : "Activar"}
                                        </button>
                                        <button
                                            onclick={() => editProduct(product)}
                                            class="rounded-lg border border-pink-300/10 bg-pink-900/20 px-3 py-2 text-xs uppercase tracking-widest text-[#B94F7F] hover:bg-pink-300/10"
                                        >
                                            Editar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
            {#if products.length === 0}
                <div class="text-center py-20 text-[#A67790]">
                    <span class="text-4xl mb-4 block">📦</span>
                    No hay productos en el catálogo.
                </div>
            {/if}
        </div>
    </main>
</section>

<ProductFormDrawer
    bind:isOpen={isDrawerOpen}
    bind:form
    bind:selectedFiles
    {categories}
    {editingId}
    {saveProduct}
    {resetForm}
/>
