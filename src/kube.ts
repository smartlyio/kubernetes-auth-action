import * as exec from '@actions/exec'
import {Context} from './context'

export async function configureKube(
  context: Context
): Promise<void> {
  await exec.exec('kubectl config set-cluster', [
    context.kubernetesContext,
    `--server=${context.kubernetesServer}`,
    `--insecure-skip-tls-verify=true`
  ])
  await exec.exec(`kubectl config set-context`, [
    context.kubernetesContext,
    `--user=deploy`,
    `--cluster=${context.kubernetesContext}`,
    `--namespace=${context.kubernetesNamespace}`
  ])
  await exec.exec(
    '/bin/bash -c "kubectl config set-credentials deploy --token=$KUBERNETES_AUTH_TOKEN"'
  )
}

export async function deconfigureKube(): Promise<void> {
  // Unset ALL configuration!
  const keys: string[] = ['clusters', 'contexts', 'current-context', 'users'];
  const errors: string[] = [];
  for (const key of keys) {
    try {
      await exec.exec(`kubectl config unset`, [key])
    } catch (e) {
      errors.push(e.message);
    }
  }
  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }
}
