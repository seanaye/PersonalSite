import fs from 'fs'
import util from 'util'
import { exec } from 'child_process'
import debounce from 'lodash.debounce'
import chokidar from 'chokidar'

const filepath = './assets/img'

const readdir = util.promisify(fs.readdir)

const watcher = chokidar.watch(filepath, {
  ignored: /[\/\\]\./,
  persistent: true,
  cwd: '.',
  ignoreInitial: true
})

// Something to use when events are received.
// Add event listeners.
watcher.on('all', debounce(async (path) => {
  let albums = await readdir(filepath)
  albums = albums.filter(file => file.charAt(0) !== '.')
  const gallery = await Promise.all(albums.map(async (album) => {
    const photos = await readdir(`${filepath}/${album}`)
    return {
      title: album,
      photos: photos.filter(photo => photo.charAt(0) !== '.').sort()
    }
  }))
  fs.writeFile('gallery.json', JSON.stringify(gallery), 'utf-8', (err) => {
    if (err) {
      console.log('An error occured while writing JSON Object to File.')
      return console.log(err)
    }
    console.log('JSON file has been saved.')
    exec('npm run generate', (error, stdout, stderr) => {
      console.log(error)
      console.log(stdout)
      console.log(stderr)
    })
  })
}, 1000))
