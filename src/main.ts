import * as core from '@actions/core'
import {configureKube, deconfigureKube} from './kube'
import {isPost, Context, getContext} from './context'

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
