export function buildBuffer(bufferSizeInKB) {
  const size = bufferSizeInKB * 1024
  const date = new Date().toISOString()
  let content = ''

  for (let i = 0; i < size / date.length; i++) {
    content += date
  }

  const buffer = Buffer.alloc(size)
  buffer.write(content)

  return buffer
}
