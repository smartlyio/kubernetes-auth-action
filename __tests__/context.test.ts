import {Context, isPost, getContext, loadState} from '../src/context'
import {mocked} from 'jest-mock'
import {getInput, saveState, getState} from '@actions/core'

jest.mock('@actions/core', () => ({
  getInput: jest.fn(),
  saveState: jest.fn(),
  getState: jest.fn()
}))

const OLD_ENV = process.env
beforeEach(() => {
  process.env = {...OLD_ENV}
})

afterEach(() => {
  process.env = OLD_ENV
})

describe('isPost', () => {
  test('is true if env var is present', () => {
    process.env['STATE_isPost'] = 'true'
    expect(isPost()).toEqual(true)
  })
  test('is false if not present', () => {
    expect(isPost()).toEqual(false)
  })
})

describe('get input context', () => {
  test('test inputs and save/load state for post process', async () => {
    const inputs: Record<string, string> = {
      kubernetesServer: '',
      kubernetesContext: 'context',
      kubernetesClusterDomain: 'kube.example.com',
      kubernetesNamespace: 'application'
    }
    const savedState: Record<string, string> = {}
    mocked(getInput).mockImplementation(name => {
      return inputs[name]
    })
    mocked(saveState).mockImplementation((name, value) => {
      if (typeof value === 'string') {
        savedState[name] = value
      } else {
        savedState[name] = JSON.stringify(value)
      }
    })
    mocked(getState).mockImplementation(name => {
      return savedState[name]
    })

    const expectedContext: Context = {
      kubernetesServer: 'https://kube.example.com:6443',
      kubernetesContext: 'context',
      kubernetesClusterDomain: 'kube.example.com',
      kubernetesNamespace: 'application',
      isPost: false
    }

    const mainContext: Context = await getContext()
    expect(mainContext).toEqual(expectedContext)

    process.env['STATE_isPost'] = '1'
    expectedContext.isPost = true
    const postContext: Context = await loadState()
    expect(postContext).toEqual(expectedContext)
  })
})
