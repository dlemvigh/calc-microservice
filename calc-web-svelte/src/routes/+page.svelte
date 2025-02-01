<script>
  import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query'
  import CalcForm from "../components/CalcForm.svelte";
  import CalcList from "../components/CalcList.svelte";

  const queryClient = new QueryClient()
</script>

<QueryClientProvider client={queryClient}>
  <CalcForm />
  <CalcList />
</QueryClientProvider>