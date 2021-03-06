---
type: reference
last_update: 2019-07-03
---

# Pipelines for Merged Results **(PREMIUM)**

> [Introduced](https://gitlab.com/gitlab-org/gitlab/issues/7380) in [GitLab Premium](https://about.gitlab.com/pricing/) 11.10.

When you submit a merge request, you are requesting to merge changes from a
source branch into a target branch. By default, the CI pipeline runs jobs
against the source branch.

With *pipelines for merged results*, the pipeline runs as if the changes from
the source branch have already been merged into the target branch.

If the pipeline fails due to a problem in the target branch, you can wait until the
target is fixed and re-run the pipeline.
This new pipeline will run as if the source is merged with the updated target, and you
will not need to rebase.

The pipeline does not automatically run when the target branch changes. Only changes
to the source branch trigger a new pipeline. If a long time has passed since the last successful
pipeline, you may want to re-run it before merge, to ensure that the source changes
can still be successfully merged into the target.

When the merge request can't be merged, the pipeline runs against the source branch only. For example, when:

- The target branch has changes that conflict with the changes in the source branch.
- The merge request is a
  [work in progress](../../../user/project/merge_requests/work_in_progress_merge_requests.md).

In these cases, the pipeline runs as a [pipeline for merge requests](../index.md)
and is labeled as `detached`. If these cases no longer exist, new pipelines will
again run against the merged results.

## Requirements and limitations

Pipelines for merged results require a [GitLab Runner][runner] 11.9 or newer.

[runner]: https://gitlab.com/gitlab-org/gitlab-runner

In addition, pipelines for merged results have the following limitations:

- Forking/cross-repo workflows are not currently supported. To follow progress,
  see [#11934](https://gitlab.com/gitlab-org/gitlab/issues/11934).
- This feature is not available for
  [fast forward merges](../../../user/project/merge_requests/fast_forward_merge.md) yet.
  To follow progress, see [#58226](https://gitlab.com/gitlab-org/gitlab/-/issues/26996).

## Enabling Pipelines for Merged Results

To enable pipelines on merged results at the project level:

1. Visit your project's **Settings > General** and expand **Merge requests**.
1. Check **Merge pipelines will try to validate the post-merge result prior to merging**.
1. Click **Save changes** button.

![Merge request pipeline config](img/merge_request_pipeline_config.png)

CAUTION: **Warning:**
Make sure your `gitlab-ci.yml` file is [configured properly for pipelines for merge requests](../index.md#configuring-pipelines-for-merge-requests),
otherwise pipelines for merged results won't run and your merge requests will be stuck in an unresolved state.

## Automatic pipeline cancelation

> [Introduced](https://gitlab.com/gitlab-org/gitlab/issues/12996) in [GitLab Premium](https://about.gitlab.com/pricing/) 12.3.

GitLab CI/CD can detect the presence of redundant pipelines,
and will cancel them automatically in order to conserve CI resources.

When a user merges a merge request immediately within an ongoing merge
train, the train will be reconstructed, as it will recreate the expected
post-merge commit and pipeline. In this case, the merge train may already
have pipelines running against the previous expected post-merge commit.
These pipelines are considered redundant and will be automatically
canceled.

## Troubleshooting

### Pipelines for merged results not created even with new change pushed to merge request

Can be caused by some disabled feature flags. Please make sure that
the following feature flags are enabled on your GitLab instance:

- `:ci_use_merge_request_ref`
- `:merge_ref_auto_sync`

To check and set these feature flag values, please ask an administrator to:

1. Log into the Rails console of the GitLab instance:

   ```shell
   sudo gitlab-rails console
   ```

1. Check if the flags are enabled or not:

   ```ruby
   Feature.enabled?(:ci_use_merge_request_ref)
   Feature.enabled?(:merge_ref_auto_sync)
   ```

1. If needed, enable the feature flags:

   ```ruby
   Feature.enable(:ci_use_merge_request_ref)
   Feature.enable(:merge_ref_auto_sync)
   ```

### Intermittently pipelines fail by `fatal: reference is not a tree:` error

Since pipelines for merged results are a run on a merge ref of a merge request
(`refs/merge-requests/<iid>/merge`), the Git reference could be overwritten at an
unexpected timing. For example, when a source or target branch is advanced.
In this case, the pipeline fails because of `fatal: reference is not a tree:` error,
which indicates that the checkout-SHA is not found in the merge ref.

This behavior was improved at GitLab 12.4 by introducing [Persistent pipeline refs](../../pipelines/index.md#troubleshooting-fatal-reference-is-not-a-tree).
You should be able to create pipelines at any timings without concerning the error.

## Using Merge Trains **(PREMIUM)**

By enabling [Pipelines for merged results](#pipelines-for-merged-results-premium),
GitLab will [automatically display](merge_trains/index.md#how-to-add-a-merge-request-to-a-merge-train)
a **Start/Add Merge Train button** as the most recommended merge strategy.

Generally, this is a safer option than merging merge requests immediately as your
merge request will be evaluated with an expected post-merge result before the actual
merge happens.

For more information, read the [documentation on Merge Trains](merge_trains/index.md).
