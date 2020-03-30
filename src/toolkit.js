const log = (msg) => {
  console.log(msg)
}

const _config = {
  TEST_INTERVAL_MS: 15 * 60 * 1000
}

const config = (key, defaultValue) => {
  if (typeof _config[key] !== 'undefined') {
    return _config[key]
  }
  if (typeof defaultValue !== 'undefined') {
    return defaultValue
  }
  return null
}

// SETS A CONFIG VARIABLE
// IF value IS NOT PASSED THEN THE VARIABLE IS REMOVED FORM THE CONFIG
const configSet = (key, value) => {
  if (typeof value === 'undefined') {
    if (typeof _config[key] !== 'undefined') {
      delete _config[key]
    }
  } else {
    _config[key] = value
  }
}

export {
  config,
  configSet
}

export {
  log
}
