import { promisify } from 'util'
import { exec } from 'child_process'
import path from 'path'
import fs from 'fs'

const execSync = promisify(exec)

const runTest = async (serverId) => {
  let cmd = 'speedtest --csv'
  if (typeof serverId !== 'undefined') {
    cmd += ' --server ' + serverId
  }
  console.log('running: ' + cmd)
  const { stdout, stderr } = await execSync(cmd)
  if ((stderr + '').length > 0) {
    console.log('An Error Occured. stdout: ' + stdout + ', stderr: ' + stderr)
  }
  return stdout
}

const testServer = Object.freeze({
  AU_SYD_TELSTRA: 2629,
  AU_SYD_INTERNODE: 2173
})

const doTestRun = async () => {
  const dte = new Date()
  const res1 = await runTest(testServer.AU_SYD_TELSTRA)
  const res2 = await runTest(testServer.AU_SYD_INTERNODE)
  const fleFld = path.resolve('./data/')
  fs.mkdirSync(fleFld, { recursive: true })
  const flePth = path.join(fleFld, dte.getFullYear() + '-' + ('00' + (dte.getMonth() + 1)).slice(-2) + '.csv')
  console.log('writing results...')
  await fs.appendFileSync(flePth, res1 + res2)
}

let nextTest = (new Date()).getTime() - 100
const testIntervalMs = 15 * 60 * 1000

const start = async () => {
  const now = (new Date()).getTime()
  if (now > nextTest) {
    await doTestRun()
    while (now > nextTest) {
      nextTest += testIntervalMs
    }
  }
  setTimeout(start, 1000)
}

export {
  start
}
