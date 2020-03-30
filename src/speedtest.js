import { promisify } from 'util'
import { exec } from 'child_process'
import path from 'path'
import fs from 'fs'
import { config, log } from './toolkit.js'

const execSync = promisify(exec)

const runTest = async (serverId) => {
  let cmd = 'speedtest --csv'
  if (typeof serverId !== 'undefined') {
    cmd += ' --server ' + serverId
  }
  console.log('  running: ' + cmd)
  const { stdout, stderr } = await execSync(cmd)
  if ((stderr + '').length > 0) {
    console.log('An Error Occured. stdout: ' + stdout + ', stderr: ' + stderr)
  }
  return stdout
}

const testServer = Object.freeze({
  AU_SYD_TELSTRA: 2629,
  AU_SYD_INTERNODE: 2173,
  AU_SYD_VOCUS: 17618,
  AU_BNE_TELSTRA: 2604,
  AU_BNE_INTERNODE: 2165,
  AU_BNE_VOCUS: 18248
})

const getDataPath = () => {
  const datPth = path.resolve(config('DATA_FOLDER', './data/'))
  if (!fs.existsSync(datPth)) {
    fs.mkdirSync(datPth, { recursive: true })
  }
  return datPth
}

const doTestRun = async () => {
  const dte = new Date()
  const flePth = path.join(getDataPath(), dte.getFullYear() + '-' + ('00' + (dte.getMonth() + 1)).slice(-2) + '.csv')
  log('starting speedtests...')
  for (const svrKey of Object.keys(testServer)) {
    const svr = testServer[svrKey]
    const res = await runTest(svr)
    log('    result: ' + res)
    fs.appendFileSync(flePth, res)
  }
}

let _nextTestTime = null

// DEALS WITH THE TEST SCHEDULING, USING _nextTestTime (EPOCH MILLISECONDS)
// nextTetsTime() RETURNS THE SCHEDULED TIME OF THE NEXT TEST RUN
// nextTestTime(8937438) SETS THE NEXT SCHEDULED DATA AND RETURNS IT
const nextTestTime = (tme) => {
  if (typeof tme !== 'undefined') { // SETTING NEXT RUN TIME
    while (tme > _nextTestTime) {
      _nextTestTime += config('TEST_INTERVAL_MS', 15 * 60 * 1000)
    }
    const flePth = path.join(getDataPath(), 'nextTestAt.dat')
    fs.writeFileSync(flePth, _nextTestTime)
  } else { // GETTING NEXT RUN TIME
    if (_nextTestTime == null) {
      const flePth = path.join(getDataPath(), 'nextTestAt.dat')
      if (!fs.existsSync(flePth)) {
        _nextTestTime = (new Date()).getTime() - 100 // RUN ASAP
      } else {
        const tmp = fs.readFileSync(flePth)
        nextTestTime(parseInt(tmp, 10))
      }
    }
  }
  return _nextTestTime
}

const startSpeedTest = async () => {
  const now = (new Date()).getTime()
  if (now > nextTestTime()) {
    await doTestRun()
    nextTestTime(now)
  }
  setTimeout(startSpeedTest, 1000)
}

export {
  startSpeedTest
}
