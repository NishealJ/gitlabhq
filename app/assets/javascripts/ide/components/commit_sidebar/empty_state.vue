<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['lastCommitMsg', 'noChangesStateSvgPath']),
  },
};
</script>

<template>
  <div
    v-if="!lastCommitMsg"
    class="multi-file-commit-panel-section ide-commit-empty-state js-empty-state"
  >
    <div class="ide-commit-empty-state-container">
      <div class="svg-content svg-80"><img :src="noChangesStateSvgPath" /></div>
      <div class="append-right-default prepend-left-default">
        <div class="text-content text-center">
          <h4>{{ __('No changes') }}</h4>
          <p>{{ __('Edit files in the editor and commit changes here') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
