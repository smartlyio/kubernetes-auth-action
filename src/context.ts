import * as core from '@actions/core'

export function isPost(): boolean {
  // Will be false if the environment variable doesn't exist; true if it does.
  return !!process.env['STATE_isPost']
}

export interface Context {
  kubernetesServer: string
  kubernetesContext: string
  kubernetesClusterDomain: string
  kubernetesNamespace: string
  isPost: boolean
}

export async function getContext(): Promise<Context> {
  const kubernetesServerRaw: string = core.getInput('kubernetesServer')
  const kubernetesContext: string = core.getInput('kubernetesContext')
  const kubernetesClusterDomain: string = core.getInput(
    'kubernetesClusterDomain'
  )
  const kubernetesNamespace: string = core.getInput('kubernetesNamespace')
  const post: boolean = isPost()

  let kubernetesServer = kubernetesServerRaw
  if (kubernetesServer === '') {
    kubernetesServer = `https://${kubernetesClusterDomain}:6443`
  }

  const context: Context = {
    kubernetesServer,
    kubernetesContext,
    kubernetesClusterDomain,
    kubernetesNamespace,
    isPost: post
  }

  core.saveState('isPost', post)
  core.saveState('kubernetesServer', context.kubernetesServer)
  core.saveState('kubernetesContext', context.kubernetesContext)
  core.saveState('kubernetesClusterDomain', context.kubernetesClusterDomain)
  core.saveState('kubernetesNamespace', context.kubernetesNamespace)

  return context
}

export async function loadState(): Promise<Context> {
  const post: boolean = isPost()
  const context: Context = {
    kubernetesServer: core.getState('kubernetesServer'),
    kubernetesContext: core.getState('kubernetesContext'),
    kubernetesClusterDomain: core.getState('kubernetesClusterDomain'),
    kubernetesNamespace: core.getState('kubernetesNamespace'),
    isPost: post
  }
  return context
}
