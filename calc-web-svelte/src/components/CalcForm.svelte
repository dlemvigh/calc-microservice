<script type="ts">
  import { useQueryClient } from '@sveltestack/svelte-query'
  import { useCreateFactorial } from "../query/factorial";

  let value = 2000;
  const createFactorial = useCreateFactorial()

  function handleSubmit(event: Event) {
    event.preventDefault();
    $createFactorial.mutate({ input: value });
  }
</script>

<form>
  <label>
    Input
    <input type="number" min="1" bind:value />
  </label>
  <button type="submit" on:click={handleSubmit}>
    calc
  </button>
</form>