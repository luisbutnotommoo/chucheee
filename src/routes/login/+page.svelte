<script>
    import { goto } from "$app/navigation";
    import { loginClient } from "$lib/auth.js";

    let email = $state("");
    let password = $state("");
    let error = $state("");
    let loading = $state(false);

    async function handleLogin() {
        error = "";
        loading = true;

        const result = await loginClient(email, password);

        if (result.error) {
            error = result.error.message;
            loading = false;
            return;
        }

        goto("/catalogo");
    }
</script>

<section
    class="min-h-screen bg-[#FFF7FB] text-[#4A3140] flex items-center justify-center px-6"
>
    <form
        onsubmit={(e) => {
            e.preventDefault();
            handleLogin();
        }}
        class="w-full max-w-md rounded-[2rem] border border-[#E7B8CF] bg-white/80 p-8 shadow-2xl"
    >
        <p class="text-xs uppercase tracking-[0.35em] text-[#C76592]">
            Chucheritas Aralan
        </p>

        <h1 class="mt-4 text-4xl font-thin tracking-widest uppercase">
            Iniciar sesión
        </h1>

        <div class="mt-8 space-y-4">
            <input
                bind:value={email}
                type="email"
                placeholder="Correo"
                class="w-full rounded-2xl bg-white/70 border border-[#E7B8CF] px-4 py-3 outline-none"
                required
            />

            <input
                bind:value={password}
                type="password"
                placeholder="Contraseña"
                class="w-full rounded-2xl bg-white/70 border border-[#E7B8CF] px-4 py-3 outline-none"
                required
            />
        </div>

        {#if error}
            <p class="mt-4 text-sm text-red-300">{error}</p>
        {/if}

        <button
            disabled={loading}
            class="mt-8 w-full rounded-full bg-[#F9DDEB] px-6 py-4 text-sm uppercase tracking-[0.25em] text-black disabled:opacity-50"
        >
            {loading ? "Entrando..." : "Entrar"}
        </button>

        <button
            type="button"
            onclick={() => goto("/register")}
            class="mt-4 w-full text-sm text-[#8A5F76] hover:text-white"
        >
            Crear cuenta
        </button>
    </form>
</section>
