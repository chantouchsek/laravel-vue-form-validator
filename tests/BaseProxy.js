import { BaseProxy } from '../src';

export default class BaseProxyTest extends BaseProxy{
    constructor (parameters = {}) {
        super('/news', parameters)
    }
}
