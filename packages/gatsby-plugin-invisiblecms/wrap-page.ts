export function getPlugin(requireOutput: any, path: string) {
  const preferDefault = (m: any) => (m && m.default) || m

  try {
    return preferDefault(requireOutput)

  } catch (e) {
    if (e.toString().indexOf(`Error: Cannot find module`) !== -1) {
      throw new Error(
        `Couldn't find page component at "${path}.\n\n` +
          `Please create page component in that location or specify path to page component in gatsby-config.js`
      )
    } else {
      // Logging the error for debugging older browsers as there is no way
      // to wrap the thrown error in a try/catch.
      console.error(e)
      throw e
    }
  }
}
