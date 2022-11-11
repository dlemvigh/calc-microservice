<script type="ts">
  import { useFactorials, useFactorialSubscription } from "../query/factorial"
  import { timeDiff } from "../lib/time";

  const factorials = useFactorials();
  useFactorialSubscription();
</script>

<table>
  <thead>
    <tr>
      <th class="col-input">n</th>
      <th class="col-output">n!</th>
      <th class="col-queue-time">queue time</th>
      <th class="col-work-time">work time</th>
    </tr>
  </thead>
  {#if $factorials.isSuccess}
    <tbody>
      {#each $factorials.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as item}
        <tr>
          <td>{item.input}</td>
          <td>{item.output ?? ""}</td>
          <td>{timeDiff(item.createdAt, item.calcStartedAt)}</td>
          <td>{timeDiff(item.calcStartedAt, item.finishedAt)}</td>
        </tr>
      {/each}
    </tbody>
  {/if}
</table>

<style>
  table {
    width: 50rem;
  }
  th {
    text-align: left;
  }
  .col-input {
    width: 6rem;
  }
  .col-queue-time {
    width: 6rem;
  }
  .col-work-time {
    width: 5rem;
  }

</style>