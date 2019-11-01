import fs from 'fs'
import util from 'util'

const readdir = util.promisify(fs.readdir)
const filepath = './assets/img'

function sortAlphaNum(b, a) {
  var aA = a.replace(/[^a-zA-Z]/g, "");
  var bA = b.replace(/[^a-zA-Z]/g, "");
  if (aA === bA) {
    var aN = parseInt(a.replace(/[^0-9]/g, ""), 10);
    var bN = parseInt(b.replace(/[^0-9]/g, ""), 10);
    return aN === bN ? 0 : aN > bN ? 1 : -1;
  } else {
    return aA > bA ? 1 : -1;
  }
}

const make = async () => {
  console.log('start')
  let albums = await readdir(filepath)
  albums = albums.filter(file => file.charAt(0) !== '.')
  const gallery = await Promise.all(albums.map(async (album) => {
    const photos = await readdir(`${filepath}/${album}`)
    return {
      title: album,
      photos: photos.filter(photo => photo.charAt(0) !== '.').sort(sortAlphaNum)
    }
  }))
  fs.writeFile('gallery.json', JSON.stringify(gallery), 'utf-8', (err) => {
    if (err) {
      console.log('An error occured while writing JSON Object to File.')
      return console.log(err)
    }
    console.log('JSON file has been saved.')
  })
  return gallery
}

export default make
