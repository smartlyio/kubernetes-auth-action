import {exec} from '@actions/exec'
import {mocked} from 'jest-mock'
import {Context} from '../src/context'
import {configureKube, deconfigureKube} from '../src/kube'

jest.mock('@actions/exec', () => ({
  exec: jest.fn()
}))

const OLD_ENV = process.env
beforeEach(() => {
  process.env = {...OLD_ENV}
})

afterEach(() => {
  process.env = OLD_ENV
})

describe('test kubernetes configuration', () => {
  test('It configures kube', async () => {
    process.env['KUBERNETES_AUTH_TOKEN'] = 'token'
    const context: Context = {
      kubernetesServer: 'https://kube.example.com:6443',
      kubernetesContext: 'context',
      kubernetesClusterDomain: 'kube.example.com',
      kubernetesNamespace: 'application',
      isPost: false
    }

    await configureKube(context)

    const mockExec = mocked(exec)
    const calls = mockExec.mock.calls
    expect(calls.length).toBe(3)
    expect(calls[0][0]).toEqual('kubectl config set-cluster')
    expect(calls[1][0]).toEqual('kubectl config set-context')
    expect(calls[2][0]).toEqual(
      '/bin/bash -c "kubectl config set-credentials deploy --token=$KUBERNETES_AUTH_TOKEN"'
    )
  })

  test('It throws an error if no token is available', async () => {
    process.env['KUBERNETES_AUTH_TOKEN'] = ''
    const context: Context = {
      kubernetesServer: 'https://kube.example.com:6443',
      kubernetesContext: 'context',
      kubernetesClusterDomain: 'kube.example.com',
      kubernetesNamespace: 'application',
      isPost: false
    }

    await expect(configureKube(context)).rejects.toThrowError(
      /No KUBERNETES_AUTH_TOKEN value/
    )

    const mockExec = mocked(exec)
    expect(mockExec.mock.calls.length).toBe(0)
  })

  test('It deconfigures kube', async () => {
    await deconfigureKube()

    const mockExec = mocked(exec)
    const calls = mockExec.mock.calls
    expect(calls.length).toBe(4)
    expect(calls[0]).toEqual(['kubectl config unset', ['clusters']])
    expect(calls[1]).toEqual(['kubectl config unset', ['contexts']])
    expect(calls[2]).toEqual(['kubectl config unset', ['current-context']])
    expect(calls[3]).toEqual(['kubectl config unset', ['users']])
  })
})
