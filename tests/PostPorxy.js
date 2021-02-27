import BaseProxy from '../src/BaseProxy'

class PostProxy extends BaseProxy {
  constructor(parameters = {}) {
    super('posts', parameters)
  }
}

export default PostProxy
