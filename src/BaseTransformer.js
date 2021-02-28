import snakeCaseKeys from 'snakecase-keys'
import camelcaseKeys from 'camelcase-keys'

class BaseTransformer {
  static fetchCollection(items = [], camelCaseKey = false) {
    return items.map((item = {}) => this.fetch(item, camelCaseKey))
  }
  static sendCollection(items = [], snakeCaseKey = false) {
    return items.map((item= {}) => this.send(item, snakeCaseKey))
  }
  static fetch(item = {}, camelCaseKey = false) {
    if (camelCaseKey) {
      return camelcaseKeys(item, { deep: true })
    }
    return item
  }
  static send(item = {}, snakeCaseKey = false) {
    if (snakeCaseKey) {
      return snakeCaseKeys(item)
    }
    return item
  }
}

export default BaseTransformer
