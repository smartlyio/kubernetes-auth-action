import * as core from '@actions/core'
import {Context, getContext, isPost} from './context'
import {configureKube, deconfigureKube} from './kube'

async function run(): Promise<void> {
  try {
    const context: Context = await getContext()
    core.info(
      `Configuring access to kubernetes cluster ${context.kubernetesClusterDomain}`
    )
    await configureKube(context)
  } catch (error) {
    core.setFailed(error.message)
  }
}

async function post(): Promise<void> {
  try {
    core.info(`Deconfiguring kubernetes client`)
    await deconfigureKube()
  } catch (error) {
    core.setFailed(error.message)
  }
}

if (!isPost()) {
  run()
} else {
  post()
}
