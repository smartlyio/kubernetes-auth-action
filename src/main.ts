import * as core from '@actions/core'
import {configureKube, deconfigureKube} from './kube'
import {isPost, Context, getContext, loadState} from './context';

async function run(): Promise<void> {
  try {
    const context: Context = getContext();

    await configureKube(context);
  } catch (error) {
    core.setFailed(error.message)
  }
}

async function post(): Promise<void> {
  try {
    await deconfigureKube()
  } catch (error) {
    core.setFailed(error.message);
  }
}

if (!isPost) {
  run()
} else {
  post()
}
