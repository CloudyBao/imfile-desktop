require('dotenv').config()

exports.default = async function (context) {
  const { electronPlatformName } = context
  if (electronPlatformName !== 'darwin') {
    return
  }

  if (process.env.SKIP_NOTARIZE === 'true') {
    console.log('Skipping notarize (SKIP_NOTARIZE=true)')
    return
  }

  console.log('Notarize skipped by default - set SKIP_NOTARIZE=false to enable')
}
